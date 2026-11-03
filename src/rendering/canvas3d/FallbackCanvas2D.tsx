import React, { useRef, useEffect, useState } from 'react';
import { ColormapId, PresetId, SimulationParameters } from '../../types/physics';
import { evaluateScalarField } from '../../physics/scalar/scalarModel';
import { getColorForValue } from '../palettes/colormaps';

interface FallbackCanvas2DProps {
  preset: PresetId;
  params: SimulationParameters;
  colormap: ColormapId;
  isPaused: boolean;
  className?: string;
}

export const FallbackCanvas2D: React.FC<FallbackCanvas2DProps> = ({
  preset,
  params,
  colormap,
  isPaused,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef<number>(0);
  const reqIdRef = useRef<number>(0);
  const [hoveredValue, setHoveredValue] = useState<{ x: number; z: number; val: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      reqIdRef.current = requestAnimationFrame(render);
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPaused && !document.hidden) {
        timeRef.current += delta * params.timeScale * 2.0;
      }

      const width = canvas.width;
      const height = canvas.height;
      const t = timeRef.current;
      const L = 10; // field spatial box from -5 to +5

      // Step size for 2D density map
      const step = 4;
      for (let px = 0; px < width; px += step) {
        for (let pz = 0; pz < height; pz += step) {
          const x = (px / width - 0.5) * L;
          const z = (pz / height - 0.5) * L;

          const { value } = evaluateScalarField(x, z, t, preset, params);
          const rgb = getColorForValue(value, colormap);

          ctx.fillStyle = `rgb(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)})`;
          ctx.fillRect(px, pz, step, step);
        }
      }

      // Draw coordinate axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('-5', 8, height / 2 - 4);
      ctx.fillText('+5', width - 20, height / 2 - 4);
      ctx.fillText('-5', width / 2 + 6, height - 8);
      ctx.fillText('+5', width / 2 + 6, 16);
    };

    reqIdRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [preset, params, colormap, isPaused]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const pz = e.clientY - rect.top;
    const L = 10;
    const x = (px / canvas.width - 0.5) * L;
    const z = (pz / canvas.height - 0.5) * L;
    const { value } = evaluateScalarField(x, z, timeRef.current, preset, params);
    setHoveredValue({ x, z, val: value });
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 bg-navy-950 rounded-panel border border-navy-border ${className}`}>
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-cyan-300">2D Density Slice Mode (Hardware fallback)</span>
        {hoveredValue && (
          <span className="text-xs font-mono text-slate-300">
            x: {hoveredValue.x.toFixed(2)} | z: {hoveredValue.z.toFixed(2)} &rarr; &phi; = {hoveredValue.val.toFixed(3)}
          </span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={380}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredValue(null)}
        className="w-full max-w-[500px] h-[360px] rounded-control border border-navy-border shadow-inner cursor-crosshair"
      />
      <div className="w-full text-center mt-2 text-[11px] font-mono text-slate-400">
        Hover over field coordinates to sample local field amplitude &phi;(x, z, t).
      </div>
    </div>
  );
};

