import { Config } from '@/Config';

export const getFullImageUrl = (url: string) => {
  if (!url) {
    return null;
  }
  if (url.startsWith('http')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    // Extract base domain from API_URL (e.g., https://api.bellndesk.com/api/ -> https://api.bellndesk.com)
    const baseUrl = Config.API_URL.endsWith('/api/')
      ? Config.API_URL.slice(0, -5)
      : Config.API_URL.endsWith('/api')
      ? Config.API_URL.slice(0, -4)
      : Config.API_URL;

    return `${baseUrl}${url}`;
  }
  return url;
};
