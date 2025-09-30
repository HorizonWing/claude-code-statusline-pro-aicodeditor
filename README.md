# Claude Code Statusline Pro - AI Code Editor Edition

[![npm version](https://badge.fury.io/js/claude-code-statusline-pro-aicodeditor.svg)](https://badge.fury.io/js/claude-code-statusline-pro-aicodeditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](https://github.com/horizonwing/claude-code-statusline-pro-aicodeditor)

> 🔥 **基于 [claude-code-statusline-pro](https://github.com/wangnov/claude-code-statusline-pro) 修改**
> 本项目在原版基础上进行了增强和定制，添加了最新 Claude 模型支持和个性化配置。

[中文](#使用指南) | [English](#user-guide)

---

# 使用指南

**Claude Code 专业状态栏 - AI Code Editor 定制版** - 为 Claude Code 量身定制的智能状态栏系统。

## 🆕 相比原版的改进

- ✅ **最新模型支持**: 已添加 Claude Sonnet 4.5 (20250929) 支持，包括 200k 和 1m 版本
- ✅ **持续更新**: 及时跟进 Claude 新模型发布
- ✅ **个性化配置**: 根据个人使用习惯优化的默认配置
- ✅ **完全兼容**: 保持与原版 100% 配置兼容

## ✨ 核心特性

- 🎯 **三大主题系统**: Classic、Powerline、Capsule 主题，自适应终端能力
- 🛠️ **灵活的配置系统**: 支持TOML配置文件和命令行参数覆盖
- 📊 **精准Token计算**: 与Claude官方API完全一致的token统计，支持渐变可视化进度条
- 🧠 **智能状态识别**: 基于tokens数量精准识别Thinking vs Ready状态
- 🚀 **预设系统**: 通过字母组合快速配置组件排布 (`PMBTUS`, `MT`, `BT`)
- 🌈 **跨平台兼容**: Windows、macOS、Linux智能适配，支持各种终端
- ⚡ **高性能优化**: 缓存机制，300ms更新间隔，符合Claude Code官方建议
- 🌐 **双语支持**: 中英双语配置界面和错误提示

## 📋 系统要求

在开始使用之前，请确保您的系统满足以下要求：

### 必需条件
- **Claude Code**: 版本 ≥ 1.0.71
- **Node.js**: 版本 ≥ 18.0.0 ([下载安装](https://nodejs.org/))
- **npm**: 通常随Node.js自动安装

### 检查当前版本
```bash
# 检查Claude Code版本
claude --version

# 检查Node.js版本
node --version

# 检查npm版本
npm --version
```

## 🚀 快速开始

### 一步配置，即刻使用

只需要在Claude Code的配置文件中添加一行配置，无需预先安装：

**在项目根目录或家目录创建 `.claude/settings.json`：**

```json
{
  "statusLine": {
    "type": "command", 
    "command": "npx claude-code-statusline-pro-aicodeditor@latest"
    // 或使用原版：npx claude-code-statusline-pro-aicodeditor@latest
  }
}
```

保存文件后，重新打开Claude Code即可看到专业版状态栏！

### 验证安装

打开Claude Code，你应该看到类似这样的状态栏：

```
📁 my-project | 🤖 S4 | 🌿 main | 📊 [████████████░░░] 80.1%(160k/200k) | $21.07 | ✅ Ready
```

## 🎯 快速配置指南

### 预设系统 - 字母组合配置

通过简单的字母组合快速定制状态栏显示内容：

- **P** = Project (项目名称)  
- **M** = Model (模型信息)
- **B** = Branch (Git分支)
- **T** = Tokens (Token使用情况)
- **U** = Usage (使用量统计) 
- **S** = Status (状态信息)

### 快速配置命令

注：这些命令全部是写在settings.json中的，并不是在终端直接执行使用（直接执行会打印出预览结果）
```bash
# 显示所有组件（推荐）
npx claude-code-statusline-pro-aicodeditor@latest --preset PMBTUS --theme powerline

# 只显示模型、Token和使用量
npx claude-code-statusline-pro-aicodeditor@latest --preset MTU --theme classic

# 只显示分支和Token信息
npx claude-code-statusline-pro-aicodeditor@latest --preset BT --theme capsule
```

## 🎨 三大主题系统

### Classic 主题 - 最大兼容性

Classic主题支持三种图标模式，默认会根据终端能力自动选择：

#### 🎯 Nerd Font 模式（推荐）
![Classic Nerd Font](./assets/classic_nf.png)

**需要安装Nerd Font字体，并在对应的终端中选择使用字体**，推荐使用 [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/Hack.zip)

#### 😊 Emoji 模式
![Classic Emoji](./assets/classic_emoji.png)

适合支持Emoji但没有Nerd Font的终端

#### 📝 文本模式
![Classic Text](./assets/classic_text.png)

最大兼容性，适合所有终端环境

### Powerline主题 - 现代化设计（需要Nerd Font字体）

![Powerline效果](./assets/powerline.png)

箭头无缝连接设计，需要Nerd Font支持，提供最佳视觉体验。

### Capsule主题 - 胶囊样式（需要Nerd Font字体）

![Capsule效果](./assets/capsule.png)

胶囊形状包装，现代化UI设计，适合追求简洁美观的用户。

### 强制启用特定模式

如果你的终端本就支持某种图标（例如Nerd Font），但没有自动启用，则可强制指定启用该图标能力

```bash
# 强制启用Nerd Font图标（需要安装字体，否则会显示乱码）
npx claude-code-statusline-pro-aicodeditor@latest --force-nerd-font

# 强制启用Emoji图标（需要终端确实支持Emoji，如MacOS，否则会显示乱码）
npx claude-code-statusline-pro-aicodeditor@latest --force-emoji  

# 强制启用纯文本模式
npx claude-code-statusline-pro-aicodeditor@latest --force-text
```

## 📊 Token计算准确性

### 与Claude官方API完全一致

状态栏的token计算与Claude官方API保持完全一致，确保显示数据的准确性：

![Token计算准确性对比](./assets/tokens_analysis_vs_official.png)

**如图所示**：
- 状态栏显示：`183.3k/200k (91.7%)`
- Claude API报错：`183559 + 21333 > 200000`
- 计算结果：`183559 ≈ 183.3k` ✅ 完全一致

### Token计算公式

```javascript
contextUsedTokens = usage.input_tokens + 
                   usage.cache_creation_input_tokens + 
                   usage.cache_read_input_tokens + 
                   usage.output_tokens;
```

这确保了状态栏显示的token使用量与Claude官方统计完全一致。

## 💰 Cost计算说明

### 智能成本追踪系统

状态栏提供两种成本计算模式，可在 `config.toml` 中配置：

#### 🔄 Session 模式（会话模式）
- **计算范围**: 从您打开 Claude Code 开始，到使用 `/clear` 命令或关闭应用为止
- **计算逻辑**: 基于当前会话的所有 token 消耗
- **适用场景**: 单次工作会话的成本控制
- **重置方式**: 使用 `/clear` 命令或重启 Claude Code

#### 🔗 Conversation 模式（对话模式）
- **计算范围**: 跨会话追踪完整对话链的累计消耗
- **智能追踪**: 即使关闭并重新打开 Claude Code，仍能追踪同一项目的历史消耗
- **Session ID 无关**: 自动处理会话 ID 变化，保持连续性追踪
- **适用场景**: 长期项目的完整成本分析

#### ⚙️ 配置方式

在 `config.toml` 中设置：
```toml
[components.usage]
mode = "conversation"  # 或 "session"
```

#### 📊 成本计算公式

```javascript
cost = (inputTokens * inputPrice + outputTokens * outputPrice + 
        cacheTokens * cachePrice) / 1_000_000
```

**注意**: 状态栏的成本计算与 `/cost` 命令采用不同逻辑和时间范围，确保各自场景的准确性。

## 🛠️ 高级配置

### 智能配置管理系统

#### 📂 配置文件层级

状态栏采用两级配置系统，支持灵活的配置管理：

**项目级配置** (优先级: 高)
- 路径: `~/.claude/projects/{project-hash}/statusline-pro/config.toml`
- 适用: 特定项目的个性化配置
- 初始化: `npx claude-code-statusline-pro-aicodeditor@latest config --init`

**用户级配置** (优先级: 低)
- 路径: `~/.claude/statusline-pro/config.toml`
- 适用: 全局默认配置，适用于所有项目
- 初始化: `npx claude-code-statusline-pro-aicodeditor@latest config --init -g`

#### ⚡ 智能终端检测和配置初始化

运行初始化命令时，系统会自动检测您的终端能力：

```bash
# 初始化项目级配置（推荐）
npx claude-code-statusline-pro-aicodeditor@latest config --init

# 初始化全局配置
npx claude-code-statusline-pro-aicodeditor@latest config --init -g

# 强制重新初始化（覆盖现有配置）
npx claude-code-statusline-pro-aicodeditor@latest config --init --force
```

**智能检测功能：**
- 🎨 **Nerd Font 检测**: 自动识别终端是否支持 Nerd Font 图标
- 😊 **Emoji 支持检测**: 检测终端的 Emoji 渲染能力
- 🌈 **颜色支持检测**: 识别终端的颜色显示能力
- 🎯 **主题自动选择**: 根据终端能力自动选择最佳主题

#### 📝 配置文件详解

系统初始化后会生成完整的 `config.toml` 配置文件：

```toml
# 默认预设和主题
preset = "PMBTUS"
theme = "powerline"

# 主题特性配置
[themes.powerline]
enable_gradient = true
ignore_separator = true
fine_progress = true

# 组件顺序配置
[components]
order = ["project", "model", "branch", "tokens", "usage", "status"]

# Token组件详细配置
[components.tokens]
show_gradient = true         # 启用彩色渐变进度条
show_progress_bar = true     # 显示进度条
show_percentage = true       # 显示百分比
progress_width = 15          # 进度条宽度

# Token阈值配置
[components.tokens.thresholds]
warning = 60    # 60%显示黄色警告
danger = 85     # 85%显示红色危险
backup = 85     # 后备区域开始
critical = 95   # 95%显示🔥临界

# 终端兼容配置
[terminal]
force_nerd_font = false     # 强制启用Nerd Font
force_emoji = false         # 强制启用Emoji  
force_text = false          # 强制文本模式
```

## 🖥️ 终端兼容性

智能检测并自动适配不同终端环境：

- **Windows Terminal** ✅ 完全支持所有特性
- **VS Code Terminal** ✅ 完全支持所有特性
- **iTerm2 (macOS)** ✅ 完全支持所有特性
- **Git Bash** ✅ 完全支持所有特性
- **PowerShell** ✅ 完全支持所有特性
- **CMD** ⚠️ 自动回退到安全文本模式

## 🔧 故障排除

### 版本兼容性问题

**Q: 状态栏完全不显示或显示错误**
```bash
# 错误示例：status line command failed: npx claude-code-statusline-pro-aicodeditor@latest
# 解决方案：升级Claude Code到最新版本
npm install -g @anthropic-ai/claude-code@latest
```

**Q: 提示"command not found: npx"或Node.js相关错误**
```bash
# 错误示例：/bin/sh: npx: command not found
# 解决方案：安装或更新Node.js环境
# 访问官网下载最新版本：https://nodejs.org/
# 或使用包管理器安装：

# macOS (使用Homebrew)
brew install node

# Ubuntu/Debian
sudo apt update && sudo apt install nodejs npm

# Windows
# 请访问 https://nodejs.org/ 下载安装包
```

**Q: Claude Code版本过旧导致的兼容性问题**
```bash
# 检查Claude Code版本
claude --version

# 如果版本低于1.0.71，请更新
npm install -g @anthropic-ai/claude-code@latest

# 更新后重启终端并重新打开Claude Code
```

### 显示问题

**Q: 图标显示为方框或乱码**
```bash
# 检查终端是否支持Nerd Font，强制使用Emoji模式
npx claude-code-statusline-pro-aicodeditor@latest --force-emoji
```

**Q: 颜色显示异常**
```bash
# 检查终端颜色支持，可以禁用颜色
npx claude-code-statusline-pro-aicodeditor@latest --no-color
```

**Q: 状态栏不更新**
```bash
# 检查Claude Code配置文件是否正确
cat ~/.claude/settings.json
```

### 测试命令

```bash
# 测试基本功能
echo '{"model":{"id":"claude-sonnet-4"}}' | npx claude-code-statusline-pro-aicodeditor@latest

# 测试特定预设和主题
echo '{"model":{"id":"claude-sonnet-4"}}' | npx claude-code-statusline-pro-aicodeditor@latest --preset MT --theme classic
```

---

# User Guide

**Claude Code Professional Status Bar - AI Code Editor Edition** - Smart status bar system specifically designed for Claude Code.

> 🔥 **Based on [claude-code-statusline-pro](https://github.com/wangnov/claude-code-statusline-pro)**
> This project is enhanced and customized based on the original version, with the latest Claude model support and personalized configurations.

## 🆕 Improvements Over Original

- ✅ **Latest Model Support**: Added Claude Sonnet 4.5 (20250929) support, including 200k and 1m versions
- ✅ **Continuous Updates**: Timely updates for new Claude model releases
- ✅ **Personalized Configuration**: Optimized default configurations based on personal usage habits
- ✅ **Fully Compatible**: Maintains 100% configuration compatibility with the original version

## ✨ Core Features

- 🎯 **Three Theme System**: Classic, Powerline, and Capsule themes with adaptive terminal capabilities
- 🛠️ **Flexible Configuration System**: Support for TOML configuration files and command-line parameter overrides
- 📊 **Precise Token Calculation**: Token statistics fully consistent with Claude's official API, supporting gradient visualization progress bar
- 🧠 **Smart Status Recognition**: Precise identification of Thinking vs Ready status based on token count
- 🚀 **Preset System**: Quick component configuration through letter combinations (`PMBTUS`, `MT`, `BT`)
- 🌈 **Cross-platform Compatibility**: Smart adaptation for Windows, macOS, Linux, supporting various terminals
- ⚡ **High Performance Optimization**: Caching mechanism, 300ms update interval, following Claude Code official recommendations
- 🌐 **Bilingual Support**: Chinese and English configuration interface with error messages

## 📋 System Requirements

Before getting started, please ensure your system meets the following requirements:

### Prerequisites
- **Claude Code**: Version ≥ 1.0.71
- **Node.js**: Version ≥ 18.0.0 ([Download](https://nodejs.org/))
- **npm**: Usually installed automatically with Node.js

### Check Current Versions
```bash
# Check Claude Code version
claude --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

## 🚀 Quick Start

### One-Step Configuration, Instant Use

Simply add one line to your Claude Code configuration file, no pre-installation required:

**Create `.claude/settings.json` in your project root or home directory:**

```json
{
  "statusLine": {
    "type": "command", 
    "command": "npx claude-code-statusline-pro-aicodeditor@latest"
  }
}
```

Save the file and restart Claude Code to see the professional status bar!

### Verify Installation

Open Claude Code and you should see a status bar like this:

```
📁 my-project | 🤖 S4 | 🌿 main | 📊 [████████████░░░] 80.1%(160k/200k) | $21.07 | ✅ Ready
```

## 🎯 Quick Configuration Guide

### Preset System - Letter Combination Configuration

Quickly customize status bar content through simple letter combinations:

- **P** = Project (project name)  
- **M** = Model (model information)
- **B** = Branch (Git branch)
- **T** = Tokens (token usage)
- **U** = Usage (usage statistics) 
- **S** = Status (status information)

### Quick Configuration Commands

Note: These commands are all written in settings.json, not executed directly in the terminal (direct execution will print preview results)

```bash
# Show all components (recommended)
npx claude-code-statusline-pro-aicodeditor@latest --preset PMBTUS --theme powerline

# Show only model, tokens, and usage
npx claude-code-statusline-pro-aicodeditor@latest --preset MTU --theme classic

# Show only branch and token information
npx claude-code-statusline-pro-aicodeditor@latest --preset BT --theme capsule
```

## 🎨 Three Theme System

### Classic Theme - Maximum Compatibility

Classic theme supports three icon modes, automatically selected based on terminal capabilities by default:

#### 🎯 Nerd Font Mode (Recommended)
![Classic Nerd Font](./assets/classic_nf.png)

**Requires Nerd Font installation and selecting the font in the corresponding terminal**, recommend [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/Hack.zip)

#### 😊 Emoji Mode
![Classic Emoji](./assets/classic_emoji.png)

Suitable for terminals that support Emoji but don't have Nerd Font

#### 📝 Text Mode
![Classic Text](./assets/classic_text.png)

Maximum compatibility, suitable for all terminal environments

### Powerline Theme - Modern Design (Requires Nerd Font)

![Powerline Effect](./assets/powerline.png)

Seamless arrow connection design, requires Nerd Font support, provides the best visual experience.

### Capsule Theme - Capsule Style (Requires Nerd Font)

![Capsule Effect](./assets/capsule.png)

Capsule-shaped wrapper, modern UI design, suitable for users pursuing simplicity and beauty.

### Force Enable Specific Mode

If your terminal already supports certain icons (e.g., Nerd Font) but doesn't auto-enable, you can force enable that icon capability

```bash
# Force enable Nerd Font icons (requires font installation, otherwise will show garbled text)
npx claude-code-statusline-pro-aicodeditor@latest --force-nerd-font

# Force enable Emoji icons (terminal must actually support Emoji like macOS, otherwise will show garbled text)
npx claude-code-statusline-pro-aicodeditor@latest --force-emoji  

# Force enable plain text mode
npx claude-code-statusline-pro-aicodeditor@latest --force-text
```

## 📊 Token Calculation Accuracy

### Fully Consistent with Claude Official API

The status bar's token calculation remains fully consistent with Claude's official API, ensuring accurate data display:

![Token Calculation Accuracy Comparison](./assets/tokens_analysis_vs_official.png)

**As shown in the image**:
- Status bar display: `183.3k/200k (91.7%)`
- Claude API error: `183559 + 21333 > 200000`
- Calculation result: `183559 ≈ 183.3k` ✅ Completely consistent

### Token Calculation Formula

```javascript
contextUsedTokens = usage.input_tokens + 
                   usage.cache_creation_input_tokens + 
                   usage.cache_read_input_tokens + 
                   usage.output_tokens;
```

This ensures that the token usage displayed in the status bar is completely consistent with Claude's official statistics.

## 💰 Cost Calculation Explanation

### Intelligent Cost Tracking System

The status bar provides two cost calculation modes, configurable in `config.toml`:

#### 🔄 Session Mode
- **Calculation scope**: From when you open Claude Code until using `/clear` command or closing the application
- **Calculation logic**: Based on all token consumption in the current session
- **Use case**: Cost control for single work sessions
- **Reset method**: Use `/clear` command or restart Claude Code

#### 🔗 Conversation Mode
- **Calculation scope**: Cross-session tracking of cumulative consumption for complete conversation chains
- **Smart tracking**: Continues tracking the same project's historical consumption even after closing and reopening Claude Code
- **Session ID independent**: Automatically handles session ID changes while maintaining continuity tracking
- **Use case**: Complete cost analysis for long-term projects

#### ⚙️ Configuration Method

Set in `config.toml`:
```toml
[components.usage]
mode = "conversation"  # or "session"
```

#### 📊 Cost Calculation Formula

```javascript
cost = (inputTokens * inputPrice + outputTokens * outputPrice + 
        cacheTokens * cachePrice) / 1_000_000
```

**Note**: The status bar's cost calculation uses different logic and time ranges from the `/cost` command, ensuring accuracy for their respective scenarios.

## 🛠️ Advanced Configuration

### Intelligent Configuration Management System

#### 📂 Configuration File Hierarchy

The status bar uses a two-level configuration system for flexible configuration management:

**Project-level Configuration** (Priority: High)
- Path: `~/.claude/projects/{project-hash}/statusline-pro/config.toml`
- Application: Personalized configuration for specific projects
- Initialization: `npx claude-code-statusline-pro-aicodeditor@latest config --init`

**User-level Configuration** (Priority: Low)
- Path: `~/.claude/statusline-pro/config.toml`
- Application: Global default configuration for all projects
- Initialization: `npx claude-code-statusline-pro-aicodeditor@latest config --init -g`

#### ⚡ Smart Terminal Detection and Configuration Initialization

When running initialization commands, the system automatically detects your terminal capabilities:

```bash
# Initialize project-level configuration (recommended)
npx claude-code-statusline-pro-aicodeditor@latest config --init

# Initialize global configuration
npx claude-code-statusline-pro-aicodeditor@latest config --init -g

# Force re-initialization (overwrite existing configuration)
npx claude-code-statusline-pro-aicodeditor@latest config --init --force
```

**Smart Detection Features:**
- 🎨 **Nerd Font Detection**: Automatically identifies if terminal supports Nerd Font icons
- 😊 **Emoji Support Detection**: Detects terminal's emoji rendering capability
- 🌈 **Color Support Detection**: Identifies terminal's color display capability
- 🎯 **Automatic Theme Selection**: Automatically selects the best theme based on terminal capabilities

#### 📝 Configuration File Details

After system initialization, a complete `config.toml` configuration file will be generated:

```toml
# Default preset and theme
preset = "PMBTUS"
theme = "powerline"

# Theme feature configuration
[themes.powerline]
enable_gradient = true
ignore_separator = true
fine_progress = true

# Component order configuration
[components]
order = ["project", "model", "branch", "tokens", "usage", "status"]

# Token component detailed configuration
[components.tokens]
show_gradient = true         # Enable colored gradient progress bar
show_progress_bar = true     # Show progress bar
show_percentage = true       # Show percentage
progress_width = 15          # Progress bar width

# Token threshold configuration
[components.tokens.thresholds]
warning = 60    # 60% shows yellow warning
danger = 85     # 85% shows red danger
backup = 85     # Backup area starts
critical = 95   # 95% shows 🔥 critical

# Terminal compatibility configuration
[terminal]
force_nerd_font = false     # Force enable Nerd Font
force_emoji = false         # Force enable Emoji
force_text = false          # Force text mode
```

## 🖥️ Terminal Compatibility

Smart detection and automatic adaptation for different terminal environments:

- **Windows Terminal** ✅ Full support for all features
- **VS Code Terminal** ✅ Full support for all features
- **iTerm2 (macOS)** ✅ Full support for all features
- **Git Bash** ✅ Full support for all features
- **PowerShell** ✅ Full support for all features
- **CMD** ⚠️ Automatic fallback to safe text mode

## 🔧 Troubleshooting

### Version Compatibility Issues

**Q: Status bar not displaying or showing errors**
```bash
# Error example: status line command failed: npx claude-code-statusline-pro-aicodeditor@latest
# Solution: Upgrade Claude Code to the latest version
npm install -g @anthropic-ai/claude-code@latest
```

**Q: "command not found: npx" or Node.js related errors**
```bash
# Error example: /bin/sh: npx: command not found
# Solution: Install or update Node.js environment
# Visit official website for latest version: https://nodejs.org/
# Or use package managers:

# macOS (using Homebrew)
brew install node

# Ubuntu/Debian
sudo apt update && sudo apt install nodejs npm

# Windows
# Please visit https://nodejs.org/ to download installer
```

**Q: Compatibility issues due to outdated Claude Code version**
```bash
# Check Claude Code version
claude --version

# If version is below 1.0.71, please update
npm install -g @anthropic-ai/claude-code@latest

# Restart terminal and reopen Claude Code after update
```

### Display Issues

**Q: Icons display as squares or garbled text**
```bash
# Check if terminal supports Nerd Font, force use Emoji mode
npx claude-code-statusline-pro-aicodeditor@latest --force-emoji
```

**Q: Color display issues**
```bash
# Check terminal color support, can disable colors
npx claude-code-statusline-pro-aicodeditor@latest --no-color
```

**Q: Status bar not updating**
```bash
# Check if Claude Code configuration file is correct
cat ~/.claude/settings.json
```

### Test Commands

```bash
# Test basic functionality
echo '{"model":{"id":"claude-sonnet-4"}}' | npx claude-code-statusline-pro-aicodeditor@latest

# Test specific preset and theme
echo '{"model":{"id":"claude-sonnet-4"}}' | npx claude-code-statusline-pro-aicodeditor@latest --preset MT --theme classic
```

---

## 🙏 致谢 | Acknowledgments

本项目基于 [@wangnov](https://github.com/wangnov) 的优秀项目 [claude-code-statusline-pro](https://github.com/wangnov/claude-code-statusline-pro) 进行修改和增强。

This project is based on and enhanced from the excellent work of [@wangnov](https://github.com/wangnov)'s [claude-code-statusline-pro](https://github.com/wangnov/claude-code-statusline-pro).

### 主要修改 | Main Modifications

- 添加 Claude Sonnet 4.5 (20250929) 模型支持（200k 和 1m 版本）
- 更新默认模型配置
- 个性化配置优化
- 持续跟进最新 Claude 模型

### 许可证 | License

本项目遵循 MIT 许可证，与原项目保持一致。

This project follows the MIT License, consistent with the original project.

---

## 📞 联系方式 | Contact

- **原项目 Original Project**: [claude-code-statusline-pro](https://github.com/wangnov/claude-code-statusline-pro)
- **本分支 This Fork**: [claude-code-statusline-pro-aicodeditor](https://github.com/horizonwing/claude-code-statusline-pro-aicodeditor)
- **问题反馈 Issues**: [GitHub Issues](https://github.com/horizonwing/claude-code-statusline-pro-aicodeditor/issues)

如果你喜欢这个项目，请给原作者 [@wangnov](https://github.com/wangnov) 和本项目一个 ⭐️ Star！

If you like this project, please give both the original author [@wangnov](https://github.com/wangnov) and this project a ⭐️ Star!
```