import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const demo = [
  {
    id: "1001",
    title: "宿舍灯坏了",
    location: "1号楼 402",
    status: "open",
    time: "今天 10:21",
    desc: "突然不亮，可能灯管坏了",
  },
  {
    id: "1002",
    title: "水龙头漏水",
    location: "2号楼 106",
    status: "in_progress",
    time: "今天 09:12",
    desc: "一开水就滴，地面已经湿了",
  },
  {
    id: "1003",
    title: "门锁卡住",
    location: "实验楼 303",
    status: "done",
    time: "昨天 16:40",
    desc: "钥匙能插进去但转不动",
  },
];

function StatusChip({ status }) {
  if (status === "open") return <Chip size="small" label="待处理" />;
  if (status === "in_progress")
    return <Chip size="small" label="处理中" color="warning" />;
  return <Chip size="small" label="已完成" color="success" />;
}

export default function WorkOrderList() {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>我的工单</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          点击查看详情与进度
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {demo.map((w) => (
          <Paper
            key={w.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 1.5,
            }}
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
                  <IconButton size="small" aria-label="go">
                    <ChevronRightIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {w.location} · {w.time}
              </Typography>

              <Divider />

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {w.desc}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 18,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        onClick={() => navigate("/user/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
