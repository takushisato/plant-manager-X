export const endpoints = {
  post: {
    login: "/api/auth/token/login",
    logout: "/api/auth/token/logout",
  },
  get: {
    users: "/api/auth/custom/users/me",
    materialList: "/api/materials",
  },
  put: {
    users: (id: string) => `/api/auth/users/${id}`,
    materialReceiveStock: (id: string) => `/api/materials/receive_stock/${id}`,
    materialUseStock: (id: string) => `/api/materials/use_stock/${id}`,
  },
  delete: {
    users: (id: string) => `/api/auth/users/${id}`,
  },
};
