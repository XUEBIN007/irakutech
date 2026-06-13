(function (root) {
  const KEY = 'irakutech.lang';
  const dict = {
    ja: {
      brand: '本町中華 QR注文',
      nav_order: '注文', nav_kitchen: '厨房', nav_checkout: '会計', nav_admin: '管理',
      store_address: '船橋市本町エリア / 店名・連絡先は正式確認後に反映', cash_notice: '公開情報では現金中心です。正式導入前に店頭で確認してください。', course_note: '4名様から。ラストオーダーは終了15分前。',
      order_eyebrow: 'Honcho Table Order', order_title: 'テーブル {table}', order_desc: '本格中華メニューを選んで、そのまま厨房へ送信できます。', order_to_kitchen: '厨房で確認 →',
      cart_title: '現在の注文', cart_empty: 'まだ注文がありません。メニューから追加してください。', order_submit: '注文を送信', note_placeholder: '備考 / 例: 辛さ控えめ、パクチーなし、生ビールで',
      add: '追加', soldout: '売切れ', total: '合計', accepted: '注文を受け付けました', all: 'すべて', recommended: 'おすすめ', note: '備考',
      kitchen_eyebrow: 'Honcho Kitchen', kitchen_title: '本町中華 厨房オーダー', kitchen_desc: '新規注文を調理中・完成へ進めます。宴会・食べ飲み放題の追加注文も同じ画面で確認します。', kitchen_to_checkout: '会計へ →', kitchen_empty: '未処理の注文はありません。',
      status_new: '新規', status_preparing: '調理中', status_done: '完成', status_paid: '会計済', status_canceled: '取消済', action_preparing: '調理中', action_done: '完成', action_cancel: '取消', set_preparing: '調理中にしました', set_done: '完成にしました', set_canceled: '注文を取消しました',
      checkout_eyebrow: 'Honcho Checkout', checkout_title: '本町中華 テーブル会計', checkout_desc: '公開情報では現金中心です。店頭確認後にカード・QR決済を有効化できます。', checkout_panel: '会計', payment_method: '支払い方法',
      pay_cash: '現金', pay_card: 'カード（確認後）', pay_qr: 'QR決済（確認後）', checkout_total: '請求金額', checkout_submit: '会計完了・清台', checkout_empty: 'このテーブルに未会計の注文はありません。', checkout_done: '会計完了', available: '空席',
      admin_eyebrow: 'Honcho Admin', admin_title: '本町中華 メニュー・テーブル管理', admin_desc: '導入用の管理画面です。店名・メニュー・価格・売切れは店頭確認後にここで調整できます。', reset_demo: 'デモデータをリセット',
      menu_edit: 'メニュー編集', id: 'ID', category: '分類', icon: 'アイコン', price: '価格', name_ja: '日本語名', name_zh: '中国語名', desc: '説明', save_menu: 'メニューを保存',
      table_status: 'テーブル状態', current_menu: '現在のメニュー', edit: '編集', restart_sales: '販売再開', stop_sales: '売切れ', menu_saved: 'メニューを保存しました',
      soldout_updated: '売切れ状態を更新しました', demo_reset: 'デモデータをリセットしました', selling: '販売中', seats: '名',
      qr_links: 'テーブルQRリンク', sales_summary: '本日の営業サマリー', paid_total: '会計済売上', unpaid_total: '未会計', canceled_count: '取消件数', order_count: '会計件数', copy_url: 'URLをコピー'
    },
    zh: {
      brand: '本町中华扫码点餐',
      nav_order: '点菜', nav_kitchen: '厨房', nav_checkout: '结账', nav_admin: '管理',
      store_address: '船桥市本町区域 / 店名和联系方式正式确认后反映', cash_notice: '公开资料显示本店以现金结账为主，正式导入前请与店铺确认。', course_note: '4位起订，结束前15分钟最后点单。',
      order_eyebrow: '本町中华桌边点餐', order_title: '桌号 {table}', order_desc: '选择本格中华料理后，可直接发送到厨房。', order_to_kitchen: '去厨房确认 →',
      cart_title: '当前订单', cart_empty: '还没有点菜，请从菜单中添加。', order_submit: '提交订单', note_placeholder: '备注 / 例: 微辣、不要香菜、饮料选生啤',
      add: '添加', soldout: '售罄', total: '合计', accepted: '订单已提交', all: '全部', recommended: '推荐', note: '备注',
      kitchen_eyebrow: '本町中华厨房', kitchen_title: '本町中华厨房订单', kitchen_desc: '把新订单推进到制作中或已完成，宴会和吃喝放题追加也在这里确认。', kitchen_to_checkout: '去结账 →', kitchen_empty: '暂无待处理订单。',
      status_new: '新订单', status_preparing: '制作中', status_done: '已完成', status_paid: '已结账', status_canceled: '已取消', action_preparing: '制作中', action_done: '完成', action_cancel: '取消订单', set_preparing: '已设为制作中', set_done: '已设为完成', set_canceled: '订单已取消',
      checkout_eyebrow: '本町中华收银', checkout_title: '本町中华桌台结账', checkout_desc: '公开资料显示本店以现金结账为主，店铺确认后可开启刷卡或QR支付。', checkout_panel: '结账', payment_method: '支付方式',
      pay_cash: '现金', pay_card: '刷卡（确认后）', pay_qr: 'QR支付（确认后）', checkout_total: '应收金额', checkout_submit: '完成结账・清台', checkout_empty: '这张桌暂无未结账订单。', checkout_done: '结账完成', available: '空桌',
      admin_eyebrow: '本町中华后台', admin_title: '本町中华菜单・桌台管理', admin_desc: '这是导入用后台。店名、菜单、价格、售罄状态可在店铺确认后调整。', reset_demo: '重置演示数据',
      menu_edit: '菜单编辑', id: 'ID', category: '分类', icon: '图标', price: '价格', name_ja: '日文名', name_zh: '中文名', desc: '说明', save_menu: '保存菜单',
      table_status: '桌台状态', current_menu: '当前菜单', edit: '编辑', restart_sales: '恢复销售', stop_sales: '设为售罄', menu_saved: '菜单已保存',
      soldout_updated: '售罄状态已更新', demo_reset: '演示数据已重置', selling: '销售中', seats: '位',
      qr_links: '桌台 QR 链接', sales_summary: '今日营业汇总', paid_total: '已结账销售额', unpaid_total: '未结账', canceled_count: '取消件数', order_count: '结账件数', copy_url: '复制URL'
    },
    en: {
      brand: 'Honcho Chinese QR Order',
      nav_order: 'Order', nav_kitchen: 'Kitchen', nav_checkout: 'Checkout', nav_admin: 'Admin',
      store_address: 'Honcho area, Funabashi / Store name and contact will be confirmed before launch', cash_notice: 'Public listings indicate cash-first checkout. Confirm with the restaurant before launch.', course_note: 'For 4+ guests, last order 15 minutes before finish.',
      order_eyebrow: 'Honcho Table Order', order_title: 'Table {table}', order_desc: 'Choose Chinese dishes and send the order directly to the kitchen.', order_to_kitchen: 'Check in kitchen →',
      cart_title: 'Current Order', cart_empty: 'No items yet. Add dishes from the menu.', order_submit: 'Send Order', note_placeholder: 'Note / e.g. mild spice, no cilantro, draft beer',
      add: 'Add', soldout: 'Sold Out', total: 'Total', accepted: 'Order received', all: 'All', recommended: 'Recommended', note: 'Note',
      kitchen_eyebrow: 'Honcho Kitchen', kitchen_title: 'Honcho Kitchen Orders', kitchen_desc: 'Move new orders, banquet add-ons, and all-you-can-eat refills into preparing or done.', kitchen_to_checkout: 'Go to checkout →', kitchen_empty: 'No open orders.',
      status_new: 'New', status_preparing: 'Preparing', status_done: 'Done', status_paid: 'Paid', status_canceled: 'Canceled', action_preparing: 'Preparing', action_done: 'Done', action_cancel: 'Cancel', set_preparing: 'Marked as preparing', set_done: 'Marked as done', set_canceled: 'Order canceled',
      checkout_eyebrow: 'Honcho Checkout', checkout_title: 'Honcho Table Checkout', checkout_desc: 'Public listings indicate cash-first checkout. Card and QR options can be enabled after store confirmation.', checkout_panel: 'Checkout', payment_method: 'Payment Method',
      pay_cash: 'Cash', pay_card: 'Card (after confirmation)', pay_qr: 'QR Payment (after confirmation)', checkout_total: 'Amount Due', checkout_submit: 'Complete Payment', checkout_empty: 'No unpaid orders for this table.', checkout_done: 'Payment completed', available: 'Open',
      admin_eyebrow: 'Honcho Admin', admin_title: 'Honcho Menu & Table Management', admin_desc: 'Admin screen for the rollout. Store name, menu, prices, and sold-out status can be adjusted after restaurant confirmation.', reset_demo: 'Reset Demo Data',
      menu_edit: 'Menu Editor', id: 'ID', category: 'Category', icon: 'Icon', price: 'Price', name_ja: 'Japanese Name', name_zh: 'Chinese Name', desc: 'Description', save_menu: 'Save Menu',
      table_status: 'Table Status', current_menu: 'Current Menu', edit: 'Edit', restart_sales: 'Resume', stop_sales: 'Sold Out', menu_saved: 'Menu saved',
      soldout_updated: 'Sold-out status updated', demo_reset: 'Demo data reset', selling: 'Selling', seats: ' seats',
      qr_links: 'Table QR Links', sales_summary: "Today's Sales Summary", paid_total: 'Paid Sales', unpaid_total: 'Unpaid', canceled_count: 'Canceled Orders', order_count: 'Paid Orders', copy_url: 'Copy URL'
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
