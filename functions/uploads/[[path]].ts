/**
 * Cloudflare Pages Functions 代理：/uploads/*
 *
 * 将衣橱图片的访问请求转发到后端，由后端从存储目录返回图片文件。
 */

interface PagesContext {
  request: Request;
  env: Record<string, string | undefined>;
}

export async function onRequest(context: PagesContext) {
  const { request, env } = context;
  const backendOrigin = env.BACKEND_ORIGIN || '';
  if (!backendOrigin) {
    return new Response('后端服务未配置（请在 Pages 项目设置中填写 BACKEND_ORIGIN）', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, backendOrigin);

  return fetch(new Request(target, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  }));
}
