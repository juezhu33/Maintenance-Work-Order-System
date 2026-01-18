import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function WorkOrderDetail() {
  return (
    <>
      {" "}
      <Box sx={{ minHeight: "100dvh", bgcolor: "background.default", py: 3 }}>
        <Container maxWidth="sm">
          <Card variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                工单详情
              </Typography>

              <Stack spacing={2.25}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    问题标题
                  </Typography>
                  <TextField fullWidth placeholder="例如：宿舍灯坏了" />
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    详细描述
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="尽量写清楚：地点/现象/是否有异味/是否漏水等"
                    multiline
                    minRows={4}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    图片
                  </Typography>
                </Box>

                {/* {images.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  图片预览（{count}）
                </Typography>

                <ImageList cols={3} gap={12} sx={{ m: 0 }}>
                  {images.map((img, idx) => (
                    <ImageListItem
                      key={img.id}
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        component="img"
                        src={img.url}
                        alt={`upload-${idx}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      <IconButton
                        size="small"
                        onClick={() => removeImage(idx)}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "white",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        }}
                        aria-label="remove"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )} */}
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

export default WorkOrderDetail;
