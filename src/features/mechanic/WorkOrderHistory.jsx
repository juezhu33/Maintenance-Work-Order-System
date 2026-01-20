import * as React from "react";
import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const demo = [
  {
    id: "h-2001",
    title: "空调不制冷",
    location: "3号楼 215",
    status: "done",
    finishedAt: "今天 12:03",
  },
  {
    id: "h-2002",
    title: "卫生间堵塞",
    location: "2号楼 511",
    status: "done",
    finishedAt: "昨天 19:20",
  },
  {
    id: "h-2003",
    title: "插座没电",
    location: "教学楼 B201",
    status: "cancel",
    finishedAt: "前天 14:11",
  },
];

function StatusChip({ value }) {
  if (value === "done")
    return <Chip size="small" label="已完成" color="success" />;
  if (value === "cancel") return <Chip size="small" label="已取消" />;
  return <Chip size="small" label="处理中" color="warning" />;
}

export default function WorkOrderHistory() {
  const [filter, setFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return demo;
    return demo.filter((x) => x.status === filter);
  }, [filter]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            历史工单
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            我的处理记录
          </Typography>
        </Box>
        <Chip size="small" label={`共 ${filtered.length} 条`} />
      </Stack>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, v) => v && setFilter(v)}
        size="small"
        sx={{ mb: 1.5 }}
      >
        <ToggleButton value="all">全部</ToggleButton>
        <ToggleButton value="done">已完成</ToggleButton>
        <ToggleButton value="cancel">已取消</ToggleButton>
      </ToggleButtonGroup>

      <Stack spacing={1.5}>
        {filtered.map((item) => (
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
                <StatusChip value={item.status} />
              </Stack>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {item.location}
              </Typography>

              <Divider />

              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                结束时间：{item.finishedAt}
              </Typography>
            </Stack>
          </Paper>
        ))}

        {filtered.length === 0 && (
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              暂无记录
            </Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
