import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SCALE_TO_COSMOS_STAGES, PERSPECTIVES_LIST } from '../../data/perspectivesData';
import { PerspectiveScaleScene, ScaleStageId } from '../../types/perspectives';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  ShieldAlert, 
  Compass, 
  Layers,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';

interface PerspectiveScaleToCosmosProps {
  initialPerspectiveSlug?: string;
  className?: string;
}

export const PerspectiveScaleToCosmos: React.FC<PerspectiveScaleToCosmosProps> = ({
  initialPerspectiveSlug = 'quantum-field-theory',
  className = '',
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialPerspectiveSlug);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const cosmicPointsRef = useRef<THREE.Points | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const timeRef = useRef<number>(0);
  const reqIdRef = useRef<number>(0);

  // Orbit rotation
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 20, theta: Math.PI / 4, phi: Math.PI / 3.4 });

  const activePerspective = PERSPECTIVES_LIST.find((p) => p.slug === selectedSlug) || PERSPECTIVES_LIST[0];
  const stages = SCALE_TO_COSMOS_STAGES[selectedSlug] || SCALE_TO_COSMOS_STAGES['quantum-field-theory'];
  const currentScene: PerspectiveScaleScene = stages[currentStageIndex] || stages[0];

  const updateCamera = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  }, []);

  const handleResetCamera = () => {
    sphericalRef.current = { radius: 20, theta: Math.PI / 4, phi: Math.PI / 3.4 };
    updateCamera();
  };

  // Playback timer across stages
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  // Initialise Three.js Canvas
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06090e); // Near-black navy
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    cameraRef.current = camera;
    updateCamera();

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    // 4. Receding Perspective Grid Plane (Reference Image Style)
    const gridHelper = new THREE.GridHelper(16, 16, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(12, 24, 15);
    scene.add(dirLight);

    // 6. Teal-to-Violet Mathematical Wave Surface Geometry (64x64 segments)
    const gridSize = 12;
    const segments = 64;
    const geometry = new THREE.PlaneGeometry(gridSize, gridSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 7. Cosmic Web / Star Cluster Points (for stages 4, 5, 6)
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.0,
    });
    const cosmicPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(cosmicPoints);
    cosmicPointsRef.current = cosmicPoints;

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / Math.max(1, h);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    // Orbit pointer events
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - dy * 0.008));
      updateCamera();
    };
    const onPointerUp = () => {
      isDraggingRef.current = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY > 0 ? 1.08 : 0.92;
      sphericalRef.current.radius = Math.max(6, Math.min(42, sphericalRef.current.radius * zoom));
      updateCamera();
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      observer.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [updateCamera]);

  // Main Render Loop with Scale-dependent animations
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      timeRef.current += delta * 1.5;
      const t = timeRef.current;

      // Update surface vertices based on scale stage
      if (meshRef.current) {
        const positions = meshRef.current.geometry.attributes.position;
        const colors = meshRef.current.geometry.attributes.color;
        const count = positions.count;

        // Stage-based morph factors:
        // Stage 0 (local patch): Clean sinusoidal wave ridges (teal to violet)
        // Stage 1 (structure): Tighter localized wave packets
        // Stage 2 (matter): Concentrated central peak
        // Stages 3-5 (astronomical & cosmic): Flattens or fades into particle nodes
        const isCosmicStage = currentStageIndex >= 3;
        const waveScale = currentStageIndex === 0 ? 1.2 : currentStageIndex === 1 ? 0.9 : currentStageIndex === 2 ? 0.5 : 0.15;

        for (let i = 0; i < count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);

          // Undulating ridge formulation (Reference image style: teal-to-violet ridges)
          const k1 = 1.3;
          const k2 = 0.8;
          let y = Math.cos(k1 * x - t) * Math.sin(k2 * z + 0.4 * t) * waveScale;
          
          if (currentStageIndex === 2) {
            // Localized packet
            const rSq = x * x + z * z;
            y += 1.2 * Math.exp(-rSq / 4.0) * Math.cos(2.5 * x - 2 * t);
          }

          positions.setY(i, y);

          // Color encoding: Teal (#00E5FF) for crests, Violet (#8B5CF6) for troughs
          const normY = (y / (waveScale * 1.5 + 0.1) + 1) / 2; // [0, 1]
          const clamped = Math.max(0, Math.min(1, normY));

          // Lerp between Violet (139, 92, 246) and Teal (0, 229, 255)
          const r = (139 + (0 - 139) * clamped) / 255;
          const g = (92 + (229 - 92) * clamped) / 255;
          const b = (246 + (255 - 246) * clamped) / 255;

          colors.setXYZ(i, r, g, b);
        }

        positions.needsUpdate = true;
        colors.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();

        // Adjust mesh visibility / opacity for cosmic scales
        (meshRef.current.material as THREE.MeshStandardMaterial).opacity = isCosmicStage ? 0.35 : 1.0;
        (meshRef.current.material as THREE.MeshStandardMaterial).transparent = isCosmicStage;
      }

      // Cosmic web point cloud opacity
      if (cosmicPointsRef.current) {
        const targetOpacity = currentStageIndex >= 3 ? 0.85 : 0.0;
        (cosmicPointsRef.current.material as THREE.PointsMaterial).opacity = targetOpacity;
        cosmicPointsRef.current.rotation.y = t * 0.03;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    reqIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [currentStageIndex]);

  return (
    <section className={`w-full bg-navy-950 border-t border-navy-border py-12 px-4 md:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-border pb-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1 block">
              Cross-Perspective Scale Journey (Addendum D)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              See How It All Unfolds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Begin with a local field representation. Then follow each perspective outward through the structures, scales, and cosmic picture that its own ideas allow us to explore.
            </p>
          </div>

          {/* Perspective Dropdown Selector */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Choose Perspective
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                setCurrentStageIndex(0);
                setIsPlaying(false);
              }}
              className="bg-navy-900 text-slate-200 border border-navy-border rounded-control px-3 py-2 text-xs font-mono focus:border-cyan-500/50"
            >
              {PERSPECTIVES_LIST.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 6-Stage Scale Stepper Bar */}
        <div className="w-full bg-navy-900 border border-navy-border rounded-panel p-2 flex items-center justify-between gap-1 overflow-x-auto">
          {stages.map((stage, idx) => {
            const isActive = currentStageIndex === idx;
            const isPast = currentStageIndex > idx;
            return (
              <button
                key={stage.stageId}
                onClick={() => {
                  setCurrentStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`flex-1 min-w-[130px] p-2 rounded-control text-left transition-all ${
                  isActive
                    ? 'bg-navy-800 border border-cyan-500/50 shadow-sm'
                    : isPast
                    ? 'bg-navy-950/60 border border-navy-border/60 hover:bg-navy-850'
                    : 'bg-navy-950/30 border border-navy-border/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                  <span>Stage {idx + 1} of 6</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400' : isPast ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className={`text-xs font-semibold truncate ${isActive ? 'text-cyan-light' : 'text-slate-200'}`}>
                  {stage.title}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {stage.scaleLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 3D Viewport & Narrative Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Canvas Viewport (68%) */}
          <div className="lg:col-span-8 flex flex-col gap-2">
            <div
              ref={mountRef}
              className="relative w-full h-[440px] sm:h-[480px] bg-navy-950 rounded-panel border border-navy-border overflow-hidden shadow-2xl select-none"
            >
              {/* Top-Left: Model & Scale Readout Overlays */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-navy-900/90 backdrop-blur border border-navy-border rounded-control text-xs font-mono font-medium text-cyan-light shadow-sm">
                    {activePerspective.title}
                  </span>
                  <span className="px-2 py-0.5 bg-navy-850/90 backdrop-blur border border-navy-border rounded text-[11px] font-mono text-slate-300">
                    STAGE {currentStageIndex + 1}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-navy-950/80 px-2 py-0.5 rounded backdrop-blur max-w-fit">
                  Scale: {currentScene.scaleLabel}
                </span>
              </div>

              {/* Top-Right: Evidence Kind Pill & "What am I seeing?" */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-navy-900/90 border border-navy-border rounded-control text-[10px] font-mono uppercase font-bold text-slate-300 backdrop-blur">
                  {currentScene.sceneType.replace('-', ' ')}
                </span>
                <button
                  onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                  className="px-2.5 py-1 bg-navy-900/90 hover:bg-navy-800 border border-navy-border hover:border-cyan-500/40 rounded-control text-xs text-slate-200 flex items-center gap-1.5 backdrop-blur transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect</span>
                </button>
              </div>

              {/* Bottom-Left: Default Opening Caption & Reference Warning */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none max-w-md hidden sm:block">
                <div className="p-2.5 bg-navy-950/85 backdrop-blur rounded-control border border-navy-border/80 text-[11px] text-slate-300 leading-snug shadow-sm">
                  <strong className="text-cyan-light block mb-0.5">Reference Visualisation:</strong>
                  Start with a local mathematical surface. What this surface represents depends on the perspective you choose.
                </div>
              </div>

              {/* Bottom-Right: Camera Reset */}
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  onClick={handleResetCamera}
                  title="Reset Camera View"
                  className="p-2 bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-cyan-300 border border-navy-border rounded-control backdrop-blur transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transport Control Strip */}
            <div className="h-12 bg-navy-900 border border-navy-border rounded-panel px-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-navy-800 hover:bg-navy-700 text-cyan-light rounded border border-navy-border flex items-center gap-1.5 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-cyan-400" /> : <Play className="w-4 h-4 fill-cyan-400" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY JOURNEY'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStageIndex(0);
                    setIsPlaying(false);
                    handleResetCamera();
                  }}
                  title="Restart journey"
                  className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded border border-navy-border"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentStageIndex > 0) setCurrentStageIndex(currentStageIndex - 1);
                    setIsPlaying(false);
                  }}
                  disabled={currentStageIndex === 0}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded bg-navy-800 border border-navy-border"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-slate-400">
                  {currentStageIndex + 1} / {stages.length}
                </span>
                <button
                  onClick={() => {
                    if (currentStageIndex < stages.length - 1) setCurrentStageIndex(currentStageIndex + 1);
                    setIsPlaying(false);
                  }}
                  disabled={currentStageIndex === stages.length - 1}
                  className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded bg-navy-800 border border-navy-border"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Narrative & Inspector Sidebar (32%) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Active Stage Narrative Card */}
            <div className="p-5 bg-navy-900 border border-navy-border rounded-panel flex flex-col gap-3 shadow-subtle">
              <div className="flex items-center justify-between border-b border-navy-border/60 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Stage {currentStageIndex + 1}: {currentScene.stageId.replace(/-/g, ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentScene.scaleLabel}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100">
                {currentScene.title}
              </h3>

              <p className="text-xs text-slate-200 leading-relaxed">
                {currentScene.narrative}
              </p>

              <div className="p-3 bg-navy-950 rounded-control border border-navy-border/60 text-xs space-y-1">
                <span className="font-semibold text-cyan-300 block text-[11px] uppercase">
                  What is Represented:
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {currentScene.whatIsRepresented}
                </p>
              </div>

              {currentScene.transitionNote && (
                <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded text-[11px] text-amber-300/90 leading-tight">
                  <strong>Transition Note:</strong> {currentScene.transitionNote}
                </div>
              )}
            </div>

            {/* Mandatory Non-Negotiable Disclosure */}
            <div className="p-4 bg-navy-900/60 border border-navy-border rounded-panel text-xs text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>Mandatory Scientific Disclosure:</strong> This is a visual representation, not a literal photograph of space or a quantum field. The mathematical object, physical interpretation, and scale differ fundamentally across perspectives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

