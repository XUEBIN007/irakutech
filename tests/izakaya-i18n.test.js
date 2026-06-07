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
assert.strictEqual(IzakayaI18n.t('add_items_first'), '先にメニューを追加してください');
assert.strictEqual(IzakayaI18n.t('order_submitting'), '送信中...');
assert.strictEqual(IzakayaI18n.t('inventory_title'), '在庫管理');
assert.strictEqual(IzakayaI18n.t('daily_report'), '営業日報');
assert.strictEqual(IzakayaI18n.t('staff_timeclock'), 'スタッフ打刻');
assert.strictEqual(IzakayaI18n.t('inventory_movements'), '在庫履歴');
assert.strictEqual(IzakayaI18n.t('restock'), '入庫');
assert.strictEqual(IzakayaI18n.t('waste'), 'ロス');
assert.strictEqual(IzakayaI18n.t('staff_schedule'), 'シフト');
assert.strictEqual(IzakayaI18n.t('late'), '遅刻');
assert.strictEqual(IzakayaI18n.t('estimated_wage'), '概算人件費');
assert.strictEqual(IzakayaI18n.t('daily_close'), '日締め');
assert.strictEqual(IzakayaI18n.t('cash_difference'), '現金差額');
assert.strictEqual(IzakayaI18n.t('table_operations'), 'テーブル操作');
assert.strictEqual(IzakayaI18n.t('transfer_table'), '席移動');
assert.strictEqual(IzakayaI18n.t('merge_table'), 'テーブル結合');
assert.strictEqual(IzakayaI18n.t('customer_management'), '顧客管理');
assert.strictEqual(IzakayaI18n.t('customer_note'), '顧客メモ');
assert.strictEqual(IzakayaI18n.t('checkout_no_due'), '現在、会計できる未会計注文がありません。金額のあるテーブル、または店外注文を選択してください。');
IzakayaI18n.setLang('zh');
assert.strictEqual(IzakayaI18n.t('nav_order'), '点菜');
assert.strictEqual(IzakayaI18n.t('takeout_confirm_title'), '订单已提交');
assert.strictEqual(IzakayaI18n.t('add_items_first'), '请先添加菜品');
assert.strictEqual(IzakayaI18n.t('order_submitting'), '提交中...');
assert.strictEqual(IzakayaI18n.t('inventory_title'), '库存管理');
assert.strictEqual(IzakayaI18n.t('daily_report'), '营业日报');
assert.strictEqual(IzakayaI18n.t('staff_timeclock'), '员工打卡');
assert.strictEqual(IzakayaI18n.t('inventory_movements'), '库存流水');
assert.strictEqual(IzakayaI18n.t('restock'), '入库');
assert.strictEqual(IzakayaI18n.t('waste'), '损耗');
assert.strictEqual(IzakayaI18n.t('staff_schedule'), '排班');
assert.strictEqual(IzakayaI18n.t('late'), '迟到');
assert.strictEqual(IzakayaI18n.t('estimated_wage'), '预估人工费');
assert.strictEqual(IzakayaI18n.t('daily_close'), '日结');
assert.strictEqual(IzakayaI18n.t('cash_difference'), '现金差额');
assert.strictEqual(IzakayaI18n.t('table_operations'), '桌台操作');
assert.strictEqual(IzakayaI18n.t('transfer_table'), '换桌');
assert.strictEqual(IzakayaI18n.t('merge_table'), '并桌');
assert.strictEqual(IzakayaI18n.t('customer_management'), '客户管理');
assert.strictEqual(IzakayaI18n.t('customer_note'), '客户备注');
assert.strictEqual(IzakayaI18n.t('checkout_no_due'), '当前没有可结账的未结账订单。请选择左侧带金额的桌台，或选择店外订单。');
IzakayaI18n.setLang('en');
assert.strictEqual(IzakayaI18n.t('nav_order'), 'Order');
assert.strictEqual(IzakayaI18n.t('takeout_confirm_title'), 'Order received');
assert.strictEqual(IzakayaI18n.t('add_items_first'), 'Add menu items first');
assert.strictEqual(IzakayaI18n.t('order_submitting'), 'Sending...');
assert.strictEqual(IzakayaI18n.t('inventory_title'), 'Inventory');
assert.strictEqual(IzakayaI18n.t('daily_report'), 'Daily Report');
assert.strictEqual(IzakayaI18n.t('staff_timeclock'), 'Staff Clock');
assert.strictEqual(IzakayaI18n.t('inventory_movements'), 'Inventory Log');
assert.strictEqual(IzakayaI18n.t('restock'), 'Restock');
assert.strictEqual(IzakayaI18n.t('waste'), 'Waste');
assert.strictEqual(IzakayaI18n.t('staff_schedule'), 'Schedule');
assert.strictEqual(IzakayaI18n.t('late'), 'Late');
assert.strictEqual(IzakayaI18n.t('estimated_wage'), 'Estimated Labor');
assert.strictEqual(IzakayaI18n.t('daily_close'), 'Daily Close');
assert.strictEqual(IzakayaI18n.t('cash_difference'), 'Cash Difference');
assert.strictEqual(IzakayaI18n.t('table_operations'), 'Table Ops');
assert.strictEqual(IzakayaI18n.t('transfer_table'), 'Move Table');
assert.strictEqual(IzakayaI18n.t('merge_table'), 'Merge Tables');
assert.strictEqual(IzakayaI18n.t('customer_management'), 'Customers');
assert.strictEqual(IzakayaI18n.t('customer_note'), 'Customer Note');
assert.strictEqual(IzakayaI18n.t('checkout_no_due'), 'There is no unpaid order ready for checkout. Select a table with an amount, or choose an outside order.');

console.log('izakaya i18n tests passed');
