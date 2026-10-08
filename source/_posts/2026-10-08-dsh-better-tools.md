---
title: dsh-better-tools：让 DSH 中的 Shell 选择更顺手
description: 介绍我的 DSH 插件：侧边栏 Shell 偏好、全局 Git Bash 工具与终端卡片，并说明它和 cordis-gitbash 预设的关系。
categories:
  - 开源项目
tags:
  - TypeScript
  - DSH
  - GitBash
  - 插件开发
cover: /assets/projects/dsh-better-tools.svg
comments: false
abbrlink: eeb37eda
date: 2026-10-08 21:11:00
updated: 2026-10-08 21:11:00
---

在 Windows 上使用编码 Agent 时，命令最终交给哪个 Shell 执行，会直接影响路径、引号和脚本的写法。

我的 [dsh-better-tools](https://github.com/xiegaoxiao/dsh-better-tools) 插件给 DeepSeek Harness（DSH）增加一个 Shell 偏好入口，并注册真正调用 Git Bash 的工具。这样，偏好设置和实际执行工具可以一起使用。

<!-- more -->

## 一个入口，三个选项

插件在侧边栏提供设置按钮，可以选择关闭偏好、优先 Git Bash 或优先 PowerShell。

设置保存在 `better-tools.shell` 中。Host 端在组装系统提示时读取当前设置，因此修改后会影响下一步模型调用；偏好本身是对 Agent 的指引，具体任务仍可能需要另一种 Shell。

对应实现见 [Host 入口](https://github.com/xiegaoxiao/dsh-better-tools/blob/4094142ad0dc576c59697d32f06834c150a48460/src/index.ts)，界面入口见 [Client 代码](https://github.com/xiegaoxiao/dsh-better-tools/tree/4094142ad0dc576c59697d32f06834c150a48460/src/client)。

## 为什么还要提供执行工具

提示 Agent“优先 Git Bash”，还需要环境里有一个可以实际执行命令的 Git Bash 工具。

插件注册全局 `gitbash` 工具，通过宿主的子进程能力启动 Git Bash，并返回标准输出、错误输出、退出码和超时信息。调用与结果使用终端卡片展示，便于查看命令、工作目录和执行结果。

这个工具面向 Windows 的真实 Git Bash 环境。它以普通子进程方式执行，并不受 DSH 文件沙箱约束；部署和使用时应明确这一执行边界。相关实现与当前限制见 [README](https://github.com/xiegaoxiao/dsh-better-tools/blob/4094142ad0dc576c59697d32f06834c150a48460/README.md)。

## 插件与预设有什么关系

这里有两个可以分开理解的项目：

| 项目 | 提供的能力 |
| --- | --- |
| `dsh-better-tools` | 侧边栏设置、全局 Shell 偏好和 `gitbash` 工具 |
| `dsh-preset-standard-gitbash` | 基于 cordis 的会话预设、Git Bash 工具和相关技能 |

插件的全局 `gitbash` 工具不依赖安装这个预设。想使用预设携带的技能和模式体验时，可以另行部署，再在新会话中选择 `cordis-gitbash`。预设项目的说明见 [独立仓库](https://github.com/xiegaoxiao/dsh-preset-standard-gitbash)。

## 安装与确认

前置条件是已经有能运行 `dsh web` 的 DSH 环境、Node.js 20 或以上，以及 pnpm。

按照项目安装说明，可以使用：

```sh
dsh plugin --profile web add dsh-better-tools
```

安装后重启 `dsh web`，再硬刷新浏览器，让 Host 与 Client 两端都加载新代码。随后检查侧边栏入口、切换 Shell 偏好，并在会话中观察是否出现对应工具调用。

卸载入口为：

```sh
dsh plugin --profile web remove dsh-better-tools
```

部署步骤、预设安装和故障排查以仓库的 [install.md](https://github.com/xiegaoxiao/dsh-better-tools/blob/4094142ad0dc576c59697d32f06834c150a48460/install.md) 为准，npm 包入口见 [dsh-better-tools](https://www.npmjs.com/package/dsh-better-tools)。

## Host / Client 双端结构

这个项目也可以作为一个插件结构示例来阅读：Host 负责设置、提示段落、工具和 HTTP 路由，Client 负责侧边栏按钮与弹窗。两端通过插件自己的接口交换状态。

当前实现的设置写入路由仍有部署边界需要处理：README 明确指出，实际服务应接入与官方 API 一致的浏览器信任检查。阅读和扩展时，应把这部分与功能代码一起考虑。

源码采用 [MIT 许可证](https://github.com/xiegaoxiao/dsh-better-tools/blob/4094142ad0dc576c59697d32f06834c150a48460/LICENSE)。欢迎到 [GitHub 仓库](https://github.com/xiegaoxiao/dsh-better-tools) 查看实现和反馈问题。
