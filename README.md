# ethan_xie 的博客

个人博客：[https://xiegaoxiao.github.io/](https://xiegaoxiao.github.io/)

基于 Hexo + [Fomalhaut](https://github.com/fomalhaut1998/hexo-theme-fomalhaut)，由 GitHub Actions 自动部署到 GitHub Pages。

```powershell
npm ci
npm run server
npm run new -- "文章标题"
npm run build
git add .
git commit -m "更新博客"
git push origin hexo-source
```

- [博客使用指南](docs/博客使用指南.md)
- [主题配置说明](docs/Fomalhaut主题说明.md)
- [旧文章迁移清单](docs/legacy-migration.json)
- [EdgeOne Makers 部署指南](docs/EdgeOne部署指南.md)

源码分支为 `hexo-source`。原 `main`、`master` 分支保留；15 篇旧文章的 URL 保持不变。

主题代码遵循附带的 Apache-2.0 许可证。
