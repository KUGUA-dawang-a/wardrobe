/**
 * 配置文件
 * 所有可调参数集中在这里，方便修改
 */

export const config = {
  port: 3001,
  jwtSecret: 'wardrobe-jwt-secret-key-2026', // JWT 签名密钥
  jwtExpiresIn: '7d',                        // Token 有效期 7 天
  uploadDir: 'uploads',                       // 图片存储目录
  webpQuality: 80,                            // WebP 压缩质量（0-100）
  maxFileSize: 5 * 1024 * 1024,              // 最大上传 5MB
  ollamaUrl: 'http://localhost:11434',        // Ollama 默认地址
};
