import React, { useState } from 'react';
import { useNavigationStore, AppRoute } from '../../state/useNavigationStore';
import { useSimulationStore } from '../../state/useSimulationStore';
import { 
  Volume2, 
  VolumeX, 
  Share2, 
  Layers, 
  Compass, 
  FlaskConical, 
  BookOpen, 
  Bookmark, 
  Menu, 
  X,
  Atom,
  HelpCircle,
  Eye
} from 'lucide-react';
import { ShareDialog } from '../dialogs/ShareDialog';

interface AppHeaderProps {
  onOpenHelp?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenHelp }) => {
  const { currentRoute, navigate } = useNavigationStore();
  const { isAudioEnabled, toggleAudio, use2DFallback, toggle2DFallback } = useSimulationStore();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; route: AppRoute; icon: React.ReactNode }[] = [
    { label: 'Explore', route: '/explore', icon: <Compass className="w-4 h-4" /> },
    { label: 'Experiments', route: '/experiments', icon: <FlaskConical className="w-4 h-4" /> },
    { label: 'Field Library', route: '/fields', icon: <Layers className="w-4 h-4" /> },
    { label: 'Perspectives', route: '/perspectives', icon: <Eye className="w-4 h-4" /> },
    { label: 'Science', route: '/science', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'My Lab', route: '/lab', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const handleNav = (route: AppRoute) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[66px] bg-navy-950/90 backdrop-blur-md border-b border-navy-border px-4 md:px-6 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left group focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-control p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-navy-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm group-hover:border-cyan-400 transition-colors">
              <Atom className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-slate-100 uppercase group-hover:text-cyan-light transition-colors">
                Quantum Field Explorer
              </span>
              <span className="hidden sm:block text-[10px] font-mono text-slate-400 tracking-tight">
                Explore the invisible structures of reality
              </span>
            </div>
          </button>
        </div>

        {/* Center: Primary Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-navy-900/60 p-1 border border-navy-border rounded-control">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route || (link.route === '/experiments' && currentRoute === '/experiments/frequency-lab');
            return (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-navy-800 text-cyan-light border border-navy-border shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle (Off by default) */}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Mute tone synthesis' : 'Enable physical audio synthesis (off by default)'}
            aria-label="Sound synthesizer toggle"
            className={`p-2 rounded-control border text-xs transition-colors flex items-center gap-1.5 ${
              isAudioEnabled
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-navy-900/80 text-slate-400 border-navy-border hover:text-slate-200'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-mono hidden xl:inline">
              {isAudioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}
            </span>
          </button>

          {/* 2D / 3D Mode Toggle */}
          <button
            onClick={toggle2DFallback}
            title={use2DFallback ? 'Switch to 3D WebGL Canvas' : 'Switch to 2D Fallback Canvas'}
            className={`p-2 rounded-control border text-xs transition-colors flex items-center gap-1.5 ${
              use2DFallback
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                : 'bg-navy-900/80 text-slate-400 border-navy-border hover:text-slate-200'
            }`}
          >
            <span className="text-[11px] font-mono font-semibold">
              {use2DFallback ? '2D MODE' : '3D MODE'}
            </span>
          </button>

          {/* Share Experiment Dialog */}
          <button
            onClick={() => setIsShareOpen(true)}
            title="Share reproducible experiment"
            className="p-2 bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-cyan-300 border border-navy-border rounded-control transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Help / Controls */}
          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              title="Keyboard and camera controls"
              className="p-2 bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-cyan-300 border border-navy-border rounded-control transition-colors hidden sm:flex"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Primary CTA if not on explorer */}
          {currentRoute !== '/explore' && (
            <button
              onClick={() => handleNav('/explore')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-navy-950 font-semibold text-xs rounded-control transition-all shadow-sm hover:shadow-active"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Open Explorer</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden bg-navy-900/80 border border-navy-border rounded-control text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[66px] z-30 bg-navy-950/95 backdrop-blur-lg border-b border-navy-border p-4 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => handleNav(link.route)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-colors ${
                currentRoute === link.route
                  ? 'bg-navy-800 text-cyan-light border border-navy-border'
                  : 'text-slate-300 hover:bg-navy-900'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-navy-border flex items-center justify-between">
            <button
              onClick={() => {
                navigate('/explore');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-semibold text-sm rounded-control"
            >
              <Compass className="w-4 h-4" />
              <span>Enter Field Explorer</span>
            </button>
          </div>
        </div>
      )}

      {/* Share Dialog Modal */}
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
