export const endpoints = {
  post: {
    login: "/api/auth/token/login",
    logout: "/api/auth/token/logout",
  },
  get: {
    users: "/api/auth/custom/users/me",
  },
  put: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
  delete: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
};
