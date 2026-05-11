import api from "./api";

export async function askChatbot(question) {
  const response = await api.post("/api/chat", {
    question,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}