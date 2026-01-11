export const getRoleFromToken = () => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // 👉 Tùy vào backend bạn có thể đặt là "Role" hoặc "role"
    const role = decodedPayload["Role"] || decodedPayload["role"];

    return role;
  } catch (error) {
    console.error("❌ Token decode failed:", error);
    return null;
  }
};
