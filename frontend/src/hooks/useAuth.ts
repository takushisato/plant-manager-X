import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";

export const useAuth = () => {
  /**
   * ログイン
   * @param email
   * @param password
   * @returns
   */
  const login = async (email: string, password: string) => {
    const response = await apiClient({
      url: endpoints.post.login,
      data: { email, password },
    });
    console.log(response);
    // TODO Cookieにトークンを保存する処理を追加する
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
    return response;
  };

  return { login, logout };
};
