import { FieldModelId } from '../types/physics';

export interface FieldLibraryEntry {
  id: FieldModelId;
  name: string;
  type: string;
  badge: 'AVAILABLE NOW' | 'LATER MODULE' | 'ADVANCED MODULE';
  available: boolean;
  mathematicalObject: string;
  governingEquation: string;
  whatCanBeVisualised: string[];
  whatIsNotRepresented: string[];
  description: string;
  route?: string;
}

export const FIELD_LIBRARY: FieldLibraryEntry[] = [
  {
    id: 'scalar-free',
    name: 'Free Scalar Field',
    type: 'Scalar Field (Spin-0, Klein-Gordon)',
    badge: 'AVAILABLE NOW',
    available: true,
    mathematicalObject: 'Real scalar field amplitude phi(x, z, t) or classical mode configuration',
    governingEquation: '(Box + m^2) phi = (d^2/dt^2 - c^2 nabla^2 + m^2) phi = 0',
    whatCanBeVisualised: [
      'Spatial scalar configurations on a 2D spatial slice',
      'Dispersion-coupled wave oscillations',
      'Mode superpositions and interference fringes',
      'Localised wave packets propagating at physical group velocity',
      'Quantized standing modes with boundary constraints',
    ],
    whatIsNotRepresented: [
      'A literal optical photograph or surface of a physical substance',
      'Non-abelian self-interactions or gauge couplings',
      'Full interacting multi-particle creation/annihilation loops',
    ],
    description: 'The prototypical model in relativistic field theory. Serves as the mathematical foundation for understanding Klein-Gordon dynamics, dispersion relations, and mode decompositions.',
    route: '/explore',
  },
  {
    id: 'electromagnetic',
    name: 'Electromagnetic Field',
    type: 'Vector / Gauge Field (Spin-1, U(1) Maxwell)',
    badge: 'LATER MODULE',
    available: false,
    mathematicalObject: 'Vector potential A_mu and gauge-invariant field strength tensor F_munu (Electric vector E and Magnetic vector B)',
    governingEquation: 'nabla . E = rho/epsilon_0,  nabla x B - (1/c^2) dE/dt = mu_0 J',
    whatCanBeVisualised: [
      'Orthogonal electric and magnetic field vector arrows',
      'Linear and circular polarization states',
      'Poynting vector energy flux S = (1/mu_0) E x B',
    ],
    whatIsNotRepresented: [
      'A single scalar height surface (EM requires 3D vector fields for E and B)',
      'Arbitrary color assignments without optical spectrum context',
    ],
    description: 'The fundamental U(1) gauge theory governing quantum electrodynamics (QED). Requires vector arrow fields and polarisation geometries rather than a simple scalar height map.',
  },
  {
    id: 'higgs-potential',
    name: 'Higgs Field Potential',
    type: 'Complex Scalar Doublet (Spontaneous Symmetry Breaking)',
    badge: 'LATER MODULE',
    available: false,
    mathematicalObject: 'Classical scalar potential landscape V(phi) = -mu^2 |phi|^2 + lambda |phi|^4',
    governingEquation: 'V(phi) = lambda (|phi|^2 - v^2/2)^2',
    whatCanBeVisualised: [
      'Mexican-hat potential-energy landscape in complex field space',
      'Spontaneous symmetry breaking and vacuum expectation value v',
      'Radial Higgs mode (massive) and angular Goldstone modes (massless)',
    ],
    whatIsNotRepresented: [
      'A physical sticky molasses fluid slowing particles down',
      'An optical fluid filling space',
    ],
    description: 'The electroweak symmetry-breaking mechanism. Visualizes the potential energy surface where the symmetric vacuum state becomes unstable, selecting a non-zero vacuum expectation value.',
  },
  {
    id: 'fermion-dirac',
    name: 'Electron / Fermion Field',
    type: 'Spinor Field (Spin-1/2, Dirac Equation)',
    badge: 'ADVANCED MODULE',
    available: false,
    mathematicalObject: 'Four-component Dirac spinor psi(x, t) and Grassman-valued anticommuting fields',
    governingEquation: '(i gamma^mu partial_mu - m) psi = 0',
    whatCanBeVisualised: [
      'Wavefunction probability density psi^dagger psi',
      'Complex phase angle and spin orientation in quantum state space',
      'Pauli exclusion principle in occupation number representations',
    ],
    whatIsNotRepresented: [
      'A classical scalar water surface',
      'A tiny solid ball orbiting a nucleus',
    ],
    description: 'Fermionic matter fields obeying Fermi-Dirac statistics and the Dirac equation. Requires spinor representations and anticommuting operator mathematics.',
  },
  {
    id: 'qcd-lattice',
    name: 'Quark and Gluon Fields (Lattice QCD)',
    type: 'Non-Abelian SU(3) Gauge Field (Quantum Chromodynamics)',
    badge: 'ADVANCED MODULE',
    available: false,
    mathematicalObject: 'Euclidean spacetime lattice link variables U_mu(x) and gauge action density Tr(F_munu F^munu)',
    governingEquation: 'S_QCD = integral d^4x [-(1/4) G_{mu nu}^a G^{a mu nu} + psi_bar (i D_slash - m) psi]',
    whatCanBeVisualised: [
      'Euclidean lattice topological charge density slices',
      'Action density flux tubes between quark-antiquark pairs',
    ],
    whatIsNotRepresented: [
      'A real-time camera photograph inside a proton',
      'A literal physical jelly with glowing blobs',
    ],
    description: 'The strong force governing quarks and gluons. Visualized from numerical Monte Carlo evaluations on four-dimensional spacetime lattices (CSSM / Adelaide benchmarks).',
  },
];

