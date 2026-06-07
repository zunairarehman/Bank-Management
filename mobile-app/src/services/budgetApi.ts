import { api } from "./api";

export const budgetApi = {
  getSummary: (userId: string) =>
    api(`/budget/summary?userId=${userId}`),

  getHistory: (userId: string) =>
    api(`/budget/history?userId=${userId}`),

  addExpense: (data: any) =>
    api("/budget/add-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBudget: (data: any) =>
    api("/budget/update-budget", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};