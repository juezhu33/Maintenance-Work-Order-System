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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<UserLayout />}>
        <Route path="" element={<Navigate to="/user" />} />
        <Route path="/user" element={<WorkOrderList />} />
        <Route path="/add" element={<AddWorkOrder />} />
        <Route path="detail/:id" element={<Detail />} />
      </Route>
    </Routes>
  );
}

export default App;
