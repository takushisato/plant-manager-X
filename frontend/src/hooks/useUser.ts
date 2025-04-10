import { create } from "zustand";
import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import { User, UserStore } from "@/domain/auth/user";
import Cookies from "js-cookie";

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  /**
   * ユーザー情報を取得
   */
  getUser: async () => {
    const token = Cookies.get("token");
    if (!token) {
      return;
    }

    const data = await apiClient<User>({ url: endpoints.get.users });
    set({ user: data });
  },

  setUser: (user) => set({ user }),
}));
