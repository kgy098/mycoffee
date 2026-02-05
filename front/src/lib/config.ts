

// Get API base URL from environment or use default
const getBaseUrl = (): string => {
  // Client-side: use NEXT_PUBLIC_ variables
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Server-side or fallback to localhost for development
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    RECOMMENDATION: '/recommendation',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Specific endpoint helpers
export const API_URLS = {
  RECOMMENDATION: getApiUrl(API_CONFIG.ENDPOINTS.RECOMMENDATION),
} as const;
