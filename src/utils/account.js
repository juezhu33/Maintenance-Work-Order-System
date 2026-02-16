// 判断是否为纯数字（学号）
export function isStudentNo(str) {
  return /^\d+$/.test(str);
}

// 将学号转换为虚拟邮箱格式
export function toEmail(account) {
  if (isStudentNo(account)) {
    return `${account}@qq.com`;
  }
  return account;
}
