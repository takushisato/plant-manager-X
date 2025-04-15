import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Material from "@/pages/Material";
import MaterialCreate from "@/pages/MaterialCreate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/material" element={<Material />} />
        <Route path="/material/create" element={<MaterialCreate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
