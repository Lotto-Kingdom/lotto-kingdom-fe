import { getCookie } from './cookieUtils';

/**
 * CSRF Fix (#3): 
 * SPA에서 모든 POST/PATCH/DELETE 요청 시 XSRF-TOKEN 쿠키를 읽어 
 * X-XSRF-TOKEN 헤더로 전송해야 함.
 */
export async function apiClient(url: string, options: RequestInit = {}) {
  const method = options.method?.toUpperCase() || 'GET';
  const headers = { ...(options.headers as Record<string, string>) };

  if (['POST', 'PATCH', 'DELETE'].includes(method)) {
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      headers['X-XSRF-TOKEN'] = xsrfToken;
    }
  }

  // 기본적으로 credentials: 'include'를 사용하여 세션 쿠키를 포함
  return fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  });
}
