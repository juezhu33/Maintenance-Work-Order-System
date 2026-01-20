import { Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import AdminNavBar from "./AdminNavBar";

export default function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar sx={{ minHeight: 64 }}>
          <AdminNavBar />
        </Toolbar>
      </AppBar>

      {/* 占位，防止内容被顶部遮挡 */}
      <Toolbar sx={{ minHeight: 64 }} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
