import api from "./api";

export async function registerUser(formData) {
  const response = await api.post("/api/auth/register", formData);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  localStorage.setItem("token", data.data.token);
  localStorage.setItem("user", JSON.stringify(data.data.user));

  return data.data;
}

export async function loginUser(formData) {
  const response = await api.post("/api/auth/login", formData);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  localStorage.setItem("token", data.data.token);
  localStorage.setItem("user", JSON.stringify(data.data.user));

  return data.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/me");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  localStorage.setItem("user", JSON.stringify(data.data.user));

  return data.data.user;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}