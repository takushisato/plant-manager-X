import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common/error-response";
import { processErrorResponse } from "@/domain/api/process-error-response";
import Cookies from "js-cookie";

// TODO 環境変数にする
const API_BASE_URL = "http://localhost:8000";

type ApiClientConfig = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
};

/**
 * Axiosラッパー関数
 *
 * @param config
 */
export const apiClient = async <T>(config: ApiClientConfig): Promise<T> => {
  try {
    const token = Cookies.get("token");
    const headers = {
      ...config.headers,
      ...(token && { Authorization: `Token ${token}` }), // トークンが存在する場合のみ Authorization を追加
    };

    const baseUrl = API_BASE_URL;

    const response: AxiosResponse<T> = await axios({
      baseURL: baseUrl,
      ...config,
      headers,
      method: config.method,
      data: config.data,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      processErrorResponse(axiosError.response.status, axiosError.message);
    }
    console.error("APIエラー詳細:", error);
    throw new Error("An error occurred during the API call.");
  }
};
