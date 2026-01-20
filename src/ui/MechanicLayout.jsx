import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import MechanicNavBar from "./MechanicNavBar";

export default function MechanicLayout() {
  const H = 56;

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar disableGutters sx={{ px: 1.5, minHeight: H }}>
          <MechanicNavBar />
        </Toolbar>
      </AppBar>

      {/* 占位，防止内容被顶部遮挡 */}
      <Toolbar sx={{ minHeight: H }} />

      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
