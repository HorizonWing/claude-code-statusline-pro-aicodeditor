/**
 * Claude settings.json 加载器
 * 从 ~/.claude/settings.json 读取环境变量配置
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export interface ClaudeSettings {
  env?: Record<string, string>;
  permissions?: {
    defaultMode?: string;
  };
  statusLine?: {
    type?: string;
    command?: string;
  };
  alwaysThinkingEnabled?: boolean;
  model?: string;
}

/**
 * 获取 settings.json 文件路径
 */
function getSettingsPath(): string {
  return join(homedir(), '.claude', 'settings.json');
}

/**
 * 从 ~/.claude/settings.json 加载环境变量
 * Load environment variables from ~/.claude/settings.json
 */
export async function loadClaudeEnvVars(): Promise<void> {
  try {
    const settingsPath = getSettingsPath();

    // 检查文件是否存在
    try {
      await fs.access(settingsPath);
    } catch {
      // 文件不存在，静默返回
      return;
    }

    // 读取并解析 settings.json
    const content = await fs.readFile(settingsPath, 'utf-8');
    const settings: ClaudeSettings = JSON.parse(content);

    // 如果有环境变量配置，应用到 process.env
    if (settings.env) {
      for (const [key, value] of Object.entries(settings.env)) {
        // 只设置尚未设置的环境变量（环境变量优先级高于配置文件）
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // 静默处理错误，不影响主程序运行
    // 可以在调试模式下输出错误
    if (process.env.DEBUG) {
      console.error('[Settings Loader] Error loading settings.json:', error);
    }
  }
}

/**
 * 同步加载环境变量（用于需要同步加载的场景）
 * Synchronously load environment variables
 */
export function loadClaudeEnvVarsSync(): void {
  try {
    const settingsPath = getSettingsPath();

    // 检查文件是否存在
    const fs = require('fs');
    if (!fs.existsSync(settingsPath)) {
      return;
    }

    // 读取并解析 settings.json
    const content = fs.readFileSync(settingsPath, 'utf-8');
    const settings: ClaudeSettings = JSON.parse(content);

    // 如果有环境变量配置，应用到 process.env
    if (settings.env) {
      for (const [key, value] of Object.entries(settings.env)) {
        // 只设置尚未设置的环境变量
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // 静默处理错误
    if (process.env.DEBUG) {
      console.error('[Settings Loader] Error loading settings.json:', error);
    }
  }
}

/**
 * 获取 Claude 设置（不修改 process.env）
 * Get Claude settings without modifying process.env
 */
export async function getClaudeSettings(): Promise<ClaudeSettings | null> {
  try {
    const settingsPath = getSettingsPath();
    const content = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}