import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import Cookies from "js-cookie";
import { create } from "zustand";
import { User, AuthStore } from "@/domain/auth/user";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  authToken: null,

  /**
   * ログイン状態を更新。
   * トークンが存在しない場合はログアウト状態にする。
   * トークンが存在する場合はユーザー情報を取得してログイン状態にする。
   * @returns
   */
  restoreSession: async () => {
    const token = Cookies.get("token");
    if (token == undefined) {
      await useAuthStore.getState().logout();
      return;
    } else {
      const data = await apiClient<User>({ url: endpoints.get.users });
      set({ user: data });
      set({ authToken: token });
    }
  },

  /**
   * ユーザー情報を削除
   * @returns
   */
  removeUser: () => set({ user: null }),

  /**
   * ユーザー情報を設定
   * @param user
   */
  setUser: (user) => set({ user }),

  /**
   * ログイン
   * @param email
   * @param password
   * @returns
   */
  login: async (email: string, password: string) => {
    const response = await apiClient<{ auth_token: string }>({
      url: endpoints.post.login,
      data: { email, password },
    });
    Cookies.set("token", response.auth_token, {
      expires: 1,
    });
    set({ authToken: response.auth_token });
    return response;
  },

  /**
   * ログアウト
   * @returns
   */
  logout: async () => {
    const response = await apiClient<void>({ url: endpoints.post.logout });
    Cookies.remove("token");
    set({ authToken: null });
    return response;
  },
}));
