const assert = require('assert');

globalThis.window = globalThis;
globalThis.localStorage = {
  data: {},
  getItem(key) { return this.data[key] || null; },
  setItem(key, value) { this.data[key] = String(value); }
};

require('../assets/izakaya-i18n.js');

assert.strictEqual(IzakayaI18n.getLang(), 'ja');
assert.strictEqual(IzakayaI18n.t('nav_order'), '注文');
assert.strictEqual(IzakayaI18n.t('takeout_confirm_title'), 'ご注文を受け付けました');
IzakayaI18n.setLang('zh');
assert.strictEqual(IzakayaI18n.t('nav_order'), '点菜');
assert.strictEqual(IzakayaI18n.t('takeout_confirm_title'), '订单已提交');
IzakayaI18n.setLang('en');
assert.strictEqual(IzakayaI18n.t('nav_order'), 'Order');
assert.strictEqual(IzakayaI18n.t('takeout_confirm_title'), 'Order received');

console.log('izakaya i18n tests passed');
