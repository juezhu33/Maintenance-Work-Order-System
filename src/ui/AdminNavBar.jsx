import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

export default function AdminNavBar() {
  const { pathname } = useLocation();
  const value = pathname.startsWith("/admin/workorders") ? 0 : false;

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 3 }}>
      <Typography sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
        Admin
      </Typography>

      <Tabs value={value}>
        <Tab label="工单" component={Link} to="/admin/workorders" />
      </Tabs>

      <Box sx={{ flex: 1 }} />

      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        管理员
      </Typography>
    </Box>
  );
}
