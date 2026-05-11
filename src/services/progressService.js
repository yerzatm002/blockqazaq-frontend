import api from "./api";

export async function getUserProgress() {
  const response = await api.get("/api/progress");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function getProgressByModuleId(moduleId) {
  const response = await api.get(`/api/progress/${moduleId}`);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}