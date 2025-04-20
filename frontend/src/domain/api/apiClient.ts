import axios from "axios";
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import type { ErrorResponse } from "@/types/common/error-response";
import { processErrorResponse } from "@/domain/api/process-error-response";
import { endpoints } from "@/utils/apiUrls";
import Cookies from "js-cookie";

/**
 * URL に応じて HTTP メソッドを判定
 */
const detectMethod = (url: string): "GET" | "POST" | "PUT" | "DELETE" => {
  const methodMap = {
    get: endpoints.get,
    post: endpoints.post,
    put: endpoints.put,
    delete: endpoints.delete,
  };

  for (const method of Object.keys(methodMap) as (keyof typeof methodMap)[]) {
    const entries = Object.values(methodMap[method]);
    if (entries.includes(url)) {
      return method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE";
    }
  }
  throw new Error("Invalid URL");
};

// TODO 環境変数にする
const API_BASE_URL = "http://localhost:8000";

/**
 * Axiosラッパー関数
 *
 * @param config
 */
export const apiClient = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const token = Cookies.get("token");
    const headers = {
      ...config.headers,
      ...(token && { Authorization: `Token ${token}` }), // トークンが存在する場合のみ Authorization を追加
    };

    const method = config.method || detectMethod(config.url || "");
    const baseUrl = API_BASE_URL;

    const response: AxiosResponse<T> = await axios({
      baseURL: baseUrl,
      ...config,
      headers,
      method,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      const errorDetail = axiosError.response.data.detail;
      processErrorResponse(axiosError.response.status, errorDetail[0]);
    }
    throw new Error("An error occurred during the API call.");
  }
};
