import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Chip } from "@mui/material";
import PriorityChip from "../../ui/PriorityChip";

function StatusChip({ status }) {
  if (status === "open") return <Chip size="small" label="待处理" />;
  if (status === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  if (status === "cancel") return <Chip size="small" label="已取消" />;
  return <Chip size="small" label="已完成" color="success" />;
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}
function WorkOrderItem({ list }) {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack spacing={1.5}>
        {list.map((w) => (
          <Paper
            key={w.id}
            variant="outlined"
            sx={{ borderRadius: 3, p: 1.5, cursor: "pointer" }}
            onClick={() => navigate(`/user/detail/${w.id}`)}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Typography sx={{ fontWeight: 800 }} noWrap>
                  {w.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatusChip status={w.status} />
                  <PriorityChip priority={w.priority} />
                  <IconButton size="small" aria-label="go">
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {w.location} · {formatTime(w.time)}
              </Typography>

              <Divider />

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {w.desc}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default WorkOrderItem;
