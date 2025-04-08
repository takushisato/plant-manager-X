import axios from "axios";
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { apiBaseUrl } from "@/utils/api-base-url";
import type { ErrorResponse } from "@/domain/api/error-response";
import { processErrorResponse } from "@/domain/api/process-error-response";

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

    const response: AxiosResponse<T> = await axios({
      baseURL: apiBaseUrl(),
      ...config,
      headers,
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
