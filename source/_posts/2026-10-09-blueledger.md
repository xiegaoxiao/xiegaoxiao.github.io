---
title: 蓝记 BlueLedger：用 Kotlin 和 Compose 做一个离线记账应用
description: 介绍我的 Android 开源记账应用蓝记：日常收支、图表、预算与本地备份，以及整数分金额、Room 数据库和 1.2.0 源码中的高级功能。
categories:
  - 开源项目
tags:
  - BlueLedger
  - Android
  - Kotlin
  - Jetpack Compose
  - 记账工具
cover: /assets/projects/blueledger.svg
comments: false
abbrlink: ab131b86
date: 2026-10-09 14:23:00
updated: 2026-10-09 14:23:00
---

日常记账可以从很小的动作开始：记下一顿饭的支出，给一笔收入选择账户，再看看这个月的钱花在了哪里。记录积累之后，分类、预算和备份就变得同样重要。

我的新开源项目 [蓝记 BlueLedger](https://github.com/xiegaoxiao/BlueLedger) 把这些流程放进一个 Android 应用里。它使用 Kotlin、Jetpack Compose 和 Room，采用蓝色主题，账本保存在本机，无广告、无会员功能，支持 Android 8.0 及以上。

<!-- more -->

## 先分清源码与安装包版本

截至 2026 年 10 月 9 日，仓库中的源码已经更新到 **1.2.0**，GitHub Release 上最新的已发布 APK 是 **1.1.3**。本文的功能与技术介绍以 [1.2.0 源码说明](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/README.md) 为准，下载现成安装包时，请同时阅读对应版本的发布说明。

| 版本 | 获取方式 | 本文对应内容 |
| --- | --- | --- |
| 1.1.3 | [下载已发布 APK](https://github.com/xiegaoxiao/BlueLedger/releases/tag/v1.1.3) | 可直接安装的离线记账工具，含完整 JSON 备份、恢复与 CSV 导出 |
| 1.2.0 | [阅读当前源码](https://github.com/xiegaoxiao/BlueLedger/tree/33cb37bc685d0c0816c091a3fbe901b221718aca) 并自行构建 | 本文的界面预览，以及分类预算、标签、周期记账等高级功能 |

## 一笔账单怎样记下来

蓝记支持收入和支出两类账单。录入时可以选择分类、账户和日期，填写备注，并用带加减功能的金额键盘完成输入。日期选择采用数字滚轮，方便补记前几天的消费。

例如，一笔午餐支出可以选择餐饮分类和付款账户，再填入金额；回到明细页后，就能按天查看记录。账单支持编辑、删除与撤销，也可以隐藏页面上的金额。

分类可以新增、编辑、归档和排序。除了长按手柄拖动，也有上移、下移菜单，分类较多时可以跨屏调整顺序。默认记账类型、账户和图表周期则能在设置里预先选择，减少每次录入时的重复操作。

下面是仓库提供的 **1.2.0 首页预览**。截图由 Robolectric 使用虚构账本生成，仅用于展示界面。

<img src="https://raw.githubusercontent.com/xiegaoxiao/BlueLedger/33cb37bc685d0c0816c091a3fbe901b221718aca/docs/images/home-1.2.0.png" alt="蓝记 1.2.0 首页预览，使用虚构账本" width="320" loading="lazy">

## 从明细看到图表和预算

记账之后，可以按周、月、年查看图表和分类占比，也可以查看月账单、年账单，并把月报告以图片形式分享。月度预算、资产与负债管理，以及账户余额调整记录，都围绕已有账本组织。

1.2.0 的周图表保留七天日期刻度，并让历史周期切换前后的绘图区保持位置一致。查看连续几周的数据时，更容易对照每天的收支。

<img src="https://raw.githubusercontent.com/xiegaoxiao/BlueLedger/33cb37bc685d0c0816c091a3fbe901b221718aca/docs/images/chart-1.2.0.png" alt="蓝记 1.2.0 周图表预览，完整显示七天日期刻度" width="320" loading="lazy">

## 离线账本，也需要能带走的数据

蓝记的 [Android Manifest](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/app/src/main/AndroidManifest.xml) 没有声明网络权限。提醒通过本地通知实现，启用时再请求通知权限；导入和导出使用 Android 系统文件选择器，不申请存储权限。

账本留在本机，也意味着备份需要自己管理。应用提供完整 JSON 备份和 CSV 导出，可以记住用户选择的保存目录：JSON 用于恢复账本，CSV 便于在表格工具中查看记录。

当前源码的备份格式为 schema 3，同时兼容 schema 1、2。恢复前会解析、校验并展示预览，确认后替换现有账本。准备恢复、换手机或重新安装应用时，应先导出并保存当前账本的完整备份。格式兼容与恢复流程见 [架构说明](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/docs/架构说明.md)。

## 1.2.0 源码里的高级功能

在「我的 → 设置 → 高级功能」中，可以使用分类预算、标签、日历、自定义记账月起始日和回收站。

自定义记账月起始日会改变统计周期，账单的实际发生日期和自然月日历仍然保留。例如，想按每月某一天开始整理一个统计周期时，可以调整这一设置，再对照原始日期查看明细。

周期记账支持按日、周、月、年生成记录，可以暂停规则。它使用本地非精确闹钟，并在启动或返回应用时补记；系统省电限制或强制停止可能延后后台执行。因此，设置周期规则时要核对开始日期与金额，尤其是开始日期在过去、可能触发补记的情况。

从实现上看，生成账单与推进规则日期会在同一事务内完成，规则 ID 与日期组成稳定账单 ID，避免重复触发产生重复记录。相关设计见 [架构说明](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/docs/架构说明.md) 和 [调度代码](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/app/src/main/java/com/blueledger/app/feature/advanced/RecurringScheduler.kt)。

## 金额与数据库的实现

蓝记使用 Jetpack Compose 构建界面，由 Room 保存正式账本。页面通过仓库接口读取和修改数据，金额校验与统计逻辑放在公共模块中，避免不同页面各自处理一套规则。

一个具体的设计是：**金额以整数分保存**。例如，12.50 元对应 1250 分。输入时先将十进制字符串转换为整数分，统计与加减也使用整数运算，最后再格式化为两位小数。这能避免直接用浮点数累计金额时出现精度误差。代码见 [Money.kt](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/app/src/main/java/com/blueledger/app/core/money/Money.kt)。

数据库升级使用显式迁移，仓库保留 Room schema，并包含业务、数据库、备份与 Compose UI 测试。生产应用初始化默认分类、账户和设置，账本从空记录开始；演示数据与正式账本分开。

## 下载或从源码运行

想直接体验已发布版本，可以到 [1.1.3 Release 页面](https://github.com/xiegaoxiao/BlueLedger/releases/tag/v1.1.3) 下载 `blueledger-1.1.3.apk`。发布页同时提供校验文件和许可证。

想研究 1.2.0 的实现，可以克隆仓库，准备 JDK 21 和 Android SDK Platform 37，再使用项目自带的 Gradle Wrapper 构建。Windows 下的基本命令如下：

```powershell
git clone https://github.com/xiegaoxiao/BlueLedger.git
cd BlueLedger
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:testDebugUnitTest
```

Debug APK 输出在 `app/build/outputs/apk/debug/app-debug.apk`。首次构建需要下载工具和依赖；Release 构建及签名配置见 [开源构建说明](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/docs/开源构建说明.md)。自行构建的签名可能与已发布 APK 不同，覆盖安装前请确认签名并备份账本。

项目采用 [Apache-2.0 许可证](https://github.com/xiegaoxiao/BlueLedger/blob/33cb37bc685d0c0816c091a3fbe901b221718aca/LICENSE)。欢迎在 [Issues](https://github.com/xiegaoxiao/BlueLedger/issues) 反馈体验或问题，附上应用版本、Android 版本和复现步骤；分享截图或备份时，请使用虚构账本。
