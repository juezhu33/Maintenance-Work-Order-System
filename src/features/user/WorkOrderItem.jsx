import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

function WorkOrderItem({ id, primary, secondary }) {
  const navigate = useNavigate();

  return (
    <ListItemButton onClick={() => navigate(`/user/detail/${id}`)}>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItemButton>
  );
}

export default WorkOrderItem;
