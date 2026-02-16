import { Navigate, Route, Routes } from "react-router-dom";
import UserLayout from "./ui/UserLayout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import WorkOrderList from "./features/user/WorkOrderList";
import AddWorkOrder from "./features/user/AddWorkOrder";
import WorkOrderDetail from "./features/user/WorkOrderDetail";
import Login from "./features/auth/Login";
import AppLayout from "./ui/AppLayout";
import AdminLayout from "./ui/AdminLayout";
import MechanicLayout from "./ui/MechanicLayout";
import WorkOrderHistory from "./features/mechanic/WorkOrderHistory";
import NewWorkOrder from "./features/mechanic/NewWorkOrder";
import MechanicWorkOrderDetail from "./features/mechanic/MechanicWorkOrderDetail";
import AdminWorkOrderList from "./features/admin/AdminWorkOrderList";
import AdminWorkOrderDetail from "./features/admin/AdminWorkOrderDetail";
import AdminMechanicList from "./features/admin/AdminMechanicList";
import AdminReporterList from "./features/admin/AdminReporterList";
import Register from "./features/auth/Register";
import ProtectedRoute from "./ui/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WorkOrderList />} />
          <Route path="add" element={<AddWorkOrder />} />
          <Route path="detail/:id" element={<WorkOrderDetail />} />
        </Route>

        <Route
          path="mechanic"
          element={
            <ProtectedRoute allowedRoles={["mechanic"]}>
              <MechanicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="news" replace />} />
          <Route path="news" element={<NewWorkOrder />} />
          <Route path="history" element={<WorkOrderHistory />} />
          <Route path="detail/:id" element={<MechanicWorkOrderDetail />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="workorders" replace />} />
          <Route path="workorders" element={<AdminWorkOrderList />} />
          <Route path="workorders/:id" element={<AdminWorkOrderDetail />} />
          <Route path="mechanics" element={<AdminMechanicList />} />
          <Route path="reporters" element={<AdminReporterList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
