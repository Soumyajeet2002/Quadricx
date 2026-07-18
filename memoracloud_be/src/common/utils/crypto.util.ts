export function generateNumericOTP(len = 6) {
  const max = 10 ** len;
  const num = Math.floor(Math.random() * (max - (max/10))) + (max/10);
  return String(num).slice(0, len);
}
