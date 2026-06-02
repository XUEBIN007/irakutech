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

localStorage.clear();
core.loadStore();
core.upsertMenuItem({ id: 'edamame', categoryId: 'fried', icon: '🫘', nameJa: '枝豆', nameZh: '毛豆', price: 360, desc: 'すぐ出せる一品。', recommended: false, soldOut: false });
assert.strictEqual(core.inventoryStatus().items.find((entry) => entry.menuItemId === 'edamame').stock, 0);
core.adjustInventory('edamame', { stock: 5, safetyStock: 2 });
assert.strictEqual(core.inventoryStatus().items.find((entry) => entry.menuItemId === 'edamame').stock, 5);
core.adjustInventory('beer', { stock: 3, safetyStock: 2 });
core.addToCart('3', 'beer');
core.addToCart('3', 'beer');
const inventoryOrder = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
let inventory = core.inventoryStatus();
assert.strictEqual(inventory.items.find((entry) => entry.menuItemId === 'beer').stock, 1);
assert.deepStrictEqual(inventory.lowStock.map((entry) => entry.menuItemId), ['beer']);
let movements = core.inventoryMovements('beer');
assert.strictEqual(movements[0].type, 'sale');
assert.strictEqual(movements[0].quantity, -2);
assert.strictEqual(movements[0].stockAfter, 1);
core.recordInventoryMovement('beer', { type: 'restock', quantity: 10, note: '仕入れ' });
inventory = core.inventoryStatus();
assert.strictEqual(inventory.items.find((entry) => entry.menuItemId === 'beer').stock, 11);
core.recordInventoryMovement('beer', { type: 'waste', quantity: 2, note: '破損' });
inventory = core.inventoryStatus();
assert.strictEqual(inventory.items.find((entry) => entry.menuItemId === 'beer').stock, 9);
movements = core.inventoryMovements('beer');
assert.deepStrictEqual(movements.slice(0, 3).map((entry) => entry.type), ['waste', 'restock', 'sale']);
assert.deepStrictEqual(movements.slice(0, 3).map((entry) => entry.stockAfter), [9, 11, 1]);
core.addToCart('2', 'beer');
core.createOrder({ tableId: '2', cart: core.loadCart('2') });
inventory = core.inventoryStatus();
assert.strictEqual(inventory.items.find((entry) => entry.menuItemId === 'beer').stock, 8);
assert.strictEqual(core.loadStore().menu.find((entry) => entry.id === 'beer').soldOut, false);
core.recordInventoryMovement('beer', { type: 'waste', quantity: 8, note: '閉店時廃棄' });
inventory = core.inventoryStatus();
assert.strictEqual(inventory.items.find((entry) => entry.menuItemId === 'beer').stock, 0);
assert.strictEqual(core.loadStore().menu.find((entry) => entry.id === 'beer').soldOut, true);
assert.throws(() => core.createOrder({ tableId: '1', cart: [{ menuItemId: 'beer', quantity: 1 }] }), /Menu item unavailable/);

core.checkoutTable('3', { method: 'cash', receivedAmount: 1000 });
core.checkoutTable('2', { method: 'paypay', receivedAmount: 480 });
const report = core.dailyReport(new Date(inventoryOrder.createdAt));
assert.strictEqual(report.salesTotal, 1440);
assert.deepStrictEqual(report.paymentMethods, { cash: 960, paypay: 480 });
assert.deepStrictEqual(report.topItems.slice(0, 1), [{ menuItemId: 'beer', nameJa: '生ビール (中)', quantity: 3, total: 1440 }]);
assert.strictEqual(report.cashExpected, 960);
assert.strictEqual(report.openOrderCount, 0);
assert.strictEqual(report.openTotal, 0);
const closeRecord = core.closeBusinessDay({
  date: report.date,
  cashActual: 950,
  note: 'レジ点検'
});
assert.strictEqual(closeRecord.date, report.date);
assert.strictEqual(closeRecord.cashExpected, 960);
assert.strictEqual(closeRecord.cashActual, 950);
assert.strictEqual(closeRecord.cashDifference, -10);
assert.strictEqual(core.dailyCloseHistory()[0].cashDifference, -10);

core.addToCart('1', 'karaage');
core.createOrder({ tableId: '1', cart: core.loadCart('1') });
const warningReport = core.dailyReport(new Date(inventoryOrder.createdAt));
assert.strictEqual(warningReport.openOrderCount, 1);
assert.strictEqual(warningReport.openTotal, 580);
assert.strictEqual(warningReport.readyToClose, false);

localStorage.clear();
core.loadStore();
core.upsertStaff({ id: 'sato', name: '佐藤', role: 'kitchen', active: true, hourlyWage: 1200 });
core.upsertStaffSchedule({
  staffId: 'sato',
  date: '2026-06-02',
  startTime: '09:00',
  endTime: '17:30',
  breakMinutes: 30
});
core.clockIn('sato', new Date('2026-06-02T09:00:00+09:00'));
core.startBreak('sato', new Date('2026-06-02T12:00:00+09:00'));
core.endBreak('sato', new Date('2026-06-02T12:30:00+09:00'));
core.clockOut('sato', new Date('2026-06-02T17:00:00+09:00'));
const labor = core.laborSummary(new Date('2026-06-02T18:00:00+09:00'));
assert.strictEqual(labor.staff.length, 3);
assert.strictEqual(labor.entries.find((entry) => entry.staffId === 'sato').workedMinutes, 450);
assert.strictEqual(labor.entries.find((entry) => entry.staffId === 'sato').breakMinutes, 30);
assert.strictEqual(labor.entries.find((entry) => entry.staffId === 'sato').earlyLeaveMinutes, 30);
assert.strictEqual(labor.entries.find((entry) => entry.staffId === 'sato').estimatedWage, 9000);
assert.strictEqual(labor.schedules.find((entry) => entry.staffId === 'sato').scheduledMinutes, 480);
assert.strictEqual(labor.totals.workedMinutes, 450);
assert.strictEqual(labor.totals.estimatedWages, 9000);
assert.strictEqual(labor.onDuty.length, 0);

core.upsertStaff({ id: 'yamada', name: '山田', role: 'hall', active: true, hourlyWage: 1100 });
core.upsertStaffSchedule({
  staffId: 'yamada',
  date: '2026-06-02',
  startTime: '10:00',
  endTime: '15:00',
  breakMinutes: 0
});
core.clockIn('yamada', new Date('2026-06-02T10:12:00+09:00'));
const activeLabor = core.laborSummary(new Date('2026-06-02T12:00:00+09:00'));
assert.strictEqual(activeLabor.entries.find((entry) => entry.staffId === 'yamada').lateMinutes, 12);
assert.strictEqual(activeLabor.entries.find((entry) => entry.staffId === 'yamada').status, 'working');

localStorage.clear();
core.loadStore();
core.openTable('3', { guestCount: 4, note: '予約 山本' });
let tableOpsStore = core.loadStore();
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '3').status, 'occupied');
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '3').guestCount, 4);
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '3').note, '予約 山本');
core.addToCart('3', 'beer');
const movedOrder = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
core.transferTable('3', '2', { note: '窓側へ移動' });
tableOpsStore = core.loadStore();
assert.strictEqual(tableOpsStore.orders.find((entry) => entry.id === movedOrder.id).tableId, '2');
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '3').status, 'available');
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '2').status, 'occupied');
assert.strictEqual(tableOpsStore.tableEvents[0].type, 'transfer');
core.addToCart('1', 'karaage');
const mergedOrder = core.createOrder({ tableId: '1', cart: core.loadCart('1') });
core.mergeTables('1', '2', { note: '団体会計' });
tableOpsStore = core.loadStore();
assert.strictEqual(tableOpsStore.orders.find((entry) => entry.id === mergedOrder.id).tableId, '2');
assert.strictEqual(core.tableOpenSummary('2').orders.length, 2);
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '1').status, 'available');
assert.strictEqual(tableOpsStore.tableEvents[0].type, 'merge');
core.clearTable('2', { note: '清掃済み' });
tableOpsStore = core.loadStore();
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '2').status, 'available');
assert.strictEqual(tableOpsStore.tables.find((entry) => entry.id === '2').note, '清掃済み');
assert.strictEqual(tableOpsStore.tableEvents[0].type, 'clear');

localStorage.clear();
core.loadStore();
const customerFirstOrder = core.createOrder({
  orderType: 'pickup',
  cart: [{ menuItemId: 'beer', quantity: 1, note: '' }],
  customer: { name: '田中', phone: '090-1111-2222' },
  fulfillment: { requestedAt: '18:00', note: '辛いもの苦手' }
});
core.checkoutOrder(customerFirstOrder.id, { method: 'cash', receivedAmount: 480 });
const customerSecondOrder = core.createOrder({
  orderType: 'delivery',
  cart: [{ menuItemId: 'karaage', quantity: 1, note: 'マヨ別' }],
  customer: { name: '田中 太郎', phone: '09011112222' },
  fulfillment: { requestedAt: '19:00', address: '東京都新宿区1-2-3', note: '' },
  deliveryFee: 300
});
core.checkoutOrder(customerSecondOrder.id, { method: 'paypay', receivedAmount: 880 });
let customers = core.customerProfiles();
assert.strictEqual(customers.length, 1);
assert.strictEqual(customers[0].phone, '09011112222');
assert.strictEqual(customers[0].name, '田中 太郎');
assert.strictEqual(customers[0].orderCount, 2);
assert.strictEqual(customers[0].totalSpent, 1360);
assert.strictEqual(customers[0].lastOrderId, customerSecondOrder.id);
core.updateCustomerNote('090-1111-2222', '辛いもの苦手 / マヨ別');
customers = core.customerProfiles();
assert.strictEqual(customers[0].note, '辛いもの苦手 / マヨ別');
assert.strictEqual(core.customerProfile('09011112222').orders.length, 2);

console.log('izakaya core tests passed');
