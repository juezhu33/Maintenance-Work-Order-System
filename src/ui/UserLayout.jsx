import { Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import UserNavBar from "./UserNavBar";

export default function UserLayout() {
  return (
    <Box sx={{ minHeight: "100dvh" }}>
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar disableGutters sx={{ px: 2, minHeight: 56 }}>
          <UserNavBar />
        </Toolbar>
      </AppBar>

      {/* 占位，防止内容被顶部遮挡 */}
      <Toolbar sx={{ minHeight: 50 }} />

      <Outlet />
    </Box>
  );
}
