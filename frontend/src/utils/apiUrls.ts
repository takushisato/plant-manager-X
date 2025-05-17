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
    users: (id: number) => `/api/auth/users/${id}`,
    materialReceiveStock: (id: number) => `/api/materials/receive_stock/${id}`,
    materialUseStock: (id: number) => `/api/materials/use_stock/${id}`,
  },
  delete: {
    users: (id: number) => `/api/auth/users/${id}`,
  },
};
