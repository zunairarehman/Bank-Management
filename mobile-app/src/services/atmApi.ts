import { api } from "./api";

export const atmApi = {
  generatePin: (data: any) =>
    api("/atm/generate-pin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePin: (data: any) =>
    api("/atm/change-pin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  withdraw: (data: any) =>
    api("/atm/withdraw", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deposit: (data: any) =>
    api("/atm/deposit", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  blockCard: (data: any) =>
    api("/atm/block", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};