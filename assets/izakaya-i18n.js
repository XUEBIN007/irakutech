(function (root) {
  const KEY = 'irakutech.lang.v2';
  const LANG_OPTIONS = [
    { lang: 'ja', label: '日本語' },
    { lang: 'zh', label: '中文' },
    { lang: 'en', label: 'English' }
  ];
  const dict = {
    ja: {
      nav_order: '注文', nav_takeout: 'テイクアウト', nav_kitchen: '厨房', nav_checkout: '会計', nav_admin: '管理',
      order_eyebrow: 'Customer Ordering', order_title: 'テーブル {table}', order_desc: 'メニューを選んで、そのまま厨房へ送信できます。', order_to_kitchen: '厨房で確認 →',
      cart_title: '現在の注文', cart_empty: 'まだ注文がありません。メニューから追加してください。', order_submit: '注文を送信', note_placeholder: '備考 / 例: 氷少なめ、ねぎ抜き',
      add: '追加', soldout: '売切れ', total: '合計', accepted: '注文を受け付けました', all: 'すべて', recommended: 'おすすめ', note: '備考',
      ordered_title: '注文済み', ordered_empty: 'まだ注文済みの商品はありません。追加注文するとここに表示されます。', current_due: '現在のご利用額', open_order_count: '{count}件',
      order_type_dine_in: '店内', order_type_pickup: 'テイクアウト', order_type_delivery: 'デリバリー', requested_time: '希望時間',
      takeout_eyebrow: 'Outside Ordering', takeout_title: 'テイクアウト・デリバリー', takeout_desc: '家や職場から注文して、店頭受取または店舗配送を選べます。', fulfillment_method: '受取方法', customer_name: 'お名前', customer_phone: '電話番号', delivery_address: '配送先住所', fulfillment_note: '連絡事項', subtotal: '小計', delivery_fee: '配送料', takeout_submit: '注文を送信', takeout_notice: '店舗からの確認後、受取または配送の準備を進めます。', takeout_missing: 'お名前、電話番号、希望時間を入力してください。', takeout_confirm_eyebrow: 'Order Confirmed', takeout_confirm_title: 'ご注文を受け付けました', takeout_confirm_desc: 'この内容で厨房に送信されました。受取時間までお待ちください。', order_number: '注文番号', store_phone: '店舗電話', continue_ordering: '続けて注文', view_kitchen_demo: '厨房で確認',
      kitchen_eyebrow: 'Kitchen Display', kitchen_title: '厨房オーダー', kitchen_desc: '新規注文を調理中・完成へ進めます。', kitchen_to_checkout: '会計へ →', kitchen_empty: '未処理の注文はありません。',
      kitchen_new: '新規注文', kitchen_preparing: '調理中', kitchen_done: '完成', kitchen_empty_new: '新しい注文はありません。', kitchen_empty_preparing: '調理中の注文はありません。', kitchen_empty_done: '完成済みの注文はありません。', item_count: '{count}品', elapsed_minutes: '{count}分経過', rush_order: '優先確認', kitchen_notes: '注意事項', waiting_checkout: '会計待ち',
      status_new: '新規', status_preparing: '調理中', status_done: '完成', status_paid: '会計済', action_preparing: '調理中', action_done: '完成', set_preparing: '調理中にしました', set_done: '完成にしました',
      checkout_eyebrow: 'Checkout', checkout_title: 'テーブル会計', checkout_desc: '未会計の注文をテーブルごとにまとめて精算します。', checkout_panel: '会計', payment_method: '支払い方法',
      pay_cash: '現金', pay_paypay: 'PayPay', pay_linepay: 'LINE Pay', pay_wechatpay: 'WeChat Pay', pay_alipay: 'Alipay', pay_card: 'クレジットカード', pay_qr: 'その他QR決済', checkout_total: '請求金額', received_amount: 'お預かり', change_amount: 'お釣り', short_amount: 'お預かり金額が不足しています', business_overview: '今日の営業概況', today_orders: '今日の注文', today_sales: '今日の売上', open_amount: '未会計金額', order_mix: '注文内訳', outside_checkout: 'テイクアウト・デリバリー未会計', outside_checkout_empty: '未会計の店外注文はありません。', select_for_payment: 'この注文を会計', checkout_hint_table: 'テーブル会計は左のテーブルを選びます。', checkout_hint_outside: '店外注文を選択中です。この注文だけを会計します。', payment_history: '収款記録', payment_history_empty: 'まだ会計済みの注文はありません。', payment_received: '受取', payment_change: 'お釣り', checkout_submit: '会計完了・清台', checkout_empty: 'このテーブルに未会計の注文はありません。', checkout_done: '会計完了', available: '空席',
      daily_close: '日締め', cash_expected: '現金予定', cash_actual: '現金実額', cash_difference: '現金差額', close_business_day: '日締め保存', close_note: '日締めメモ', close_saved: '日締めを保存しました', close_history: '日締め履歴', unpaid_warning: '未会計があります',
      table_operations: 'テーブル操作', open_table: '開台', transfer_table: '席移動', merge_table: 'テーブル結合', clear_table: '清台', from_table: '移動元', to_table: '移動先', guest_count: '人数', table_note: 'テーブルメモ', table_operation_done: 'テーブル操作を保存しました',
      customer_management: '顧客管理', customer_note: '顧客メモ', order_count: '注文回数', total_spent: '利用合計', last_order: '最終注文', save_customer_note: '顧客メモ保存', customer_note_saved: '顧客メモを保存しました',
      admin_eyebrow: 'Admin', admin_title: 'メニュー・テーブル管理', admin_desc: '第一版は演示用の管理画面です。メニューと注文データはブラウザ内に保存されます。', reset_demo: 'デモデータをリセット',
      menu_edit: 'メニュー編集', id: 'ID', category: '分類', icon: 'アイコン', price: '価格', name_ja: '日本語名', name_zh: '中国語名', desc: '説明', save_menu: 'メニューを保存',
      table_status: 'テーブル状態', current_menu: '現在のメニュー', edit: '編集', restart_sales: '販売再開', stop_sales: '売切れ', menu_saved: 'メニューを保存しました',
      soldout_updated: '売切れ状態を更新しました', demo_reset: 'デモデータをリセットしました', selling: '販売中', seats: '名',
      table_qr: 'テーブル・QR管理', table_id: 'テーブル番号', area: 'エリア', seats_count: '席数', enabled: '有効', save_table: 'テーブルを保存',
      qr_url: '注文URL', open_order: '注文画面', download_qr: 'QRを開く', regenerate_qr: 'QR再発行', disable_table: '停止', enable_table: '再開',
      table_saved: 'テーブルを保存しました', table_token_updated: 'QRを再発行しました', table_enabled_updated: 'テーブル状態を更新しました'
      ,inventory_title: '在庫管理', stock: '在庫', safety_stock: '安全在庫', save_inventory: '在庫を保存', low_stock: '低在庫', inventory_saved: '在庫を保存しました',
      inventory_movements: '在庫履歴', restock: '入庫', waste: 'ロス', movement_note: '理由・メモ', movement_saved: '在庫履歴を保存しました', show_low_stock_only: '低在庫のみ表示', all_inventory: '全在庫', sale: '販売',
      daily_report: '営業日報', top_items: '売れ筋商品', payment_methods: '支払い別売上',
      staff_timeclock: 'スタッフ打刻', staff_name: 'スタッフ名', staff_role: '役割', save_staff: 'スタッフ保存', clock_in: '出勤', start_break: '休憩開始', end_break: '休憩終了', clock_out: '退勤', on_duty: '勤務中', worked_time: '勤務時間', break_time: '休憩', staff_saved: 'スタッフを保存しました', timeclock_updated: '打刻を更新しました'
      ,staff_schedule: 'シフト', schedule_date: '日付', start_time: '開始', end_time: '終了', hourly_wage: '時給', save_schedule: 'シフト保存', late: '遅刻', early_leave: '早退', estimated_wage: '概算人件費', scheduled_time: '予定時間', schedule_saved: 'シフトを保存しました'
      ,invalid_table: 'このQRコードは現在利用できません。スタッフにお声がけください。'
      ,demo_notice: '公開 demo です。入力データはブラウザ内に保存されます。実在する個人情報・決済情報は入力しないでください。'
    },
    zh: {
      nav_order: '点菜', nav_takeout: '外卖自取', nav_kitchen: '厨房', nav_checkout: '结账', nav_admin: '管理',
      order_eyebrow: '顾客点菜', order_title: '桌号 {table}', order_desc: '选择菜品后，可直接发送到厨房。', order_to_kitchen: '去厨房确认 →',
      cart_title: '当前订单', cart_empty: '还没有点菜，请从菜单中添加。', order_submit: '提交订单', note_placeholder: '备注 / 例: 少冰、不要葱',
      add: '添加', soldout: '售罄', total: '合计', accepted: '订单已提交', all: '全部', recommended: '推荐', note: '备注',
      ordered_title: '已点订单', ordered_empty: '还没有已提交的菜品。追加点单后会显示在这里。', current_due: '当前消费金额', open_order_count: '{count}单',
      order_type_dine_in: '堂食', order_type_pickup: '到店自取', order_type_delivery: '店铺配送', requested_time: '希望时间',
      takeout_eyebrow: '店外点单', takeout_title: '外卖・到店自取', takeout_desc: '顾客可以在家或公司下单，选择到店自取或店铺配送。', fulfillment_method: '取餐方式', customer_name: '姓名', customer_phone: '电话', delivery_address: '配送地址', fulfillment_note: '备注事项', subtotal: '小计', delivery_fee: '配送费', takeout_submit: '提交订单', takeout_notice: '店铺确认后，会开始准备自取或配送。', takeout_missing: '请填写姓名、电话和希望时间。', takeout_confirm_eyebrow: '订单确认', takeout_confirm_title: '订单已提交', takeout_confirm_desc: '订单已经发送到厨房，请按希望时间等待自取或配送。', order_number: '订单号', store_phone: '店铺电话', continue_ordering: '继续点单', view_kitchen_demo: '去厨房查看',
      kitchen_eyebrow: '厨房接单', kitchen_title: '厨房订单', kitchen_desc: '把新订单推进到制作中或已完成。', kitchen_to_checkout: '去结账 →', kitchen_empty: '暂无待处理订单。',
      kitchen_new: '新订单', kitchen_preparing: '制作中', kitchen_done: '已完成', kitchen_empty_new: '暂无新订单。', kitchen_empty_preparing: '暂无制作中订单。', kitchen_empty_done: '暂无已完成订单。', item_count: '{count}件', elapsed_minutes: '已等待 {count} 分钟', rush_order: '优先确认', kitchen_notes: '注意事项', waiting_checkout: '等待结账',
      status_new: '新订单', status_preparing: '制作中', status_done: '已完成', status_paid: '已结账', action_preparing: '制作中', action_done: '完成', set_preparing: '已设为制作中', set_done: '已设为完成',
      checkout_eyebrow: '收银结账', checkout_title: '桌台结账', checkout_desc: '按桌汇总未结账订单并完成清台。', checkout_panel: '结账', payment_method: '支付方式',
      pay_cash: '现金', pay_paypay: 'PayPay', pay_linepay: 'LINE Pay', pay_wechatpay: '微信支付', pay_alipay: '支付宝', pay_card: '信用卡', pay_qr: '其他 QR 支付', checkout_total: '应收金额', received_amount: '实收金额', change_amount: '找零', short_amount: '实收金额不足', business_overview: '今日营业概览', today_orders: '今日订单', today_sales: '今日销售额', open_amount: '未结账金额', order_mix: '订单内訳', outside_checkout: '外卖・自取未结账', outside_checkout_empty: '暂无未结账店外订单。', select_for_payment: '选择此订单收款', checkout_hint_table: '桌台结账时，请先选择左侧桌号。', checkout_hint_outside: '当前已选择店外订单，只会结算这一单。', payment_history: '收款记录', payment_history_empty: '暂无已结账订单。', payment_received: '实收', payment_change: '找零', checkout_submit: '完成结账・清台', checkout_empty: '这张桌暂无未结账订单。', checkout_done: '结账完成', available: '空桌',
      daily_close: '日结', cash_expected: '现金应收', cash_actual: '现金实盘', cash_difference: '现金差额', close_business_day: '保存日结', close_note: '日结备注', close_saved: '日结已保存', close_history: '日结记录', unpaid_warning: '还有未结账订单',
      table_operations: '桌台操作', open_table: '开台', transfer_table: '换桌', merge_table: '并桌', clear_table: '清台', from_table: '来源桌', to_table: '目标桌', guest_count: '人数', table_note: '桌台备注', table_operation_done: '桌台操作已保存',
      customer_management: '客户管理', customer_note: '客户备注', order_count: '消费次数', total_spent: '消费合计', last_order: '最近订单', save_customer_note: '保存客户备注', customer_note_saved: '客户备注已保存',
      admin_eyebrow: '后台管理', admin_title: '菜单・桌台管理', admin_desc: '第一版是演示用管理画面，菜单和订单数据保存在浏览器本地。', reset_demo: '重置演示数据',
      menu_edit: '菜单编辑', id: 'ID', category: '分类', icon: '图标', price: '价格', name_ja: '日文名', name_zh: '中文名', desc: '说明', save_menu: '保存菜单',
      table_status: '桌台状态', current_menu: '当前菜单', edit: '编辑', restart_sales: '恢复销售', stop_sales: '设为售罄', menu_saved: '菜单已保存',
      soldout_updated: '售罄状态已更新', demo_reset: '演示数据已重置', selling: '销售中', seats: '位',
      table_qr: '桌台・二维码管理', table_id: '桌号', area: '区域', seats_count: '座位数', enabled: '启用', save_table: '保存桌台',
      qr_url: '点菜链接', open_order: '打开点菜页', download_qr: '打开二维码', regenerate_qr: '重新生成二维码', disable_table: '停用', enable_table: '启用',
      table_saved: '桌台已保存', table_token_updated: '二维码已重新生成', table_enabled_updated: '桌台状态已更新'
      ,inventory_title: '库存管理', stock: '库存', safety_stock: '安全库存', save_inventory: '保存库存', low_stock: '低库存', inventory_saved: '库存已保存',
      inventory_movements: '库存流水', restock: '入库', waste: '损耗', movement_note: '原因/备注', movement_saved: '库存流水已保存', show_low_stock_only: '只看低库存', all_inventory: '全部库存', sale: '销售',
      daily_report: '营业日报', top_items: '热销商品', payment_methods: '支付方式统计',
      staff_timeclock: '员工打卡', staff_name: '员工姓名', staff_role: '岗位', save_staff: '保存员工', clock_in: '上班打卡', start_break: '开始休息', end_break: '结束休息', clock_out: '下班打卡', on_duty: '在岗', worked_time: '工作时间', break_time: '休息', staff_saved: '员工已保存', timeclock_updated: '打卡已更新'
      ,staff_schedule: '排班', schedule_date: '日期', start_time: '开始', end_time: '结束', hourly_wage: '时薪', save_schedule: '保存排班', late: '迟到', early_leave: '早退', estimated_wage: '预估人工费', scheduled_time: '计划时间', schedule_saved: '排班已保存'
      ,invalid_table: '这个二维码当前不可使用，请联系店员。'
      ,demo_notice: '这是公开 demo，输入数据会保存在当前浏览器中。请不要填写真实个人信息或支付信息。'
    },
    en: {
      nav_order: 'Order', nav_takeout: 'Takeout', nav_kitchen: 'Kitchen', nav_checkout: 'Checkout', nav_admin: 'Admin',
      order_eyebrow: 'Customer Ordering', order_title: 'Table {table}', order_desc: 'Choose menu items and send the order directly to the kitchen.', order_to_kitchen: 'Check in kitchen →',
      cart_title: 'Current Order', cart_empty: 'No items yet. Add dishes from the menu.', order_submit: 'Send Order', note_placeholder: 'Note / e.g. less ice, no scallion',
      add: 'Add', soldout: 'Sold Out', total: 'Total', accepted: 'Order received', all: 'All', recommended: 'Recommended', note: 'Note',
      ordered_title: 'Ordered Items', ordered_empty: 'No submitted items yet. Additional orders will appear here.', current_due: 'Current Due', open_order_count: '{count} orders',
      order_type_dine_in: 'Dine-in', order_type_pickup: 'Pickup', order_type_delivery: 'Delivery', requested_time: 'Requested Time',
      takeout_eyebrow: 'Outside Ordering', takeout_title: 'Takeout & Delivery', takeout_desc: 'Order from home or work, then choose pickup or store delivery.', fulfillment_method: 'Fulfillment', customer_name: 'Name', customer_phone: 'Phone', delivery_address: 'Delivery Address', fulfillment_note: 'Notes', subtotal: 'Subtotal', delivery_fee: 'Delivery Fee', takeout_submit: 'Send Order', takeout_notice: 'The store will confirm and prepare your order.', takeout_missing: 'Please enter name, phone, and requested time.', takeout_confirm_eyebrow: 'Order Confirmed', takeout_confirm_title: 'Order received', takeout_confirm_desc: 'Your order has been sent to the kitchen. Please wait until your requested time.', order_number: 'Order No.', store_phone: 'Store Phone', continue_ordering: 'Continue Ordering', view_kitchen_demo: 'View Kitchen',
      kitchen_eyebrow: 'Kitchen Display', kitchen_title: 'Kitchen Orders', kitchen_desc: 'Move new orders into preparing or completed status.', kitchen_to_checkout: 'Go to checkout →', kitchen_empty: 'No open orders.',
      kitchen_new: 'New', kitchen_preparing: 'Preparing', kitchen_done: 'Done', kitchen_empty_new: 'No new orders.', kitchen_empty_preparing: 'No preparing orders.', kitchen_empty_done: 'No completed orders.', item_count: '{count} items', elapsed_minutes: '{count} min elapsed', rush_order: 'Priority', kitchen_notes: 'Notes', waiting_checkout: 'Waiting for checkout',
      status_new: 'New', status_preparing: 'Preparing', status_done: 'Done', status_paid: 'Paid', action_preparing: 'Preparing', action_done: 'Done', set_preparing: 'Marked as preparing', set_done: 'Marked as done',
      checkout_eyebrow: 'Checkout', checkout_title: 'Table Checkout', checkout_desc: 'Review unpaid orders by table and close the table.', checkout_panel: 'Checkout', payment_method: 'Payment Method',
      pay_cash: 'Cash', pay_paypay: 'PayPay', pay_linepay: 'LINE Pay', pay_wechatpay: 'WeChat Pay', pay_alipay: 'Alipay', pay_card: 'Card', pay_qr: 'Other QR Payment', checkout_total: 'Amount Due', received_amount: 'Received', change_amount: 'Change', short_amount: 'Received amount is short', business_overview: 'Today Overview', today_orders: 'Orders Today', today_sales: 'Sales Today', open_amount: 'Unpaid Amount', order_mix: 'Order Mix', outside_checkout: 'Takeout & Delivery Due', outside_checkout_empty: 'No unpaid outside orders.', select_for_payment: 'Select for Payment', checkout_hint_table: 'For dine-in checkout, select a table on the left.', checkout_hint_outside: 'Outside order selected. Only this order will be paid.', payment_history: 'Payment History', payment_history_empty: 'No paid orders yet.', payment_received: 'Received', payment_change: 'Change', checkout_submit: 'Complete Payment', checkout_empty: 'No unpaid orders for this table.', checkout_done: 'Payment completed', available: 'Open',
      daily_close: 'Daily Close', cash_expected: 'Expected Cash', cash_actual: 'Actual Cash', cash_difference: 'Cash Difference', close_business_day: 'Save Close', close_note: 'Close Note', close_saved: 'Daily close saved', close_history: 'Close History', unpaid_warning: 'Unpaid orders remain',
      table_operations: 'Table Ops', open_table: 'Open Table', transfer_table: 'Move Table', merge_table: 'Merge Tables', clear_table: 'Clear Table', from_table: 'From', to_table: 'To', guest_count: 'Guests', table_note: 'Table Note', table_operation_done: 'Table operation saved',
      customer_management: 'Customers', customer_note: 'Customer Note', order_count: 'Orders', total_spent: 'Total Spent', last_order: 'Last Order', save_customer_note: 'Save Customer Note', customer_note_saved: 'Customer note saved',
      admin_eyebrow: 'Admin', admin_title: 'Menu & Table Management', admin_desc: 'This first version is a demo admin screen. Menu and order data are stored in the browser.', reset_demo: 'Reset Demo Data',
      menu_edit: 'Menu Editor', id: 'ID', category: 'Category', icon: 'Icon', price: 'Price', name_ja: 'Japanese Name', name_zh: 'Chinese Name', desc: 'Description', save_menu: 'Save Menu',
      table_status: 'Table Status', current_menu: 'Current Menu', edit: 'Edit', restart_sales: 'Resume', stop_sales: 'Sold Out', menu_saved: 'Menu saved',
      soldout_updated: 'Sold-out status updated', demo_reset: 'Demo data reset', selling: 'Selling', seats: ' seats',
      table_qr: 'Table & QR Management', table_id: 'Table No.', area: 'Area', seats_count: 'Seats', enabled: 'Enabled', save_table: 'Save Table',
      qr_url: 'Order URL', open_order: 'Open Order', download_qr: 'Open QR', regenerate_qr: 'Regenerate QR', disable_table: 'Disable', enable_table: 'Enable',
      table_saved: 'Table saved', table_token_updated: 'QR regenerated', table_enabled_updated: 'Table status updated'
      ,inventory_title: 'Inventory', stock: 'Stock', safety_stock: 'Safety Stock', save_inventory: 'Save Inventory', low_stock: 'Low Stock', inventory_saved: 'Inventory saved',
      inventory_movements: 'Inventory Log', restock: 'Restock', waste: 'Waste', movement_note: 'Reason / Note', movement_saved: 'Inventory log saved', show_low_stock_only: 'Low Stock Only', all_inventory: 'All Inventory', sale: 'Sale',
      daily_report: 'Daily Report', top_items: 'Top Items', payment_methods: 'Payment Methods',
      staff_timeclock: 'Staff Clock', staff_name: 'Staff Name', staff_role: 'Role', save_staff: 'Save Staff', clock_in: 'Clock In', start_break: 'Start Break', end_break: 'End Break', clock_out: 'Clock Out', on_duty: 'On Duty', worked_time: 'Worked', break_time: 'Break', staff_saved: 'Staff saved', timeclock_updated: 'Time clock updated'
      ,staff_schedule: 'Schedule', schedule_date: 'Date', start_time: 'Start', end_time: 'End', hourly_wage: 'Hourly Wage', save_schedule: 'Save Schedule', late: 'Late', early_leave: 'Early Leave', estimated_wage: 'Estimated Labor', scheduled_time: 'Scheduled', schedule_saved: 'Schedule saved'
      ,invalid_table: 'This QR code is not available. Please ask the staff.'
      ,demo_notice: 'Public demo. Data is stored in this browser. Do not enter real personal, confidential, or payment information.'
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
    root.document.querySelectorAll('[data-lang-select]').forEach((select) => { select.value = lang; });
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
    root.document.querySelectorAll('.lang-switcher').forEach((switcher) => {
      if (switcher.querySelector('[data-lang-select]')) return;
      switcher.innerHTML = `
        <label class="lang-select-label">
          <span>Language</span>
          <select data-lang-select aria-label="Language">
            ${LANG_OPTIONS.map((option) => `<option value="${option.lang}">${option.label}</option>`).join('')}
          </select>
        </label>
      `;
    });
    root.document.querySelectorAll('[data-lang-select]').forEach((select) => {
      select.addEventListener('change', () => setLang(select.value));
    });
    root.document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => setLang(button.dataset.lang));
    });
    applyLang(getLang());
  }

  const api = { dict, getLang, setLang, t, applyLang, init };
  root.IzakayaI18n = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
