// Recover editable Markdown from an existing Hexo Atom feed.
// Usage: node tools/migrate-legacy.cjs path/to/atom.xml
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const Turndown = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const feedPath = process.argv[2];
if (!feedPath) throw new Error('Pass the legacy atom.xml path.');
const $feed = cheerio.load(fs.readFileSync(feedPath, 'utf8'), { xmlMode: true });
const converter = new Turndown({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
converter.use(gfm);
converter.addRule('hexoCode', {
  filter: node => node.nodeName === 'FIGURE' && node.classList.contains('highlight'),
  replacement: (_, node) => {
    const $ = cheerio.load(node.outerHTML);
    const code = $('td.code pre');
    code.find('br').replaceWith('\n');
    const language = (node.getAttribute('class') || '').split(/\s+/).find(x => x !== 'highlight') || '';
    const text = code.text().replace(/\n+$/, '');
    const fence = '`'.repeat(Math.max(3, ...Array.from(text.matchAll(/`+/g), match => match[0].length + 1)));
    return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
  },
});
const posts = [];
$feed('entry').each((_, element) => {
  const entry = $feed(element);
  const oldUrl = entry.children('link').attr('href');
  const permalink = decodeURI(new URL(oldUrl).pathname).replace(/^\//, '');
  const $html = cheerio.load(entry.children('content').text(), { decodeEntities: true });
  $html('a.headerlink').remove();
  $html('a[href], img[src]').each((_, node) => {
    const attribute = node.name === 'img' ? 'src' : 'href';
    const value = $html(node).attr(attribute);
    if (/^https?:\/\/blog\.imaeternal\.cn\//.test(value)) {
      $html(node).attr(attribute, new URL(value).pathname + new URL(value).hash);
    }
  });
  const categories = [], tags = [];
  entry.children('category').each((_, node) => {
    const type = ($feed(node).attr('scheme') || '').includes('/categories/') ? categories : tags;
    type.push($feed(node).attr('term'));
  });
  const metadata = { title: entry.children('title').text(),
    date: entry.children('published').text(), updated: entry.children('updated').text(),
    permalink, categories, tags, comments: false };
  const slug = permalink.split('/').filter(Boolean).pop();
  const filename = path.join('source', '_posts', `${metadata.date.slice(0, 10)}-${slug}.md`);
  if (fs.existsSync(filename)) throw new Error(`Refusing to overwrite ${filename}`);
  const markdown = converter.turndown($html.html());
  fs.writeFileSync(filename, `---\n${yaml.dump(metadata, { lineWidth: -1 })}---\n\n${markdown}\n`);
  posts.push({ title: metadata.title, permalink, source: filename, codeBlocks: $html('figure.highlight').length,
    images: $html('img').length });
});
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/legacy-migration.json', JSON.stringify(posts, null, 2) + '\n');
console.log(`Recovered ${posts.length} posts; original URLs retained.`);
