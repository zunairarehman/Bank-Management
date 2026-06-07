import { api } from "./api";

export const creditApi = {
  get: (userId: string) => api(`/credit/${userId}`),

  generate: (data: any) =>
    api("/credit/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};