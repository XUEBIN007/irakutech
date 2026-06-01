const assert = require('assert');

globalThis.localStorage = (() => {
  const data = {};
  return {
    getItem: (key) => Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null,
    setItem: (key, value) => { data[key] = String(value); },
    removeItem: (key) => { delete data[key]; },
    clear: () => Object.keys(data).forEach((key) => delete data[key]),
    key: (index) => Object.keys(data)[index],
    get length() { return Object.keys(data).length; }
  };
})();

const core = require('../assets/izakaya-core.js');

localStorage.clear();
core.loadStore();
core.addToCart('3', 'beer');
core.addToCart('3', 'beer');
core.updateCartLine('3', 'beer', { note: '少泡沫' });

const order = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
assert.strictEqual(order.tableId, '3');
assert.strictEqual(order.orderType, 'dine-in');
assert.strictEqual(order.fulfillment.method, 'dine-in');
assert.strictEqual(order.fulfillmentStatus, 'pending');
assert.deepStrictEqual(order.customer, { name: '', phone: '' });
assert.strictEqual(order.lines[0].quantity, 2);
assert.strictEqual(order.lines[0].note, '少泡沫');
assert.strictEqual(order.subtotal, 960);
assert.strictEqual(order.deliveryFee, 0);
assert.strictEqual(order.total, 960);
assert.strictEqual(core.loadCart('3').length, 0);
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').status, 'occupied');

core.updateOrderStatus(order.id, 'done');
assert.strictEqual(core.loadStore().orders[0].status, 'done');

const paidTotal = core.checkoutTable('3', { method: 'cash', receivedAmount: 1000 });
assert.strictEqual(paidTotal, 960);
assert.strictEqual(core.loadStore().orders[0].paymentStatus, 'paid');
assert.strictEqual(core.loadStore().orders[0].paymentMethod, 'cash');
assert.strictEqual(core.loadStore().orders[0].receivedAmount, 1000);
assert.strictEqual(core.loadStore().orders[0].changeAmount, 40);
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').status, 'available');

core.toggleSoldOut('beer');
assert.strictEqual(core.loadStore().menu.find((item) => item.id === 'beer').soldOut, true);

const table = core.upsertTable({ id: '8', area: 'VIP', seats: 6, enabled: true });
assert.strictEqual(table.id, '8');
assert.strictEqual(table.area, 'VIP');
assert.strictEqual(table.enabled, true);
assert.ok(table.token.length >= 8);

const firstToken = table.token;
core.regenerateTableToken('8');
const updatedTable = core.loadStore().tables.find((entry) => entry.id === '8');
assert.notStrictEqual(updatedTable.token, firstToken);

core.toggleTableEnabled('8');
assert.strictEqual(core.loadStore().tables.find((entry) => entry.id === '8').enabled, false);

const url = core.tableOrderUrl({ origin: 'https://xuebin007.github.io', basePath: '/irakutech', table: updatedTable });
assert.strictEqual(url.startsWith('https://xuebin007.github.io/irakutech/order/?table=8&token='), true);
assert.strictEqual(core.validateTableAccess('8', updatedTable.token), false);
core.toggleTableEnabled('8');
assert.strictEqual(core.validateTableAccess('8', updatedTable.token), true);
assert.strictEqual(core.validateTableAccess('8', 'wrong-token'), false);

localStorage.clear();
core.loadStore();
core.addToCart('3', 'beer');
const firstTableOrder = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
core.addToCart('3', 'karaage');
const secondTableOrder = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
core.addToCart('2', 'highball');
core.createOrder({ tableId: '2', cart: core.loadCart('2') });
const tableSummary = core.tableOpenSummary('3');
assert.strictEqual(tableSummary.tableId, '3');
assert.strictEqual(tableSummary.orders.length, 2);
assert.deepStrictEqual(tableSummary.orders.map((entry) => entry.id), [secondTableOrder.id, firstTableOrder.id]);
assert.strictEqual(tableSummary.total, 1060);

localStorage.clear();
core.loadStore();
core.addToCart('1', 'beer');
const newOrder = core.createOrder({ tableId: '1', cart: core.loadCart('1') });
core.addToCart('2', 'karaage');
const preparingOrder = core.createOrder({ tableId: '2', cart: core.loadCart('2') });
core.updateOrderStatus(preparingOrder.id, 'preparing');
core.addToCart('3', 'momo');
const doneOrder = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
core.updateOrderStatus(doneOrder.id, 'done');
core.addToCart('5', 'potato');
core.createOrder({ tableId: '5', cart: core.loadCart('5') });
core.checkoutTable('5', { method: 'cash', receivedAmount: 500 });
const kitchenGroups = core.kitchenOrderGroups();
assert.deepStrictEqual(kitchenGroups.new.map((entry) => entry.id), [newOrder.id]);
assert.deepStrictEqual(kitchenGroups.preparing.map((entry) => entry.id), [preparingOrder.id]);
assert.deepStrictEqual(kitchenGroups.done.map((entry) => entry.id), [doneOrder.id]);

localStorage.clear();
core.loadStore();
core.addToCart('1', 'beer');
const cashOrder = core.createOrder({ tableId: '1', cart: core.loadCart('1') });
core.checkoutTable('1', { method: 'paypay', receivedAmount: 480 });
core.addToCart('2', 'karaage');
const cardOrder = core.createOrder({ tableId: '2', cart: core.loadCart('2') });
core.checkoutTable('2', { method: 'card', receivedAmount: 600 });
const payments = core.paymentHistory();
assert.deepStrictEqual(payments.records.map((entry) => entry.orderId), [cardOrder.id, cashOrder.id]);
assert.deepStrictEqual(payments.records.map((entry) => entry.method), ['card', 'paypay']);
assert.strictEqual(payments.records[0].changeAmount, 20);
assert.strictEqual(payments.total, 1060);

localStorage.clear();
core.loadStore();
const pickupOrder = core.createOrder({
  orderType: 'pickup',
  cart: [{ menuItemId: 'beer', quantity: 1, note: '18:30ごろ' }],
  customer: { name: '田中', phone: '090-1111-2222' },
  fulfillment: { requestedAt: '18:30', note: '店頭受取' }
});
assert.strictEqual(pickupOrder.tableId, '');
assert.strictEqual(pickupOrder.orderType, 'pickup');
assert.strictEqual(pickupOrder.fulfillment.method, 'pickup');
assert.strictEqual(pickupOrder.fulfillment.requestedAt, '18:30');
assert.strictEqual(pickupOrder.customer.name, '田中');
assert.strictEqual(pickupOrder.total, 480);
assert.strictEqual(core.loadStore().tables.find((entry) => entry.id === '3').status, 'available');

const deliveryOrder = core.createOrder({
  orderType: 'delivery',
  cart: [{ menuItemId: 'highball', quantity: 1, note: '' }],
  customer: { name: '佐藤', phone: '090-3333-4444' },
  fulfillment: { requestedAt: '19:00', address: '東京都新宿区1-2-3', note: 'マンション前' },
  deliveryFee: 300
});
assert.strictEqual(deliveryOrder.orderType, 'delivery');
assert.strictEqual(deliveryOrder.fulfillment.method, 'delivery');
assert.strictEqual(deliveryOrder.fulfillment.address, '東京都新宿区1-2-3');
assert.strictEqual(deliveryOrder.subtotal, 420);
assert.strictEqual(deliveryOrder.deliveryFee, 300);
assert.strictEqual(deliveryOrder.total, 720);
core.checkoutOrder(deliveryOrder.id, { method: 'paypay', receivedAmount: 720 });
assert.strictEqual(core.paymentHistory().records[0].orderId, deliveryOrder.id);
const overview = core.businessOverview();
assert.strictEqual(overview.orderCount, 2);
assert.strictEqual(overview.paidCount, 1);
assert.strictEqual(overview.openCount, 1);
assert.strictEqual(overview.salesTotal, 720);
assert.strictEqual(overview.openTotal, 480);
assert.deepStrictEqual(overview.byType, { dineIn: 0, pickup: 1, delivery: 1 });

console.log('izakaya core tests passed');
