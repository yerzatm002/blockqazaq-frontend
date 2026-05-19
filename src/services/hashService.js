import api from "./api";

export async function generateHash(text) {
  const response = await api.post("/api/hash/generate", {
    text,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}