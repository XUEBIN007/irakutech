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
    inventory: [
      { menuItemId: 'beer', stock: 24, safetyStock: 8 },
      { menuItemId: 'highball', stock: 24, safetyStock: 8 },
      { menuItemId: 'lemon-sour', stock: 24, safetyStock: 8 },
      { menuItemId: 'momo', stock: 30, safetyStock: 10 },
      { menuItemId: 'negima', stock: 30, safetyStock: 10 },
      { menuItemId: 'karaage', stock: 18, safetyStock: 6 },
      { menuItemId: 'potato', stock: 18, safetyStock: 6 },
      { menuItemId: 'sashimi-mix', stock: 10, safetyStock: 3 },
      { menuItemId: 'ochazuke', stock: 16, safetyStock: 5 }
    ],
    inventoryMovements: [],
    tables: [
      { id: '1', area: 'A', seats: 2, status: 'available', enabled: true, token: 'A1DEMO01' },
      { id: '2', area: 'A', seats: 4, status: 'available', enabled: true, token: 'A2DEMO02' },
      { id: '3', area: 'B', seats: 4, status: 'available', enabled: true, token: 'B3DEMO03' },
      { id: '5', area: '座敷', seats: 6, status: 'available', enabled: true, token: 'Z5DEMO05' }
    ],
    staff: [
      { id: 'owner', name: '店長', role: 'manager', active: true, hourlyWage: 1500 },
      { id: 'kitchen-a', name: '厨房A', role: 'kitchen', active: true, hourlyWage: 1200 }
    ],
    staffSchedules: [],
    timeEntries: [],
    dailyCloses: [],
    tableEvents: [],
    customerNotes: [],
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

  function demoAutoRestockEnabled() {
    return root.IzakayaCloudConfig?.demoAutoRestock === true;
  }

  function restoreDemoInventory(store) {
    if (!demoAutoRestockEnabled()) return false;
    let changed = false;
    const seedStock = new Map(seed.inventory.map((entry) => [entry.menuItemId, entry.stock]));
    store.inventory.forEach((entry) => {
      const targetStock = seedStock.get(entry.menuItemId) ?? Math.max(entry.safetyStock * 3, 12);
      const item = store.menu.find((menuItem) => menuItem.id === entry.menuItemId);
      if (entry.stock <= entry.safetyStock || item?.soldOut) {
        entry.stock = Math.max(entry.stock, targetStock);
        if (item) item.soldOut = false;
        changed = true;
      }
    });
    return changed;
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
      const normalized = {
        categories: parsed.categories || clone(seed.categories),
        menu: parsed.menu || clone(seed.menu),
        inventory: normalizeInventory(parsed.inventory, parsed.menu || seed.menu),
        inventoryMovements: (parsed.inventoryMovements || []).map(normalizeInventoryMovement),
        tables: normalizeTables(parsed.tables || clone(seed.tables)),
        staff: normalizeStaff(parsed.staff || clone(seed.staff)),
        staffSchedules: (parsed.staffSchedules || []).map(normalizeStaffSchedule),
        timeEntries: (parsed.timeEntries || []).map(normalizeTimeEntry),
        dailyCloses: (parsed.dailyCloses || []).map(normalizeDailyClose),
        tableEvents: (parsed.tableEvents || []).map(normalizeTableEvent),
        customerNotes: (parsed.customerNotes || []).map(normalizeCustomerNote),
        orders: (parsed.orders || []).map(normalizeOrder)
      };
      if (restoreDemoInventory(normalized)) saveStore(normalized);
      return normalized;
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
      token: table.token || randomToken(),
      guestCount: Number(table.guestCount || 0),
      openedAt: table.openedAt || '',
      note: table.note || ''
    }));
  }

  function normalizeTableEvent(event) {
    return {
      id: event.id || 'TABLE-' + randomToken(),
      type: event.type,
      tableId: event.tableId ? String(event.tableId) : '',
      fromTableId: event.fromTableId ? String(event.fromTableId) : '',
      toTableId: event.toTableId ? String(event.toTableId) : '',
      guestCount: Number(event.guestCount || 0),
      note: event.note || '',
      createdAt: event.createdAt || new Date().toISOString()
    };
  }

  function addTableEvent(store, event) {
    const normalized = normalizeTableEvent({
      id: 'TABLE-' + Date.now() + '-' + randomToken().slice(0, 4),
      createdAt: new Date().toISOString(),
      ...event
    });
    store.tableEvents.unshift(normalized);
    return normalized;
  }

  function normalizeInventory(inventory, menu) {
    const byId = new Map((inventory || []).map((entry) => [entry.menuItemId, entry]));
    return menu.map((item) => {
      const entry = byId.get(item.id) || {};
      return {
        menuItemId: item.id,
        stock: Number(entry.stock ?? 0),
        safetyStock: Number(entry.safetyStock ?? 0)
      };
    });
  }

  function normalizeInventoryMovement(entry) {
    return {
      id: entry.id || 'INV-' + randomToken(),
      menuItemId: String(entry.menuItemId),
      type: entry.type || 'adjustment',
      quantity: Number(entry.quantity || 0),
      stockAfter: Number(entry.stockAfter || 0),
      note: entry.note || '',
      orderId: entry.orderId || '',
      createdAt: entry.createdAt || new Date().toISOString()
    };
  }

  function movementDelta(type, quantity) {
    const value = Math.abs(Number(quantity || 0));
    if (type === 'sale' || type === 'waste') return -value;
    return value;
  }

  function setMenuSoldOutByStock(store, menuItemId, stock) {
    store.menu = store.menu.map((item) => item.id === menuItemId ? { ...item, soldOut: stock <= 0 } : item);
  }

  function addInventoryMovement(store, menuItemId, movement) {
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item) throw new Error('Menu item not found');
    let inventoryItem = store.inventory.find((entry) => entry.menuItemId === menuItemId);
    if (!inventoryItem) {
      inventoryItem = { menuItemId, stock: 0, safetyStock: 0 };
      store.inventory.push(inventoryItem);
    }
    const type = movement.type || 'adjustment';
    const delta = movementDelta(type, movement.quantity);
    const nextStock = Math.max(0, inventoryItem.stock + delta);
    inventoryItem.stock = nextStock;
    setMenuSoldOutByStock(store, menuItemId, nextStock);
    const entry = normalizeInventoryMovement({
      id: 'INV-' + Date.now() + '-' + randomToken().slice(0, 4),
      menuItemId,
      type,
      quantity: delta,
      stockAfter: nextStock,
      note: movement.note || '',
      orderId: movement.orderId || '',
      createdAt: movement.createdAt || new Date().toISOString()
    });
    store.inventoryMovements.unshift(entry);
    return entry;
  }

  function normalizeStaff(staff) {
    return staff.map((entry) => ({
      id: String(entry.id).trim(),
      name: String(entry.name || '').trim(),
      role: entry.role || 'staff',
      active: entry.active !== false,
      hourlyWage: Number(entry.hourlyWage || 0)
    })).filter((entry) => entry.id && entry.name);
  }

  function normalizeStaffSchedule(schedule) {
    return {
      id: schedule.id || `${schedule.staffId}-${schedule.date}`,
      staffId: String(schedule.staffId),
      date: schedule.date,
      startTime: schedule.startTime || '09:00',
      endTime: schedule.endTime || '17:00',
      breakMinutes: Number(schedule.breakMinutes || 0),
      note: schedule.note || ''
    };
  }

  function normalizeTimeEntry(entry) {
    return {
      id: entry.id || 'TIME-' + randomToken(),
      staffId: String(entry.staffId),
      clockIn: entry.clockIn,
      clockOut: entry.clockOut || '',
      breakStartedAt: entry.breakStartedAt || '',
      breakMinutes: Number(entry.breakMinutes || 0),
      status: entry.status || (entry.clockOut ? 'done' : 'working')
    };
  }

  function normalizeDailyClose(entry) {
    return {
      id: entry.id || 'CLOSE-' + randomToken(),
      date: entry.date,
      cashExpected: Number(entry.cashExpected || 0),
      cashActual: Number(entry.cashActual || 0),
      cashDifference: Number(entry.cashDifference || 0),
      salesTotal: Number(entry.salesTotal || 0),
      openTotal: Number(entry.openTotal || 0),
      paymentMethods: entry.paymentMethods || {},
      note: entry.note || '',
      closedAt: entry.closedAt || new Date().toISOString()
    };
  }

  function normalizePhone(phone) {
    return String(phone || '').replace(/[^\d]/g, '');
  }

  function normalizeCustomerNote(entry) {
    return {
      phone: normalizePhone(entry.phone),
      note: entry.note || '',
      updatedAt: entry.updatedAt || new Date().toISOString()
    };
  }

  function normalizeOrder(order) {
    const orderType = order.orderType || (order.tableId ? 'dine-in' : 'pickup');
    const deliveryFee = Number(order.deliveryFee || 0);
    const subtotal = Number(order.subtotal ?? order.total ?? 0) - (order.subtotal === undefined && deliveryFee ? deliveryFee : 0);
    return {
      ...order,
      tableId: order.tableId ? String(order.tableId) : '',
      orderType,
      customer: {
        name: order.customer?.name || '',
        phone: order.customer?.phone || ''
      },
      fulfillment: {
        method: order.fulfillment?.method || orderType,
        requestedAt: order.fulfillment?.requestedAt || '',
        address: order.fulfillment?.address || '',
        note: order.fulfillment?.note || ''
      },
      fulfillmentStatus: order.fulfillmentStatus || 'pending',
      subtotal,
      deliveryFee,
      total: Number(order.total ?? subtotal + deliveryFee)
    };
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

  function createOrder({ tableId = '', cart, orderType, customer, fulfillment, deliveryFee = 0 }) {
    const store = loadStore();
    if (!cart || cart.length === 0) throw new Error('Cart is empty');
    const normalizedOrderType = orderType || (tableId ? 'dine-in' : 'pickup');
    const normalizedDeliveryFee = Number(deliveryFee || 0);
    const lines = cart.map((line) => {
      const item = store.menu.find((entry) => entry.id === line.menuItemId);
      const inventoryItem = store.inventory.find((entry) => entry.menuItemId === line.menuItemId);
      const quantity = Number(line.quantity || 0);
      if (!item || item.soldOut || quantity <= 0 || (inventoryItem && inventoryItem.stock < quantity)) throw new Error('Menu item unavailable');
      return {
        menuItemId: item.id,
        nameJa: item.nameJa,
        nameZh: item.nameZh,
        price: item.price,
        quantity,
        note: line.note || ''
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const order = {
      id: 'ORD-' + Date.now() + '-' + randomToken().slice(0, 4),
      tableId: tableId ? String(tableId) : '',
      orderType: normalizedOrderType,
      customer: {
        name: customer?.name || '',
        phone: customer?.phone || ''
      },
      fulfillment: {
        method: fulfillment?.method || normalizedOrderType,
        requestedAt: fulfillment?.requestedAt || '',
        address: fulfillment?.address || '',
        note: fulfillment?.note || ''
      },
      fulfillmentStatus: 'pending',
      status: 'new',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      lines,
      subtotal,
      deliveryFee: normalizedDeliveryFee,
      total: subtotal + normalizedDeliveryFee
    };
    lines.forEach((line) => {
      const inventoryItem = store.inventory.find((entry) => entry.menuItemId === line.menuItemId);
      if (!inventoryItem) return;
      addInventoryMovement(store, line.menuItemId, {
        type: 'sale',
        quantity: line.quantity,
        orderId: order.id,
        note: order.tableId ? `Table ${order.tableId}` : order.orderType
      });
    });
    store.orders.unshift(order);
    if (normalizedOrderType === 'dine-in' && tableId) {
      store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'occupied', openedAt: table.openedAt || order.createdAt } : table);
    }
    saveStore(store);
    if (tableId) clearCart(tableId);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    const store = loadStore();
    store.orders = store.orders.map((order) => order.id === orderId ? { ...order, status } : order);
    saveStore(store);
  }

  function tableOpenSummary(tableId) {
    const orders = loadStore().orders.filter((order) => (
      order.tableId === String(tableId) && order.paymentStatus !== 'paid'
    ));
    return {
      tableId: String(tableId),
      orders,
      total: orders.reduce((sum, order) => sum + order.total, 0)
    };
  }

  function kitchenOrderGroups() {
    const groups = { new: [], preparing: [], done: [] };
    loadStore().orders
      .filter((order) => order.paymentStatus !== 'paid')
      .forEach((order) => {
        const status = groups[order.status] ? order.status : 'new';
        groups[status].push(order);
      });
    return groups;
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
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'available', guestCount: 0, openedAt: '' } : table);
    saveStore(store);
    return paidTotal;
  }

  function checkoutOrder(orderId, payment) {
    const store = loadStore();
    const order = store.orders.find((entry) => entry.id === orderId && entry.paymentStatus !== 'paid');
    if (!order) return 0;
    const paymentInfo = typeof payment === 'string' ? { method: payment } : (payment || {});
    const method = paymentInfo.method || 'cash';
    const hasReceived = paymentInfo.receivedAmount !== undefined && paymentInfo.receivedAmount !== null && paymentInfo.receivedAmount !== '';
    const receivedAmount = hasReceived ? Number(paymentInfo.receivedAmount) : order.total;
    const changeAmount = Math.max(receivedAmount - order.total, 0);
    store.orders = store.orders.map((entry) => entry.id === orderId ? {
      ...entry,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: method,
      receivedAmount,
      changeAmount,
      paidAt: new Date().toISOString()
    } : entry);
    saveStore(store);
    return order.total;
  }

  function paymentHistory() {
    const records = loadStore().orders
      .filter((order) => order.paymentStatus === 'paid')
      .map((order) => ({
        orderId: order.id,
        tableId: order.tableId,
        orderType: order.orderType,
        customer: order.customer,
        fulfillment: order.fulfillment,
        method: order.paymentMethod || 'cash',
        total: order.total,
        receivedAmount: order.receivedAmount ?? order.total,
        changeAmount: order.changeAmount || 0,
        paidAt: order.paidAt,
        lines: order.lines
      }))
      .sort((a, b) => String(b.paidAt || '').localeCompare(String(a.paidAt || '')));
    return {
      records,
      total: records.reduce((sum, record) => sum + record.total, 0)
    };
  }

  function businessOverview(now = new Date()) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const todayOrders = loadStore().orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= start && createdAt < end;
    });
    const openOrders = todayOrders.filter((order) => order.paymentStatus !== 'paid');
    const paidOrders = todayOrders.filter((order) => order.paymentStatus === 'paid');
    const byType = { dineIn: 0, pickup: 0, delivery: 0 };
    todayOrders.forEach((order) => {
      if (order.orderType === 'pickup') byType.pickup += 1;
      else if (order.orderType === 'delivery') byType.delivery += 1;
      else byType.dineIn += 1;
    });
    return {
      date: start.toISOString().slice(0, 10),
      orderCount: todayOrders.length,
      paidCount: paidOrders.length,
      openCount: openOrders.length,
      salesTotal: paidOrders.reduce((sum, order) => sum + order.total, 0),
      openTotal: openOrders.reduce((sum, order) => sum + order.total, 0),
      byType
    };
  }

  function dailyReport(now = new Date()) {
    const targetDate = typeof now === 'string' ? now : dateKey(now);
    const overview = businessOverview(new Date(`${targetDate}T12:00:00`));
    overview.date = targetDate;
    const paidOrders = loadStore().orders.filter((order) => {
      return order.paymentStatus === 'paid' && dateKey(order.paidAt || order.createdAt) === targetDate;
    });
    const paymentMethods = {};
    const itemMap = new Map();
    paidOrders.forEach((order) => {
      const method = order.paymentMethod || 'cash';
      paymentMethods[method] = (paymentMethods[method] || 0) + order.total;
      order.lines.forEach((line) => {
        const current = itemMap.get(line.menuItemId) || { menuItemId: line.menuItemId, nameJa: line.nameJa, quantity: 0, total: 0 };
        current.quantity += line.quantity;
        current.total += line.price * line.quantity;
        itemMap.set(line.menuItemId, current);
      });
    });
    const cashExpected = paidOrders
      .filter((order) => (order.paymentMethod || 'cash') === 'cash')
      .reduce((sum, order) => sum + order.total, 0);
    const openOrders = loadStore().orders.filter((order) => {
      return order.paymentStatus !== 'paid' && dateKey(order.createdAt) === targetDate;
    });
    return {
      ...overview,
      salesTotal: paidOrders.reduce((sum, order) => sum + order.total, 0),
      cashExpected,
      openOrderCount: openOrders.length,
      readyToClose: openOrders.length === 0,
      paymentMethods,
      topItems: Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity || b.total - a.total)
    };
  }

  function closeBusinessDay({ date, cashActual, note = '' }) {
    const store = loadStore();
    const report = dailyReport(date);
    const normalized = normalizeDailyClose({
      id: 'CLOSE-' + date + '-' + randomToken().slice(0, 4),
      date,
      cashExpected: report.cashExpected,
      cashActual: Number(cashActual || 0),
      cashDifference: Number(cashActual || 0) - report.cashExpected,
      salesTotal: report.salesTotal,
      openTotal: report.openTotal,
      paymentMethods: report.paymentMethods,
      note,
      closedAt: new Date().toISOString()
    });
    const index = store.dailyCloses.findIndex((entry) => entry.date === date);
    if (index >= 0) store.dailyCloses[index] = normalized;
    else store.dailyCloses.unshift(normalized);
    saveStore(store);
    return normalized;
  }

  function dailyCloseHistory() {
    return loadStore().dailyCloses
      .slice()
      .sort((a, b) => String(b.closedAt).localeCompare(String(a.closedAt)));
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

  function adjustInventory(menuItemId, changes) {
    const store = loadStore();
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item) throw new Error('Menu item not found');
    const existing = store.inventory.find((entry) => entry.menuItemId === menuItemId);
    const normalized = {
      menuItemId,
      stock: Number(changes.stock ?? existing?.stock ?? 0),
      safetyStock: Number(changes.safetyStock ?? existing?.safetyStock ?? 0)
    };
    if (existing) Object.assign(existing, normalized);
    else store.inventory.push(normalized);
    setMenuSoldOutByStock(store, menuItemId, normalized.stock);
    saveStore(store);
    return normalized;
  }

  function recordInventoryMovement(menuItemId, movement) {
    const store = loadStore();
    const entry = addInventoryMovement(store, menuItemId, movement);
    saveStore(store);
    return entry;
  }

  function inventoryMovements(menuItemId) {
    return loadStore().inventoryMovements
      .filter((entry) => !menuItemId || entry.menuItemId === menuItemId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  function inventoryStatus() {
    const store = loadStore();
    const items = store.inventory.map((entry) => {
      const item = store.menu.find((menuItem) => menuItem.id === entry.menuItemId);
      return {
        ...entry,
        nameJa: item?.nameJa || entry.menuItemId,
        nameZh: item?.nameZh || entry.menuItemId,
        soldOut: item?.soldOut === true,
        lowStock: entry.stock <= entry.safetyStock
      };
    });
    return {
      items,
      lowStock: items.filter((entry) => entry.lowStock)
    };
  }

  function upsertStaff(staff) {
    const store = loadStore();
    const normalized = normalizeStaff([staff])[0];
    if (!normalized) throw new Error('Staff name is required');
    const index = store.staff.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.staff[index] = normalized;
    else store.staff.push(normalized);
    saveStore(store);
    return normalized;
  }

  function upsertStaffSchedule(schedule) {
    const store = loadStore();
    if (!store.staff.some((entry) => entry.id === schedule.staffId)) throw new Error('Staff not found');
    const normalized = normalizeStaffSchedule({
      ...schedule,
      id: schedule.id || `${schedule.staffId}-${schedule.date}`
    });
    const index = store.staffSchedules.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.staffSchedules[index] = normalized;
    else store.staffSchedules.push(normalized);
    saveStore(store);
    return normalized;
  }

  function dateKey(value) {
    const date = new Date(value);
    return date.toISOString().slice(0, 10);
  }

  function minutesOfDay(isoTime) {
    const date = new Date(isoTime);
    return date.getHours() * 60 + date.getMinutes();
  }

  function scheduleMinutes(schedule) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return Math.max(0, end - start - schedule.breakMinutes);
  }

  function scheduleBounds(schedule) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    return {
      start: startHour * 60 + startMinute,
      end: endHour * 60 + endMinute
    };
  }

  function openTimeEntry(store, staffId) {
    return store.timeEntries.find((entry) => entry.staffId === staffId && !entry.clockOut);
  }

  function clockIn(staffId, now = new Date()) {
    const store = loadStore();
    if (!store.staff.some((entry) => entry.id === staffId && entry.active)) throw new Error('Staff not active');
    if (openTimeEntry(store, staffId)) throw new Error('Staff already clocked in');
    const entry = normalizeTimeEntry({
      id: 'TIME-' + Date.now() + '-' + randomToken().slice(0, 4),
      staffId,
      clockIn: new Date(now).toISOString(),
      status: 'working'
    });
    store.timeEntries.unshift(entry);
    saveStore(store);
    return entry;
  }

  function startBreak(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry || entry.status !== 'working') throw new Error('Staff is not working');
    entry.breakStartedAt = new Date(now).toISOString();
    entry.status = 'break';
    saveStore(store);
    return entry;
  }

  function endBreak(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry || entry.status !== 'break') throw new Error('Staff is not on break');
    const started = new Date(entry.breakStartedAt).getTime();
    entry.breakMinutes += Math.max(0, Math.round((new Date(now).getTime() - started) / 60000));
    entry.breakStartedAt = '';
    entry.status = 'working';
    saveStore(store);
    return entry;
  }

  function workedMinutes(entry, now = new Date()) {
    const end = entry.clockOut ? new Date(entry.clockOut).getTime() : new Date(now).getTime();
    const start = new Date(entry.clockIn).getTime();
    const activeBreak = entry.breakStartedAt ? Math.max(0, Math.round((new Date(now).getTime() - new Date(entry.breakStartedAt).getTime()) / 60000)) : 0;
    return Math.max(0, Math.round((end - start) / 60000) - entry.breakMinutes - activeBreak);
  }

  function clockOut(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry) throw new Error('Staff is not clocked in');
    if (entry.status === 'break') {
      const started = new Date(entry.breakStartedAt).getTime();
      entry.breakMinutes += Math.max(0, Math.round((new Date(now).getTime() - started) / 60000));
      entry.breakStartedAt = '';
    }
    entry.clockOut = new Date(now).toISOString();
    entry.status = 'done';
    saveStore(store);
    return entry;
  }

  function laborSummary(now = new Date()) {
    const store = loadStore();
    const summaryDate = dateKey(now);
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const schedules = store.staffSchedules
      .filter((schedule) => schedule.date === summaryDate)
      .map((schedule) => ({
        ...schedule,
        staff: store.staff.find((staff) => staff.id === schedule.staffId),
        scheduledMinutes: scheduleMinutes(schedule)
      }));
    const entries = store.timeEntries.filter((entry) => {
      const clockInTime = new Date(entry.clockIn);
      return clockInTime >= start && clockInTime < end;
    }).map((entry) => ({
      ...entry,
      staff: store.staff.find((staff) => staff.id === entry.staffId),
      workedMinutes: workedMinutes(entry, now)
    })).map((entry) => {
      const schedule = schedules.find((candidate) => candidate.staffId === entry.staffId);
      const staff = entry.staff || {};
      const bounds = schedule ? scheduleBounds(schedule) : null;
      const clockInMinutes = minutesOfDay(entry.clockIn);
      const clockOutMinutes = entry.clockOut ? minutesOfDay(entry.clockOut) : null;
      const lateMinutes = bounds ? Math.max(0, clockInMinutes - bounds.start) : 0;
      const earlyLeaveMinutes = bounds && clockOutMinutes !== null ? Math.max(0, bounds.end - clockOutMinutes) : 0;
      return {
        ...entry,
        schedule,
        lateMinutes,
        earlyLeaveMinutes,
        estimatedWage: Math.round((entry.workedMinutes / 60) * Number(staff.hourlyWage || 0))
      };
    });
    const totals = entries.reduce((result, entry) => ({
      workedMinutes: result.workedMinutes + entry.workedMinutes,
      breakMinutes: result.breakMinutes + entry.breakMinutes,
      estimatedWages: result.estimatedWages + entry.estimatedWage
    }), { workedMinutes: 0, breakMinutes: 0, estimatedWages: 0 });
    return {
      staff: store.staff,
      schedules,
      entries,
      onDuty: entries.filter((entry) => !entry.clockOut),
      totals
    };
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
      token: table.token || existing?.token || randomToken(),
      guestCount: Number(table.guestCount ?? existing?.guestCount ?? 0),
      openedAt: table.openedAt || existing?.openedAt || '',
      note: table.note ?? existing?.note ?? ''
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

  function requireTable(store, tableId) {
    const table = store.tables.find((entry) => entry.id === String(tableId));
    if (!table) throw new Error('Table not found');
    return table;
  }

  function openTable(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    store.tables = store.tables.map((table) => table.id === String(tableId) ? {
      ...table,
      status: 'occupied',
      guestCount: Number(details.guestCount || table.guestCount || 0),
      openedAt: table.openedAt || new Date().toISOString(),
      note: details.note ?? table.note ?? ''
    } : table);
    addTableEvent(store, { type: 'open', tableId, guestCount: Number(details.guestCount || 0), note: details.note || '' });
    saveStore(store);
  }

  function resetTableState(table, note = '') {
    return { ...table, status: 'available', guestCount: 0, openedAt: '', note };
  }

  function transferTable(fromTableId, toTableId, details = {}) {
    const store = loadStore();
    const from = requireTable(store, fromTableId);
    const to = requireTable(store, toTableId);
    store.orders = store.orders.map((order) => (
      order.tableId === String(fromTableId) && order.paymentStatus !== 'paid'
        ? { ...order, tableId: String(toTableId) }
        : order
    ));
    store.tables = store.tables.map((table) => {
      if (table.id === String(fromTableId)) return resetTableState(table);
      if (table.id === String(toTableId)) return {
        ...table,
        status: 'occupied',
        guestCount: to.guestCount || from.guestCount,
        openedAt: to.openedAt || from.openedAt || new Date().toISOString(),
        note: details.note || to.note || from.note || ''
      };
      return table;
    });
    addTableEvent(store, { type: 'transfer', fromTableId, toTableId, note: details.note || '' });
    saveStore(store);
  }

  function mergeTables(fromTableId, toTableId, details = {}) {
    const store = loadStore();
    const from = requireTable(store, fromTableId);
    const to = requireTable(store, toTableId);
    store.orders = store.orders.map((order) => (
      order.tableId === String(fromTableId) && order.paymentStatus !== 'paid'
        ? { ...order, tableId: String(toTableId) }
        : order
    ));
    store.tables = store.tables.map((table) => {
      if (table.id === String(fromTableId)) return resetTableState(table);
      if (table.id === String(toTableId)) return {
        ...table,
        status: 'occupied',
        guestCount: Number(to.guestCount || 0) + Number(from.guestCount || 0),
        openedAt: to.openedAt || from.openedAt || new Date().toISOString(),
        note: details.note || to.note || from.note || ''
      };
      return table;
    });
    addTableEvent(store, { type: 'merge', fromTableId, toTableId, note: details.note || '' });
    saveStore(store);
  }

  function clearTable(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    store.tables = store.tables.map((table) => table.id === String(tableId) ? resetTableState(table, details.note || '') : table);
    addTableEvent(store, { type: 'clear', tableId, note: details.note || '' });
    saveStore(store);
  }

  function customerProfiles() {
    const store = loadStore();
    const noteMap = new Map(store.customerNotes.map((entry) => [entry.phone, entry.note]));
    const profiles = new Map();
    store.orders
      .filter((order) => normalizePhone(order.customer?.phone))
      .forEach((order) => {
        const phone = normalizePhone(order.customer.phone);
        const current = profiles.get(phone) || {
          phone,
          name: '',
          note: noteMap.get(phone) || '',
          orderCount: 0,
          totalSpent: 0,
          lastOrderId: '',
          lastOrderedAt: '',
          orders: []
        };
        current.orderCount += 1;
        current.totalSpent += order.paymentStatus === 'paid' ? order.total : 0;
        current.orders.push(order);
        if (!current.lastOrderedAt || String(order.createdAt).localeCompare(current.lastOrderedAt) > 0) {
          current.lastOrderedAt = order.createdAt;
          current.lastOrderId = order.id;
          if (order.customer?.name) current.name = order.customer.name;
        } else if (!current.name && order.customer?.name) {
          current.name = order.customer.name;
        }
        profiles.set(phone, current);
      });
    return Array.from(profiles.values())
      .map((profile) => ({
        ...profile,
        orders: profile.orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      }))
      .sort((a, b) => String(b.lastOrderedAt).localeCompare(String(a.lastOrderedAt)));
  }

  function customerProfile(phone) {
    return customerProfiles().find((profile) => profile.phone === normalizePhone(phone)) || null;
  }

  function updateCustomerNote(phone, note) {
    const store = loadStore();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) throw new Error('Phone is required');
    const normalized = normalizeCustomerNote({ phone: normalizedPhone, note, updatedAt: new Date().toISOString() });
    const index = store.customerNotes.findIndex((entry) => entry.phone === normalizedPhone);
    if (index >= 0) store.customerNotes[index] = normalized;
    else store.customerNotes.push(normalized);
    saveStore(store);
    return normalized;
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
    clearCart,
    addToCart,
    updateCartLine,
    cartTotal,
    createOrder,
    updateOrderStatus,
    tableOpenSummary,
    kitchenOrderGroups,
    checkoutTable,
    checkoutOrder,
    paymentHistory,
    businessOverview,
    dailyReport,
    closeBusinessDay,
    dailyCloseHistory,
    upsertMenuItem,
    toggleSoldOut,
    adjustInventory,
    recordInventoryMovement,
    inventoryMovements,
    inventoryStatus,
    upsertTable,
    toggleTableEnabled,
    regenerateTableToken,
    tableOrderUrl,
    validateTableAccess,
    openTable,
    transferTable,
    mergeTables,
    clearTable,
    customerProfiles,
    customerProfile,
    updateCustomerNote,
    upsertStaff,
    upsertStaffSchedule,
    clockIn,
    startBreak,
    endBreak,
    clockOut,
    laborSummary,
    resetDemo
  };

  root.IzakayaCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
