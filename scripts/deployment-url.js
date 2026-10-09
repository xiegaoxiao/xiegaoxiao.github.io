/* global hexo */
'use strict';

// Set SITE_URL on EdgeOne after binding a domain. Other builds keep _config.yml.
const siteUrl = String(process.env.SITE_URL || '').trim();
if (siteUrl) {
  const parsed = new URL(siteUrl);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password ||
      parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('SITE_URL must be a site origin, for example https://your-name.is-a.dev');
  }
  hexo.config.url = parsed.origin;
  // robots.txt is otherwise copied verbatim with the GitHub Pages sitemap URL.
  hexo.extend.filter.register('after_generate', function () {
    hexo.route.set('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: ' + parsed.origin + '/sitemap.xml\n');
  });
}
