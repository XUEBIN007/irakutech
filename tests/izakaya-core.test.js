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
assert.strictEqual(order.lines[0].quantity, 2);
assert.strictEqual(order.lines[0].note, '少泡沫');
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

console.log('izakaya core tests passed');
