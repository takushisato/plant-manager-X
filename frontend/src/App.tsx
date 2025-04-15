import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Materials from "@/pages/Materials";
import MaterialsReceive from "@/pages/MaterialsReceive";
import MaterialsUse from "@/pages/MaterialsUse";
import AttendanceList from "@/pages/AttendanceList";
import AttendanceCreate from "@/pages/AttendanceCreate";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/materials/:id/receive" element={<MaterialsReceive />} />
        <Route path="/materials/:id/use" element={<MaterialsUse />} />
        <Route path="/attendance" element={<AttendanceList />} />
        <Route path="/attendance/create" element={<AttendanceCreate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
