const assert = require('assert');

globalThis.window = globalThis;
globalThis.localStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = String(value); }
};

require('../assets/izakaya-i18n.js');

assert.strictEqual(IzakayaI18n.getLang(), 'ja');
assert.strictEqual(IzakayaI18n.t('brand'), '本町中華 QR注文');
assert.strictEqual(IzakayaI18n.t('nav_order'), '注文');
assert.strictEqual(IzakayaI18n.t('order_eyebrow'), 'Honcho Table Order');
assert.strictEqual(IzakayaI18n.t('checkout_desc'), '公開情報では現金中心です。店頭確認後にカード・QR決済を有効化できます。');
assert.strictEqual(IzakayaI18n.t('action_cancel'), '取消');
assert.strictEqual(IzakayaI18n.t('qr_links'), 'テーブルQRリンク');
assert.strictEqual(IzakayaI18n.t('sales_summary'), '本日の営業サマリー');
IzakayaI18n.setLang('zh');
assert.strictEqual(IzakayaI18n.t('brand'), '本町中华扫码点餐');
assert.strictEqual(IzakayaI18n.t('nav_order'), '点菜');
assert.strictEqual(IzakayaI18n.t('cash_notice'), '公开资料显示本店以现金结账为主，正式导入前请与店铺确认。');
assert.strictEqual(IzakayaI18n.t('action_cancel'), '取消订单');
assert.strictEqual(IzakayaI18n.t('qr_links'), '桌台 QR 链接');
IzakayaI18n.setLang('en');
assert.strictEqual(IzakayaI18n.t('brand'), 'Honcho Chinese QR Order');
assert.strictEqual(IzakayaI18n.t('nav_order'), 'Order');
assert.strictEqual(IzakayaI18n.t('course_note'), 'For 4+ guests, last order 15 minutes before finish.');
assert.strictEqual(IzakayaI18n.t('sales_summary'), "Today's Sales Summary");

console.log('izakaya i18n tests passed');
