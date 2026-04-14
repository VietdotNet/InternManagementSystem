export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function getEmailError(email) {
  if (!email) return "Email không được để trống";
  if (!validateEmail(email)) return "Email không đúng định dạng";
  return null;
}

export function getPasswordError(password) {
  if (!password) return "Mật khẩu không được để trống";
  if (!validatePassword(password)) return "Mật khẩu phải có ít nhất 6 ký tự";
  return null;
}
