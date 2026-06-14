const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
assert.match(index, /<meta name="description"/);
assert.match(index, /<meta property="og:title"/);
assert.match(index, /<meta property="og:description"/);
assert.match(index, /<link rel="canonical" href="https:\/\/xuebin007\.github\.io\/irakutech\/"/);

const robots = read('robots.txt');
assert.match(robots, /Sitemap: https:\/\/xuebin007\.github\.io\/irakutech\/sitemap\.xml/);

const sitemap = read('sitemap.xml');
[
  'https://xuebin007.github.io/irakutech/',
  'https://xuebin007.github.io/irakutech/order/',
  'https://xuebin007.github.io/irakutech/takeout/',
  'https://xuebin007.github.io/irakutech/kitchen/',
  'https://xuebin007.github.io/irakutech/checkout/',
  'https://xuebin007.github.io/irakutech/admin/',
  'https://xuebin007.github.io/irakutech/privacy.html',
  'https://xuebin007.github.io/irakutech/legal.html',
  'https://xuebin007.github.io/irakutech/terms.html'
].forEach((url) => assert.ok(sitemap.includes(`<loc>${url}</loc>`), url));

const notFound = read('404.html');
assert.match(notFound, /居楽テック/);
assert.match(notFound, /デモ一覧/);

assert.match(index, /href="privacy\.html"/);
assert.match(index, /href="legal\.html"/);
assert.match(index, /href="terms\.html"/);
assert.match(index, /href="order\/\?table=3"/);
assert.match(index, /href="takeout\/"/);
assert.match(index, /href="kitchen\/"/);
assert.match(index, /href="checkout\/"/);
assert.match(index, /href="admin\/"/);

const privacy = read('privacy.html');
const legal = read('legal.html');
const terms = read('terms.html');
assert.match(privacy, /プライバシーポリシー/);
assert.match(legal, /特定商取引法に基づく表記/);
assert.match(terms, /利用規約/);

[
  'order/index.html',
  'takeout/index.html',
  'kitchen/index.html',
  'checkout/index.html',
  'admin/index.html'
].forEach((file) => {
  const page = read(file);
  assert.match(page, /class="demo-notice"/, file);
  assert.match(page, /data-i18n="demo_notice"/, file);
  assert.match(page, /assets\/izakaya-config\.js\?v=20260613-timeout/, file);
  assert.match(page, /assets\/izakaya-cloud\.js\?v=20260613-timeout/, file);
});
assert.match(read('admin/index.html'), /data-audit-log/);
assert.match(read('admin/index.html'), /data-manager-alerts/);
assert.match(read('admin/index.html'), /data-coverage-alerts/);
assert.match(read('order/index.html'), /data-seat-panel/);
assert.match(read('order/index.html'), /data-start-table/);
assert.match(read('order/index.html'), /data-request-checkout/);
assert.match(read('order/index.html'), /data-order-progress/);
assert.match(read('order/index.html'), /data-checkout-complete/);

const checklist = read('docs/public-launch-checklist.md');
assert.match(checklist, /公開前チェックリスト/);
assert.match(checklist, /GitHub Pages/);
assert.match(checklist, /デモ版の注意/);

console.log('site public readiness tests passed');
