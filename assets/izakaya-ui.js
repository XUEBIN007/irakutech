(function () {
  const core = window.IzakayaCore;
  const i18n = window.IzakayaI18n;
  const view = document.body.dataset.view;
  const yen = (value) => '¥' + Number(value || 0).toLocaleString('ja-JP');
  const t = (key, params) => i18n ? i18n.t(key, params) : key;
  const statusText = (status) => t(`status_${status}`);
  const lang = () => i18n?.getLang() || 'ja';

  function notify(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  function itemName(item) {
    if (!item) return '';
    if (lang() === 'zh') return item.nameZh || item.nameJa;
    if (lang() === 'en') return item.nameEn || item.nameJa;
    return item.nameJa;
  }

  function itemSubName(item) {
    if (!item) return '';
    if (lang() === 'ja') return item.nameZh || item.nameEn || '';
    if (lang() === 'zh') return item.nameJa || item.nameEn || '';
    return item.nameJa || item.nameZh || '';
  }

  function categoryName(category) {
    if (lang() === 'zh') return category.nameZh || category.nameJa;
    if (lang() === 'en') return category.nameEn || category.nameJa;
    return category.nameJa;
  }

  function renderStoreInfo(store) {
    const target = document.querySelector('[data-store-info]');
    if (!target || !store.restaurant) return;
    target.innerHTML = `
      <strong>${store.restaurant.nameJa}</strong>
      <span>${t('store_address')}</span>
      <span>${t('cash_notice')}</span>
    `;
  }

  function getTableId() {
    return new URLSearchParams(location.search).get('table') || '3';
  }

  function mountOrder() {
    let selectedCategory = 'all';
    const tableId = getTableId();

    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      renderStoreInfo(store);
      const cart = core.loadCart(tableId);
      const tableLabel = document.querySelector('[data-table-label]');
      if (tableLabel) tableLabel.textContent = t('order_title', { table: tableId });
      const categories = [{ id: 'all', nameJa: t('all'), nameZh: t('all') }, ...store.categories];
      document.querySelector('[data-categories]').innerHTML = categories.map((category) => (
        `<button class="chip ${category.id === selectedCategory ? 'active' : ''}" data-category="${category.id}">${categoryName(category)}</button>`
      )).join('');

      const menu = selectedCategory === 'all'
        ? store.menu
        : store.menu.filter((item) => item.categoryId === selectedCategory);
      document.querySelector('[data-menu]').innerHTML = menu.map((item) => `
        <article class="card menu-item ${item.soldOut ? 'soldout' : ''}">
          <div class="menu-top">
            <div>
              <div class="dish-icon">${item.icon}</div>
              <div class="dish-name">${itemName(item)}</div>
              <div class="dish-sub">${itemSubName(item)}</div>
            </div>
            <div class="price">${yen(item.price)}</div>
          </div>
          <div class="dish-desc">${item.desc}${item.id === 'tabe-nomi-3500' ? ` · ${t('course_note')}` : ''}${item.recommended ? ` · ${t('recommended')}` : ''}</div>
          <button class="btn primary" data-add="${item.id}" ${item.soldOut ? 'disabled' : ''}>${item.soldOut ? t('soldout') : t('add')}</button>
        </article>
      `).join('');

      document.querySelector('[data-cart]').innerHTML = cart.length ? cart.map((line) => {
        const item = store.menu.find((entry) => entry.id === line.menuItemId);
        return `
          <div class="cart-line">
            <div>
              <strong>${itemName(item)}</strong><div class="dish-sub">${itemSubName(item)}</div>
              <input class="note" data-note="${line.menuItemId}" placeholder="${t('note_placeholder')}" value="${line.note || ''}">
            </div>
            <div>
              <div class="price">${yen(item.price * line.quantity)}</div>
              <div class="qty">
                <button data-dec="${line.menuItemId}">-</button>
                <strong>${line.quantity}</strong>
                <button data-inc="${line.menuItemId}">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('') : `<div class="empty">${t('cart_empty')}</div>`;
      document.querySelector('[data-total]').textContent = yen(core.cartTotal(cart, store.menu));
      document.querySelector('[data-submit]').disabled = cart.length === 0;
    }

    document.addEventListener('click', (event) => {
      const category = event.target.closest('[data-category]');
      if (category) {
        selectedCategory = category.dataset.category;
        render();
      }
      const add = event.target.closest('[data-add]');
      if (add) {
        core.addToCart(tableId, add.dataset.add);
        render();
      }
      const inc = event.target.closest('[data-inc]');
      if (inc) {
        const line = core.loadCart(tableId).find((entry) => entry.menuItemId === inc.dataset.inc);
        core.updateCartLine(tableId, inc.dataset.inc, { quantity: line.quantity + 1 });
        render();
      }
      const dec = event.target.closest('[data-dec]');
      if (dec) {
        const line = core.loadCart(tableId).find((entry) => entry.menuItemId === dec.dataset.dec);
        core.updateCartLine(tableId, dec.dataset.dec, { quantity: line.quantity - 1 });
        render();
      }
      const submit = event.target.closest('[data-submit]');
      if (submit) {
        const order = core.createOrder({ tableId, cart: core.loadCart(tableId) });
        notify(`${t('accepted')}: ${order.id}`);
        render();
      }
    });

    document.addEventListener('input', (event) => {
      const note = event.target.closest('[data-note]');
      if (note) core.updateCartLine(tableId, note.dataset.note, { note: note.value });
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    render();
  }

  function orderMarkup(order) {
    const canCancel = order.paymentStatus !== 'paid' && order.status !== 'canceled';
    return `
      <article class="card order-card">
        <div class="btn-row">
          <span class="status ${order.status}">${statusText(order.status)}</span>
          <strong>${t('order_title', { table: order.tableId })}</strong>
          <span class="muted">${new Date(order.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div>${order.lines.map((line) => `
          <div class="order-line">
            <div><strong>${lang() === 'zh' ? line.nameZh : lang() === 'en' ? (line.nameEn || line.nameJa) : line.nameJa}</strong> × ${line.quantity}${line.note ? `<div class="muted">${t('note')}: ${line.note}</div>` : ''}</div>
            <div class="price">${yen(line.price * line.quantity)}</div>
          </div>
        `).join('')}</div>
        <div class="summary"><span>${t('total')}</span><span>${yen(order.total)}</span></div>
        <div class="btn-row">
          <button class="btn warn" data-status="${order.id}:preparing" ${order.status !== 'new' ? 'disabled' : ''}>${t('action_preparing')}</button>
          <button class="btn primary" data-status="${order.id}:done" ${order.paymentStatus === 'paid' || order.status === 'canceled' ? 'disabled' : ''}>${t('action_done')}</button>
          <button class="btn danger" data-cancel="${order.id}" ${canCancel ? '' : 'disabled'}>${t('action_cancel')}</button>
        </div>
      </article>
    `;
  }

  function kitchenItemMarkup(item) {
    return `
      <article class="card kitchen-ticket ${item.urgency}">
        <div class="ticket-head">
          <span class="status ${item.status}">${statusText(item.status)}</span>
          <strong>${t('order_title', { table: item.tableId })}</strong>
          <span class="ticket-age">${item.waitMinutes} min</span>
        </div>
        <div class="ticket-dish">${lang() === 'zh' ? item.nameZh : lang() === 'en' ? (item.nameEn || item.nameJa) : item.nameJa}</div>
        <div class="ticket-meta">x ${item.quantity}${item.note ? ` · ${t('note')}: ${item.note}` : ''}</div>
        <button class="btn primary" data-line-done="${item.orderId}:${item.id}">${t('action_done')}</button>
      </article>
    `;
  }

  function mountKitchen() {
    function render() {
      i18n?.applyLang(i18n.getLang());
      renderStoreInfo(core.loadStore());
      const items = core.kitchenQueueItems();
      document.querySelector('[data-orders]').innerHTML = items.length ? items.map(kitchenItemMarkup).join('') : `<div class="empty">${t('kitchen_empty')}</div>`;
    }
    document.addEventListener('click', (event) => {
      const lineDone = event.target.closest('[data-line-done]');
      if (lineDone) {
        const [orderId, lineId] = lineDone.dataset.lineDone.split(':');
        core.updateOrderLineStatus(orderId, lineId, 'done');
        notify(t('set_done'));
        render();
      }
      const action = event.target.closest('[data-status]');
      if (action) {
        const [orderId, status] = action.dataset.status.split(':');
        core.updateOrderStatus(orderId, status);
        notify(status === 'done' ? t('set_done') : t('set_preparing'));
        render();
      }
      const cancel = event.target.closest('[data-cancel]');
      if (cancel) {
        core.cancelOrder(cancel.dataset.cancel, t('action_cancel'));
        notify(t('set_canceled'));
        render();
      }
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    render();
  }

  function mountCheckout() {
    let selectedTable = '3';
    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      renderStoreInfo(store);
      const openOrders = store.orders.filter((order) => order.paymentStatus !== 'paid' && order.status !== 'canceled');
      const paymentSelect = document.querySelector('[data-payment-method]');
      if (paymentSelect) {
        paymentSelect.innerHTML = core.availablePaymentMethods(store).map((method) => (
          `<option value="${method.id}">${lang() === 'zh' ? method.nameZh : lang() === 'en' ? method.nameEn : method.nameJa}</option>`
        )).join('');
        paymentSelect.value = store.settings.defaultPaymentMethod;
      }
      document.querySelector('[data-tables]').innerHTML = store.tables.map((table) => {
        const total = openOrders.filter((order) => order.tableId === table.id).reduce((sum, order) => sum + order.total, 0);
        return `<button class="tab ${selectedTable === table.id ? 'active' : ''}" data-table="${table.id}">${table.area}-${table.id} · ${table.seats}${t('seats')} · ${total ? yen(total) : t('available')}</button>`;
      }).join('');
      const tableOrders = openOrders.filter((order) => order.tableId === selectedTable);
      const total = tableOrders.reduce((sum, order) => sum + order.total, 0);
      document.querySelector('[data-checkout-orders]').innerHTML = tableOrders.length ? tableOrders.map(orderMarkup).join('') : `<div class="empty">${t('checkout_empty')}</div>`;
      document.querySelector('[data-checkout-total]').textContent = yen(total);
      const note = document.querySelector('[data-payment-note]');
      if (note) note.textContent = t('cash_notice');
      document.querySelector('[data-pay]').disabled = total === 0;
    }
    document.addEventListener('click', (event) => {
      const table = event.target.closest('[data-table]');
      if (table) {
        selectedTable = table.dataset.table;
        render();
      }
      const pay = event.target.closest('[data-pay]');
      if (pay) {
        const method = document.querySelector('[data-payment-method]').value;
        const total = core.checkoutTable(selectedTable, method);
        notify(`${t('checkout_done')}: ${yen(total)}`);
        render();
      }
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    render();
  }

  function mountAdmin() {
    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      const baseUrl = `${location.origin}${location.pathname.replace(/\/admin\/?$/, '')}`;
      const summary = core.dailySummary();
      renderStoreInfo(store);
      const summaryTarget = document.querySelector('[data-sales-summary]');
      if (summaryTarget) {
        summaryTarget.innerHTML = `
          <div class="table-line"><strong>${t('paid_total')}</strong><span>${yen(summary.paidTotal)}</span></div>
          <div class="table-line"><strong>${t('unpaid_total')}</strong><span>${yen(summary.unpaidTotal)}</span></div>
          <div class="table-line"><strong>${t('order_count')}</strong><span>${summary.orderCount}</span></div>
          <div class="table-line"><strong>${t('canceled_count')}</strong><span>${summary.canceledCount}</span></div>
        `;
      }
      document.querySelector('[data-admin-menu]').innerHTML = store.menu.map((item) => `
        <div class="admin-line">
          <div>
            <strong>${item.icon} ${itemName(item)}</strong>
            <div class="dish-sub">${itemSubName(item)}</div>
            <div class="muted">${item.categoryId} · ${yen(item.price)} · ${item.soldOut ? t('soldout') : t('selling')}</div>
          </div>
          <div class="btn-row">
            <button class="btn ghost" data-edit="${item.id}">${t('edit')}</button>
            <button class="btn ${item.soldOut ? 'primary' : 'danger'}" data-soldout="${item.id}">${item.soldOut ? t('restart_sales') : t('stop_sales')}</button>
          </div>
        </div>
      `).join('');
      document.querySelector('[name="categoryId"]').innerHTML = store.categories.map((category) => `<option value="${category.id}">${categoryName(category)}</option>`).join('');
      document.querySelector('[data-admin-tables]').innerHTML = store.tables.map((table) => {
        const label = `${table.area}-${table.id}`;
        const url = core.tableOrderUrl(baseUrl, label);
        return `
          <div class="table-line">
            <div>
              <strong>${label}</strong>
              <div class="muted">${table.seats}${t('seats')} · ${table.status}</div>
            </div>
            <a class="app-link mini-link" href="${url}">${t('copy_url')}</a>
          </div>
        `;
      }).join('');
    }

    document.addEventListener('click', (event) => {
      const soldout = event.target.closest('[data-soldout]');
      if (soldout) {
        core.toggleSoldOut(soldout.dataset.soldout);
        notify(t('soldout_updated'));
        render();
      }
      const edit = event.target.closest('[data-edit]');
      if (edit) {
        const item = core.loadStore().menu.find((entry) => entry.id === edit.dataset.edit);
        Object.entries(item).forEach(([key, value]) => {
          const field = document.querySelector(`[name="${key}"]`);
          if (!field) return;
          if (field.type === 'checkbox') field.checked = Boolean(value);
          else field.value = value;
        });
      }
      const reset = event.target.closest('[data-reset]');
      if (reset) {
        core.resetDemo();
        notify(t('demo_reset'));
        render();
      }
    });

    document.querySelector('[data-menu-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.upsertMenuItem({
        id: form.get('id') || String(Date.now()),
        categoryId: form.get('categoryId'),
        icon: form.get('icon') || '🍽️',
        nameJa: form.get('nameJa'),
        nameZh: form.get('nameZh'),
        nameEn: form.get('nameEn'),
        price: Number(form.get('price')),
        desc: form.get('desc'),
        recommended: form.get('recommended') === 'on',
        soldOut: form.get('soldOut') === 'on'
      });
      event.currentTarget.reset();
      notify(t('menu_saved'));
      render();
    });

    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    render();
  }

  i18n?.init();
  if (view === 'order') mountOrder();
  if (view === 'kitchen') mountKitchen();
  if (view === 'checkout') mountCheckout();
  if (view === 'admin') mountAdmin();
})();
