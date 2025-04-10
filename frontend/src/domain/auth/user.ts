export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthStore = {
  user: User | null;
  restoreSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ auth_token: string }>;
  logout: () => Promise<void>;
};
