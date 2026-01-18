import { Navigate, Route, Routes } from "react-router-dom";
import UserLayout from "./ui/UserLayout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import WorkOrderList from "./features/user/WorkOrderList";
import AddWorkOrder from "./features/user/AddWorkOrder";
import Detail from "./features/user/WorkOrderDetail";
import Login from "./features/auth/Login";
import AppLayout from "./ui/AppLayout";
import AdminLayout from "./ui/AdminLayout";
import MechanicLayout from "./ui/MechanicLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/user" replace />} />

        <Route path="admin" element={<AdminLayout />}></Route>
        <Route path="mechanic" element={<MechanicLayout />}></Route>

        <Route path="user" element={<UserLayout />}>
          <Route index element={<WorkOrderList />} />
          <Route path="add" element={<AddWorkOrder />} />
          <Route path="detail/:id" element={<Detail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
