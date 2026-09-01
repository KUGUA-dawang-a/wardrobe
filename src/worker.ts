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
        return json({ error: '后端服务未配置（请设置 BACKEND_ORIGIN 环境变量）' }, 503);
      }

      const target = new URL(url.pathname + url.search, backendOrigin);

      // Host / Content-Length 由运行时管理，转发时清除避免冲突
      const headers = new Headers(request.headers);
      headers.delete('host');
      headers.delete('content-length');

      try {
        return await fetch(new Request(target, {
          method: request.method,
          headers,
          body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
        }));
      } catch (error: any) {
        // 转发失败时返回可读的 JSON，而不是抛异常（避免 Error 1101）
        return json({ error: `后端转发失败：${error?.message || '未知错误'}` }, 502);
      }
    }

    // 前端路由：返回静态资源（含 SPA 回退）
    return env.ASSETS.fetch(request);
  },
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
