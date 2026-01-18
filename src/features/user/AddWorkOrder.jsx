import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { useNavigate } from "react-router-dom";

function pickFiles(fileList) {
  if (!fileList || fileList.length === 0) return [];
  return Array.from(fileList).filter((f) => f && f.type?.startsWith("image/"));
}

export default function TicketSubmitPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  // { file, url } 跟你现在的逻辑一样
  const [images, setImages] = useState([]);
  const imagesRef = useRef([]); // 用于统一清理 objectURL

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const count = useMemo(() => images.length, [images.length]);

  function openCameraPicker() {
    cameraInputRef.current?.click();
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function addFiles(fileList) {
    const files = pickFiles(fileList);
    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${
        crypto.randomUUID?.() ?? Math.random()
      }`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const next = [...prev, ...newItems];
      imagesRef.current = next;
      return next;
    });
  }

  function handleCameraChange(e) {
    addFiles(e.target.files);
    // 关键：清空 value，避免同一张图重复选择不触发 change
    e.target.value = "";
  }

  function handleFileChange(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function removeImage(idx) {
    setImages((prev) => {
      const target = prev[idx];
      if (target?.url) URL.revokeObjectURL(target.url);

      const next = prev.filter((_, i) => i !== idx);
      imagesRef.current = next;
      return next;
    });
  }

  // 卸载时统一清理
  useEffect(() => {
    return () => {
      for (const item of imagesRef.current) {
        if (item?.url) URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default", py: 3 }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ borderRadius: 4, overflow: "hidden" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              提交维修工单
            </Typography>

            <Stack spacing={2.25}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  问题标题
                </Typography>
                <TextField
                  fullWidth
                  placeholder="例如：宿舍灯坏了"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  详细描述
                </Typography>
                <TextField
                  fullWidth
                  placeholder="尽量写清楚：地点/现象/是否有异味/是否漏水等"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  multiline
                  minRows={4}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  图片
                </Typography>

                <Stack direction="row" spacing={1.25}>
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCameraOutlinedIcon />}
                    onClick={openCameraPicker}
                    sx={{ borderRadius: 2, px: 2 }}
                  >
                    拍照
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileOutlinedIcon />}
                    onClick={openFilePicker}
                    sx={{ borderRadius: 2, px: 2 }}
                  >
                    上传
                  </Button>
                </Stack>

                {/* 隐藏 input：拍照 */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleCameraChange}
                />

                {/* 隐藏 input：上传 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>

              {images.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
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
              )}
            </Stack>
          </CardContent>

          <Divider />

          <CardActions sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ borderRadius: 2 }}
                onClick={() => navigate("/user")}
              >
                提交
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{ borderRadius: 2 }}
                onClick={() => navigate("/user")}
              >
                返回
              </Button>
            </Stack>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
