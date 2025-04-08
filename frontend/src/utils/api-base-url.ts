export function apiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return baseUrl;
}
