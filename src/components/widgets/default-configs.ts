/**
 * Widget默认配置 | Widget default configurations
 * 提供内置的默认配置，用户配置可以覆盖这些默认值
 */

import type { WidgetConfig, ComponentMultilineConfig } from '../../config/schema.js';

/**
 * AI Code Editor默认配置
 */
export const AICODEDITOR_DEFAULT_CONFIG: WidgetConfig = {
  enabled: true,
  type: 'api',
  row: 1,
  col: 0,
  nerd_icon: '',
  emoji_icon: '',
  text_icon: '',
  template: '💰 {data.points:,} | ⏱️  {data.remainingTime}',

  // API配置
  api: {
    base_url: 'https://aicodeditor.com',
    endpoint: '/api/v1/usage',
    method: 'POST',
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer ${ANTHROPIC_AUTH_TOKEN:-${ANTHROPIC_API_KEY}}'
    },
    data_path: '$',
  },

  // 检测配置 - 当检测到环境变量时自动启用
  detection: {
    env: ['ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_API_KEY'],
  },
};

/**
 * Usage组件的默认配置
 */
export const USAGE_DEFAULT_COMPONENT_CONFIG: ComponentMultilineConfig = {
  meta: {
    description: 'AI Code Editor 用户信息显示',
    version: '1.0',
  },
  widgets: {
    aicodeditor_status: AICODEDITOR_DEFAULT_CONFIG,
  },
};

/**
 * 默认配置映射表
 */
export const DEFAULT_WIDGET_CONFIGS: Map<string, WidgetConfig> = new Map([
  ['aicodeditor_status', AICODEDITOR_DEFAULT_CONFIG],
]);

/**
 * 默认组件配置映射表
 */
export const DEFAULT_COMPONENT_CONFIGS: Map<string, ComponentMultilineConfig> = new Map([
  ['usage', USAGE_DEFAULT_COMPONENT_CONFIG],
]);

/**
 * 获取Widget的默认配置
 * @param widgetName Widget名称
 * @returns 默认配置或undefined
 */
export function getDefaultWidgetConfig(widgetName: string): WidgetConfig | undefined {
  return DEFAULT_WIDGET_CONFIGS.get(widgetName);
}

/**
 * 合并用户配置和默认配置
 * @param widgetName Widget名称
 * @param userConfig 用户配置（可选）
 * @returns 合并后的配置
 */
export function mergeWithDefaultConfig(
  widgetName: string,
  userConfig?: Partial<WidgetConfig>
): WidgetConfig | undefined {
  const defaultConfig = getDefaultWidgetConfig(widgetName);

  if (!defaultConfig) {
    return userConfig as WidgetConfig;
  }

  if (!userConfig) {
    return defaultConfig;
  }

  // 深度合并配置
  return deepMergeConfigs(defaultConfig, userConfig);
}

/**
 * 获取组件的默认配置
 * @param componentName 组件名称
 * @returns 默认配置或undefined
 */
export function getDefaultComponentConfig(componentName: string): ComponentMultilineConfig | undefined {
  return DEFAULT_COMPONENT_CONFIGS.get(componentName);
}

/**
 * 合并组件配置和默认配置
 * @param componentName 组件名称
 * @param userConfig 用户配置（可选）
 * @returns 合并后的配置
 */
export function mergeComponentConfig(
  componentName: string,
  userConfig?: ComponentMultilineConfig
): ComponentMultilineConfig | undefined {
  const defaultConfig = getDefaultComponentConfig(componentName);

  if (!defaultConfig) {
    return userConfig;
  }

  if (!userConfig) {
    return defaultConfig;
  }

  // 合并meta信息
  const mergedMeta = {
    ...defaultConfig.meta,
    ...userConfig.meta,
  };

  // 合并widgets
  const mergedWidgets: Record<string, WidgetConfig> = {};

  // 首先添加默认widgets
  for (const [widgetName, widgetConfig] of Object.entries(defaultConfig.widgets || {})) {
    mergedWidgets[widgetName] = widgetConfig;
  }

  // 然后用用户配置覆盖
  for (const [widgetName, userWidgetConfig] of Object.entries(userConfig.widgets || {})) {
    if (mergedWidgets[widgetName]) {
      // 深度合并widget配置
      mergedWidgets[widgetName] = deepMergeConfigs(
        mergedWidgets[widgetName],
        userWidgetConfig
      );
    } else {
      mergedWidgets[widgetName] = userWidgetConfig;
    }
  }

  return {
    meta: mergedMeta,
    widgets: mergedWidgets,
  };
}

/**
 * 深度合并两个配置对象
 * @param defaultConfig 默认配置
 * @param userConfig 用户配置
 * @returns 合并后的配置
 */
function deepMergeConfigs(
  defaultConfig: WidgetConfig,
  userConfig: Partial<WidgetConfig>
): WidgetConfig {
  const merged = { ...defaultConfig };

  for (const key in userConfig) {
    const userValue = userConfig[key as keyof WidgetConfig];
    const defaultValue = defaultConfig[key as keyof WidgetConfig];

    if (userValue === undefined) {
      continue;
    }

    // 如果是对象类型且都存在，进行深度合并
    if (
      typeof userValue === 'object' &&
      userValue !== null &&
      !Array.isArray(userValue) &&
      typeof defaultValue === 'object' &&
      defaultValue !== null &&
      !Array.isArray(defaultValue)
    ) {
      // 特殊处理api和detection对象
      if (key === 'api' && defaultConfig.api) {
        merged.api = { ...defaultConfig.api, ...userValue as any };
      } else if (key === 'detection' && defaultConfig.detection) {
        merged.detection = { ...defaultConfig.detection, ...userValue as any };
      } else {
        (merged as any)[key] = { ...defaultValue, ...userValue };
      }
    } else {
      // 直接覆盖
      (merged as any)[key] = userValue;
    }
  }

  return merged;
}