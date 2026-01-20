import { Link as RouterLink, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

export default function AdminWorkOrderDetail() {
  const { id } = useParams();

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Button component={RouterLink} to="/admin/workorders" sx={{ mb: 1 }}>
            返回列表
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            工单详情 #{id}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            查看工单信息与处理情况
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => {}}>
            派单
          </Button>
          <Button variant="contained" onClick={() => {}}>
            标记完成
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
          <Typography sx={{ fontWeight: 800, mb: 1 }}>问题描述</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            工单详情
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 800, mb: 1 }}>图片</Typography>
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

        <Paper
          variant="outlined"
          sx={{ borderRadius: 3, p: 2.5, height: "fit-content" }}
        >
          <Typography sx={{ fontWeight: 800, mb: 1 }}>状态</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip size="small" label="处理中" color="warning" />
            <Chip size="small" label="高优先级" />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 800, mb: 1 }}>信息</Typography>
          <Stack spacing={1}>
            <Row label="报修人" value="张三" />
            <Row label="位置" value="1号楼 402" />
            <Row label="提交时间" value="2026-01-20 09:12" />
            <Row label="更新时间" value="2026-01-20 10:21" />
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}
