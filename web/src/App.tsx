import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RedirectPage } from './pages/RedirectPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/r/:encurtador" element={<RedirectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
