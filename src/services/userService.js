import api from "./api";

export async function getUserProfile() {
  const response = await api.get("/api/users/profile");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.user;
}

export async function getDashboard() {
  const response = await api.get("/api/users/dashboard");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}