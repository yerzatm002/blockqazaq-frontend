import api from "./api";

export async function getModules() {
  const response = await api.get("/api/modules");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.modules;
}

export async function getModuleById(moduleId) {
  const response = await api.get(`/api/modules/${moduleId}`);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.module;
}