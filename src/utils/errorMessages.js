// Supabase 错误消息中文映射
const errorMap = {
  // 登录相关
  "Invalid login credentials": "账号或密码错误",
  "Email not confirmed": "邮箱未验证，请先验证邮箱",
  "Invalid email or password": "账号或密码错误",
  "User not found": "用户不存在",

  // 注册相关
  "User already registered": "该账号已被注册",
  "Password should be at least 6 characters": "密码至少需要6位",
  "Unable to validate email address: invalid format": "邮箱格式不正确",
  "Signup requires a valid password": "请输入有效密码",

  // 通用
  "Network request failed": "网络连接失败，请检查网络",
  "Request timeout": "请求超时，请重试",
  "Too many requests": "操作过于频繁，请稍后再试",
  "Invalid API key": "系统配置错误",
};

/**
 * 转换 Supabase 错误消息为中文
 * @param {string} message - 原始错误消息
 * @returns {string} 中文错误消息
 */
export function translateError(message) {
  if (!message) return "操作失败";

  // 精确匹配
  if (errorMap[message]) {
    return errorMap[message];
  }

  // 模糊匹配
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 无法匹配时返回原始消息
  return message;
}
