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
IzakayaI18n.setLang('zh');
assert.strictEqual(IzakayaI18n.t('nav_order'), '点菜');
IzakayaI18n.setLang('en');
assert.strictEqual(IzakayaI18n.t('nav_order'), 'Order');

console.log('izakaya i18n tests passed');
