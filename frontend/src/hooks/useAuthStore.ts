import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import Cookies from "js-cookie";
import { create } from "zustand";
import { User, AuthStore, AllUsers } from "@/types/user";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  allUsers: [] as AllUsers[],

  /**
   * ログイン状態を更新。
   * トークンが存在する場合はユーザー情報を取得してログイン状態にする。
   * トークンが存在しない場合はログアウト状態にしてログイン画面にリダイレクト。
   * @returns
   */
  restoreSession: async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const data = await apiClient<User>({
          url: endpoints.get.users,
          method: "GET",
        });
        set({ user: data });
      } catch (error) {
        console.error(error);
        Cookies.remove("token");
        set({ user: null });
      }
    } else {
      set({ user: null });
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  },

  /**
   * ログイン
   * @param email
   * @param password
   * @returns
   */
  login: async (email: string, password: string) => {
    const response = await apiClient<{ auth_token: string }>({
      url: endpoints.post.login,
      method: "POST",
      data: { email, password },
    });
    Cookies.set("token", response.auth_token, {
      expires: 1,
    });
    await useAuthStore.getState().restoreSession(); // ログインが成功したら状態を更新
    return response;
  },

  /**
   * ログアウト
   * @returns
   */
  logout: async () => {
    const response = await apiClient<void>({
      url: endpoints.post.logout,
      method: "POST",
    });
    Cookies.remove("token");
    return response;
  },

  /**
   * 全ユーザーの名前とIDを取得
   * @returns
   */
  getAllUsers: async () => {
    const response = await apiClient<AllUsers[]>({
      url: endpoints.get.allUsers,
      method: "GET",
    });
    set({ allUsers: response });
  },
}));
