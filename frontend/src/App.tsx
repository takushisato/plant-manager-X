import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WhitePageLayout from '@/layouts/WhitePageLayout';
import Home from '@/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<WhitePageLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
