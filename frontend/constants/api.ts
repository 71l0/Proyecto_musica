const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';
  }
  return process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.47:4000';
};

export const API_URL = getApiUrl();
