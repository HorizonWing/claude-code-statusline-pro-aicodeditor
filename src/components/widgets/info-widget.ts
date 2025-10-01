/**
 * 信息小组件 | Info widget
 * 显示基于环境变量的用户信息 | Display user info based on environment variables
 */

import type { WidgetConfig } from '../../config/schema.js';
import type { TerminalCapabilities } from '../../terminal/detector.js';
import { BaseWidget } from './base-widget.js';

/**
 * 信息小组件类 | Info widget class
 */
export class InfoWidget extends BaseWidget {
  constructor(config: WidgetConfig, capabilities: TerminalCapabilities) {
    super(config, capabilities);

    // 验证配置 | Validate configuration
    if (config.type !== 'info') {
      throw new Error(`信息小组件配置类型错误: ${config.type}`);
    }

    if (process.env.DEBUG_WIDGET) {
      console.error('[InfoWidget] Created with config:', JSON.stringify(config, null, 2));
    }
  }

  /**
   * 渲染信息内容 | Render info content
   */
  protected async renderContent(_context?: any): Promise<string | null> {
    try {
      // 收集环境信息 | Collect environment info
      const infoData = this.collectInfo();

      if (process.env.DEBUG_WIDGET) {
        console.error('[InfoWidget] Collected data:', JSON.stringify(infoData, null, 2));
        console.error('[InfoWidget] Template:', this.config.template);
      }

      // 使用模板渲染 | Render with template
      if (this.config.template) {
        const result = this.renderTemplate(this.config.template, infoData);
        if (process.env.DEBUG_WIDGET) {
          console.error('[InfoWidget] Rendered result:', result);
        }
        return result;
      }

      // 默认渲染 | Default rendering
      return this.renderDefaultInfo(infoData);
    } catch (error) {
      if (process.env.DEBUG_WIDGET) {
        console.error('[InfoWidget] Error:', error);
      }
      // 静默失败 | Silent failure
      return null;
    }
  }

  /**
   * 收集信息数据 | Collect info data
   */
  private collectInfo(): any {
    const info: any = {};

    // 获取token信息（脱敏） | Get token info (masked)
    const authToken = process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY;
    if (authToken) {
      // 只显示前后几位，中间用星号代替 | Show only first and last few chars
      if (authToken.length > 12) {
        info.token = `${authToken.substring(0, 6)}...${authToken.substring(authToken.length - 4)}`;
      } else {
        info.token = 'Token Set';
      }

      // 判断token类型 | Determine token type
      if (authToken.startsWith('sk-ant-')) {
        info.tokenType = 'Claude API';
      } else if (authToken.startsWith('sk_')) {
        info.tokenType = 'Auth Token';
      } else {
        info.tokenType = 'Custom';
      }
    } else {
      info.token = 'No Token';
      info.tokenType = 'None';
    }

    // 获取时间信息 | Get time info
    const now = new Date();
    info.time = now.toLocaleTimeString();
    info.date = now.toLocaleDateString();

    // 获取会话信息 | Get session info
    info.sessionId = process.env.SESSION_ID || 'Local';
    info.user = process.env.USER || process.env.USERNAME || 'User';

    // 获取项目信息 | Get project info
    info.cwd = process.cwd();
    info.project = info.cwd.split('/').pop() || 'Unknown';

    // AI Code Editor 状态 | AI Code Editor status
    info.aceStatus = process.env.AICODEDITOR_TOKEN ? 'Connected' : 'Ready';

    // 计算积分（模拟） | Calculate credits (simulated)
    // 基于token的hash值生成一个稳定的数字
    if (authToken) {
      let hash = 0;
      for (let i = 0; i < authToken.length; i++) {
        hash = ((hash << 5) - hash) + authToken.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      info.credits = Math.abs(hash % 100000) + 50000; // 50k-150k range
      info.days = Math.abs(hash % 30) + 1; // 1-30 days
    } else {
      info.credits = 0;
      info.days = 0;
    }

    return info;
  }

  /**
   * 默认信息渲染 | Default info rendering
   */
  private renderDefaultInfo(info: any): string {
    if (info.tokenType === 'None') {
      return 'No authentication configured';
    }

    // 根据token类型显示不同信息 | Show different info based on token type
    const parts: string[] = [];

    // 显示积分信息（模拟） | Show credits (simulated)
    if (info.credits > 0) {
      parts.push(`积分: ${info.credits.toLocaleString()}`);
    }

    // 显示剩余天数 | Show remaining days
    if (info.days > 0) {
      parts.push(`剩余: ${info.days}天`);
    }

    // 显示token类型 | Show token type
    parts.push(`认证: ${info.tokenType}`);

    // 显示状态 | Show status
    parts.push(`状态: ${info.aceStatus}`);

    return parts.join(' | ');
  }
}