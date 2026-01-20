import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

const demo = [
  {
    id: "n-1001",
    title: "宿舍灯坏了",
    location: "1号楼 402",
    desc: "晚上突然不亮，可能灯管坏了。",
    createdAt: "10:21",
    priority: "high",
  },
  {
    id: "n-1002",
    title: "水龙头漏水",
    location: "2号楼 106",
    desc: "一开水就滴，地面已经湿了。",
    createdAt: "09:12",
    priority: "medium",
  },
  {
    id: "n-1003",
    title: "门锁卡住",
    location: "实验楼 303",
    desc: "钥匙能插进去，但转不动。",
    createdAt: "昨天 16:40",
    priority: "low",
  },
];

function PriorityChip({ value }) {
  if (value === "high")
    return <Chip size="small" label="高优先" color="error" />;
  if (value === "medium")
    return <Chip size="small" label="中优先" color="warning" />;
  return <Chip size="small" label="低优先" />;
}

export default function NewWorkOrder() {
  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>新工单</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            待接单列表
          </Typography>
        </Box>
        <Chip size="small" label={`共 ${demo.length} 条`} />
      </Stack>

      <Stack spacing={1.5}>
        {demo.map((item) => (
          <Paper
            key={item.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 1.5,
            }}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Typography sx={{ fontWeight: 800 }} noWrap>
                  {item.title}
                </Typography>
                <PriorityChip value={item.priority} />
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {item.location} · {item.createdAt}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {item.desc}
              </Typography>

              <Divider />

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" variant="outlined" onClick={() => {}}>
                  忽略
                </Button>
                <Button size="small" variant="contained" onClick={() => {}}>
                  接单
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
