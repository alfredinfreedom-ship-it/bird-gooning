import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BirdDetailPage from './pages/BirdDetailPage';
import SightingLogPage from './pages/SightingLogPage';
import EvolutionPage from './pages/EvolutionPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bird/:id" element={<BirdDetailPage />} />
        <Route path="/sightings" element={<SightingLogPage />} />
        <Route path="/evolution" element={<EvolutionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
