---
title: 追番通知工具：用 GitHub Actions 发送微信提醒
description: 介绍我的 Python 追番提醒项目 zhuifan：配置时间表、GitHub Secrets、微信通知，以及半小时调度和无状态方案的取舍。
categories:
  - 开源项目
tags:
  - Python
  - GitHubActions
  - 自动化
  - 追番
cover: /assets/projects/anime-notifier.svg
comments: false
abbrlink: c1e22c0f
date: 2026-10-08 21:10:00
updated: 2026-10-08 21:10:00
---

如果已经知道想看的番剧通常在星期几、几点更新，可以把这些时间写进配置，让工具在附近的时间发一条微信提醒。

我的 [zhuifan 仓库](https://github.com/xiegaoxiao/zhuifan) 实现了这个小工具，Python 包名为 `anime-notifier`。它通过 GitHub Actions 定时运行，匹配配置的时间表，再调用 Server 酱发送通知。

<!-- more -->

## 时间表就是主要输入

配置文件包含番剧名称、星期和时间。下面是一个自定义示例，名称和播出时间需要按自己的追番列表填写：

```yaml
schedule:
  - name: 示例番剧
    weekday: 3
    air_time: "20:00"

wechat:
  send_key: "${WECHAT_SEND_KEY}"
  timezone: "Asia/Shanghai"
```

`weekday` 使用 1 到 7 表示周一到周日，`air_time` 使用 `HH:MM` 格式。当前命令入口按北京时间匹配这些条目。字段示例见 [config.example.yaml](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/config.example.yaml)。

工具根据时间表提醒，不会抓取视频资源，也不会查询平台是否已经实际发布新一集。收到通知后，可以去对应官方平台查看。

## 当前调度方式

阅读 README 时，容易把“配置时间精确到分钟”理解成“消息一定在那个分钟送达”。当前代码的行为需要更具体地说明。

[工作流](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/.github/workflows/notifier.yml) 每 30 分钟触发一次；[调度器](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/anime_notifier/scheduler.py) 则把当前时间落在目标时间前后 30 分钟内的条目视为匹配。

例如，上面的 `20:00` 配置，在同一个星期三的 `19:30`、`20:00`、`20:30` 都可能命中。工作流实际开始时间还受 Actions 调度影响，因此它是带容错的时间提醒，没有准点送达保证。

当前方案不保存已发送状态，相邻运行也可能重复通知。这让流程比较简单，但使用前需要接受这个取舍。

## 部署步骤

1. 将仓库复制到自己的 GitHub 账号。
2. 在 Server 酱获取自己的 SendKey。
3. 在仓库的 Actions Secrets 中添加 `WECHAT_SEND_KEY`。
4. 参照示例创建或修改 `config.yaml`，填写追番时间表。
5. 提交配置，并确认仓库的 Actions 工作流已启用。

SendKey 存放在 Secret 中，配置文件保留环境变量占位符。工作流使用 `contents: read`，不需要为了记录发送状态额外申请仓库写权限。配置与部署说明见 [项目 README](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/README.md)。

当前调度覆盖每天的半小时时间点。新增番剧时，通常只需修改配置；无需为每一个新 `air_time` 单独增加 cron 表达式。

## 先验证，再推送

项目声明 Python 3.12 或以上。准备好配置后，可以在仓库根目录执行：

```sh
pip install -r requirements.txt
pip install -e ".[dev]"

# 只输出当前匹配的提醒，不发送消息
python -m anime_notifier --dry-run

# 运行项目测试
python -m pytest -v
```

`--dry-run` 仍按当前时间匹配；如果时间窗口里没有条目，输出没有提醒是正常结果。手动运行工作流也遵循同一匹配逻辑，不会无条件发送全部追番列表，具体入口见 [__main__.py](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/anime_notifier/__main__.py)。

## 阅读源码的顺序

可以依次查看配置加载、时间匹配、通知发送和命令入口。每层职责都比较集中，适合用来了解一个小型定时任务如何从配置走到外部通知。

项目采用 [Apache-2.0 许可证](https://github.com/xiegaoxiao/zhuifan/blob/4f9e49c703fb93db75044587db3bc0163e1e711b/LICENSE)。[查看仓库](https://github.com/xiegaoxiao/zhuifan) 或 [提交问题](https://github.com/xiegaoxiao/zhuifan/issues)。
