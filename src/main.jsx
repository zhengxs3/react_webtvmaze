import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import ShowDetail from './ShowDetail';
import People from './People';
import Header from './Header';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/people" element={<People />} />
      <Route path="/show/:id" element={<ShowDetail />} />
    </Routes>
  </BrowserRouter>
);
