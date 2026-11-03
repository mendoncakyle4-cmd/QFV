export interface ScienceTopic {
  id: string;
  title: string;
  category: 'Foundations' | 'Equations' | 'Research Bibliography' | 'Triage & Guardrails';
  summary: string;
  equationsLatex?: string[];
  assumptions: string[];
  limitations: string[];
  citations: string[];
}

export const SCIENCE_TOPICS: ScienceTopic[] = [
  {
    id: 'operator-distributions',
    title: 'Operator-Valued Distributions & Smearing',
    category: 'Foundations',
    summary: 'A quantum field is mathematically not a classical continuous number assigned to each spatial point. According to the Wightman axioms of axiomatic quantum field theory, a field phi(x) is an operator-valued distribution. To produce a legitimate quantum observable with finite variance, the distribution must be smeared over a smooth spacetime test function f(x).',
    equationsLatex: [
      '\\phi(f) = \\int d^4x \\, \\phi(x) f(x)',
      '\\langle 0 | \\phi(f)^2 | 0 \\rangle < \\infty',
    ],
    assumptions: [
      'Poincaré invariance of the vacuum state |0>',
      'Microcausality (spacelike commutators vanish: [phi(x), phi(y)] = 0 for (x - y)^2 < 0)',
      'Positive-energy spectral condition',
    ],
    limitations: [
      'Pointwise values phi(x) have divergent variances; our discrete grid visualisations represent sampled smoothed distributions.',
    ],
    citations: [
      'Streater, R. F., & Wightman, A. S. (1964). PCT, Spin and Statistics, and All That. Princeton University Press.',
      'Haag, R. (1996). Local Quantum Physics: Fields, Particles, Algebras. Springer.',
    ],
  },
  {
    id: 'klein-gordon-dispersion',
    title: 'Klein-Gordon Equation & Relativistic Dispersion',
    category: 'Equations',
    summary: 'The relativistic field equation for a free scalar field of mass m. The dispersion relation directly couples the spatial wave number k to the temporal oscillation frequency omega.',
    equationsLatex: [
      '(\\partial_t^2 - c^2 \\nabla^2 + m^2) \\phi(x, t) = 0',
      '\\omega(k) = \\sqrt{c^2 k^2 + m^2}',
      '\\lambda = \\frac{2\\pi}{k}, \\quad f = \\frac{\\omega}{2\\pi}, \\quad E = \\hbar \\omega',
      'v_g = \\frac{d\\omega}{dk} = \\frac{c^2 k}{\\omega} < c \\quad (m > 0)',
    ],
    assumptions: [
      'Linear free field (no non-linear self-interaction terms lambda * phi^4)',
      'Flat Minkowski spacetime (special relativity; zero gravitational curvature)',
      'Dirichlet or periodic boundary conditions at spatial boundaries',
    ],
    limitations: [
      'Interactions (particle creation/decay) require perturbative Feynman diagrams or non-perturbative lattice path integrals.',
    ],
    citations: [
      'Peskin, M. E., & Schroeder, D. V. (1995). An Introduction to Quantum Field Theory. Westview Press.',
      'Srednicki, M. (2007). Quantum Field Theory. Cambridge University Press.',
    ],
  },
  {
    id: 'quantum-vacuum-casimir',
    title: 'Quantum Vacuum & Casimir Boundary Quantisation',
    category: 'Foundations',
    summary: 'The vacuum state |0> is the lowest energy eigenstate of the quantum Hamiltonian. While the field expectation value vanishes (<0|phi|0> = 0), the zero-point quantum variance is non-zero. Between conducting boundaries separated by distance d, only discrete modes kn = n*pi/d are permitted, resulting in the macroscopic Casimir force.',
    equationsLatex: [
      '\\langle 0 | \\phi(x) | 0 \\rangle = 0, \\quad \\langle 0 | \\phi(x)^2 | 0 \\rangle > 0',
      'E_0 = \\sum_k \\frac{1}{2} \\hbar \\omega_k',
      '\\frac{F}{A} = -\\frac{\\pi^2 \\hbar c}{240 d^4}',
    ],
    assumptions: [
      'Idealized perfectly conducting plates with infinite plasma frequency',
      'Zero temperature (T = 0 K)',
      'Parallel geometry with zero surface roughness',
    ],
    limitations: [
      'Real metals show finite conductivity and UV transparency. Thermal fluctuations dominate at large plate separations.',
      'Energy conservation holds strictly: no net usable energy can be harvested from static vacuum configurations.',
    ],
    citations: [
      'Casimir, H. B. G. (1948). On the attraction between two perfectly conducting plates. Proc. K. Ned. Akad. Wet., 51, 793.',
      'Lamoreaux, S. K. (1997). Demonstration of the Casimir force in the 0.6 to 6 um range. Physical Review Letters, 78(1), 5.',
    ],
  },
  {
    id: 'research-bibliography-triage',
    title: 'Research Source Triage & Verification',
    category: 'Research Bibliography',
    summary: 'Independent assessment of primary literature and scientific references used in the design of this product.',
    assumptions: [
      'Scientific claims must be verified against peer-reviewed empirical and theoretical physics literature.',
    ],
    limitations: [
      'Educational visualisations use chosen mathematical projections; they are never optical photographs of quantum fields.',
    ],
    citations: [
      'Helmut Linde (2019). A New Way of Visualizing Quantum Fields. arXiv:1907.11311.',
      'Riek, C., et al. (2015). Direct sampling of electric field vacuum fluctuations. Science, 350(6259), 420-423.',
      'Benea-Chelmus, I.-C., et al. (2019). Electric field correlation measurements on the electromagnetic ground state. Nature, 568, 202-206.',
      'Stodolna, A. S., et al. (2013). Hydrogen atoms under magnification: direct observation of the nodal structure of Stark states. Phys. Rev. Lett., 110, 213001.',
      'CSSM Visual QCD (University of Adelaide): Lattice gauge field topological charge and action density visualisations.',
    ],
  },
  {
    id: 'excluded-claims-guardrails',
    title: 'Claims Excluded from Scientific Curriculum',
    category: 'Triage & Guardrails',
    summary: 'In accordance with Section 0 and Section 4 of the master specification, the following concepts are explicitly excluded from the core simulator and educational content because they lack empirical verification or misrepresent established field theory: (1) Literal physical medium / ether models; (2) Free energy extraction or vacuum harvesting devices; (3) CIA Gateway / Stargate interpretations; (4) Unverified DARPA speculative interpretations; (5) Popular metaphors treated as literal physical ontology.',
    assumptions: [
      'Conservation of energy, standard model gauge symmetries, and empirical peer-reviewed consensus.',
    ],
    limitations: [
      'Speculative theories are welcome in theoretical physics seminars, but must not be presented to students as settled experimental facts.',
    ],
    citations: [
      'Master Product Specification Section 0 (Non-Negotiable Product Rules).',
      'Master Product Specification Section 4 (Research-source triage).',
    ],
  },
];

