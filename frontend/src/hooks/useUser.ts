import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";
import { User } from "@/domain/auth/user";


export const useUser = () => {
  const getUser = async () => {
    const response = await apiClient<User>({
      url: endpoints.get.users,
    });
    return response;
  };

  return { getUser };
};
