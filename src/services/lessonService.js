import api from "./api";

export async function getLessonByModuleId(moduleId) {
  const response = await api.get(`/api/lessons/${moduleId}`);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}