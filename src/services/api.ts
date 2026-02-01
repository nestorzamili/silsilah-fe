import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError } from '@/types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api/v1';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Data yang dikirim tidak valid. Silakan periksa kembali.',
  401: 'Email atau kata sandi salah.',
  403: 'Anda tidak memiliki izin untuk melakukan tindakan ini.',
  404: 'Data yang diminta tidak ditemukan.',
  409: 'Data sudah ada. Silakan gunakan data lain.',
  422: 'Data tidak dapat diproses. Silakan periksa kembali.',
  429: 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
  500: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  502: 'Server sedang tidak tersedia. Silakan coba lagi nanti.',
  503: 'Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti.',
};

const DEFAULT_ERROR_MESSAGE = 'Terjadi kesalahan. Silakan coba lagi.';
const NETWORK_ERROR_MESSAGE =
  'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onTokenRefresh:
  | ((tokens: { access_token: string; refresh_token: string }) => void)
  | null = null;
let onAuthError: (() => void) | null = null;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
  isRefreshing = false;
};

export const setTokens = (access: string | null, refresh: string | null) => {
  accessToken = access;
  refreshToken = refresh;
};

export const setAuthCallbacks = (
  onRefresh: (tokens: { access_token: string; refresh_token: string }) => void,
  onError: () => void,
) => {
  onTokenRefresh = onRefresh;
  onAuthError = onError;
};

export const getAccessToken = () => accessToken;

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        setTokens(access_token, newRefreshToken);

        if (onTokenRefresh) {
          onTokenRefresh({ access_token, refresh_token: newRefreshToken });
        }

        processQueue(null, access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        setTokens(null, null);
        if (onAuthError) {
          onAuthError();
        }
        return Promise.reject(refreshError);
      }
    }

    const statusCode = error.response?.status;
    const serverMessage = error.response?.data?.message;

    let userFriendlyMessage: string;

    if (!error.response) {
      userFriendlyMessage = NETWORK_ERROR_MESSAGE;
    } else if (serverMessage && typeof serverMessage === 'string') {
      userFriendlyMessage = translateServerMessage(serverMessage);
    } else if (statusCode && ERROR_MESSAGES[statusCode]) {
      userFriendlyMessage = ERROR_MESSAGES[statusCode];
    } else {
      userFriendlyMessage = DEFAULT_ERROR_MESSAGE;
    }

    const friendlyError = new Error(userFriendlyMessage);
    return Promise.reject(friendlyError);
  },
);

function translateServerMessage(message: string): string {
  const translations: Record<string, string> = {
    'invalid credentials': 'Email atau kata sandi salah.',
    'invalid email or password': 'Email atau kata sandi salah.',
    'user not found': 'Pengguna tidak ditemukan.',
    'email already exists':
      'Email sudah terdaftar. Silakan gunakan email lain.',
    'email already registered':
      'Email sudah terdaftar. Silakan gunakan email lain.',
    'email not verified': 'Email belum diverifikasi. Silakan periksa email Anda untuk verifikasi.',
    'email not verified. please verify your email first': 'Email belum diverifikasi. Silakan periksa email Anda untuk verifikasi.',
    'token expired': 'Sesi Anda telah berakhir. Silakan masuk kembali.',
    'token invalid': 'Sesi tidak valid. Silakan masuk kembali.',
    'invalid or expired token': 'Token tidak valid atau telah kedaluwarsa.',
    'invalid or expired verification token': 'Token verifikasi tidak valid atau telah kedaluwarsa.',
    'invalid or expired reset token': 'Token reset kata sandi tidak valid atau telah kedaluwarsa.',
    'invalid refresh token': 'Sesi tidak valid. Silakan masuk kembali.',
    'invalid verification token': 'Token verifikasi tidak valid.',
    'verification token expired': 'Token verifikasi telah kedaluwarsa. Silakan minta verifikasi ulang.',
    
    unauthorized: 'Anda perlu masuk untuk melanjutkan.',
    forbidden: 'Anda tidak memiliki izin untuk melakukan tindakan ini.',
    'insufficient permissions': 'Anda tidak memiliki izin yang cukup untuk melakukan tindakan ini.',
    'insufficient permissions to assign roles': 'Anda tidak memiliki izin untuk mengatur peran pengguna.',
    'insufficient permissions to delete user': 'Anda tidak memiliki izin untuk menghapus pengguna.',
    'cannot modify your own role': 'Anda tidak dapat mengubah peran Anda sendiri.',
    'cannot delete your own account': 'Anda tidak dapat menghapus akun Anda sendiri.',
    
    'person not found': 'Orang yang diminta tidak ditemukan.',
    'record not found': 'Data tidak ditemukan.',
    'relationship not found': 'Hubungan tidak ditemukan.',
    
    'internal server error':
      'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    'failed to process request': 'Gagal memproses permintaan. Silakan coba lagi nanti.',
    'failed to delete person': 'Gagal menghapus data. Silakan coba lagi nanti.',
    
    'bad request': 'Data yang dikirim tidak valid. Silakan periksa kembali.',
    'invalid request body':
      'Format data tidak valid. Silakan periksa kembali formulir.',
    'validation error': 'Data tidak valid. Silakan periksa kembali.',
    'invalid person id': 'ID orang tidak valid.',
    'invalid relationship id': 'ID hubungan tidak valid.',
    'invalid user id': 'ID pengguna tidak valid.',
    'invalid media id': 'ID media tidak valid.',
    
    'relationship already exists': 'Hubungan sudah ada antara kedua orang ini.',
    'relationship already exists between these two persons':
      'Hubungan sudah ada antara kedua orang ini.',
    'cannot create relationship with self':
      'Tidak dapat membuat hubungan dengan diri sendiri.',
    'one or both persons not found': 'Satu atau kedua orang tidak ditemukan.',
    'person already has a parent with this role (father/mother)':
      'Orang ini sudah memiliki ayah/ibu kandung. Setiap orang hanya boleh memiliki satu ayah kandung dan satu ibu kandung.',
    'person already has a father':
      'Orang ini sudah memiliki ayah kandung. Setiap orang hanya boleh memiliki satu ayah kandung.',
    'person already has a mother':
      'Orang ini sudah memiliki ibu kandung. Setiap orang hanya boleh memiliki satu ibu kandung.',
    'duplicate relationship': 'Hubungan sudah ada antara kedua orang ini.',
    'duplicate parent role': 'Orang ini sudah memiliki orang tua dengan peran ini.',
    
    'invalid request': 'Permintaan tidak valid.',
    'request failed': 'Permintaan gagal. Silakan coba lagi.',
    'something went wrong': 'Terjadi kesalahan. Silakan coba lagi.',
  };

  const lowerMessage = message.toLowerCase().trim();

  if (translations[lowerMessage]) {
    return translations[lowerMessage];
  }

  for (const [key, value] of Object.entries(translations)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  if (
    message.includes('error') ||
    message.includes('exception') ||
    message.includes('_')
  ) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return message;
}

export default apiClient;
