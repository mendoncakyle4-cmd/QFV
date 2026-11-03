import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ColormapId, DisplayMode, PresetId, SimulationParameters } from '../../types/physics';
import { evaluateScalarField } from '../../physics/scalar/scalarModel';
import { getColorForValue } from '../palettes/colormaps';
import { Maximize2, Minimize2, RotateCcw, AlertTriangle, Eye } from 'lucide-react';

interface FieldSceneProps {
  preset: PresetId;
  params: SimulationParameters;
  displayMode: DisplayMode;
  colormap: ColormapId;
  isPaused: boolean;
  onOpenWhatAmISeeing?: () => void;
  className?: string;
}

export const FieldScene: React.FC<FieldSceneProps> = ({
  preset,
  params,
  displayMode,
  colormap,
  isPaused,
  onOpenWhatAmISeeing,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [fps, setFps] = useState(60);

  // References for animation and Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const meshRef = useRef<THREE.Mesh | THREE.Points | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const reqIdRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(performance.now());

  // Orbit control state
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 18, theta: Math.PI / 4, phi: Math.PI / 3.2 });
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  // Default camera reset
  const resetCamera = useCallback(() => {
    sphericalRef.current = { radius: 18, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    targetRef.current.set(0, 0, 0);
    updateCameraPosition();
  }, []);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const x = targetRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = targetRef.current.y + radius * Math.cos(phi);
    const z = targetRef.current.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(targetRef.current);
  };

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Initialise Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with WebGL error check
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = false;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.error('WebGL initialization failed:', e);
      setHasWebGLError(true);
      return;
    }

    // 4. Subtle Coordinate Grid & Floor Indicator
    const gridHelper = new THREE.GridHelper(12, 12, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    // 6. Scalar Field Surface Geometry (64x64 resolution for smooth wave dynamics)
    const gridSize = 10;
    const segments = 64;
    const geometry = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    // Rotate so plane lies in XZ plane (Y is height displacement phi)
    geometry.rotateX(-Math.PI / 2);
    geometryRef.current = geometry;

    // Vertex colors buffer
    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material setup
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / Math.max(1, height);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Event listeners for Orbit Interaction
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 2 || e.shiftKey) {
        isRightDraggingRef.current = true;
      } else {
        isDraggingRef.current = true;
      }
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current && !isRightDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      if (isDraggingRef.current) {
        // Orbit rotation
        sphericalRef.current.theta -= dx * 0.008;
        sphericalRef.current.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.02, sphericalRef.current.phi - dy * 0.008));
      } else if (isRightDraggingRef.current) {
        // Pan
        const panFactor = sphericalRef.current.radius * 0.001;
        targetRef.current.x -= dx * panFactor;
        targetRef.current.z += dy * panFactor;
      }
      updateCameraPosition();
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      isRightDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      sphericalRef.current.radius = Math.max(5, Math.min(45, sphericalRef.current.radius * zoomFactor));
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Update display mode materials dynamically
  useEffect(() => {
    if (!meshRef.current || !geometryRef.current) return;
    const mesh = meshRef.current as THREE.Mesh;

    if (displayMode === 'wireframe') {
      mesh.material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: true,
      });
    } else if (displayMode === 'slice-2d') {
      mesh.material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
      });
    } else {
      mesh.material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.35,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
    }
  }, [displayMode]);

  // Main Render & Physics Calculation Loop
  useEffect(() => {
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Measure FPS
      frameCountRef.current++;
      const now = performance.now();
      if (now - fpsTimerRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        fpsTimerRef.current = now;
      }

      const delta = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      // Update simulation time if not paused and tab is active
      if (!isPaused && !document.hidden) {
        timeRef.current += delta * params.timeScale * 2.0;
      }

      // Update Field Mesh Geometry
      if (geometryRef.current && meshRef.current) {
        const positions = geometryRef.current.attributes.position;
        const colors = geometryRef.current.attributes.color;
        const count = positions.count;
        const t = timeRef.current;

        for (let i = 0; i < count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);

          // Evaluate mathematical model directly
          const { value } = evaluateScalarField(x, z, t, preset, params);

          // Height displacement along Y axis (if slice-2d, keep flat at y=0)
          const y = displayMode === 'slice-2d' ? 0 : value * 1.5;
          positions.setY(i, y);

          // False-color encoding from chosen colormap
          const rgb = getColorForValue(value, colormap);
          colors.setXYZ(i, rgb.r, rgb.g, rgb.b);
        }

        positions.needsUpdate = true;
        colors.needsUpdate = true;
        if (displayMode !== 'slice-2d') {
          geometryRef.current.computeVertexNormals();
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    reqIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [preset, params, displayMode, colormap, isPaused]);

  if (hasWebGLError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-navy-900 border border-navy-border rounded-panel p-6 text-center text-slate-300 ${className}`}>
        <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
        <h3 className="text-lg font-medium text-slate-100 mb-1">WebGL 3D Context Unavailable</h3>
        <p className="text-sm text-slate-400 max-w-md mb-4">
          Your browser or graphics driver does not currently support WebGL hardware acceleration. You can switch to the 2D scientific fallback view below.
        </p>
      </div>
    );
  }

  return (
    <div ref={mountRef} className={`relative w-full h-full min-h-[420px] select-none overflow-hidden bg-navy-950 ${className}`}>
      {/* Top Left: Model & Representation Tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-navy-900/80 backdrop-blur border border-navy-border rounded-control text-xs font-mono font-medium text-cyan-light shadow-sm">
            MODEL: FREE SCALAR FIELD
          </span>
          <span className="px-2 py-0.5 bg-navy-800/80 backdrop-blur border border-navy-border rounded text-[11px] font-mono text-slate-300">
            {displayMode.toUpperCase()}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-navy-950/70 px-2 py-0.5 rounded backdrop-blur max-w-fit">
          Quantity: Scalar amplitude &phi;(x, z, t) [sim units]
        </span>
      </div>

      {/* Top Right: "What am I seeing?" button */}
      {onOpenWhatAmISeeing && (
        <button
          onClick={onOpenWhatAmISeeing}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-navy-900/90 hover:bg-navy-800 text-slate-200 border border-navy-border rounded-control text-xs font-medium backdrop-blur transition-all shadow-instrument hover:border-cyan-500/40"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>What am I seeing?</span>
        </button>
      )}

      {/* Bottom Left: Spatial Scale Legend */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-navy-900/80 backdrop-blur px-2.5 py-1.5 border border-navy-border rounded-control text-[11px] font-mono text-slate-400 flex flex-col gap-0.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-8 h-0.5 bg-cyan-400 inline-block"></span>
          <span>Scale: 2.0 length units</span>
        </div>
        <div className="text-[10px] text-slate-500">
          Grid: 10 &times; 10 units &middot; FPS: {fps}
        </div>
      </div>

      {/* Bottom Right: Camera Reset & Fullscreen */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={resetCamera}
          title="Reset Camera View"
          className="p-2 bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-cyan-300 border border-navy-border rounded-control backdrop-blur transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          className="p-2 bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-cyan-300 border border-navy-border rounded-control backdrop-blur transition-colors shadow-sm"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Center Subtle Hint (Fades out on interaction) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
        <span className="text-[11px] text-slate-400/80 bg-navy-950/60 px-3 py-1 rounded-full backdrop-blur border border-white/5">
          Drag to rotate &middot; Scroll to zoom &middot; Shift+Drag to pan
        </span>
      </div>
    </div>
  );
};

