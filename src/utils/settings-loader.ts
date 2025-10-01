/**
 * Claude settings.json 加载器
 * 从 ~/.claude/settings.json 读取环境变量配置
 * 支持 Windows、macOS 和 Linux 系统
 */

import { promises as fs } from 'node:fs';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, normalize } from 'node:path';
import { homedir, platform } from 'node:os';

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
 * 跨平台兼容：Windows、macOS、Linux
 */
function getSettingsPath(): string {
  const home = homedir();
  const currentPlatform = platform();

  // 处理不同操作系统的路径
  let settingsPath: string;

  if (currentPlatform === 'win32') {
    // Windows: 使用 %USERPROFILE%\.claude\settings.json
    // 或者 %APPDATA%\Claude\settings.json (如果存在)
    const appDataPath = process.env.APPDATA;
    const userProfilePath = process.env.USERPROFILE || home;

    // 优先检查 APPDATA 路径
    if (appDataPath) {
      const appDataSettingsPath = join(appDataPath, 'Claude', 'settings.json');
      if (existsSync(appDataSettingsPath)) {
        return normalize(appDataSettingsPath);
      }
    }

    // 回退到用户目录
    settingsPath = join(userProfilePath, '.claude', 'settings.json');
  } else {
    // macOS 和 Linux: 使用 ~/.claude/settings.json
    settingsPath = join(home, '.claude', 'settings.json');
  }

  // 确保路径规范化（处理多余的分隔符等）
  return normalize(resolve(settingsPath));
}

/**
 * 检查文件是否可读
 * 处理跨平台权限问题
 */
function isFileReadable(path: string): boolean {
  try {
    // 使用 fs.constants 检查权限
    const fs = require('fs');
    fs.accessSync(path, fs.constants.F_OK | fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从 ~/.claude/settings.json 加载环境变量
 * Load environment variables from ~/.claude/settings.json
 * 支持 Windows、macOS、Linux
 */
export async function loadClaudeEnvVars(): Promise<void> {
  try {
    const settingsPath = getSettingsPath();

    // 检查文件是否存在和可读
    if (!isFileReadable(settingsPath)) {
      // 文件不存在或不可读，静默返回
      if (process.env.DEBUG_SETTINGS) {
        console.log(`[Settings Loader] Settings file not found or not readable: ${settingsPath}`);
      }
      return;
    }

    // 读取并解析 settings.json
    // 使用 utf-8 编码确保跨平台兼容
    const content = await fs.readFile(settingsPath, { encoding: 'utf-8' });

    // 处理可能的 BOM (Byte Order Mark) 问题（Windows 可能会添加）
    const cleanContent = content.replace(/^\uFEFF/, '');

    let settings: ClaudeSettings;
    try {
      settings = JSON.parse(cleanContent);
    } catch (parseError) {
      if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
        console.error('[Settings Loader] Invalid JSON in settings.json:', parseError);
      }
      return;
    }

    // 如果有环境变量配置，应用到 process.env
    if (settings.env && typeof settings.env === 'object') {
      for (const [key, value] of Object.entries(settings.env)) {
        // 只设置尚未设置的环境变量（环境变量优先级高于配置文件）
        if (!process.env[key] && typeof value === 'string') {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // 静默处理错误，不影响主程序运行
    // 可以在调试模式下输出错误
    if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
      console.error('[Settings Loader] Error loading settings.json:', error);
      console.error('[Settings Loader] Platform:', platform());
      console.error('[Settings Loader] Home directory:', homedir());
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

    // 检查文件是否存在和可读
    if (!isFileReadable(settingsPath)) {
      // 文件不存在或不可读，静默返回
      if (process.env.DEBUG_SETTINGS) {
        console.log(`[Settings Loader] Settings file not found or not readable: ${settingsPath}`);
      }
      return;
    }

    // 读取并解析 settings.json
    // 使用 utf-8 编码确保跨平台兼容
    const content = readFileSync(settingsPath, { encoding: 'utf-8' });

    // 处理可能的 BOM (Byte Order Mark) 问题（Windows 可能会添加）
    const cleanContent = content.replace(/^\uFEFF/, '');

    let settings: ClaudeSettings;
    try {
      settings = JSON.parse(cleanContent);
    } catch (parseError) {
      if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
        console.error('[Settings Loader] Invalid JSON in settings.json:', parseError);
      }
      return;
    }

    // 如果有环境变量配置，应用到 process.env
    if (settings.env && typeof settings.env === 'object') {
      for (const [key, value] of Object.entries(settings.env)) {
        // 只设置尚未设置的环境变量（环境变量优先级高于配置文件）
        if (!process.env[key] && typeof value === 'string') {
          process.env[key] = value;
        }
      }
    }
  } catch (error) {
    // 静默处理错误，不影响主程序运行
    // 可以在调试模式下输出错误
    if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
      console.error('[Settings Loader] Error loading settings.json:', error);
      console.error('[Settings Loader] Platform:', platform());
      console.error('[Settings Loader] Home directory:', homedir());
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

    // 检查文件是否存在和可读
    if (!isFileReadable(settingsPath)) {
      if (process.env.DEBUG_SETTINGS) {
        console.log(`[Settings Loader] Settings file not found or not readable: ${settingsPath}`);
      }
      return null;
    }

    // 读取文件内容
    const content = await fs.readFile(settingsPath, { encoding: 'utf-8' });

    // 处理可能的 BOM (Byte Order Mark) 问题（Windows 可能会添加）
    const cleanContent = content.replace(/^\uFEFF/, '');

    try {
      return JSON.parse(cleanContent);
    } catch (parseError) {
      if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
        console.error('[Settings Loader] Invalid JSON in settings.json:', parseError);
      }
      return null;
    }
  } catch (error) {
    if (process.env.DEBUG || process.env.DEBUG_SETTINGS) {
      console.error('[Settings Loader] Error getting settings:', error);
    }
    return null;
  }
}