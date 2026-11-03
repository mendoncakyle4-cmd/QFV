import React, { useState, useEffect } from 'react';
import { useNavigationStore } from './state/useNavigationStore';
import { AppHeader } from './components/layout/AppHeader';
import { Footer } from './components/layout/Footer';
import { HelpDialog } from './components/dialogs/HelpDialog';
import { LandingPage } from './views/LandingPage';
import { ExplorerPage } from './views/ExplorerPage';
import { FrequencyLabPage } from './views/FrequencyLabPage';
import { ExperimentsPage } from './views/ExperimentsPage';
import { FieldLibraryPage } from './views/FieldLibraryPage';
import { QuantumStatesPage } from './views/QuantumStatesPage';
import { VacuumPage } from './views/VacuumPage';
import { InteractionsPage } from './views/InteractionsPage';
import { SciencePage } from './views/SciencePage';
import { MyLabPage } from './views/MyLabPage';

export const App: React.FC = () => {
  const { currentRoute } = useNavigationStore();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Keyboard shortcut: '?' opens help dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage />;
      case '/explore':
        return <ExplorerPage />;
      case '/experiments/frequency-lab':
        return <FrequencyLabPage />;
      case '/experiments':
        return <ExperimentsPage />;
      case '/fields':
        return <FieldLibraryPage />;
      case '/states':
        return <QuantumStatesPage />;
      case '/vacuum':
        return <VacuumPage />;
      case '/interactions':
        return <InteractionsPage />;
      case '/science':
        return <SciencePage />;
      case '/lab':
        return <MyLabPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <AppHeader onOpenHelp={() => setIsHelpOpen(true)} />
      <main className="flex-1 flex flex-col">
        {renderCurrentView()}
      </main>
      {/* Footer on editorial and learning pages (hidden on full-screen explorer workspace) */}
      {currentRoute !== '/explore' && <Footer />}
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

