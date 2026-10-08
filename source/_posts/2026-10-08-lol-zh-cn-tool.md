---
title: LoL 简体中文配置工具：配置修改、备份与持续保护
description: 介绍我的 LoL 简体中文配置工具，说明普通 GUI、命令行与持续保护版的区别，以及配置备份、恢复和使用边界。
categories:
  - 开源项目
tags:
  - CSharp
  - Windows
  - LoL
  - 桌面工具
cover: /assets/projects/lol-zh-cn-tool.svg
comments: false
abbrlink: d701a6ae
date: 2026-10-08 21:12:00
updated: 2026-10-08 21:12:00
---

[lol-zh-cn-tool](https://github.com/xiegaoxiao/lol-zh-cn-tool) 是我的一个 Windows 开源工具，用于把 League of Legends 和 Riot 的指定语言配置设置为 `zh_CN`。

它提供普通图形界面、命令行和持续检测保护版。三种入口共享配置处理能力，但使用场景和行为有所不同。

<!-- more -->

## 先选合适的入口

当前 [v1.0.0 发布包](https://github.com/xiegaoxiao/lol-zh-cn-tool/releases/tag/v1.0.0) 包含以下程序：

| 程序 | 主要用途 |
| --- | --- |
| `LoL-ZhCN-GUI.exe` | 普通图形界面，按需修改和恢复配置 |
| `LoL语言工具-cli.exe` | 通过命令行查询、应用或恢复配置 |
| `LoL-ZhCN-Guard.exe` | 后台持续检测并保护单个产品配置 |

如果只是修改一次语言配置，可以从普通 GUI 开始；需要持续处理配置被改回的情况时，再考虑保护版。项目要求 Windows 10/11 与 .NET Framework 4.x，说明见 [README](https://github.com/xiegaoxiao/lol-zh-cn-tool/blob/b2e6d5b5477629a05b11035306b702ea84c4e8ce/README.md)。

## 普通版修改哪些内容

普通版可以分别选择产品配置、游戏安装目录中的配置和 Riot 启动器配置。它针对指定的语言字段进行修改，保留其他设置、编码、换行和注释。

应用前会结束 Riot 客户端及其子进程；检测到对局进程时会拒绝操作。字段数量不符合预期时停止，多文件应用失败时会尝试回滚本次修改。这些处理集中在项目的 [配置引擎](https://github.com/xiegaoxiao/lol-zh-cn-tool/blob/b2e6d5b5477629a05b11035306b702ea84c4e8ce/src/LocaleEngine.cs) 中。

命令行入口适合明确知道自己要操作哪些配置的场景：

```powershell
# 查询当前状态
.\LoL语言工具-cli.exe --status

# 应用简体中文，并同步游戏和 Riot 启动器配置
.\LoL语言工具-cli.exe --apply --sync --riot

# 恢复对应备份
.\LoL语言工具-cli.exe --restore --sync --riot
```

省略 `--sync` 和 `--riot` 时，只操作产品配置。普通版默认不持续锁定文件。

## 保护版如何工作

保护版只针对下面这个产品配置：

```text
C:\ProgramData\Riot Games\Metadata\league_of_legends.live\league_of_legends.live.product_settings.yaml
```

开启后，它持续检查目标文件、语言字段和文件标识，必要时修复语言并重新加锁。目标文件丢失时，只有存在有效恢复快照，才能重建该 YAML；它不会凭空编造配置，也不会重建其他 Riot 元数据文件。实现入口见 [ProductGuard.cs](https://github.com/xiegaoxiao/lol-zh-cn-tool/blob/b2e6d5b5477629a05b11035306b702ea84c4e8ce/src/ProductGuard.cs)。

关闭控制窗口后，保护仍可在后台运行；结束后台进程或重启电脑后，需要重新开启。

文件保护可能影响 Riot 保存配置、启动或更新。遇到这些情况，先点击“停止保护”。写入 `zh_CN` 也不代表客户端一定具备对应语言资源；工具不修改游戏程序、Vanguard 或 NTFS 权限。

## 把恢复路径一起留下

每份被修改的配置旁，会保留 `.lol-zh-cn.bak` 和 `.lol-zh-cn.bak.meta`，分别承载原始备份和校验、属性信息。这两个文件需要一起保留，重复应用不会覆盖首次备份。

保护版运行期间，应先停止保护，再执行恢复。普通版恢复时若途中失败，已经恢复的文件会保持恢复状态，日志报告未完成的部分。备份与恢复行为见 [项目说明](https://github.com/xiegaoxiao/lol-zh-cn-tool/blob/b2e6d5b5477629a05b11035306b702ea84c4e8ce/README.md#备份与恢复)。

## 源码与构建

源码使用 C#，构建脚本调用 Windows 的 .NET Framework 编译器，不需要 NuGet 依赖。在仓库根目录执行：

```powershell
.\build-guard.ps1 -OutputName 'LoL-ZhCN-Guard.exe'
.\build.ps1 -GuiName 'LoL-ZhCN-GUI.exe'
.\test.ps1
```

项目测试针对临时文件覆盖字段处理、备份校验、属性恢复、回滚和保护行为；这些测试与 Riot 实际启动兼容性验证是不同的检查范围。

项目采用 [MIT 许可证](https://github.com/xiegaoxiao/lol-zh-cn-tool/blob/b2e6d5b5477629a05b11035306b702ea84c4e8ce/LICENSE)，与 Riot Games 无隶属关系。[查看源码](https://github.com/xiegaoxiao/lol-zh-cn-tool) 或 [提交问题](https://github.com/xiegaoxiao/lol-zh-cn-tool/issues)。
