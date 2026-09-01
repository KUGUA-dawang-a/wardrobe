/**
 * AI 配置存储服务
 *
 * 前端提交的 DeepSeek API Key 保存在 server/src/data/aiConfig.json
 * （被 .gitignore 排除）。优先级：aiConfig.json > 环境变量 DEEPSEEK_API_KEY。
 */

import fs from 'fs';
import { dataFilePath, writeDataJson } from './dataService';

const CONFIG_PATH = dataFilePath('aiConfig.json');

interface AIConfig {
  apiKey?: string;
}

/** 读取当前 API Key（前端配置优先，其次 .env） */
export function getApiKey(): string {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as AIConfig;
      if (cfg.apiKey) return cfg.apiKey;
    }
  } catch (error: any) {
    console.warn('[AI Config] 读取失败:', error.message);
  }
  return process.env.DEEPSEEK_API_KEY || '';
}

/** 保存 API Key 到 aiConfig.json */
export function saveApiKey(apiKey: string): void {
  writeDataJson('aiConfig.json', { apiKey } satisfies AIConfig);
}
