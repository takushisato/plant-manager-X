export const endpoints = {
  post: {
    login: "/api/auth/token/login",
    logout: "/api/auth/token/logout",
    attendanceRecords: "/api/attendance/records/",
  },
  get: {
    users: "/api/auth/custom/users/me/",
    materialList: "/api/materials/",
    attendanceMyList: (month: string) => `/api/attendance/records/my_list/?month=${month}`,
    attendanceAllList: (month: string) => `/api/attendance/records/all_list/?month=${month}`,
    orderList: "/api/trade/orders/",
    orderDetail: (id: number) => `/api/trade/orders/${id}/`,
  },
  put: {
    users: (id: number) => `/api/auth/users/${id}/`,
    materialReceiveStock: (id: number) => `/api/materials/receive_stock/${id}/`,
    materialUseStock: (id: number) => `/api/materials/use_stock/${id}/`,
    attendanceRecords: (id: number) => `/api/attendance/records/${id}/`,
  },
  delete: {
    users: (id: number) => `/api/auth/users/${id}/`,
  },
};
