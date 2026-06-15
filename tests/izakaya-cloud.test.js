const assert = require('assert');

const cloud = require('../assets/izakaya-cloud.js');

const sampleOrder = {
  id: 'ORD-TEST-0001',
  tableId: '3',
  orderType: 'dine-in',
  customer: { name: '', phone: '' },
  fulfillment: { method: 'dine-in', requestedAt: '', address: '', note: '' },
  fulfillmentStatus: 'pending',
  status: 'new',
  paymentStatus: 'unpaid',
  createdAt: '2026-06-07T10:00:00.000Z',
  lines: [
    { menuItemId: 'beer', nameJa: '生ビール (中)', nameZh: '生啤（中）', price: 480, quantity: 2, note: '少泡沫' },
    { menuItemId: 'karaage', nameJa: 'から揚げ', nameZh: '炸鸡块', price: 580, quantity: 1, note: '' }
  ],
  subtotal: 1540,
  deliveryFee: 0,
  total: 1540
};

const rows = cloud.orderToRows(sampleOrder, 'demo');
assert.strictEqual(rows.order.id, 'ORD-TEST-0001');
assert.strictEqual(rows.order.restaurant_id, 'demo');
assert.strictEqual(rows.order.table_id, '3');
assert.strictEqual(rows.order.order_type, 'dine-in');
assert.strictEqual(rows.order.payment_status, 'unpaid');
assert.strictEqual(rows.order.customer.name, '');
assert.strictEqual(rows.lines.length, 2);
assert.strictEqual(rows.lines[0].restaurant_id, 'demo');
assert.strictEqual(rows.lines[0].order_id, 'ORD-TEST-0001');
assert.strictEqual(rows.lines[0].menu_item_id, 'beer');
assert.strictEqual(rows.lines[0].line_index, 0);

const restored = cloud.rowsToOrder(rows.order, rows.lines.slice().reverse());
assert.deepStrictEqual(restored, sampleOrder);

const store = {
  orders: [
    { ...sampleOrder, id: 'ORD-OLD', status: 'preparing', createdAt: '2026-06-07T09:00:00.000Z' },
    { ...sampleOrder, status: 'preparing' }
  ],
  tables: [
    { id: '3', status: 'available', openedAt: '', guestCount: 0 },
    { id: '5', status: 'available', openedAt: '', guestCount: 0 }
  ]
};
const merged = cloud.mergeCloudOrders(store, [sampleOrder]);
assert.deepStrictEqual(merged.orders.map((order) => order.id), ['ORD-TEST-0001', 'ORD-OLD']);
assert.strictEqual(merged.orders[0].status, 'new');
assert.strictEqual(merged.tables.find((table) => table.id === '3').status, 'occupied');
assert.strictEqual(merged.tables.find((table) => table.id === '5').status, 'available');

const localLineStatusStore = {
  orders: [{
    ...sampleOrder,
    status: 'preparing',
    lines: [
      { ...sampleOrder.lines[0], id: 'beer-line', status: 'preparing' },
      { ...sampleOrder.lines[1], id: 'karaage-line', status: 'new' }
    ]
  }],
  tables: [{ id: '3', status: 'occupied', openedAt: '', guestCount: 2 }]
};
const cloudStatusOnlyOrder = {
  ...sampleOrder,
  status: 'preparing',
  lines: sampleOrder.lines.map((line) => ({ ...line }))
};
const mergedLineStatus = cloud.mergeCloudOrders(localLineStatusStore, [cloudStatusOnlyOrder]);
assert.strictEqual(mergedLineStatus.orders[0].lines[0].status, 'preparing');
assert.strictEqual(mergedLineStatus.orders[0].lines[1].status, 'new');

assert.strictEqual(cloud.configured({ supabaseUrl: '', supabaseAnonKey: 'abc' }), false);
assert.strictEqual(cloud.configured({ supabaseUrl: 'https://example.supabase.co', supabaseAnonKey: '' }), false);
assert.strictEqual(cloud.configured({ supabaseUrl: 'https://example.supabase.co', supabaseAnonKey: 'abc' }), true);

console.log('izakaya cloud tests passed');
