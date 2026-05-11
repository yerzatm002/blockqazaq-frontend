import api from "./api";

export async function generateCertificate() {
  const response = await api.post("/api/certificates/generate");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}

export async function getMyCertificate() {
  const response = await api.get("/api/certificates/my");
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data.certificate;
}

export async function verifyCertificate(certificateId) {
  const response = await api.get(`/api/certificates/verify/${certificateId}`);
  const data = response.data;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
}