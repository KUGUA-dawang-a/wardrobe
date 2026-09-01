/**
 * 数据存储路径工具
 *
 * 本地开发：数据存 server/src/data + server/uploads
 * 部署平台（如 Railway）：通过 DATA_DIR 环境变量指向持久化磁盘（<DATA_DIR>/data + <DATA_DIR>/uploads）
 */

import path from 'path';
import fs from 'fs';
import { config } from '../config';

/** data 目录下某文件的绝对路径 */
export function dataFilePath(filename: string): string {
  return path.join(config.dataDir, filename);
}

/** 上传图片目录 */
export function getUploadsDir(): string {
  return config.uploadDir;
}

/** 确保数据与上传目录存在 */
export function ensureDataDirs(): void {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

/** 首次启动时，从仓库内置种子复制缺失的文件（如 fashionKnowledge.json） */
export function ensureSeedFiles(): void {
  ensureDataDirs();
  for (const f of ['fashionKnowledge.json']) {
    const filePath = dataFilePath(f);
    if (fs.existsSync(filePath)) continue;
    const seed = path.join(config.seedDir, f);
    if (fs.existsSync(seed)) {
      fs.copyFileSync(seed, filePath);
    }
  }
}

/**
 * 读取 data 目录下的 JSON。
 * 文件不存在时，若 seedFromRepo 为 true 则尝试从仓库种子复制后读取。
 */
export function readDataJson<T>(filename: string, seedFromRepo = false): T {
  const filePath = dataFilePath(filename);
  if (!fs.existsSync(filePath) && seedFromRepo) {
    ensureSeedFiles();
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/** 写入 data 目录下的 JSON（自动创建目录） */
export function writeDataJson(filename: string, data: unknown): void {
  ensureDataDirs();
  fs.writeFileSync(dataFilePath(filename), JSON.stringify(data, null, 2));
}
