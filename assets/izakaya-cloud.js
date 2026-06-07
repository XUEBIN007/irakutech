(function (root) {
  const DEFAULT_RESTAURANT_ID = 'demo';
  const API_TABLE_ORDERS = 'izakaya_orders';
  const API_TABLE_LINES = 'izakaya_order_lines';

  function config(overrides = {}) {
    const fromWindow = root.IzakayaCloudConfig || {};
    return {
      supabaseUrl: overrides.supabaseUrl ?? fromWindow.supabaseUrl ?? '',
      supabaseAnonKey: overrides.supabaseAnonKey ?? fromWindow.supabaseAnonKey ?? '',
      restaurantId: overrides.restaurantId ?? fromWindow.restaurantId ?? DEFAULT_RESTAURANT_ID,
      pollMs: Number(overrides.pollMs ?? fromWindow.pollMs ?? 3500)
    };
  }

  function configured(candidate = config()) {
    return Boolean(candidate.supabaseUrl && candidate.supabaseAnonKey);
  }

  function orderToRows(order, restaurantId = DEFAULT_RESTAURANT_ID) {
    const normalizedRestaurantId = restaurantId || DEFAULT_RESTAURANT_ID;
    return {
      order: {
        id: order.id,
        restaurant_id: normalizedRestaurantId,
        table_id: order.tableId || '',
        order_type: order.orderType || (order.tableId ? 'dine-in' : 'pickup'),
        status: order.status || 'new',
        payment_status: order.paymentStatus || 'unpaid',
        payment_method: order.paymentMethod || '',
        received_amount: Number(order.receivedAmount || 0),
        change_amount: Number(order.changeAmount || 0),
        customer: order.customer || { name: '', phone: '' },
        fulfillment: order.fulfillment || {},
        fulfillment_status: order.fulfillmentStatus || 'pending',
        subtotal: Number(order.subtotal || 0),
        delivery_fee: Number(order.deliveryFee || 0),
        total: Number(order.total || 0),
        created_at: order.createdAt || new Date().toISOString(),
        paid_at: order.paidAt || null
      },
      lines: (order.lines || []).map((line, index) => ({
        restaurant_id: normalizedRestaurantId,
        order_id: order.id,
        menu_item_id: line.menuItemId,
        name_ja: line.nameJa,
        name_zh: line.nameZh,
        price: Number(line.price || 0),
        quantity: Number(line.quantity || 0),
        note: line.note || '',
        line_index: index
      }))
    };
  }

  function rowsToOrder(orderRow, lineRows = []) {
    const lines = lineRows
      .filter((line) => line.order_id === orderRow.id)
      .slice()
      .sort((a, b) => Number(a.line_index || 0) - Number(b.line_index || 0))
      .map((line) => ({
        menuItemId: line.menu_item_id,
        nameJa: line.name_ja,
        nameZh: line.name_zh,
        price: Number(line.price || 0),
        quantity: Number(line.quantity || 0),
        note: line.note || ''
      }));
    return {
      id: orderRow.id,
      tableId: orderRow.table_id || '',
      orderType: orderRow.order_type || (orderRow.table_id ? 'dine-in' : 'pickup'),
      customer: orderRow.customer || { name: '', phone: '' },
      fulfillment: orderRow.fulfillment || {},
      fulfillmentStatus: orderRow.fulfillment_status || 'pending',
      status: orderRow.status || 'new',
      paymentStatus: orderRow.payment_status || 'unpaid',
      ...(orderRow.payment_method ? { paymentMethod: orderRow.payment_method } : {}),
      ...(Number(orderRow.received_amount || 0) ? { receivedAmount: Number(orderRow.received_amount || 0) } : {}),
      ...(Number(orderRow.change_amount || 0) ? { changeAmount: Number(orderRow.change_amount || 0) } : {}),
      ...(orderRow.paid_at ? { paidAt: orderRow.paid_at } : {}),
      createdAt: orderRow.created_at,
      lines,
      subtotal: Number(orderRow.subtotal || 0),
      deliveryFee: Number(orderRow.delivery_fee || 0),
      total: Number(orderRow.total || 0)
    };
  }

  function mergeCloudOrders(store, cloudOrders) {
    const byId = new Map((store.orders || []).map((order) => [order.id, order]));
    cloudOrders.forEach((order) => byId.set(order.id, order));
    const orders = Array.from(byId.values())
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const openTableIds = new Set(orders
      .filter((order) => order.orderType === 'dine-in' && order.tableId && order.paymentStatus !== 'paid')
      .map((order) => String(order.tableId)));
    const tables = (store.tables || []).map((table) => (
      openTableIds.has(String(table.id))
        ? { ...table, status: 'occupied', openedAt: table.openedAt || orders.find((order) => String(order.tableId) === String(table.id))?.createdAt || '' }
        : table
    ));
    return { ...store, orders, tables };
  }

  function restUrl(table, query = '') {
    const current = config();
    const base = current.supabaseUrl.replace(/\/$/, '');
    return `${base}/rest/v1/${table}${query}`;
  }

  async function request(table, options = {}, query = '') {
    const current = config();
    if (!configured(current)) throw new Error('Supabase is not configured');
    const response = await root.fetch(restUrl(table, query), {
      ...options,
      headers: {
        apikey: current.supabaseAnonKey,
        Authorization: `Bearer ${current.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: options.prefer || 'return=representation',
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new Error(message || response.statusText);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function createOrder(order) {
    const current = config();
    const rows = orderToRows(order, current.restaurantId);
    await request(API_TABLE_ORDERS, {
      method: 'POST',
      body: JSON.stringify(rows.order),
      prefer: 'resolution=merge-duplicates,return=representation'
    }, '?on_conflict=id');
    if (rows.lines.length) {
      await request(API_TABLE_LINES, {
        method: 'POST',
        body: JSON.stringify(rows.lines),
        prefer: 'return=representation'
      });
    }
    return order;
  }

  async function fetchOrders() {
    const current = config();
    const restaurant = encodeURIComponent(current.restaurantId);
    const [orders, lines] = await Promise.all([
      request(API_TABLE_ORDERS, { method: 'GET', prefer: '' }, `?restaurant_id=eq.${restaurant}&order=created_at.desc`),
      request(API_TABLE_LINES, { method: 'GET', prefer: '' }, `?restaurant_id=eq.${restaurant}&order=line_index.asc`)
    ]);
    return (orders || []).map((order) => rowsToOrder(order, lines || []));
  }

  async function updateOrderStatus(orderId, status) {
    const current = config();
    await request(API_TABLE_ORDERS, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      prefer: 'return=representation'
    }, `?restaurant_id=eq.${encodeURIComponent(current.restaurantId)}&id=eq.${encodeURIComponent(orderId)}`);
  }

  async function checkoutOrders(orderIds, payment) {
    const current = config();
    const paidAt = new Date().toISOString();
    await Promise.all(orderIds.map((orderId) => request(API_TABLE_ORDERS, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'paid',
        payment_status: 'paid',
        payment_method: payment.method || 'cash',
        received_amount: Number(payment.receivedAmount || 0),
        change_amount: Number(payment.changeAmount || 0),
        paid_at: paidAt
      }),
      prefer: 'return=representation'
    }, `?restaurant_id=eq.${encodeURIComponent(current.restaurantId)}&id=eq.${encodeURIComponent(orderId)}`)));
  }

  async function resetOrders() {
    const current = config();
    const restaurant = encodeURIComponent(current.restaurantId);
    await request(API_TABLE_LINES, {
      method: 'DELETE',
      prefer: 'return=minimal'
    }, `?restaurant_id=eq.${restaurant}`);
    await request(API_TABLE_ORDERS, {
      method: 'DELETE',
      prefer: 'return=minimal'
    }, `?restaurant_id=eq.${restaurant}`);
  }

  async function syncIntoCore(core) {
    if (!configured()) return core.loadStore();
    const cloudOrders = await fetchOrders();
    const merged = mergeCloudOrders(core.loadStore(), cloudOrders);
    core.saveStore(merged);
    return merged;
  }

  function startPolling(core, callback) {
    if (!configured()) return () => {};
    let stopped = false;
    let timer = null;
    const tick = async () => {
      if (stopped) return;
      try {
        await syncIntoCore(core);
        callback?.();
      } catch (error) {
        root.console?.warn?.('Cloud sync failed', error);
      } finally {
        if (!stopped) timer = root.setTimeout(tick, config().pollMs);
      }
    };
    tick();
    return () => {
      stopped = true;
      if (timer) root.clearTimeout(timer);
    };
  }

  const api = {
    config,
    configured,
    orderToRows,
    rowsToOrder,
    mergeCloudOrders,
    createOrder,
    fetchOrders,
    updateOrderStatus,
    checkoutOrders,
    resetOrders,
    syncIntoCore,
    startPolling
  };

  root.IzakayaCloud = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
