import { apiBaseUrl } from "@/utils/api-base-url";

export const ENDPOINTS = {
  LOGIN: `${apiBaseUrl()}/api/auth/token/login`,
  LOGOUT: `${apiBaseUrl()}/api/auth/token/logout`,
  USERS: (id: string) => `${apiBaseUrl()}/api/auth/users/${id}`,
};
