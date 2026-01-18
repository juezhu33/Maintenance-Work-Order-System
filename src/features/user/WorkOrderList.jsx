import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkOrderItem from "./WorkOrderItem";
import { useNavigate } from "react-router-dom";

const messages = [
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "标题",
    secondary:
      "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
];

export default function WorkOrderList() {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ pb: 10 }}>
        <CssBaseline />
        <List>
          {messages.map(({ primary, secondary, person }, index) => (
            <WorkOrderItem
              key={`${index}-${person}`}
              primary={primary}
              secondary={secondary}
            />
          ))}
        </List>
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          left: 56,
          bottom: 88,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        onClick={() => {
          navigate("add");
        }}
      >
        <AddIcon />
      </Fab>
    </>
  );
}
