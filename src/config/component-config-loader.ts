/**
 * 组件配置加载器 | Component config loader
 * 负责加载 components/*.toml 配置文件 | Responsible for loading components/*.toml config files
 *
 * 遵循KISS原则：单一职责、错误处理清晰、性能考虑
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { parse as parseToml } from '@iarna/toml';
import { z } from 'zod';
import type { ComponentMultilineConfig } from './schema.js';

// 导入配置Schema用于验证
const ComponentMultilineConfigSchema = z.object({
  meta: z
    .object({
      description: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),
  widgets: z.record(
    z.string(),
    z.object({
      enabled: z.boolean().default(true),
      force: z.boolean().optional(),
      type: z.enum(['static', 'api']),
      row: z.number().min(1),
      col: z.number().min(0),
      nerd_icon: z.string(),
      emoji_icon: z.string(),
      text_icon: z.string(),
      content: z.string().optional(),
      template: z.string().optional(),
      api: z
        .object({
          base_url: z.string(),
          endpoint: z.string(),
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
          timeout: z.number().min(1000).max(30000).default(5000),
          headers: z.record(z.string(), z.string()).default({}),
          data_path: z.string(),
        })
        .optional(),
      detection: z
        .object({
          env: z.union([z.string(), z.array(z.string())]), // 支持单个或数组
          contains: z.string().optional(),
          equals: z.string().optional(),
          pattern: z.string().optional(),
        })
        .optional(),
    })
  ),
});

/**
 * 组件配置加载结果 | Component config loading result
 */
export interface ComponentConfigLoadResult {
  /** 是否成功加载 | Whether loading succeeded */
  success: boolean;
  /** 组件配置 | Component config */
  config?: ComponentMultilineConfig;
  /** 错误信息 | Error message */
  error?: string;
  /** 文件路径 | File path */
  filePath?: string;
}

/**
 * 组件配置缓存项 | Component config cache item
 */
interface ComponentConfigCacheItem {
  /** 配置内容 | Config content */
  config: ComponentMultilineConfig;
  /** 文件修改时间 | File modification time */
  mtime: number;
  /** 加载时间 | Load time */
  loadTime: number;
}

// 模块级缓存配置 | Module-level cache configuration
const CACHE_TTL = 5000; // 5秒缓存 | 5-second cache
const configCache = new Map<string, ComponentConfigCacheItem>();

/**
 * 加载指定组件的配置 | Load config for specific component
 */
export async function loadComponentConfig(
  componentName: string,
  baseDir?: string
): Promise<ComponentConfigLoadResult> {
  try {
    const configDir = resolveComponentsDir(baseDir);
    const configPath = join(configDir, `${componentName.toLowerCase()}.toml`);

    // 检查缓存 | Check cache
    const cached = getFromCache(configPath);
    if (cached) {
      return {
        success: true,
        config: cached,
        filePath: configPath,
      };
    }

    // 检查文件是否存在 | Check if file exists
    const exists = await fileExists(configPath);
    if (!exists) {
      return {
        success: false,
        error: `配置文件不存在: ${configPath}`,
        filePath: configPath,
      };
    }

    // 读取和解析配置 | Read and parse config
    const config = await parseConfigFile(configPath);

    // 缓存结果 | Cache result
    await setToCache(configPath, config);

    return {
      success: true,
      config,
      filePath: configPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 加载所有组件配置 | Load all component configs
 */
export async function loadAllComponentConfigs(
  baseDir?: string,
  enabledComponents?: string[]
): Promise<Map<string, ComponentMultilineConfig>> {
  const configDir = resolveComponentsDir(baseDir);
  const configs = new Map<string, ComponentMultilineConfig>();

  try {
    let componentNames: string[];

    if (enabledComponents && enabledComponents.length > 0) {
      // 只加载启用的组件配置 | Only load enabled component configs
      componentNames = enabledComponents;
    } else {
      // 回退到扫描所有文件的旧行为 | Fallback to old behavior of scanning all files
      const files = await scanComponentFiles(configDir);
      componentNames = files.map((fileName) => fileName.replace('.toml', ''));
    }

    // 并行加载指定的配置 | Load specified configs in parallel
    const loadPromises = componentNames.map(async (componentName) => {
      const result = await loadComponentConfig(componentName, baseDir);

      if (result.success && result.config) {
        configs.set(componentName, result.config);
      } else if (result.error) {
        console.warn(`加载组件配置失败: ${componentName} - ${result.error}`);
      }
    });

    await Promise.all(loadPromises);
  } catch (error) {
    console.error('扫描组件配置目录失败:', error);
  }

  return configs;
}

/**
 * 清除缓存 | Clear cache
 */
export function clearCache(): void {
  configCache.clear();
}

/**
 * 解析配置所在目录 | Resolve components directory
 */
function resolveComponentsDir(baseDir?: string): string {
  if (baseDir) {
    return join(baseDir, 'components');
  }

  // 默认使用当前工作目录下的components | Default to components in current working directory
  return join(process.cwd(), 'components');
}

/**
 * 检查文件是否存在 | Check if file exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * 扫描组件配置文件 | Scan component config files
 */
async function scanComponentFiles(configDir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(configDir);
    return files.filter((file) => file.endsWith('.toml'));
  } catch (error) {
    // 目录不存在时返回空数组 | Return empty array if directory doesn't exist
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 解析配置文件 | Parse config file
 */
async function parseConfigFile(filePath: string): Promise<ComponentMultilineConfig> {
  try {
    // 读取文件内容 | Read file content
    const content = await fs.readFile(filePath, 'utf-8');

    // 解析TOML | Parse TOML
    const rawConfig = parseToml(content);

    // 环境变量替换 | Environment variable substitution
    const processedConfig = processEnvironmentVariables(rawConfig);

    // 验证配置格式 | Validate config format
    const validatedConfig = ComponentMultilineConfigSchema.parse(processedConfig);

    return validatedConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`配置格式错误: ${error.issues.map((e) => e.message).join(', ')}`);
    }
    throw new Error(`解析配置文件失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 处理环境变量 | Process environment variables
 */
function processEnvironmentVariables(obj: any): any {
  if (typeof obj === 'string') {
    // 临时占位符，用于保护转义的美元符号
    const DOLLAR_PLACEHOLDER = '\u0000DOLLAR\u0000';

    // 1. 先处理转义的 \$，将其替换为占位符
    let result = obj.replace(/\\\$/g, DOLLAR_PLACEHOLDER);

    // 2. 替换 ${VAR_NAME} 或 ${VAR1:-${VAR2}:-${VAR3}} 格式的环境变量
    // 支持 fallback 语法，依次尝试多个环境变量
    result = result.replace(/\$\{([^}]+)\}/g, (match, expr) => {
      // 移除嵌套的 ${}，提取变量名列表
      const varNames = expr.split(':-').map((v: string) => v.replace(/\$\{|\}/g, '').trim());

      // 依次尝试每个变量名
      for (const varName of varNames) {
        const value = process.env[varName];
        if (value !== undefined) {
          return value; // 找到第一个存在的变量，返回其值
        }
      }

      // 所有变量都不存在
      if (varNames.length > 1) {
        console.warn(`环境变量未找到（已尝试）: ${varNames.join(', ')}`);
      } else {
        console.warn(`环境变量未找到: ${varNames[0]}`);
      }
      return match; // 保持原始字符串
    });

    // 3. 将占位符替换回美元符号
    result = result.replace(new RegExp(DOLLAR_PLACEHOLDER, 'g'), '$');

    return result;
  } else if (Array.isArray(obj)) {
    return obj.map((item) => processEnvironmentVariables(item));
  } else if (obj && typeof obj === 'object') {
    const processed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = processEnvironmentVariables(value);
    }
    return processed;
  }
  return obj;
}

/**
 * 从缓存获取 | Get from cache
 */
function getFromCache(filePath: string): ComponentMultilineConfig | null {
  const item = configCache.get(filePath);
  if (!item) return null;

  // 检查缓存是否过期 | Check if cache is expired
  const now = Date.now();
  if (now - item.loadTime > CACHE_TTL) {
    configCache.delete(filePath);
    return null;
  }

  return item.config;
}

/**
 * 设置到缓存 | Set to cache
 */
async function setToCache(filePath: string, config: ComponentMultilineConfig): Promise<void> {
  try {
    const stats = await fs.stat(filePath);
    configCache.set(filePath, {
      config,
      mtime: stats.mtimeMs,
      loadTime: Date.now(),
    });
  } catch (error) {
    // 缓存失败不影响主流程 | Cache failure doesn't affect main flow
    console.warn('缓存配置失败:', error);
  }
}
