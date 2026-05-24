(function (root) {
  const STORE_KEY = 'irakutech.mini.store.v1';
  const CART_PREFIX = 'irakutech.mini.cart.';

  const seed = {
    categories: [
      { id: 'drink', nameJa: 'ドリンク', nameZh: '酒水' },
      { id: 'yakitori', nameJa: '焼き鳥', nameZh: '烤串' },
      { id: 'fried', nameJa: '揚げ物', nameZh: '炸物' },
      { id: 'sashimi', nameJa: '刺身', nameZh: '刺身' },
      { id: 'rice', nameJa: 'ご飯もの', nameZh: '主食' }
    ],
    menu: [
      { id: 'beer', categoryId: 'drink', icon: '🍺', nameJa: '生ビール (中)', nameZh: '生啤（中）', price: 480, desc: '定番の一杯。', recommended: true, soldOut: false },
      { id: 'highball', categoryId: 'drink', icon: '🥃', nameJa: 'ハイボール', nameZh: 'Highball', price: 420, desc: 'すっきり爽快。', recommended: false, soldOut: false },
      { id: 'lemon-sour', categoryId: 'drink', icon: '🍋', nameJa: 'レモンサワー', nameZh: '柠檬沙瓦', price: 430, desc: '揚げ物に合う酸味。', recommended: false, soldOut: false },
      { id: 'momo', categoryId: 'yakitori', icon: '🍢', nameJa: 'もも串', nameZh: '鸡腿肉串', price: 180, desc: '塩・タレ対応。', recommended: true, soldOut: false },
      { id: 'negima', categoryId: 'yakitori', icon: '🍢', nameJa: 'ねぎま', nameZh: '葱鸡肉串', price: 190, desc: '香ばしいねぎと鶏肉。', recommended: false, soldOut: false },
      { id: 'karaage', categoryId: 'fried', icon: '🍗', nameJa: 'から揚げ', nameZh: '炸鸡块', price: 580, desc: '外はカリッと中はジューシー。', recommended: true, soldOut: false },
      { id: 'potato', categoryId: 'fried', icon: '🍟', nameJa: 'ポテトフライ', nameZh: '炸薯条', price: 420, desc: 'お子様にも人気。', recommended: false, soldOut: false },
      { id: 'sashimi-mix', categoryId: 'sashimi', icon: '🐟', nameJa: '刺身盛り合わせ', nameZh: '刺身拼盘', price: 1200, desc: '本日の鮮魚三点盛り。', recommended: true, soldOut: false },
      { id: 'ochazuke', categoryId: 'rice', icon: '🍚', nameJa: '鮭茶漬け', nameZh: '鲑鱼茶泡饭', price: 520, desc: '締めにぴったり。', recommended: false, soldOut: false }
    ],
    tables: [
      { id: '1', area: 'A', seats: 2, status: 'available', enabled: true, token: 'A1DEMO01' },
      { id: '2', area: 'A', seats: 4, status: 'available', enabled: true, token: 'A2DEMO02' },
      { id: '3', area: 'B', seats: 4, status: 'available', enabled: true, token: 'B3DEMO03' },
      { id: '5', area: '座敷', seats: 6, status: 'available', enabled: true, token: 'Z5DEMO05' }
    ],
    orders: []
  };

  function memoryStorage() {
    const data = {};
    return {
      getItem: (key) => Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null,
      setItem: (key, value) => { data[key] = String(value); },
      removeItem: (key) => { delete data[key]; }
    };
  }

  function cookieStorage() {
    return {
      getItem: (key) => {
        const pair = (root.document.cookie || '').split('; ').find((entry) => entry.startsWith(encodeURIComponent(key) + '='));
        return pair ? decodeURIComponent(pair.split('=').slice(1).join('=')) : null;
      },
      setItem: (key, value) => {
        root.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}; path=/; max-age=2592000; SameSite=Lax`;
      },
      removeItem: (key) => {
        root.document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
      },
      keys: () => (root.document.cookie || '').split('; ').filter(Boolean).map((entry) => decodeURIComponent(entry.split('=')[0]))
    };
  }

  function storage() {
    try {
      if (root.localStorage) return root.localStorage;
    } catch (error) {}
    if (root.document && typeof root.document.cookie === 'string') return cookieStorage();
    return (root.__irakutechMemoryStorage ||= memoryStorage());
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadStore() {
    const raw = storage().getItem(STORE_KEY);
    if (!raw) {
      const initial = clone(seed);
      saveStore(initial);
      return initial;
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        categories: parsed.categories || clone(seed.categories),
        menu: parsed.menu || clone(seed.menu),
        tables: normalizeTables(parsed.tables || clone(seed.tables)),
        orders: parsed.orders || []
      };
    } catch (error) {
      const initial = clone(seed);
      saveStore(initial);
      return initial;
    }
  }

  function saveStore(store) {
    storage().setItem(STORE_KEY, JSON.stringify(store));
    return store;
  }

  function randomToken() {
    if (root.crypto?.getRandomValues) {
      const bytes = new Uint8Array(6);
      root.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return Math.random().toString(36).slice(2, 10).toUpperCase() + Date.now().toString(36).slice(-4).toUpperCase();
  }

  function normalizeTables(tables) {
    return tables.map((table) => ({
      id: String(table.id),
      area: table.area || 'A',
      seats: Number(table.seats || 2),
      status: table.status || 'available',
      enabled: table.enabled !== false,
      token: table.token || randomToken()
    }));
  }

  function cartKey(tableId) {
    return CART_PREFIX + tableId;
  }

  function loadCart(tableId) {
    const raw = storage().getItem(cartKey(tableId));
    return raw ? JSON.parse(raw) : [];
  }

  function saveCart(tableId, cart) {
    storage().setItem(cartKey(tableId), JSON.stringify(cart));
    return cart;
  }

  function clearCart(tableId) {
    storage().removeItem(cartKey(tableId));
  }

  function addToCart(tableId, menuItemId) {
    const store = loadStore();
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item || item.soldOut) return loadCart(tableId);
    const cart = loadCart(tableId);
    const existing = cart.find((line) => line.menuItemId === menuItemId);
    if (existing) existing.quantity += 1;
    else cart.push({ menuItemId, quantity: 1, note: '' });
    return saveCart(tableId, cart);
  }

  function updateCartLine(tableId, menuItemId, changes) {
    const cart = loadCart(tableId).map((line) => {
      if (line.menuItemId !== menuItemId) return line;
      return { ...line, ...changes, quantity: Number(changes.quantity ?? line.quantity) };
    }).filter((line) => line.quantity > 0);
    return saveCart(tableId, cart);
  }

  function cartTotal(cart, menu) {
    return cart.reduce((sum, line) => {
      const item = menu.find((entry) => entry.id === line.menuItemId);
      return sum + (item ? item.price * line.quantity : 0);
    }, 0);
  }

  function createOrder({ tableId, cart }) {
    const store = loadStore();
    if (!cart || cart.length === 0) throw new Error('Cart is empty');
    const lines = cart.map((line) => {
      const item = store.menu.find((entry) => entry.id === line.menuItemId);
      if (!item || item.soldOut) throw new Error('Menu item unavailable');
      return {
        menuItemId: item.id,
        nameJa: item.nameJa,
        nameZh: item.nameZh,
        price: item.price,
        quantity: line.quantity,
        note: line.note || ''
      };
    });
    const order = {
      id: 'ORD-' + Date.now(),
      tableId: String(tableId),
      status: 'new',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      lines,
      total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
    };
    store.orders.unshift(order);
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'occupied' } : table);
    saveStore(store);
    clearCart(tableId);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    const store = loadStore();
    store.orders = store.orders.map((order) => order.id === orderId ? { ...order, status } : order);
    saveStore(store);
  }

  function checkoutTable(tableId, payment) {
    const store = loadStore();
    const paymentInfo = typeof payment === 'string' ? { method: payment } : (payment || {});
    const method = paymentInfo.method || 'cash';
    const unpaidOrders = store.orders.filter((order) => order.tableId === String(tableId) && order.paymentStatus !== 'paid');
    const paidTotal = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
    const hasReceived = paymentInfo.receivedAmount !== undefined && paymentInfo.receivedAmount !== null && paymentInfo.receivedAmount !== '';
    const receivedAmount = hasReceived ? Number(paymentInfo.receivedAmount) : paidTotal;
    const changeAmount = Math.max(receivedAmount - paidTotal, 0);
    store.orders = store.orders.map((order) => {
      if (order.tableId !== String(tableId) || order.paymentStatus === 'paid') return order;
      return {
        ...order,
        status: 'paid',
        paymentStatus: 'paid',
        paymentMethod: method,
        receivedAmount,
        changeAmount,
        paidAt: new Date().toISOString()
      };
    });
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'available' } : table);
    saveStore(store);
    return paidTotal;
  }

  function upsertMenuItem(item) {
    const store = loadStore();
    const normalized = { ...item, price: Number(item.price), soldOut: Boolean(item.soldOut), recommended: Boolean(item.recommended) };
    const index = store.menu.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.menu[index] = normalized;
    else store.menu.push(normalized);
    saveStore(store);
    return normalized;
  }

  function toggleSoldOut(menuItemId) {
    const store = loadStore();
    store.menu = store.menu.map((item) => item.id === menuItemId ? { ...item, soldOut: !item.soldOut } : item);
    saveStore(store);
  }

  function upsertTable(table) {
    const store = loadStore();
    const existing = store.tables.find((entry) => entry.id === String(table.id));
    const normalized = {
      id: String(table.id).trim(),
      area: String(table.area || 'A').trim(),
      seats: Number(table.seats || 2),
      status: existing?.status || table.status || 'available',
      enabled: table.enabled !== false,
      token: table.token || existing?.token || randomToken()
    };
    if (!normalized.id) throw new Error('Table id is required');
    const index = store.tables.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.tables[index] = normalized;
    else store.tables.push(normalized);
    store.tables.sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
    saveStore(store);
    return normalized;
  }

  function toggleTableEnabled(tableId) {
    const store = loadStore();
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, enabled: !table.enabled } : table);
    saveStore(store);
  }

  function regenerateTableToken(tableId) {
    const store = loadStore();
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, token: randomToken() } : table);
    saveStore(store);
  }

  function tableOrderUrl({ origin, basePath, table }) {
    const cleanBase = ('/' + (basePath || '').replace(/^\/|\/$/g, '')).replace(/^\/$/, '');
    const url = new URL(`${cleanBase}/order/`, origin);
    url.searchParams.set('table', table.id);
    url.searchParams.set('token', table.token);
    return url.toString();
  }

  function validateTableAccess(tableId, token) {
    const table = loadStore().tables.find((entry) => entry.id === String(tableId));
    if (!table || table.enabled === false) return false;
    if (!token) return true;
    return table.token === token;
  }

  function resetDemo() {
    saveStore(clone(seed));
    const keys = storage().keys ? storage().keys() : Object.keys(storage());
    keys.forEach?.((key) => {
      if (key.startsWith(CART_PREFIX)) storage().removeItem(key);
    });
  }

  const api = {
    STORE_KEY,
    seed,
    loadStore,
    saveStore,
    loadCart,
    saveCart,
    addToCart,
    updateCartLine,
    cartTotal,
    createOrder,
    updateOrderStatus,
    checkoutTable,
    upsertMenuItem,
    toggleSoldOut,
    upsertTable,
    toggleTableEnabled,
    regenerateTableToken,
    tableOrderUrl,
    validateTableAccess,
    resetDemo
  };

  root.IzakayaCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
