/**
 * 认证路由 — 注册 / 登录
 *
 * POST /api/auth/register  — 注册新用户
 * POST /api/auth/login     — 登录，返回 JWT token
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { config } from '../config';
import { dataFilePath, writeDataJson } from '../services/dataService';
import { User } from '../types';

const router = Router();

/** 用户数据文件路径 */
const usersPath = dataFilePath('users.json');

/** 读取所有用户 */
function getUsers(): User[] {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}

/** 保存用户列表 */
function saveUsers(users: User[]): void {
  writeDataJson('users.json', users);
}

/**
 * 注册
 * 接收 username + password，密码加密存储
 */
router.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // 校验参数
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  if (username.length < 2) {
    return res.status(400).json({ error: '用户名至少2个字符' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: '密码至少4个字符' });
  }

  const users = getUsers();

  // 检查重名
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已被注册' });
  }

  // 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser: User = {
    id: uuid(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // 创建该用户的空衣橱文件
  writeDataJson(`wardrobe-${newUser.id}.json`, []);

  // 签发 token
  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any },
  );

  res.json({ token, username: newUser.username });
});

/**
 * 登录
 * 验证用户名密码，返回 JWT token
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any },
  );

  res.json({ token, username: user.username });
});

export default router;
