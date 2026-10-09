# EdgeOne Makers 部署

项目是 Hexo + Fomalhaut 静态博客。EdgeOne 配置在根目录 `edgeone.json`。

## 导入项目

1. 登录 https://edgeone.ai/pages/ ，开通免费版服务，选择导入 Git 仓库。
2. 连接 GitHub，授权此仓库：`xiegaoxiao/xiegaoxiao.github.io`。
3. 选择源码分支 `hexo-source`，项目根目录保持仓库根目录。
4. 项目名可填 `ethan-xie-blog`。框架选择 Hexo；没有 Hexo 选项则选 Other。
5. 无 ICP 备案时，加速区域选择 **全球可用区（不含中国大陆）**。
6. 配置如下，然后部署：

| 设置 | 值 |
| --- | --- |
| 安装命令 | `npm ci --include=dev --no-audit --no-fund` |
| 构建命令 | `npm run build` |
| 输出目录 | `public` |
| Node.js | `22.11.0` |

`edgeone.json` 会覆盖平台上的对应构建设置。不要导入 `main` 或 `master` 当源码分支。

当前 AI 助手和 Twikoo 后端未启用，初次部署不需要 API 密钥。仓库中的 `api/` 和
`functions/` 是其他平台的函数实现；EdgeOne 需要 `edge-functions/`，重新启用 AI 助手时
要另行适配，不能直接假定现有函数已在 EdgeOne 上运行。

## 绑定免费子域名

技术类个人博客可申请 https://docs.is-a.dev/quickstart/ 中的免费子域名。
域名名字、审批和服务限制以服务商为准；域名未通过审核前不要视为已取得。

1. 在 EdgeOne 的项目域名设置添加准备申请的 `你的名字.is-a.dev`。
2. 记录平台分配的 CNAME 值，以及平台要求的其他验证记录。
3. 按 is-a.dev 文档在注册仓库提交域名申请，填写 GitHub 用户名与对应的 DNS 记录。
   按服务商的 PR 模板填写，并提供博客预览地址和截图。
4. 审核通过、DNS 生效后，返回 EdgeOne 检查域名验证与 HTTPS 证书状态。
5. 在 EdgeOne 项目环境变量中设置 `SITE_URL=https://你的名字.is-a.dev`，然后重新部署。
   该变量会更新 canonical、站点地图、RSS 和 robots.txt 中的站点地址。

不要使用项目默认域名作为国内长期公开入口。按平台域名规则，默认域名有访问限制；
没有备案时，绑定自定义域名并使用境外加速区域。境外节点的国内可达性仍需实际测试。

## 验证

关闭代理，用国内手机流量和宽带分别检查首页、文章、图片、站内搜索，以及：

- `/sitemap.xml`、`/robots.txt`、`/atom.xml` 的地址使用新域名。
- 原有 `/posts/xxx.html` 路径保持有效。
- HTTPS 正常；不存在把访客重定向回 GitHub Pages 的配置。

GitHub Pages 会继续按原有流程发布。后续推送 `hexo-source` 分支可同时触发 EdgeOne 的
Git 自动部署；GitHub Pages 没有 `SITE_URL` 时仍使用原地址。

官方文档：

- https://pages.edgeone.ai/zh/document/edgeone-json
- https://pages.edgeone.ai/zh/document/faqs
- https://edgeone.ai/document/175201428435140608
