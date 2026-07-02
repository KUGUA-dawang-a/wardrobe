/**
 * JWT 鉴权中间件
 *
 * 验证请求头中的 Authorization: Bearer <token>
 * 验证通过后把用户信息挂在 req.user 上
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// 扩展 Express 的 Request 类型，加上 user 字段
export interface AuthRequest extends Request {
  user?: { userId: string; username: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // 从请求头获取 token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 验证 token
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string; username: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}
