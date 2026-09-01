/**
 * 配置文件
 * 所有可调参数集中在这里，方便修改
 */

import path from 'path';

/** 运行时根目录（开发用 ts-node: server/src；生产编译后: server/dist） */
const runtimeRoot = path.resolve(__dirname);

/** 部署平台（如 Railway）通过 DATA_DIR 环境变量指向持久化磁盘；本地留空保持原路径 */
const deployData = process.env.DATA_DIR || '';

export const config = {
  // 部署平台（如 Railway）会注入 PORT 环境变量
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'wardrobe-jwt-secret-key-2026', // JWT 签名密钥（生产环境请通过环境变量覆盖）
  jwtExpiresIn: '7d',                        // Token 有效期 7 天

  // 数据 JSON 目录：部署时 <DATA_DIR>/data，本地开发保持 server/src/data
  dataDir: deployData ? path.join(deployData, 'data') : path.join(runtimeRoot, 'data'),
  // 上传图片目录：部署时 <DATA_DIR>/uploads，本地开发保持 server/uploads
  uploadDir: deployData ? path.join(deployData, 'uploads') : path.join(runtimeRoot, '../../uploads'),
  // 仓库内置的种子数据目录（开发/生产都指向 server/src/data）
  seedDir: path.resolve(runtimeRoot, '../src/data'),

  webpQuality: 80,                            // WebP 压缩质量（0-100）
  maxFileSize: 5 * 1024 * 1024,              // 最大上传 5MB

  // DeepSeek API 配置
  // API Key 通过前端设置页保存（aiConfig.json）或环境变量 DEEPSEEK_API_KEY 提供
  deepseek: {
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
};
