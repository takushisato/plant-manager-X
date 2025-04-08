import axios from "axios";
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import type { ErrorResponse } from "@/domain/api/error-response";
import { processErrorResponse } from "@/domain/api/process-error-response";
import { endpoints } from "@/utils/apiUrls";

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

/**
 * Axiosラッパー関数
 *
 * @param config
 */
export const apiClient = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const token = localStorage.getItem("token"); // TODO: cookieから取得に変更する
    const headers = {
      ...config.headers,
      ...(token && { Authorization: `Token ${token}` }), // トークンが存在する場合のみ Authorization を追加
    };

    const method = config.method || detectMethod(config.url || "");
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const response: AxiosResponse<T> = await axios({
      baseURL: baseUrl,
      ...config,
      headers,
      method,
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
