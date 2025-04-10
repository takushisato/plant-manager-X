export type User = {
  id: number;
  name: string;
  email: string;
};

export type UserStore = {
  user: User | null;
  getUser: () => Promise<void>;
  setUser: (user: User) => void;
};
