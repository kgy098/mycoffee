import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { useUserStore } from '@/stores/user-store';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    let token = useUserStore.getState().user.data.token;
    
    // If token is not in store, try to get it from cookies
    if (!token && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1]?.trim();
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/me')
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const refreshResponse = await apiClient.post('/auth/refresh', {}, {
          withCredentials: true,
        });

        // If refresh successful (200), update token and retry original request
        if (refreshResponse.status === 200 && refreshResponse.data?.data?.token) {
          const newToken = refreshResponse.data.data.token;
          const currentUser = useUserStore.getState().user;

          // Convert expAt to number if it's a string
          let expiresIn = refreshResponse.data.data.expires_in;
          if (!expiresIn && refreshResponse.data.data.expAt) {
            expiresIn = typeof refreshResponse.data.data.expAt === 'string' 
              ? new Date(refreshResponse.data.data.expAt).getTime() / 1000 
              : refreshResponse.data.data.expAt;
          }

          // Update user store with new token
          useUserStore.getState().setUser({
            ...currentUser,
            data: {
              ...currentUser.data,
              user_id: refreshResponse.data.data.userId || currentUser.data.user_id,
              session_id: refreshResponse.data.data.session_id || currentUser.data.session_id,
              token: newToken,
              token_type: refreshResponse.data.data.token_type || currentUser.data.token_type,
              expires_in: expiresIn || currentUser.data.expires_in,
              result_code: String(refreshResponse.data.data.result_code || currentUser.data.result_code),
              result_message: refreshResponse.data.data.result_message || currentUser.data.result_message
            },
            meta: refreshResponse.data.meta || currentUser.meta
          });

          // Update cookie with new token
          if (typeof document !== 'undefined') {
            const { setAccessTokenCookie } = require('@/utils/cookies');
            setAccessTokenCookie(newToken);
          }

          // Retry the original request with new token
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry original request - user won't notice this
          return apiClient(originalRequest);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (refreshError) {
        // Refresh failed, clear user state
        originalRequest._retry = false; // Reset retry flag
        useUserStore.getState().resetUser();
        if (typeof document !== 'undefined') {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        sessionStorage.setItem('auth_redirect', 'true');
        // Reject with original error, not refresh error
        return Promise.reject(error);
      }
    }

    // If it's a 401 on the refresh endpoint itself, clear user
    if (
      error.response?.status === 401 && 
      originalRequest?.url?.includes('/auth/refresh')
    ) {
      useUserStore.getState().resetUser();
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      sessionStorage.setItem('auth_redirect', 'true');
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),
};

export default apiClient;