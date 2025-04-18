import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Materials from "@/pages/Materials";
import MaterialsReceive from "@/pages/MaterialsReceive";
import MaterialsUse from "@/pages/MaterialsUse";
import AttendanceList from "@/pages/AttendanceList";
import AttendanceCreate from "@/pages/AttendanceCreate";
import AttendanceByUserId from "@/pages/AttendanceByUserId";
import AttendanceUpdate from "@/pages/AttendanceUpdate";
import ProductionPlanList from "@/pages/ProductionPlanList";
import ProductionPlanCreate from "@/pages/ProductionPlanCreate";
import ProductionPlanUpdate from "@/pages/ProductionPlanUpdate";
import OrderList from "@/pages/orderList";
import OrderCreate from "@/pages/OrderCreate";
import OrderUpdate from "@/pages/OrderUpdate";
import OrderById from "@/pages/OrderById";
import DefectList from "@/pages/DefectList";
import DefectCreate from "@/pages/DefectCreate";
import DefectUpdate from "@/pages/DefectUpdate";
import DefectById from "@/pages/DefectById";
import MailCreate from "@/pages/MailCreate";
import MailList from "@/pages/MailList";

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
        <Route path="/attendance/:id" element={<AttendanceByUserId />} />
        <Route path="/attendance/:id/update" element={<AttendanceUpdate />} />
        <Route path="/production_plan" element={<ProductionPlanList />} />
        <Route
          path="/production_plan/create"
          element={<ProductionPlanCreate />}
        />
        <Route
          path="/production_plan/:id/update"
          element={<ProductionPlanUpdate />}
        />
        <Route path="/order" element={<OrderList />} />
        <Route path="/order/create" element={<OrderCreate />} />
        <Route path="/order/:id/update" element={<OrderUpdate />} />
        <Route path="/order/:id" element={<OrderById />} />
        <Route path="/defect" element={<DefectList />} />
        <Route path="/defect/create" element={<DefectCreate />} />
        <Route path="/defect/:id/update" element={<DefectUpdate />} />
        <Route path="/defect/:id" element={<DefectById />} />
        <Route path="/mail" element={<MailList />} />
        <Route path="/mail/create" element={<MailCreate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
