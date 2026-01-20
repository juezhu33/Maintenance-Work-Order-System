import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import apiLogin from "../../services/apiLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { data, error, role } = await apiLogin(account, password);

    if (error) {
      console.error("登录失败：", error.message);
      return;
    }
    console.log("登录成功，用户角色：", role);
    if (role === "user") {
      navigate("/user");
      return;
    }
    if (role === "admin") {
      navigate("/admin");
      return;
    }
    if (role === "mechanic") {
      navigate("/mechanic");
      return;
    }
  }

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          height: "100dvh",
          overflow: "hidden",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            transform: "translateY(-55px)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "action.hover",
                  flex: "0 0 auto",
                }}
              >
                <LockOutlinedIcon />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, lineHeight: 1.1 }}
                >
                  维修工单系统
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  登录
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              <TextField
                label="账号"
                placeholder="学号 / 工号 / 邮箱"
                autoComplete="username"
                fullWidth
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />

              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="密码"
                placeholder="请输入密码"
                type="password"
                autoComplete="current-password"
                fullWidth
              />

              {/* 记住我和忘记密码 */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label={<Typography variant="body2">记住我</Typography>}
                />

                <Button
                  size="small"
                  variant="text"
                  sx={{ textTransform: "none" }}
                >
                  ?忘记密码
                </Button>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  handleLogin();
                }}
              >
                登录
              </Button>

              {/* 注册 */}
              <Typography
                variant="body2"
                sx={{ textAlign: "center", opacity: 0.75 }}
              >
                还没有账号？
                <Button
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  去注册
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
