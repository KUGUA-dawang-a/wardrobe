/**
 * Cloudflare Pages Functions 代理：/api/*
 *
 * 将前端对 /api/* 的请求转发到独立部署的后端服务（环境变量 BACKEND_ORIGIN 指定）。
 * 这样前端代码无需改动即可在 Pages 上工作，且请求由 Cloudflare 服务端转发，
 * 浏览器不受跨域限制，后端也无需开放 CORS。
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
