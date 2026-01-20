import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { useLocation, useNavigate } from "react-router-dom";

export default function MechanicNavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const base = "/mechanic";
  const value = pathname.startsWith(`${base}/history`) ? 1 : 0;

  const handleChange = (e, newValue) => {
    const next = newValue === 1 ? `${base}/history` : `${base}/news`;
    if (next !== pathname) navigate(next);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="新工单" />
        <Tab label="历史工单" />
      </Tabs>
      <Divider />
    </Box>
  );
}
