/**
 * Cloudflare Workers 入口
 *
 * 1. /api/* 与 /uploads/* 请求代理到独立部署的后端（环境变量 BACKEND_ORIGIN 指定）
 * 2. 其余请求返回前端静态资源（含 SPA 回退，前端路由直接访问可用）
 */

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  BACKEND_ORIGIN?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API 与图片：代理到后端
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
      const backendOrigin = env.BACKEND_ORIGIN || '';
      if (!backendOrigin) {
        return new Response('后端服务未配置（请设置 BACKEND_ORIGIN 环境变量）', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      const target = new URL(url.pathname + url.search, backendOrigin);
      return fetch(new Request(target, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      }));
    }

    // 前端路由：返回静态资源（含 SPA 回退）
    return env.ASSETS.fetch(request);
  },
};
