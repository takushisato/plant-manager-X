import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";

export const useAuth = () => {
  /**
   * ログイン
   * @param username
   * @param password
   * @returns
   */
  const login = async (username: string, password: string) => {
    const response = await apiClient({
      url: endpoints.post.login,
      data: { username, password },
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
    return response;
  };

  return { login, logout };
};
