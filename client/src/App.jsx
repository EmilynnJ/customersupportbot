import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;

