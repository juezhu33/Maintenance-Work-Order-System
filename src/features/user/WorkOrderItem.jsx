import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

function WorkOrderItem({ primary, secondary }) {
  const navigate = useNavigate();

  return (
    <ListItemButton onClick={() => navigate(`detail/${primary}`)}>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItemButton>
  );
}

export default WorkOrderItem;
