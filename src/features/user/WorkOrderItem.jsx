import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

function WorkOrderItem({ primary, secondary }) {
  return (
    <ListItemButton>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItemButton>
  );
}

export default WorkOrderItem;
