import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Footer from './components/layout/Footer';
import SimulatorControls from './components/Controls/SimulatorControls';
import CourtVisualization from './components/Court/CourtVisualization';
import ResultsPanel from './components/Results/ResultsPanel';
import ScenarioSelector from './components/Scenarios/ScenarioSelector';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <MainContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6">
              <ScenarioSelector />
              <SimulatorControls />
              <ResultsPanel />
            </div>
            
            <div className="flex flex-col space-y-6">
              <CourtVisualization />
            </div>
          </div>
        </MainContent>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;