/**
 * API 请求封装
 *
 * 自动在请求头中添加 JWT token，
 * 统一处理错误响应。
 */

const BASE_URL = '/api';

/** 从 localStorage 获取 token */
function getToken(): string | null {
  return localStorage.getItem('token');
}

/** 通用请求封装 */
async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // 如果有 token 就带上
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // 处理 401（token 过期或无效）
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('登录已过期，请重新登录');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `请求失败 (${res.status})`);
  }
  return data;
}

/** GET 请求 */
export function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

/** POST 请求 */
export function post<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** PUT 请求 */
export function put<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** DELETE 请求 */
export function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' });
}

/** 上传图片（multipart/form-data） */
export async function uploadImage(file: File): Promise<{ imagePath: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '上传失败');
  }
  return res.json();
}
