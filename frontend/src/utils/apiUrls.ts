export const endpoints = {
  post: {
    login: "/api/auth/token/login",
    logout: "/api/auth/token/logout",
  },
  get: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
  put: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
  delete: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
};
