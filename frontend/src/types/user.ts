export type User = {
  id: number;
  name: string;
  email: string;
  permission: Permission;
};

export type AuthStore = {
  user: User | null;
  allUsers: AllUsers[];
  getAllUsers: () => Promise<void>;
  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ auth_token: string }>;
  logout: () => Promise<void>;
};

export type Permission = {
  material_access: boolean;
  can_manage_own_attendance: boolean;
  can_manage_all_attendance: boolean;
  can_view_production_plan: boolean;
  can_edit_production_plan: boolean;
  can_view_order: boolean;
  can_edit_order: boolean;
  can_view_defect: boolean;
  can_edit_defect: boolean;
  mail_access: boolean;
};

export type AllUsers = {
  id: number;
  name: string;
};
