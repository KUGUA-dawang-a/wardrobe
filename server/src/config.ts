/**
 * 配置文件
 * 所有可调参数集中在这里，方便修改
 */

export const config = {
  // 部署平台（如 Railway/Render）会注入 PORT 环境变量
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'wardrobe-jwt-secret-key-2026', // JWT 签名密钥（生产环境请通过环境变量覆盖）
  jwtExpiresIn: '7d',                        // Token 有效期 7 天
  uploadDir: 'uploads',                       // 图片存储目录
  webpQuality: 80,                            // WebP 压缩质量（0-100）
  maxFileSize: 5 * 1024 * 1024,              // 最大上传 5MB

  // DeepSeek API 配置
  // API Key 通过前端设置页保存（aiConfig.json）或环境变量 DEEPSEEK_API_KEY 提供
  deepseek: {
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
};
