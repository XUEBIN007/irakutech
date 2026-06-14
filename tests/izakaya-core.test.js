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
const store = core.loadStore();

assert.strictEqual(store.restaurant.nameJa, '本町中華食堂（仮）');
assert.strictEqual(store.restaurant.shortName, '本町中華');
assert.strictEqual(store.restaurant.phone, '店頭確認');
assert.strictEqual(store.settings.defaultPaymentMethod, 'cash');
assert.strictEqual(store.settings.cashFirst, true);
assert.deepStrictEqual(core.availablePaymentMethods(store).map((method) => method.id), ['cash']);
assert.strictEqual(core.tableOrderUrl('https://nanakaori.com', '座敷-6'), 'https://nanakaori.com/order/?table=%E5%BA%A7%E6%95%B7-6');
assert.ok(store.categories.some((category) => category.id === 'course' && category.nameJa === '食べ飲み放題'));
assert.ok(store.categories.some((category) => category.id === 'banquet' && category.nameJa === '晩酌セット'));
assert.ok(store.menu.length >= 40);
assert.ok(store.menu.some((item) => item.id === 'tabe-nomi-3500' && item.price === 3500 && item.categoryId === 'course'));
assert.ok(store.menu.some((item) => item.id === 'banshaku-set' && item.price === 680 && item.categoryId === 'banquet'));
assert.ok(store.menu.some((item) => item.id === 'spicy-miso-ramen' && item.price === 790 && item.categoryId === 'noodle'));
assert.ok(store.menu.some((item) => item.id === 'sweet-sour-pork' && item.recommended));
assert.ok(store.tables.some((table) => table.id === '6' && table.area === '座敷'));

const session = core.startTableSession('3', { guestCount: 4, note: '窓側希望', source: 'customer' });
assert.strictEqual(session.id, '3');
assert.strictEqual(session.status, 'occupied');
assert.strictEqual(session.guestCount, 4);
assert.strictEqual(session.note, '窓側希望');
assert.ok(session.openedAt);
let tableEvents = core.loadStore().tableEvents;
assert.strictEqual(tableEvents[0].type, 'open');
assert.strictEqual(tableEvents[0].tableId, '3');
assert.strictEqual(tableEvents[0].source, 'customer');
assert.strictEqual(tableEvents[0].guestCount, 4);

core.addToCart('3', 'banshaku-set');
core.addToCart('3', 'banshaku-set');
core.updateCartLine('3', 'banshaku-set', { note: '生ビールで' });

const order = core.createOrder({ tableId: '3', cart: core.loadCart('3') });
assert.strictEqual(order.tableId, '3');
assert.strictEqual(order.lines[0].quantity, 2);
assert.strictEqual(order.lines[0].note, '生ビールで');
assert.strictEqual(order.total, 1360);
assert.strictEqual(core.loadCart('3').length, 0);
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').status, 'occupied');

const checkoutRequest = core.requestCheckout('3', { note: '現金でお願いします', source: 'customer' });
assert.strictEqual(checkoutRequest.status, 'checkout-requested');
assert.strictEqual(checkoutRequest.checkoutNote, '現金でお願いします');
assert.ok(checkoutRequest.checkoutRequestedAt);
tableEvents = core.loadStore().tableEvents;
assert.strictEqual(tableEvents[0].type, 'checkout_request');
assert.strictEqual(tableEvents[0].source, 'customer');
assert.strictEqual(tableEvents[0].tableId, '3');
assert.ok(core.managerAlerts().some((alert) => alert.type === 'checkout_requested' && alert.quantity === 1));

const staffCall = core.requestStaffCall('3', { reason: 'water', note: '水をお願いします', source: 'customer' });
assert.strictEqual(staffCall.type, 'staff_call');
assert.strictEqual(staffCall.tableId, '3');
assert.strictEqual(staffCall.reason, 'water');
assert.strictEqual(staffCall.note, '水をお願いします');
assert.strictEqual(staffCall.resolvedAt, '');
assert.ok(core.activeStaffCalls().some((entry) => entry.id === staffCall.id && entry.tableId === '3'));
assert.ok(core.managerAlerts().some((alert) => alert.type === 'staff_call' && alert.quantity === 1));
const resolvedCall = core.resolveStaffCall(staffCall.id, { source: 'staff' });
assert.ok(resolvedCall.resolvedAt);
assert.strictEqual(core.activeStaffCalls().some((entry) => entry.id === staffCall.id), false);
assert.strictEqual(core.managerAlerts().some((alert) => alert.type === 'staff_call'), false);

core.updateOrderStatus(order.id, 'done');
assert.strictEqual(core.loadStore().orders[0].status, 'done');

const paidTotal = core.checkoutTable('3', 'cash');
assert.strictEqual(paidTotal, 1360);
assert.strictEqual(core.loadStore().orders[0].paymentStatus, 'paid');
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').status, 'available');
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').checkoutRequestedAt, '');
const paidSummary = core.tableRecentCheckout('3');
assert.strictEqual(paidSummary.tableId, '3');
assert.strictEqual(paidSummary.total, 1360);
assert.strictEqual(paidSummary.orderCount, 1);
assert.ok(paidSummary.paidAt);
assert.ok(paidSummary.orders.every((entry) => entry.paymentStatus === 'paid'));

core.toggleSoldOut('banshaku-set');
assert.strictEqual(core.loadStore().menu.find((item) => item.id === 'banshaku-set').soldOut, true);

const secondCart = core.saveCart('4', [{ menuItemId: 'mapo-tofu', quantity: 1, note: '辛さ普通' }]);
const secondOrder = core.createOrder({ tableId: '4', cart: secondCart });
const canceled = core.cancelOrder(secondOrder.id, '客人取消');
assert.strictEqual(canceled.status, 'canceled');
assert.strictEqual(canceled.cancelReason, '客人取消');
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '4').status, 'available');

const summary = core.dailySummary();
assert.strictEqual(summary.orderCount, 1);
assert.strictEqual(summary.paidTotal, 1360);
assert.strictEqual(summary.unpaidTotal, 0);
assert.ok(summary.topItems.some((item) => item.nameJa === '晩酌セット' && item.quantity === 2));

const kdsCart = core.saveCart('5', [
  { menuItemId: 'mapo-tofu', quantity: 1, note: '辛さ控えめ' },
  { menuItemId: 'grilled-gyoza', quantity: 2, note: '' }
]);
const kdsOrder = core.createOrder({ tableId: '5', cart: kdsCart });
assert.strictEqual(kdsOrder.lines[0].status, 'new');
assert.ok(kdsOrder.lines[0].id);
let progress = core.tableOrderProgress('5');
assert.strictEqual(progress.totalQuantity, 3);
assert.strictEqual(progress.doneQuantity, 0);
assert.strictEqual(progress.openQuantity, 3);
assert.strictEqual(progress.ready, false);
assert.strictEqual(core.kitchenQueueItems().length, 2);
const doneLine = core.updateOrderLineStatus(kdsOrder.id, kdsOrder.lines[0].id, 'done');
assert.strictEqual(doneLine.status, 'done');
progress = core.tableOrderProgress('5');
assert.strictEqual(progress.totalQuantity, 3);
assert.strictEqual(progress.doneQuantity, 1);
assert.strictEqual(progress.openQuantity, 2);
assert.strictEqual(progress.ready, false);
assert.strictEqual(core.kitchenQueueItems().length, 1);
assert.strictEqual(core.kitchenQueueItems()[0].nameJa, '焼き餃子（6ヶ）');
core.updateOrderLineStatus(kdsOrder.id, kdsOrder.lines[1].id, 'done');
assert.strictEqual(core.loadStore().orders.find((entry) => entry.id === kdsOrder.id).status, 'done');
progress = core.tableOrderProgress('5');
assert.strictEqual(progress.doneQuantity, 3);
assert.strictEqual(progress.openQuantity, 0);
assert.strictEqual(progress.ready, true);

const agingCart = core.saveCart('6', [{ menuItemId: 'yu-lin-chi', quantity: 1, note: '' }]);
const agingOrder = core.createOrder({ tableId: '6', cart: agingCart });
const agingStore = core.loadStore();
agingStore.orders = agingStore.orders.map((entry) => (
  entry.id === agingOrder.id
    ? { ...entry, createdAt: '2026-06-13T12:00:00.000Z' }
    : entry
));
core.saveStore(agingStore);
assert.strictEqual(core.kitchenQueueItems(new Date('2026-06-13T12:04:59.000Z'))[0].urgency, 'normal');
assert.strictEqual(core.kitchenQueueItems(new Date('2026-06-13T12:05:00.000Z'))[0].urgency, 'warning');
assert.strictEqual(core.kitchenQueueItems(new Date('2026-06-13T12:10:00.000Z'))[0].urgency, 'urgent');
assert.strictEqual(core.kitchenQueueItems(new Date('2026-06-13T12:10:00.000Z'))[0].waitMinutes, 10);

console.log('izakaya core tests passed');
