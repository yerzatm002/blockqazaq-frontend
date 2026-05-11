import api from "./api";

export async function getQuizByModuleId(moduleId) {
  const response = await api.get(`/api/quizzes/${moduleId}`);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function submitQuiz(moduleId, answers) {
  const response = await api.post(`/api/quizzes/${moduleId}/submit`, {
    answers,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}