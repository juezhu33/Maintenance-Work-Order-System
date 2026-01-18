import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import supabase from "../../utils/supabase";
import apiLogin from "../../services/apiLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
    }
    if (role === "admin") {
      navigate("/admin");
    }
    if (role === "mechanic") {
      navigate("/mechanic");
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
                  登录
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  进入工单系统
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
              />

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
