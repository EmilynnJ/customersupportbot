import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/generator" element={<GeneratorPage />} />
    </Routes>
  );
};

export default App;

