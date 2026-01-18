import { Outlet } from "react-router-dom";
import UserLayout from "./UserLayout";

function AppLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default AppLayout;
