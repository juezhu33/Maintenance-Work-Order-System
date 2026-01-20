import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, useParams } from "react-router-dom";

export default function WorkOrderDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const demo = {
    id,
    title: "宿舍灯坏了",
    status: "in_progress",
    location: "1号楼 402",
    createdAt: "2026-01-20 10:21",
    updatedAt: "2026-01-20 12:05",
    desc: "突然不亮，可能灯管坏了。",
  };

  const statusChip =
    demo.status === "open" ? (
      <Chip size="small" label="待处理" />
    ) : demo.status === "in_progress" ? (
      <Chip size="small" label="处理中" color="warning" />
    ) : (
      <Chip size="small" label="已完成" color="success" />
    );

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton onClick={() => nav(-1)} size="small" aria-label="back">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 900, fontSize: 18 }}>工单详情</Typography>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5 }}>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {demo.title}
            </Typography>
            {statusChip}
          </Stack>

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {demo.location}
          </Typography>

          <Divider />

          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {demo.desc}
          </Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, mt: 1.5 }}>
        <Typography sx={{ fontWeight: 900, mb: 1 }}>信息</Typography>
        <Stack spacing={1}>
          <Row label="工单编号" value={demo.id} />
          <Row label="提交时间" value={demo.createdAt} />
          <Row label="更新时间" value={demo.updatedAt} />
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={{ fontWeight: 900, mb: 1 }}>图片</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          <Box
            sx={{
              aspectRatio: "1/1",
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              aspectRatio: "1/1",
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              aspectRatio: "1/1",
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}
