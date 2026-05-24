(function (root) {
  const KEY = 'irakutech.lang';
  const dict = {
    ja: {
      nav_order: '注文', nav_kitchen: '厨房', nav_checkout: '会計', nav_admin: '管理',
      order_eyebrow: 'Customer Ordering', order_title: 'テーブル {table}', order_desc: 'メニューを選んで、そのまま厨房へ送信できます。', order_to_kitchen: '厨房で確認 →',
      cart_title: '現在の注文', cart_empty: 'まだ注文がありません。メニューから追加してください。', order_submit: '注文を送信', note_placeholder: '備考 / 例: 氷少なめ、ねぎ抜き',
      add: '追加', soldout: '売切れ', total: '合計', accepted: '注文を受け付けました', all: 'すべて', recommended: 'おすすめ', note: '備考',
      kitchen_eyebrow: 'Kitchen Display', kitchen_title: '厨房オーダー', kitchen_desc: '新規注文を調理中・完成へ進めます。', kitchen_to_checkout: '会計へ →', kitchen_empty: '未処理の注文はありません。',
      status_new: '新規', status_preparing: '調理中', status_done: '完成', status_paid: '会計済', action_preparing: '調理中', action_done: '完成', set_preparing: '調理中にしました', set_done: '完成にしました',
      checkout_eyebrow: 'Checkout', checkout_title: 'テーブル会計', checkout_desc: '未会計の注文をテーブルごとにまとめて精算します。', checkout_panel: '会計', payment_method: '支払い方法',
      pay_cash: '現金', pay_card: 'クレジットカード', pay_qr: 'QR決済', checkout_total: '請求金額', checkout_submit: '会計完了・清台', checkout_empty: 'このテーブルに未会計の注文はありません。', checkout_done: '会計完了', available: '空席',
      admin_eyebrow: 'Admin', admin_title: 'メニュー・テーブル管理', admin_desc: '第一版は演示用の管理画面です。メニューと注文データはブラウザ内に保存されます。', reset_demo: 'デモデータをリセット',
      menu_edit: 'メニュー編集', id: 'ID', category: '分類', icon: 'アイコン', price: '価格', name_ja: '日本語名', name_zh: '中国語名', desc: '説明', save_menu: 'メニューを保存',
      table_status: 'テーブル状態', current_menu: '現在のメニュー', edit: '編集', restart_sales: '販売再開', stop_sales: '売切れ', menu_saved: 'メニューを保存しました',
      soldout_updated: '売切れ状態を更新しました', demo_reset: 'デモデータをリセットしました', selling: '販売中', seats: '名'
    },
    zh: {
      nav_order: '点菜', nav_kitchen: '厨房', nav_checkout: '结账', nav_admin: '管理',
      order_eyebrow: '顾客点菜', order_title: '桌号 {table}', order_desc: '选择菜品后，可直接发送到厨房。', order_to_kitchen: '去厨房确认 →',
      cart_title: '当前订单', cart_empty: '还没有点菜，请从菜单中添加。', order_submit: '提交订单', note_placeholder: '备注 / 例: 少冰、不要葱',
      add: '添加', soldout: '售罄', total: '合计', accepted: '订单已提交', all: '全部', recommended: '推荐', note: '备注',
      kitchen_eyebrow: '厨房接单', kitchen_title: '厨房订单', kitchen_desc: '把新订单推进到制作中或已完成。', kitchen_to_checkout: '去结账 →', kitchen_empty: '暂无待处理订单。',
      status_new: '新订单', status_preparing: '制作中', status_done: '已完成', status_paid: '已结账', action_preparing: '制作中', action_done: '完成', set_preparing: '已设为制作中', set_done: '已设为完成',
      checkout_eyebrow: '收银结账', checkout_title: '桌台结账', checkout_desc: '按桌汇总未结账订单并完成清台。', checkout_panel: '结账', payment_method: '支付方式',
      pay_cash: '现金', pay_card: '信用卡', pay_qr: 'QR 支付', checkout_total: '应收金额', checkout_submit: '完成结账・清台', checkout_empty: '这张桌暂无未结账订单。', checkout_done: '结账完成', available: '空桌',
      admin_eyebrow: '后台管理', admin_title: '菜单・桌台管理', admin_desc: '第一版是演示用管理画面，菜单和订单数据保存在浏览器本地。', reset_demo: '重置演示数据',
      menu_edit: '菜单编辑', id: 'ID', category: '分类', icon: '图标', price: '价格', name_ja: '日文名', name_zh: '中文名', desc: '说明', save_menu: '保存菜单',
      table_status: '桌台状态', current_menu: '当前菜单', edit: '编辑', restart_sales: '恢复销售', stop_sales: '设为售罄', menu_saved: '菜单已保存',
      soldout_updated: '售罄状态已更新', demo_reset: '演示数据已重置', selling: '销售中', seats: '位'
    },
    en: {
      nav_order: 'Order', nav_kitchen: 'Kitchen', nav_checkout: 'Checkout', nav_admin: 'Admin',
      order_eyebrow: 'Customer Ordering', order_title: 'Table {table}', order_desc: 'Choose menu items and send the order directly to the kitchen.', order_to_kitchen: 'Check in kitchen →',
      cart_title: 'Current Order', cart_empty: 'No items yet. Add dishes from the menu.', order_submit: 'Send Order', note_placeholder: 'Note / e.g. less ice, no scallion',
      add: 'Add', soldout: 'Sold Out', total: 'Total', accepted: 'Order received', all: 'All', recommended: 'Recommended', note: 'Note',
      kitchen_eyebrow: 'Kitchen Display', kitchen_title: 'Kitchen Orders', kitchen_desc: 'Move new orders into preparing or completed status.', kitchen_to_checkout: 'Go to checkout →', kitchen_empty: 'No open orders.',
      status_new: 'New', status_preparing: 'Preparing', status_done: 'Done', status_paid: 'Paid', action_preparing: 'Preparing', action_done: 'Done', set_preparing: 'Marked as preparing', set_done: 'Marked as done',
      checkout_eyebrow: 'Checkout', checkout_title: 'Table Checkout', checkout_desc: 'Review unpaid orders by table and close the table.', checkout_panel: 'Checkout', payment_method: 'Payment Method',
      pay_cash: 'Cash', pay_card: 'Card', pay_qr: 'QR Payment', checkout_total: 'Amount Due', checkout_submit: 'Complete Payment', checkout_empty: 'No unpaid orders for this table.', checkout_done: 'Payment completed', available: 'Open',
      admin_eyebrow: 'Admin', admin_title: 'Menu & Table Management', admin_desc: 'This first version is a demo admin screen. Menu and order data are stored in the browser.', reset_demo: 'Reset Demo Data',
      menu_edit: 'Menu Editor', id: 'ID', category: 'Category', icon: 'Icon', price: 'Price', name_ja: 'Japanese Name', name_zh: 'Chinese Name', desc: 'Description', save_menu: 'Save Menu',
      table_status: 'Table Status', current_menu: 'Current Menu', edit: 'Edit', restart_sales: 'Resume', stop_sales: 'Sold Out', menu_saved: 'Menu saved',
      soldout_updated: 'Sold-out status updated', demo_reset: 'Demo data reset', selling: 'Selling', seats: ' seats'
    }
  };

  function safeStorage() {
    try { if (root.localStorage) return root.localStorage; } catch (error) {}
    return { getItem: () => null, setItem: () => {} };
  }

  function getLang() {
    const saved = safeStorage().getItem(KEY);
    return dict[saved] ? saved : 'ja';
  }

  function t(key, params) {
    const lang = getLang();
    let text = dict[lang][key] || dict.ja[key] || key;
    Object.entries(params || {}).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, value);
    });
    return text;
  }

  function applyLang(lang) {
    if (!root.document) return;
    root.document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    root.document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    root.document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setLang(lang) {
    if (!dict[lang]) lang = 'ja';
    safeStorage().setItem(KEY, lang);
    applyLang(lang);
    root.dispatchEvent?.(new Event('irakutech:lang'));
  }

  function init() {
    if (!root.document) return;
    root.document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => setLang(button.dataset.lang));
    });
    applyLang(getLang());
  }

  const api = { dict, getLang, setLang, t, applyLang, init };
  root.IzakayaI18n = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
