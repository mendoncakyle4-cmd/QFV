import { create } from 'zustand';

export type AppRoute = 
  | '/'
  | '/explore'
  | '/experiments'
  | '/experiments/frequency-lab'
  | '/fields'
  | '/states'
  | '/vacuum'
  | '/interactions'
  | '/science'
  | '/lab'
  | '/perspectives';

interface NavigationState {
  currentRoute: AppRoute;
  activeExperimentSlug: string | null;
  navigate: (route: AppRoute, experimentSlug?: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => {
  // Read hash or pathname on initial load
  const initialHash = window.location.hash.replace('#', '') || '/';
  const validRoute: AppRoute = [
    '/', '/explore', '/experiments', '/experiments/frequency-lab',
    '/fields', '/states', '/vacuum', '/interactions', '/science', '/lab', '/perspectives'
  ].includes(initialHash as AppRoute) ? (initialHash as AppRoute) : '/';

  // Listen for browser hash changes (for back/forward buttons)
  window.addEventListener('hashchange', () => {
    const nextHash = window.location.hash.replace('#', '') || '/';
    if (nextHash.startsWith('/experiments/')) {
      const slug = nextHash.replace('/experiments/', '');
      if (slug === 'frequency-lab') {
        set({ currentRoute: '/experiments/frequency-lab', activeExperimentSlug: null });
      } else {
        set({ currentRoute: '/experiments', activeExperimentSlug: slug });
      }
    } else if (nextHash.startsWith('/perspectives/')) {
      const slug = nextHash.replace('/perspectives/', '');
      set({ currentRoute: '/perspectives', activeExperimentSlug: slug });
    } else {
      set({ currentRoute: (nextHash as AppRoute) || '/', activeExperimentSlug: null });
    }
  });

  return {
    currentRoute: validRoute,
    activeExperimentSlug: null,
    navigate: (route, experimentSlug) => {
      if (experimentSlug && route === '/perspectives') {
        window.location.hash = `/perspectives/${experimentSlug}`;
        set({ currentRoute: '/perspectives', activeExperimentSlug: experimentSlug });
      } else if (experimentSlug) {
        window.location.hash = `/experiments/${experimentSlug}`;
        set({ currentRoute: '/experiments', activeExperimentSlug: experimentSlug });
      } else {
        window.location.hash = route;
        set({ currentRoute: route, activeExperimentSlug: null });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
});
