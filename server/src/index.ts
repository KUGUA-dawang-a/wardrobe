/**
 * 服务器入口
 *
 * 启动 Express 服务，注册所有路由，
 * 静态文件服务用于提供上传的图片。
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';

// 路由
import authRouter from './routes/auth';
import itemsRouter from './routes/items';
import uploadRouter from './routes/upload';
import outfitsRouter from './routes/outfits';
import knowledgeRouter from './routes/knowledge';
import trendsRouter from './routes/trends';

const app = express();

// ---------- 中间件 ----------
app.use(cors());
app.use(express.json());

// 静态文件：让前端能访问上传的图片
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// ---------- 路由 ----------
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/outfits', outfitsRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/trends', trendsRouter);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 生产环境：托管前端打包后的静态文件
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));
// 所有非 API 请求返回前端页面（支持前端路由）
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ---------- 启动 ----------
app.listen(config.port, () => {
  console.log(`🧥 衣帽间服务器已启动：http://localhost:${config.port}`);
  console.log(`📡 注册：POST http://localhost:${config.port}/api/auth/register`);
  console.log(`📡 登录：POST http://localhost:${config.port}/api/auth/login`);
  console.log(`📡 衣橱：GET  http://localhost:${config.port}/api/items`);
});
