import { apiClient } from "@/domain/api/apiClient";
import { endpoints } from "@/utils/apiUrls";

type User = {
  id: number;
  name: string;
  email: string;
};

export const useUser = () => {
  const getUser = async () => {
    const response = await apiClient<User>({
      url: endpoints.get.users,
    });
    return response;
  };

  return { getUser };
};
