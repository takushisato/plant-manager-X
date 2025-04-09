import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import Cookies from "js-cookie";

export const useAuth = () => {
  /**
   * ログイン
   * @param email
   * @param password
   * @returns
   */
  const login = async (email: string, password: string) => {
    const response = await apiClient<{ auth_token: string }>({
      url: endpoints.post.login,
      data: { email, password },
    });
    // トークンをCookieに保存
    Cookies.set("token", response.auth_token, {
      expires: 1,
    });
    return response;
  };

  /**
   * ログアウト
   * @returns
   */
  const logout = async () => {
    const response = await apiClient({
      url: endpoints.post.logout,
    });
    // Cookieを削除
    Cookies.remove("token");
    return response;
  };

  return { login, logout };
};
