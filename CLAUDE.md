# Claude Code 状态栏增强系统架构指南

## 核心架构

这是一个企业级状态栏生成系统，采用分层架构：

```
CLI层 (src/cli/main.ts)
    ↓
生成器层 (src/core/generator.ts - StatuslineGenerator)
    ↓ ╔═══════════════════════════════════╗
      ║      多行渲染系统 (新增)           ║
      ║ MultiLineRenderer + GridSystem    ║
      ║ + Widget Framework               ║
      ╚═══════════════════════════════════╝
    ↓
组件层 (src/components/ - BaseComponent子类) + Widget层
    ↓
服务层 (GitService + StorageManager + TerminalDetector)  
    ↓
基础层 (Utils + Config + Themes)
```

## 多行状态栏系统 🆕

### 架构概览
多行系统允许在主状态栏下方显示扩展信息行，通过Widget框架提供灵活的内容展示能力。

### 核心组件

**MultiLineRenderer** (`src/core/multi-line-renderer.ts`):
- 统一管理扩展行渲染
- 集成GridSystem进行布局
- 支持组件配置动态加载

**GridSystem** (`src/core/grid-system.ts`):
- 二维网格布局引擎
- 支持多行多列组件排列
- 自动处理行列对齐和空白填充

**Widget框架** (`src/components/widgets/`):
- `BaseWidget`: Widget基类，提供渲染和检测能力
- `ApiWidget`: API数据获取和显示
- `StaticWidget`: 静态内容显示
- `WidgetFactory`: Widget工厂模式实现

### Detection系统 🔥
自动检测机制，根据环境变量智能启用Widget：

```typescript
// 配置示例
[widgets.example.detection]
env = "ANTHROPIC_BASE_URL"
equals = "https://api.example.com"        // 精确匹配
contains = "example.com"                   // 包含匹配  
pattern = ".*\\.example\\.(com|org)$"     // 正则表达式匹配

// 强制控制
force = true   // 强制启用，忽略detection
force = false  // 强制禁用
```

## 主要执行流程

1. **CLI入口**: `src/cli/main.ts:64` 处理命令行参数
2. **配置加载**: `ConfigLoader.load()` 加载TOML配置
3. **生成器初始化**: `new StatuslineGenerator(config)`
4. **组件注册**: `initializeComponents()` 注册7个组件工厂
5. **状态栏生成**: `generator.generate(inputData)` 执行渲染
6. **主题渲染**: ThemeRenderer 生成最终输出

## 关键类和接口

### StatuslineGenerator (src/core/generator.ts:29)
```typescript
class StatuslineGenerator {
  generate(inputData: InputData): Promise<string>  // 主要接口
  private initializeComponents(): void             // 注册组件工厂
}
```

### BaseComponent (src/components/base.ts:34)
```typescript
abstract class BaseComponent {
  abstract renderContent(context: RenderContext): string | null
  protected selectIcon(): string  // 三级图标选择逻辑
}
```

### ConfigLoader (src/config/loader.ts)
```typescript
class ConfigLoader {
  load(customPath?: string): Promise<Config>
  createDefaultConfig(path: string, theme: string): Promise<void>
}
```

## 🚨 AI Agent开发哲学

### KISS原则 (Keep It Simple, Stupid)
1. **简单优于复杂**: 优先选择简单直接的解决方案
2. **可读性第一**: 代码是给人看的，其次才是给机器执行的
3. **避免过度设计**: 不要为了未来可能的需求而过度设计
4. **单一职责**: 每个函数、类、模块只做一件事

### Linus精神
1. **代码质量至上**: 糟糕的代码是技术债务，好的代码是资产
2. **直接而诚实**: 代码评审时直接指出问题，不要含糊其辞
3. **性能意识**: 始终考虑代码的性能影响
4. **测试驱动**: 没有测试的代码就是坏代码

### AI Agent开发技巧
1. **并行阅读和执行Bash命令**: 充分利用自身的并行工具调用能力，一次性同时并行阅读多个文件，并行调用多个Bash命令以提高效率
2. **谨慎并行编辑**: 在并行Update的时候，要小心谨慎，充分思考
3. **避免一次性输出过长**: 在创建超过1000行的大文档、执行超过1000行的代码删除和修改等长输出的工具调用时，优先选择先创建基础，然后并行调用Update，或使用Multi Update进行丰富完善的方式。而不是一次性输出一整个文档或试图直接编辑1000行的代码，这很有可能会失败
4. **使用SubAgent来扩展**: 面对某些调研代码库、阅读庞大的文档等高上下文消耗的工作，请使用Task工具委派给合适的SubAgent或General Purpose来执行。避免污染自身上下文
5. **SubAgents并行调用**: 在需要执行多个Task的时候，可以并行调用任务互相正交的SubAgents，提高效率

## 📝 TypeScript开发规范

### 常见错误与避免方法

#### 1. 类型不一致问题
**❌ 错误**:
```typescript
function extractProjectId(path: string | null): string | undefined {
  return path ? path.match(/.../)![1] : undefined; // 类型不匹配！
}
```
**✅ 正确**:
```typescript
function extractProjectId(path: string | null): string | null {
  return path ? (path.match(/.../))?.[1] || null : null;
}
```

#### 2. 可选属性处理
**❌ 错误**:
```typescript
const cost: SessionCost = {
  parentSessionId: undefined, // 在strictOptionalProperties下会报错
};
```
**✅ 正确**:
```typescript
const cost: SessionCost = {};
if (parentId) {
  cost.parentSessionId = parentId;
}
```

#### 3. 异步操作处理
**❌ 错误**:
```typescript
async renderContent() {
  updateCostFromInput(data); // 忘记await导致数据丢失
  return this.formatOutput();
}
```
**✅ 正确**:
```typescript
async renderContent() {
  await updateCostFromInput(data); // 必须await
  return this.formatOutput();
}
```

## 🔄 模块依赖关系

### 核心依赖链
- **CLI层** → **生成器层** → **组件层** → **服务层**
- **组件层** ← **配置系统** (Config + Schema)
- **服务层** ← **Git服务** + **存储系统** + **终端检测**
- **主题系统** ← **渲染器** (Classic/Powerline/Capsule)

### 关键设计模式
- **工厂模式**: `ComponentFactory` 负责组件实例创建
- **模板方法**: `BaseComponent` 提供统一渲染流程
- **策略模式**: 三级图标回退 (NerdFont → Emoji → Text)
- **门面模式**: `StatuslineGenerator` 统一外部接口

## 🛠 开发指南

### 添加新组件的完整步骤
1. 继承 `BaseComponent`，实现 `renderContent()`
2. 创建对应的 `ComponentFactory`
3. 在 `StatuslineGenerator.initializeComponents()` 中注册
4. 在 `src/config/schema.ts` 添加配置类型
5. 更新预设映射支持新组件

### 添加新主题
1. 在 `src/themes/types.ts` 定义配置
2. 创建渲染器类实现 `ThemeRenderer` 接口
3. 在 `src/themes/index.ts:createThemeRenderer()` 注册

### 三级图标系统实现
每个组件配置必须包含：
```typescript
{
  nerd_icon: string,    // Nerd Font图标
  emoji_icon: string,   // Emoji图标
  text_icon: string     // 文本回退
}
```

### 添加新Widget的步骤 🆕
1. 继承 `BaseWidget` 或 `ApiWidget`，实现 `renderContent()`
2. 在 `WidgetFactory` 中注册新的Widget类型
3. 创建组件配置文件 (如 `components/my-widget.toml`)
4. 配置 detection 规则或 force 控制
5. 在主配置中启用对应组件

### Widget配置示例 🆕
```toml
[widgets.my_widget]
enabled = true
type = "api"
row = 1
col = 0
nerd_icon = "\uf085"
template = "Value: {field_name}"

[widgets.my_widget.detection]
env = "MY_ENV_VAR" 
contains = "expected_value"

[widgets.my_widget.api]
base_url = "https://api.example.com"
endpoint = "/data"
data_path = "$.result"
```

## 📁 重要文件路径
### 核心系统
- 主入口: `src/index.ts`
- CLI入口: `src/cli/main.ts:64`
- 核心生成器: `src/core/generator.ts:29`
- 组件基类: `src/components/base.ts:34`
- 配置加载: `src/config/loader.ts`

### 多行系统 🆕
- 多行渲染器: `src/core/multi-line-renderer.ts`
- 网格系统: `src/core/grid-system.ts`
- Widget基类: `src/components/widgets/base-widget.ts`
- API Widget: `src/components/widgets/api-widget.ts`
- 静态Widget: `src/components/widgets/static-widget.ts`
- Widget工厂: `src/components/widgets/widget-factory.ts`
- 组件配置加载: `src/config/component-config-loader.ts`

### 服务层
- Git服务: `src/git/service.ts:39`
- 终端检测: `src/terminal/detector.ts:798`
- 主题引擎: `src/themes/engine.ts:14`
- 项目解析: `src/utils/project-resolver.ts`

## ⚠️ 开发注意事项

### 异步操作
- **存储操作必须await**: `await updateCostFromInput(data)`
- **组件渲染可能异步**: 特别是Usage和Branch组件

### 路径哈希一致性
- 所有模块必须使用 `projectResolver.hashPath()` 
- 位置: `src/utils/project-resolver.ts`

### 缓存系统
- Git操作缓存: 5秒TTL，通过 `cache_enabled` 控制
- 组件渲染频率: 300ms更新间隔

### Widget系统特性 🆕
- **嵌套数据访问**: 支持 `{other.field}` 语法访问JSON字符串字段
- **数学表达式**: 支持 `{quota / 500000:.2f}` 计算和格式化
- **美元符号转义**: 在TOML中使用 `\\$` 显示美元符号
- **环境变量**: 配置中的 `${VAR_NAME}` 自动替换

---
**Node.js**: >=18.0.0 | **系统**: macOS/Linux/Windows