/**
 * 图片处理服务
 *
 * - 接收上传的图片，压缩为 WebP 格式
 * - 删除图片文件
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { config } from '../config';

/** 上传目录的绝对路径 */
const uploadsBase = path.resolve(__dirname, '../../uploads');

/**
 * 压缩并保存图片为 WebP
 * @param fileBuffer 原始文件二进制
 * @param userId 用户 ID（用于隔离目录）
 * @returns 相对路径，如 /uploads/xxx/abc.webp
 */
export async function saveImage(fileBuffer: Buffer, userId: string): Promise<string> {
  // 创建用户目录 uploads/{userId}/
  const userDir = path.join(uploadsBase, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  // 生成唯一文件名
  const fileName = uuid() + '.webp';
  const outputPath = path.join(userDir, fileName);

  // 用 sharp 压缩为 WebP
  await sharp(fileBuffer)
    .webp({ quality: config.webpQuality })
    .toFile(outputPath);

  // 返回相对路径（前端用）
  return `/uploads/${userId}/${fileName}`;
}

/**
 * 根据相对路径删除图片
 * @param imagePath 相对路径，如 /uploads/xxx/abc.webp
 */
export function deleteImage(imagePath: string): void {
  if (!imagePath) return;
  const fullPath = path.join(uploadsBase, imagePath.replace('/uploads/', ''));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
