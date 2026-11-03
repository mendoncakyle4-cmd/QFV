import React from 'react';
import { KatexMath } from '../ui/KatexMath';
import { SimulationParameters } from '../../types/physics';
import { calculateDispersion } from '../../physics/core/dispersion';

interface ModelAssumptionsPanelProps {
  params: SimulationParameters;
  className?: string;
}

export const ModelAssumptionsPanel: React.FC<ModelAssumptionsPanelProps> = ({ params, className = '' }) => {
  const { k, mass, c_sim, amplitude } = params;
  const { wavelength, omega, frequency } = calculateDispersion(k, mass, c_sim);

  return (
    <div className={`flex flex-col gap-3 text-xs text-slate-300 ${className}`}>
      {/* 1. Governing Differential Equation */}
      <div className="p-3 bg-navy-900/80 border border-navy-border rounded-control">
        <span className="text-[11px] font-mono font-semibold text-cyan-300 uppercase">
          1. Governing Equation (Klein-Gordon)
        </span>
        <KatexMath math="(\Box + m^2)\phi = \left(\frac{1}{c^2}\frac{\partial^2}{\partial t^2} - \nabla^2 + \frac{m^2 c^2}{\hbar^2}\right)\phi = 0" block />
        <p className="text-[11px] text-slate-400 mt-1">
          In simulation units (&hbar; = 1, c<sub>sim</sub> = 1.0):
        </p>
        <KatexMath math="\frac{\partial^2 \phi}{\partial t^2} - c_{\text{sim}}^2 \nabla^2 \phi + m^2 \phi = 0" block />
      </div>

      {/* 2. Live Parameter Solutions */}
      <div className="p-3 bg-navy-900/80 border border-navy-border rounded-control font-mono text-[11px]">
        <span className="font-semibold text-cyan-300 uppercase block mb-1">
          2. Live Mode Solution
        </span>
        <KatexMath math={`\\phi(\\vec{x}, t) = A \\cos(\\vec{k}\\cdot\\vec{x} - \\omega t)`} block />
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-navy-border/60">
          <div>Wave number (k): <span className="text-cyan-light font-bold">{k.toFixed(2)} rad/u</span></div>
          <div>Wavelength (&lambda;): <span className="text-cyan-light font-bold">{wavelength.toFixed(2)} u</span></div>
          <div>Angular freq (&omega;): <span className="text-cyan-light font-bold">{omega.toFixed(2)} rad/t</span></div>
          <div>Frequency (f): <span className="text-cyan-light font-bold">{frequency.toFixed(2)} cyc/t</span></div>
          <div>Rest mass (m): <span className="text-cyan-light font-bold">{mass.toFixed(2)}</span></div>
          <div>Amplitude (A): <span className="text-cyan-light font-bold">{amplitude.toFixed(2)}</span></div>
        </div>
      </div>

      {/* 3. Scientific Assumptions & Boundary Conditions */}
      <div className="p-3 bg-navy-900/80 border border-navy-border rounded-control space-y-2">
        <span className="text-[11px] font-mono font-semibold text-cyan-300 uppercase block">
          3. Assumptions & Boundary Conditions
        </span>
        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
          <li><strong>Flat Spacetime:</strong> Zero gravitational metric curvature (&eta;<sub>&mu;&nu;</sub> = diag(-1, +1, +1, +1)).</li>
          <li><strong>Linear Free Field:</strong> No non-linear self-coupling terms (&lambda;&phi;<sup>4</sup> = 0). Modes evolve independently without scattering.</li>
          <li><strong>Spatial Domain:</strong> Bounded simulation domain [-5, +5] &times; [-5, +5] length units with 64 &times; 64 sampled grid points.</li>
          <li><strong>Numerical Method:</strong> Exact analytic plane-wave summation evaluated dynamically per vertex in real-time.</li>
        </ul>
      </div>

      {/* 4. Known Limitations */}
      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-control space-y-1">
        <span className="text-[11px] font-mono font-semibold text-amber-400 uppercase block">
          4. Known Model Limitations
        </span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          This model represents classical and single-particle expectation configurations of a free scalar field. It does not compute non-perturbative lattice path integrals or full quantum loops with multi-particle creation and annihilation.
        </p>
      </div>
    </div>
  );
};

