/**
 * 图片上传路由
 *
 * POST /api/upload — 上传图片，返回 WebP 文件路径
 */

import { Router, Response } from 'express';
import multer from 'multer';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { saveImage } from '../services/imageService';
import { config } from '../config';

const router = Router();

// multer 配置：内存存储（文件先进内存，再压缩处理）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  // 只允许图片格式
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG/PNG/GIF/WebP 格式图片'));
    }
  },
});

/**
 * POST /api/upload
 * 上传一张图片，返回 WebP 后的路径
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: '请选择要上传的图片' });
      }

      const imagePath = await saveImage(req.file.buffer, req.user!.userId);

      res.json({ imagePath });
    } catch (error: any) {
      // multer 文件大小超限错误
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: '图片大小不能超过 5MB' });
      }
      res.status(500).json({ error: error.message || '上传失败' });
    }
  },
);

export default router;
