export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthStore = {
  user: User | null;
  authToken: string | null;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
  removeUser: () => void;
  login: (email: string, password: string) => Promise<{ auth_token: string }>;
  logout: () => Promise<void>;
};
