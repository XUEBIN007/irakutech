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

const paidTotal = core.checkoutTable('3', 'cash');
assert.strictEqual(paidTotal, 960);
assert.strictEqual(core.loadStore().orders[0].paymentStatus, 'paid');
assert.strictEqual(core.loadStore().tables.find((table) => table.id === '3').status, 'available');

core.toggleSoldOut('beer');
assert.strictEqual(core.loadStore().menu.find((item) => item.id === 'beer').soldOut, true);

console.log('izakaya core tests passed');
