export interface GuidedStep {
  stepNumber: number;
  title: string;
  instruction: string;
  highlightControl?: 'k' | 'amplitude' | 'mass' | 'phase' | 'mode' | 'timeScale';
  expectedObservation: string;
  scientificInsight: string;
  suggestedValue?: number;
}

export interface GuidedExperiment {
  slug: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Conceptual';
  concept: string;
  startingPreset: 'single-mode' | 'two-mode' | 'wave-packet' | 'ground-state' | 'standing-wave';
  steps: GuidedStep[];
  takeaway: string;
  nextSuggestedSlug: string;
}

export const GUIDED_EXPERIMENTS: GuidedExperiment[] = [
  {
    slug: 'one-field-one-mode',
    title: 'One Field, One Mode',
    subtitle: 'Observe how spatial wave number k dictates wavelength lambda',
    durationMinutes: 2,
    difficulty: 'Beginner',
    concept: 'Spatial wave number k, wavelength lambda = 2*pi/k, and temporal dispersion',
    startingPreset: 'single-mode',
    steps: [
      {
        stepNumber: 1,
        title: 'Initialise a Pure Monochromatic Mode',
        instruction: 'Look at the field surface. It currently shows a single sinusoidal spatial wave travelling across the simulation coordinate grid.',
        expectedObservation: 'A uniform wave pattern with equal spacing between crests.',
        scientificInsight: 'In quantum field theory, plane wave modes form the fundamental basis (Fourier modes) from which general field configurations and particle states are built.',
      },
      {
        stepNumber: 2,
        title: 'Increase the Wave Number (k)',
        instruction: 'Move the Wave Number (k) slider from 1.5 up to 3.5.',
        highlightControl: 'k',
        suggestedValue: 3.5,
        expectedObservation: 'The spatial crests pack closer together, shortening the wavelength lambda.',
        scientificInsight: 'The fundamental relation lambda = 2*pi / k means higher k compresses the wave. Because omega = c * k, the oscillation frequency also increases proportionally.',
      },
      {
        stepNumber: 3,
        title: 'Introduce Rest Mass (m)',
        instruction: 'Slide the Mass (m) parameter from 0.0 to 1.5.',
        highlightControl: 'mass',
        suggestedValue: 1.5,
        expectedObservation: 'The wave phase propagation speed alters according to the relativistic dispersion relation.',
        scientificInsight: 'For a massive relativistic field, omega(k) = sqrt(c^2*k^2 + m^2). Even at k -> 0, the field oscillates at a non-zero rest frequency omega_0 = m, representing the rest-mass energy E = m*c^2.',
      },
    ],
    takeaway: 'Wave number k determines spatial wavelength, while the field dispersion relation couples spatial frequency to temporal oscillation rate.',
    nextSuggestedSlug: 'two-modes-meet',
  },
  {
    slug: 'two-modes-meet',
    title: 'Two Modes Meet',
    subtitle: 'Explore linear superposition and interference fringes',
    durationMinutes: 3,
    difficulty: 'Intermediate',
    concept: 'Linear superposition of modes, constructive and destructive interference',
    startingPreset: 'two-mode',
    steps: [
      {
        stepNumber: 1,
        title: 'Observe the Superposition Field',
        instruction: 'Look at the surface. You are seeing the sum of two independent Fourier modes phi_1(x) + phi_2(x).',
        expectedObservation: 'Periodic beat patterns where the two modes alternately add up and cancel out.',
        scientificInsight: 'Because free quantum field equations are linear (Klein-Gordon equation), any linear combination of solutions is also an exact solution.',
      },
      {
        stepNumber: 2,
        title: 'Adjust Relative Phase',
        instruction: 'Adjust the Phase slider to shift the relative starting offset of the waves.',
        highlightControl: 'phase',
        expectedObservation: 'The interference crests and cancellation nodes shift position across space.',
        scientificInsight: 'Relative phase determines where constructive interference (amplification) and destructive interference (cancellation) take place in space.',
      },
      {
        stepNumber: 3,
        title: 'Compare the Mode Spectrum',
        instruction: 'Open the Spectrum tab in the inspector to see the two separate Fourier peaks.',
        expectedObservation: 'Two distinct peaks on the k-axis matching the wave numbers of the two component modes.',
        scientificInsight: 'A spectrum acts like a prism, separating a complex spatial field into its individual harmonic constituents.',
      },
    ],
    takeaway: 'Complex field patterns emerge simply from linear additions of clean sinusoidal modes.',
    nextSuggestedSlug: 'build-a-wave-packet',
  },
  {
    slug: 'build-a-wave-packet',
    title: 'Build a Wave Packet',
    subtitle: 'Localise an excitation in space and observe group velocity',
    durationMinutes: 4,
    difficulty: 'Intermediate',
    concept: 'Wave packets, Gaussian envelopes, phase velocity vs group velocity',
    startingPreset: 'wave-packet',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect the Spatially Bounded Packet',
        instruction: 'Notice that unlike infinite plane waves, this excitation is confined to a localized region.',
        expectedObservation: 'A localized envelope of ripples that travels across the coordinate space.',
        scientificInsight: 'In quantum mechanics, localized particles are represented by wave packets constructed from a continuum of momentum modes.',
      },
      {
        stepNumber: 2,
        title: 'Modify Packet Width (sigma)',
        instruction: 'Change the packet width parameter and observe the spatial spread.',
        expectedObservation: 'A narrower packet is more sharply localized in space.',
        scientificInsight: 'Heisenberg uncertainty principle: a more sharply localized spatial packet (delta x small) requires a wider distribution of wave numbers (delta k large).',
      },
      {
        stepNumber: 3,
        title: 'Group Velocity in a Massive Field',
        instruction: 'Observe the propagation speed of the packet with mass m > 0.',
        expectedObservation: 'The packet envelope travels slower than light (v_g < c).',
        scientificInsight: 'The physical packet travels at group velocity v_g = d(omega)/dk = c^2*k / omega, which is strictly less than c for a massive particle.',
      },
    ],
    takeaway: 'Particles in field theory correspond to localized wave packet excitations of the underlying field.',
    nextSuggestedSlug: 'ground-state-versus-excitation',
  },
  {
    slug: 'ground-state-versus-excitation',
    title: 'Ground State versus Excitation',
    subtitle: 'Contrast zero-point quantum variance with excited states',
    durationMinutes: 3,
    difficulty: 'Advanced',
    concept: 'Vacuum ground state, zero-point energy, quantum field operators',
    startingPreset: 'ground-state',
    steps: [
      {
        stepNumber: 1,
        title: 'The Ground State is Not Static Nothingness',
        instruction: 'Observe the ground-state visualization. Notice that the field has deterministic non-zero spatial fluctuations.',
        expectedObservation: 'The expectation value <phi> is zero everywhere, but the variance <phi^2> is non-zero.',
        scientificInsight: 'Because field operators at different spacetime points do not commute, the ground state possesses zero-point vacuum fluctuations E_0 = (1/2) hbar omega for every mode.',
      },
      {
        stepNumber: 2,
        title: 'Add a Quantum of Excitation',
        instruction: 'Switch from the ground state to a single-mode excited state.',
        expectedObservation: 'The field gains a coherent, non-zero macroscopic amplitude.',
        scientificInsight: 'Creating a particle in QFT corresponds to applying a creation operator a^dagger(k) to the vacuum state |0>, adding energy hbar*omega to that mode.',
      },
    ],
    takeaway: 'The quantum vacuum is the lowest-energy state of a field system, possessing zero-point energy and observable variance.',
    nextSuggestedSlug: 'what-is-a-field-measurement',
  },
  {
    slug: 'what-is-a-field-measurement',
    title: 'What does a Field Measurement Mean?',
    subtitle: 'Operator-valued distributions and spatial smearing',
    durationMinutes: 3,
    difficulty: 'Conceptual',
    concept: 'Operator-valued distributions, measurement smearing, observable expectation values',
    startingPreset: 'single-mode',
    steps: [
      {
        stepNumber: 1,
        title: 'Why a Field Cannot be Measured at an Infinitesimal Point',
        instruction: 'Rotate the camera to view the 3D grid points.',
        expectedObservation: 'The visual plots amplitude values evaluated over a spatial region.',
        scientificInsight: 'In rigorous axiomatic QFT (Wightman axioms), a quantum field phi(x) is not an ordinary number at point x, but an operator-valued distribution. It only becomes a well-defined physical observable when averaged (smeared) over a test function f(x).',
      },
      {
        stepNumber: 2,
        title: 'Measurement Resolution and Sampling',
        instruction: 'Switch the display mode to "Contours" or "2D Slice".',
        expectedObservation: 'The rendering changes representation without changing the underlying mathematical model.',
        scientificInsight: 'Visualizations are human tools for encoding mathematical quantities. Changing the color palette or camera view does not change the physical quantum state.',
      },
    ],
    takeaway: 'A quantum field is a mathematical distribution whose physical predictions arise through spatial smearing and expectation values of observables.',
    nextSuggestedSlug: 'one-field-one-mode',
  },
];

