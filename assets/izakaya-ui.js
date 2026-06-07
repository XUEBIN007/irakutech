(function () {
  const core = window.IzakayaCore;
  const i18n = window.IzakayaI18n;
  const cloud = window.IzakayaCloud;
  const view = document.body.dataset.view;
  const yen = (value) => '¥' + Number(value || 0).toLocaleString('ja-JP');
  const t = (key, params) => i18n ? i18n.t(key, params) : key;
  const statusText = (status) => t(`status_${status}`);
  const paymentText = (method) => t(`pay_${method}`) === `pay_${method}` ? method : t(`pay_${method}`);
  const formatMinutes = (minutes) => {
    const total = Number(minutes || 0);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  };
  const todayKey = () => new Date().toISOString().slice(0, 10);

  function elapsedMinutes(isoTime) {
    const createdAt = new Date(isoTime).getTime();
    if (!createdAt) return 0;
    return Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
  }

  function notify(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  async function syncCloud(render) {
    if (!cloud?.configured?.()) return;
    try {
      await cloud.syncIntoCore(core);
      render?.();
    } catch (error) {
      console.warn('Cloud sync failed', error);
    }
  }

  async function pushCloudOrder(order) {
    if (!cloud?.configured?.()) return;
    try {
      await cloud.createOrder(order);
    } catch (error) {
      console.warn('Cloud order upload failed', error);
      notify('Cloud sync error');
    }
  }

  function itemName(item) {
    return `${item.nameJa} / ${item.nameZh}`;
  }

  function orderLabel(order) {
    if (order.orderType === 'pickup') return `${t('order_type_pickup')} ${order.customer?.name || ''}`.trim();
    if (order.orderType === 'delivery') return `${t('order_type_delivery')} ${order.customer?.name || ''}`.trim();
    return t('order_title', { table: order.tableId });
  }

  function orderTypeText(orderType) {
    return t(`order_type_${String(orderType || 'dine-in').replaceAll('-', '_')}`);
  }

  function fulfillmentMeta(order) {
    const parts = [];
    if (order.orderType && order.orderType !== 'dine-in') parts.push(orderTypeText(order.orderType));
    if (order.fulfillment?.requestedAt) parts.push(`${t('requested_time')}: ${order.fulfillment.requestedAt}`);
    if (order.fulfillment?.address) parts.push(order.fulfillment.address);
    if (order.customer?.phone) parts.push(order.customer.phone);
    return parts.join(' · ');
  }

  function orderLinesMarkup(order) {
    return order.lines.map((line) => `
      <div class="order-line">
        <div><strong>${line.nameJa}</strong> × ${line.quantity}${line.note ? `<div class="muted">${t('note')}: ${line.note}</div>` : ''}</div>
        <div class="price">${yen(line.price * line.quantity)}</div>
      </div>
    `).join('');
  }

  function getTableId() {
    return new URLSearchParams(location.search).get('table') || '3';
  }

  function getTableToken() {
    return new URLSearchParams(location.search).get('token');
  }

  function mountOrder() {
    let selectedCategory = 'all';
    let isSubmitting = false;
    let submitError = '';
    const tableId = getTableId();

    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      const cart = core.loadCart(tableId);
      const isValidTable = core.validateTableAccess(tableId, getTableToken());
      const tableLabel = document.querySelector('[data-table-label]');
      if (tableLabel) tableLabel.textContent = t('order_title', { table: tableId });
      if (!isValidTable) {
        document.querySelector('[data-categories]').innerHTML = '';
        document.querySelector('[data-menu]').innerHTML = `<div class="empty">${t('invalid_table')}</div>`;
        document.querySelector('[data-cart]').innerHTML = `<div class="empty">${t('invalid_table')}</div>`;
        document.querySelector('[data-total]').textContent = yen(0);
        document.querySelector('[data-submit]').disabled = true;
        document.querySelector('[data-submit]').textContent = t('order_submit');
        document.querySelector('[data-order-count]').textContent = t('open_order_count', { count: 0 });
        document.querySelector('[data-open-orders]').innerHTML = `<div class="empty small">${t('ordered_empty')}</div>`;
        document.querySelector('[data-open-total]').textContent = yen(0);
        return;
      }
      const categories = [{ id: 'all', nameJa: t('all'), nameZh: t('all') }, ...store.categories];
      document.querySelector('[data-categories]').innerHTML = categories.map((category) => (
        `<button class="chip ${category.id === selectedCategory ? 'active' : ''}" data-category="${category.id}">${category.nameJa}</button>`
      )).join('');

      const menu = selectedCategory === 'all'
        ? store.menu
        : store.menu.filter((item) => item.categoryId === selectedCategory);
      document.querySelector('[data-menu]').innerHTML = menu.map((item) => `
        <article class="card menu-item ${item.soldOut ? 'soldout' : ''}">
          <div class="menu-top">
            <div>
              <div class="dish-icon">${item.icon}</div>
              <div class="dish-name">${item.nameJa}</div>
              <div class="dish-sub">${item.nameZh}</div>
            </div>
            <div class="price">${yen(item.price)}</div>
          </div>
          <div class="dish-desc">${item.desc}${item.recommended ? ` · ${t('recommended')}` : ''}</div>
          <button class="btn primary" data-add="${item.id}" ${item.soldOut ? 'disabled' : ''}>${item.soldOut ? t('soldout') : t('add')}</button>
        </article>
      `).join('');

      const cartMarkup = cart.length ? cart.map((line) => {
        const item = store.menu.find((entry) => entry.id === line.menuItemId);
        return `
          <div class="cart-line">
            <div>
              <strong>${itemName(item)}</strong>
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
      document.querySelector('[data-cart]').innerHTML = `${submitError ? `<div class="empty small">${submitError}</div>` : ''}${cartMarkup}`;
      document.querySelector('[data-total]').textContent = yen(core.cartTotal(cart, store.menu));
      const submitButton = document.querySelector('[data-submit]');
      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? t('order_submitting') : cart.length ? t('order_submit') : t('add_items_first');
      submitButton.title = cart.length ? t('order_submit') : t('cart_empty');
      const summary = core.tableOpenSummary(tableId);
      document.querySelector('[data-order-count]').textContent = t('open_order_count', { count: summary.orders.length });
      document.querySelector('[data-open-orders]').innerHTML = summary.orders.length ? summary.orders.map((order) => `
        <article class="mini-order">
          <div class="btn-row">
            <span class="status ${order.status}">${statusText(order.status)}</span>
            <strong>${new Date(order.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</strong>
            <span class="price">${yen(order.total)}</span>
          </div>
          ${orderLinesMarkup(order)}
        </article>
      `).join('') : `<div class="empty small">${t('ordered_empty')}</div>`;
      document.querySelector('[data-open-total]').textContent = yen(summary.total);
    }

    document.addEventListener('click', async (event) => {
      const category = event.target.closest('[data-category]');
      if (category) {
        selectedCategory = category.dataset.category;
        render();
      }
      const add = event.target.closest('[data-add]');
      if (add) {
        submitError = '';
        core.addToCart(tableId, add.dataset.add);
        render();
      }
      const inc = event.target.closest('[data-inc]');
      if (inc) {
        submitError = '';
        const line = core.loadCart(tableId).find((entry) => entry.menuItemId === inc.dataset.inc);
        core.updateCartLine(tableId, inc.dataset.inc, { quantity: line.quantity + 1 });
        render();
      }
      const dec = event.target.closest('[data-dec]');
      if (dec) {
        submitError = '';
        const line = core.loadCart(tableId).find((entry) => entry.menuItemId === dec.dataset.dec);
        core.updateCartLine(tableId, dec.dataset.dec, { quantity: line.quantity - 1 });
        render();
      }
      const submit = event.target.closest('[data-submit]');
      if (submit) {
        if (isSubmitting) return;
        const cart = core.loadCart(tableId);
        if (!cart.length) {
          notify(t('add_items_first'));
          render();
          return;
        }
        isSubmitting = true;
        render();
        try {
          const order = core.createOrder({ tableId, cart });
          submitError = '';
          notify(`${t('accepted')}: ${order.id}`);
          isSubmitting = false;
          render();
          pushCloudOrder(order).then(() => syncCloud(render));
        } catch (error) {
          isSubmitting = false;
          submitError = error.message || t('takeout_missing');
          notify(submitError);
          render();
        }
      }
    });

    document.addEventListener('input', (event) => {
      const note = event.target.closest('[data-note]');
      if (note) core.updateCartLine(tableId, note.dataset.note, { note: note.value });
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    cloud?.startPolling?.(core, render);
    render();
  }

  function orderMarkup(order) {
    return `
      <article class="card order-card">
        <div class="btn-row">
          <span class="status ${order.status}">${statusText(order.status)}</span>
          <strong>${orderLabel(order)}</strong>
          <span class="muted">${new Date(order.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
          ${fulfillmentMeta(order) ? `<span class="muted">${fulfillmentMeta(order)}</span>` : ''}
        </div>
        <div>${orderLinesMarkup(order)}</div>
        <div class="summary"><span>${t('total')}</span><span>${yen(order.total)}</span></div>
        <div class="btn-row">
          <button class="btn warn" data-status="${order.id}:preparing" ${order.status !== 'new' ? 'disabled' : ''}>${t('action_preparing')}</button>
          <button class="btn primary" data-status="${order.id}:done" ${order.status === 'paid' ? 'disabled' : ''}>${t('action_done')}</button>
        </div>
      </article>
    `;
  }

  function mountKitchen() {
    function kitchenOrderMarkup(order) {
      const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
      const minutes = elapsedMinutes(order.createdAt);
      const isRush = (order.status === 'new' && minutes >= 10) || (order.status === 'preparing' && minutes >= 20);
      const orderTypeClass = order.orderType === 'delivery' ? 'delivery' : order.orderType === 'pickup' ? 'pickup' : 'dine-in';
      const lineNotes = order.lines.filter((line) => line.note).map((line) => `${line.nameJa}: ${line.note}`);
      const fulfillmentNote = order.fulfillment?.note ? [order.fulfillment.note] : [];
      const notes = [...lineNotes, ...fulfillmentNote];
      return `
        <article class="card order-card kitchen-ticket ${orderTypeClass} ${isRush ? 'rush' : ''}">
          <div class="ticket-head">
            <div>
              <div class="ticket-badges">
                <span class="status ${order.status}">${statusText(order.status)}</span>
                <span class="order-type ${orderTypeClass}">${orderTypeText(order.orderType)}</span>
                ${isRush ? `<span class="rush-badge">${t('rush_order')}</span>` : ''}
              </div>
              <h2>${orderLabel(order)}</h2>
              <div class="meta">
                <span>${new Date(order.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>${t('elapsed_minutes', { count: minutes })}</span>
                <span>${t('item_count', { count: itemCount })}</span>
                ${fulfillmentMeta(order) ? `<span>${fulfillmentMeta(order)}</span>` : ''}
              </div>
            </div>
            <div class="price">${yen(order.total)}</div>
          </div>
          ${notes.length ? `<div class="note-alert"><strong>${t('kitchen_notes')}</strong>${notes.map((note) => `<span>${note}</span>`).join('')}</div>` : ''}
          <div>${orderLinesMarkup(order)}</div>
          <div class="btn-row">
            ${order.status === 'new' ? `<button class="btn warn" data-status="${order.id}:preparing">${t('action_preparing')}</button>` : ''}
            ${order.status === 'preparing' ? `<button class="btn primary" data-status="${order.id}:done">${t('action_done')}</button>` : ''}
            ${order.status === 'done' ? `<span class="muted">${t('waiting_checkout')}</span>` : ''}
          </div>
        </article>
      `;
    }

    function kitchenColumn(status, orders) {
      return `
        <section class="kitchen-column ${status}">
          <div class="section-head">
            <h2>${t(`kitchen_${status}`)}</h2>
            <span class="status ${status}">${orders.length}</span>
          </div>
          <div class="grid">
            ${orders.length ? orders.map(kitchenOrderMarkup).join('') : `<div class="empty small">${t(`kitchen_empty_${status}`)}</div>`}
          </div>
        </section>
      `;
    }

    function render() {
      i18n?.applyLang(i18n.getLang());
      const groups = core.kitchenOrderGroups();
      document.querySelector('[data-orders]').innerHTML = ['new', 'preparing', 'done']
        .map((status) => kitchenColumn(status, groups[status]))
        .join('');
    }
    document.addEventListener('click', async (event) => {
      const action = event.target.closest('[data-status]');
      if (!action) return;
      const [orderId, status] = action.dataset.status.split(':');
      core.updateOrderStatus(orderId, status);
      if (cloud?.configured?.()) {
        try {
          await cloud.updateOrderStatus(orderId, status);
          await syncCloud();
        } catch (error) {
          console.warn('Cloud status update failed', error);
          notify('Cloud sync error');
        }
      }
      notify(status === 'done' ? t('set_done') : t('set_preparing'));
      render();
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    cloud?.startPolling?.(core, render);
    render();
  }

  function mountTakeout() {
    const cartId = 'takeout';
    let selectedCategory = 'all';
    let fulfillmentMethod = 'pickup';
    let confirmedOrder = null;
    let isSubmitting = false;
    let submitError = '';

    function deliveryFee() {
      return fulfillmentMethod === 'delivery' ? 300 : 0;
    }

    function renderConfirmation() {
      const confirmation = document.querySelector('[data-takeout-confirmation]');
      if (!confirmation) return;
      if (!confirmedOrder) {
        confirmation.hidden = true;
        confirmation.innerHTML = '';
        return;
      }
      confirmation.hidden = false;
      confirmation.innerHTML = `
        <div class="confirmation-icon">✓</div>
        <div>
          <div class="eyebrow">${t('takeout_confirm_eyebrow')}</div>
          <h3>${t('takeout_confirm_title')}</h3>
          <p class="muted">${t('takeout_confirm_desc')}</p>
        </div>
        <div class="confirm-detail">
          <span>${t('order_number')}</span>
          <strong>${confirmedOrder.id}</strong>
        </div>
        <div class="confirm-detail">
          <span>${t('fulfillment_method')}</span>
          <strong>${t(`order_type_${confirmedOrder.orderType}`)}</strong>
        </div>
        <div class="confirm-detail">
          <span>${t('requested_time')}</span>
          <strong>${confirmedOrder.fulfillment?.requestedAt || '-'}</strong>
        </div>
        <div class="confirm-detail">
          <span>${t('total')}</span>
          <strong class="price">${yen(confirmedOrder.total)}</strong>
        </div>
        <div class="confirm-detail">
          <span>${t('store_phone')}</span>
          <strong>03-0000-0000</strong>
        </div>
        <div class="btn-row">
          <button class="btn ghost" type="button" data-continue-takeout>${t('continue_ordering')}</button>
          <a class="btn ghost" href="../kitchen/">${t('view_kitchen_demo')}</a>
        </div>
      `;
    }

    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      const cart = core.loadCart(cartId);
      renderConfirmation();
      document.querySelectorAll('[data-fulfillment]').forEach((button) => {
        button.classList.toggle('active', button.dataset.fulfillment === fulfillmentMethod);
      });
      const addressField = document.querySelector('[data-delivery-address-field]');
      if (addressField) addressField.hidden = fulfillmentMethod !== 'delivery';
      const categories = [{ id: 'all', nameJa: t('all'), nameZh: t('all') }, ...store.categories];
      document.querySelector('[data-categories]').innerHTML = categories.map((category) => (
        `<button class="chip ${category.id === selectedCategory ? 'active' : ''}" data-category="${category.id}">${category.nameJa}</button>`
      )).join('');
      const menu = selectedCategory === 'all'
        ? store.menu
        : store.menu.filter((item) => item.categoryId === selectedCategory);
      document.querySelector('[data-menu]').innerHTML = menu.map((item) => `
        <article class="card menu-item ${item.soldOut ? 'soldout' : ''}">
          <div class="menu-top">
            <div>
              <div class="dish-icon">${item.icon}</div>
              <div class="dish-name">${item.nameJa}</div>
              <div class="dish-sub">${item.nameZh}</div>
            </div>
            <div class="price">${yen(item.price)}</div>
          </div>
          <div class="dish-desc">${item.desc}${item.recommended ? ` · ${t('recommended')}` : ''}</div>
          <button class="btn primary" data-add="${item.id}" ${item.soldOut ? 'disabled' : ''}>${item.soldOut ? t('soldout') : t('add')}</button>
        </article>
      `).join('');
      const cartMarkup = cart.length ? cart.map((line) => {
        const item = store.menu.find((entry) => entry.id === line.menuItemId);
        return `
          <div class="cart-line">
            <div>
              <strong>${itemName(item)}</strong>
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
      document.querySelector('[data-takeout-cart]').innerHTML = `${submitError ? `<div class="empty small">${submitError}</div>` : ''}${cartMarkup}`;
      const subtotal = core.cartTotal(cart, store.menu);
      document.querySelector('[data-subtotal]').textContent = yen(subtotal);
      document.querySelector('[data-delivery-fee]').textContent = yen(deliveryFee());
      document.querySelector('[data-total]').textContent = yen(subtotal + deliveryFee());
      const takeoutSubmit = document.querySelector('[data-submit-takeout]');
      takeoutSubmit.disabled = isSubmitting;
      takeoutSubmit.textContent = isSubmitting ? t('order_submitting') : cart.length ? t('takeout_submit') : t('add_items_first');
      takeoutSubmit.title = cart.length ? t('takeout_submit') : t('cart_empty');
    }

    document.addEventListener('click', async (event) => {
      const fulfillment = event.target.closest('[data-fulfillment]');
      if (fulfillment) {
        fulfillmentMethod = fulfillment.dataset.fulfillment;
        render();
      }
      const category = event.target.closest('[data-category]');
      if (category) {
        selectedCategory = category.dataset.category;
        render();
      }
      const add = event.target.closest('[data-add]');
      if (add) {
        submitError = '';
        confirmedOrder = null;
        core.addToCart(cartId, add.dataset.add);
        render();
      }
      const inc = event.target.closest('[data-inc]');
      if (inc) {
        submitError = '';
        const line = core.loadCart(cartId).find((entry) => entry.menuItemId === inc.dataset.inc);
        core.updateCartLine(cartId, inc.dataset.inc, { quantity: line.quantity + 1 });
        render();
      }
      const dec = event.target.closest('[data-dec]');
      if (dec) {
        submitError = '';
        const line = core.loadCart(cartId).find((entry) => entry.menuItemId === dec.dataset.dec);
        core.updateCartLine(cartId, dec.dataset.dec, { quantity: line.quantity - 1 });
        render();
      }
      const submit = event.target.closest('[data-submit-takeout]');
      if (submit) {
        if (isSubmitting) return;
        const cart = core.loadCart(cartId);
        if (!cart.length) {
          notify(t('add_items_first'));
          render();
          return;
        }
        const name = document.querySelector('[data-customer-name]').value.trim();
        const phone = document.querySelector('[data-customer-phone]').value.trim();
        const requestedAt = document.querySelector('[data-requested-time]').value.trim();
        const address = document.querySelector('[data-delivery-address]').value.trim();
        if (!name || !phone || !requestedAt || (fulfillmentMethod === 'delivery' && !address)) {
          notify(t('takeout_missing'));
          return;
        }
        isSubmitting = true;
        render();
        try {
          const order = core.createOrder({
            orderType: fulfillmentMethod,
            cart,
            customer: { name, phone },
            fulfillment: {
              method: fulfillmentMethod,
              requestedAt,
              address,
              note: document.querySelector('[data-fulfillment-note]').value.trim()
            },
            deliveryFee: deliveryFee()
          });
          core.clearCart?.(cartId);
          confirmedOrder = order;
          submitError = '';
          notify(`${t('accepted')}: ${order.id}`);
          isSubmitting = false;
          render();
          pushCloudOrder(order).then(() => syncCloud(render));
        } catch (error) {
          isSubmitting = false;
          submitError = error.message || t('takeout_missing');
          notify(submitError);
          render();
        }
      }
      const continueTakeout = event.target.closest('[data-continue-takeout]');
      if (continueTakeout) {
        confirmedOrder = null;
        render();
      }
    });

    document.addEventListener('input', (event) => {
      const note = event.target.closest('[data-note]');
      if (note) core.updateCartLine(cartId, note.dataset.note, { note: note.value });
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    cloud?.startPolling?.(core, render);
    render();
  }

  function mountCheckout() {
    let selectedTable = '3';
    let selectedOutsideOrderId = '';
    function selectedTableTotal() {
      return core.loadStore().orders
        .filter((order) => order.tableId === selectedTable && order.paymentStatus !== 'paid')
        .reduce((sum, order) => sum + order.total, 0);
    }
    function activeCheckoutTotal() {
      if (selectedOutsideOrderId) {
        const order = core.loadStore().orders.find((entry) => entry.id === selectedOutsideOrderId && entry.paymentStatus !== 'paid');
        return order ? order.total : 0;
      }
      return selectedTableTotal();
    }
    function renderChange() {
      const total = activeCheckoutTotal();
      const receivedInput = document.querySelector('[data-received-amount]');
      const changeTotal = document.querySelector('[data-change-total]');
      if (!receivedInput || !changeTotal) return;
      const received = receivedInput.value === '' ? 0 : Number(receivedInput.value);
      const difference = received - total;
      changeTotal.textContent = difference < 0 ? `${t('short_amount')} ${yen(Math.abs(difference))}` : yen(difference);
      changeTotal.classList.toggle('danger-text', difference < 0);
    }
    function renderCloseDifference(report) {
      const input = document.querySelector('[data-close-form] [name="cashActual"]');
      const output = document.querySelector('[data-cash-difference]');
      if (!input || !output) return;
      const actual = input.value === '' ? 0 : Number(input.value);
      const difference = actual - report.cashExpected;
      output.textContent = yen(difference);
      output.classList.toggle('danger-text', difference < 0);
    }
    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      const openOrders = store.orders.filter((order) => order.paymentStatus !== 'paid');
      const outsideOrders = openOrders.filter((order) => order.orderType !== 'dine-in');
      if (selectedOutsideOrderId && !outsideOrders.some((order) => order.id === selectedOutsideOrderId)) selectedOutsideOrderId = '';
      const payments = core.paymentHistory();
      const overview = core.businessOverview();
      const report = core.dailyReport();
      const closeHistory = core.dailyCloseHistory();
      document.querySelector('[data-business-date]').textContent = overview.date;
      document.querySelector('[data-today-orders]').textContent = overview.orderCount;
      document.querySelector('[data-today-sales]').textContent = yen(overview.salesTotal);
      document.querySelector('[data-open-amount]').textContent = yen(overview.openTotal);
      document.querySelector('[data-order-mix]').textContent = `${t('order_type_dine_in')} ${overview.byType.dineIn} / ${t('order_type_pickup')} ${overview.byType.pickup} / ${t('order_type_delivery')} ${overview.byType.delivery}`;
      document.querySelector('[data-tables]').innerHTML = store.tables.map((table) => {
        const total = openOrders.filter((order) => order.tableId === table.id).reduce((sum, order) => sum + order.total, 0);
        const tableMeta = table.guestCount ? `${table.guestCount}${t('seats')}` : `${table.seats}${t('seats')}`;
        return `<button class="tab ${selectedTable === table.id ? 'active' : ''}" data-table="${table.id}">${table.area}-${table.id} · ${tableMeta} · ${total ? yen(total) : t('available')}${table.note ? ` · ${table.note}` : ''}</button>`;
      }).join('');
      const tableOptions = store.tables.map((table) => `<option value="${table.id}">${table.area}-${table.id}</option>`).join('');
      document.querySelector('[data-table-ops-form] [name="fromTable"]').innerHTML = tableOptions;
      document.querySelector('[data-table-ops-form] [name="toTable"]').innerHTML = tableOptions;
      document.querySelector('[data-table-ops-form] [name="fromTable"]').value = selectedTable;
      if (!document.querySelector('[data-table-ops-form] [name="toTable"]').value) {
        document.querySelector('[data-table-ops-form] [name="toTable"]').value = store.tables[0]?.id || '';
      }
      document.querySelector('[data-table-events]').innerHTML = store.tableEvents.slice(0, 6).map((event) => `
        <div class="table-line">
          <div>
            <strong>${t(event.type === 'open' ? 'open_table' : event.type === 'transfer' ? 'transfer_table' : event.type === 'merge' ? 'merge_table' : 'clear_table')}</strong>
            <div class="muted">${event.fromTableId ? `${event.fromTableId} → ${event.toTableId}` : event.tableId}${event.note ? ` · ${event.note}` : ''}</div>
          </div>
          <span class="muted">${new Date(event.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `).join('') || `<div class="empty small">${t('payment_history_empty')}</div>`;
      const tableOrders = openOrders.filter((order) => order.tableId === selectedTable);
      const total = tableOrders.reduce((sum, order) => sum + order.total, 0);
      document.querySelector('[data-checkout-orders]').innerHTML = tableOrders.length ? tableOrders.map(orderMarkup).join('') : `<div class="empty">${t('checkout_empty')}</div>`;
      document.querySelector('[data-outside-count]').textContent = outsideOrders.length;
      document.querySelector('[data-outside-orders]').innerHTML = outsideOrders.length ? outsideOrders.map((order) => `
        <article class="mini-order ${selectedOutsideOrderId === order.id ? 'selected' : ''}">
          <div class="btn-row">
            <span class="status ${order.status}">${statusText(order.status)}</span>
            <strong>${orderLabel(order)}</strong>
            <span class="price">${yen(order.total)}</span>
          </div>
          <div class="muted">${fulfillmentMeta(order)}</div>
          <div>${orderLinesMarkup(order)}</div>
          <button class="btn ghost" data-select-outside-order="${order.id}">${t('select_for_payment')}</button>
        </article>
      `).join('') : `<div class="empty small">${t('outside_checkout_empty')}</div>`;
      document.querySelector('[data-checkout-total]').textContent = yen(activeCheckoutTotal());
      const hint = document.querySelector('[data-active-payment-hint]');
      const currentTotal = activeCheckoutTotal();
      if (hint) {
        hint.textContent = currentTotal === 0
          ? t('checkout_no_due')
          : selectedOutsideOrderId ? t('checkout_hint_outside') : t('checkout_hint_table');
      }
      document.querySelector('[data-pay]').disabled = currentTotal === 0;
      document.querySelector('[data-payment-total]').textContent = yen(payments.total);
      document.querySelector('[data-payment-history]').innerHTML = payments.records.length ? payments.records.map((record) => `
        <div class="payment-line">
          <div>
            <strong>${orderLabel(record)}</strong>
            <div class="muted">${paymentText(record.method)} · ${record.paidAt ? new Date(record.paidAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
            ${fulfillmentMeta(record) ? `<div class="muted">${fulfillmentMeta(record)}</div>` : ''}
            <div class="muted">${t('payment_received')}: ${yen(record.receivedAmount)} · ${t('payment_change')}: ${yen(record.changeAmount)}</div>
          </div>
          <div class="price">${yen(record.total)}</div>
        </div>
      `).join('') : `<div class="empty small">${t('payment_history_empty')}</div>`;
      document.querySelector('[data-cash-expected]').textContent = yen(report.cashExpected);
      document.querySelector('[data-close-open]').textContent = yen(report.openTotal);
      const closeWarning = document.querySelector('[data-close-warning]');
      if (closeWarning) closeWarning.hidden = report.readyToClose;
      document.querySelector('[data-close-history]').innerHTML = closeHistory.length ? closeHistory.map((record) => `
        <div class="payment-line">
          <div>
            <strong>${record.date}</strong>
            <div class="muted">${t('cash_expected')}: ${yen(record.cashExpected)} · ${t('cash_actual')}: ${yen(record.cashActual)} · ${t('cash_difference')}: ${yen(record.cashDifference)}</div>
            ${record.note ? `<div class="muted">${record.note}</div>` : ''}
          </div>
          <div class="price">${yen(record.salesTotal)}</div>
        </div>
      `).join('') : `<div class="empty small">${t('payment_history_empty')}</div>`;
      renderCloseDifference(report);
      renderChange();
    }
    document.addEventListener('click', async (event) => {
      const table = event.target.closest('[data-table]');
      if (table) {
        selectedTable = table.dataset.table;
        selectedOutsideOrderId = '';
        render();
      }
      const outsideOrder = event.target.closest('[data-select-outside-order]');
      if (outsideOrder) {
        selectedOutsideOrderId = outsideOrder.dataset.selectOutsideOrder;
        render();
      }
      const pay = event.target.closest('[data-pay]');
      if (pay) {
        const method = document.querySelector('[data-payment-method]').value;
        const totalDue = activeCheckoutTotal();
        if (totalDue === 0) {
          notify(t('checkout_no_due'));
          render();
          return;
        }
        const receivedInput = document.querySelector('[data-received-amount]');
        const receivedAmount = receivedInput.value === '' ? totalDue : Number(receivedInput.value);
        if (receivedAmount < totalDue) {
          notify(t('short_amount'));
          renderChange();
          return;
        }
        const storeBeforePayment = core.loadStore();
        const ordersToPay = selectedOutsideOrderId
          ? storeBeforePayment.orders.filter((entry) => entry.id === selectedOutsideOrderId && entry.paymentStatus !== 'paid')
          : storeBeforePayment.orders.filter((order) => order.tableId === selectedTable && order.paymentStatus !== 'paid');
        const orderIdsToPay = ordersToPay.map((order) => order.id);
        const total = selectedOutsideOrderId
          ? core.checkoutOrder(selectedOutsideOrderId, { method, receivedAmount })
          : core.checkoutTable(selectedTable, { method, receivedAmount });
        if (cloud?.configured?.() && orderIdsToPay.length) {
          try {
            await cloud.checkoutOrders(orderIdsToPay, {
              method,
              receivedAmount,
              changeAmount: Math.max(receivedAmount - totalDue, 0)
            });
            await syncCloud();
          } catch (error) {
            console.warn('Cloud checkout update failed', error);
            notify('Cloud sync error');
          }
        }
        notify(`${t('checkout_done')}: ${yen(total)}`);
        selectedOutsideOrderId = '';
        receivedInput.value = '';
        render();
      }
    });
    document.querySelector('[data-close-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const report = core.dailyReport();
      const cashActual = form.get('cashActual') === '' ? report.cashExpected : Number(form.get('cashActual'));
      const record = core.closeBusinessDay({
        date: report.date,
        cashActual,
        note: form.get('note')
      });
      notify(`${t('close_saved')}: ${yen(record.cashDifference)}`);
      render();
    });
    document.querySelector('[data-table-ops-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const action = form.get('action');
      const fromTable = form.get('fromTable');
      const toTable = form.get('toTable');
      const note = form.get('note');
      if (action === 'open') core.openTable(fromTable, { guestCount: Number(form.get('guestCount')), note });
      if (action === 'transfer') core.transferTable(fromTable, toTable, { note });
      if (action === 'merge') core.mergeTables(fromTable, toTable, { note });
      if (action === 'clear') core.clearTable(fromTable, { note });
      selectedTable = action === 'transfer' || action === 'merge' ? toTable : fromTable;
      notify(t('table_operation_done'));
      render();
    });
    document.addEventListener('input', (event) => {
      if (event.target.closest('[data-received-amount]')) renderChange();
      if (event.target.closest('[data-close-form] [name="cashActual"]')) renderCloseDifference(core.dailyReport());
    });
    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    cloud?.startPolling?.(core, render);
    render();
  }

  function mountAdmin() {
    let inventoryFilter = 'all';

    function appBasePath() {
      const marker = '/admin/';
      const path = window.location.pathname;
      const index = path.indexOf(marker);
      return index >= 0 ? path.slice(0, index) : '';
    }

    function tableUrl(table) {
      return core.tableOrderUrl({ origin: window.location.origin, basePath: appBasePath(), table });
    }

    function qrImageUrl(url) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(url)}`;
    }

    function render() {
      i18n?.applyLang(i18n.getLang());
      const store = core.loadStore();
      const inventory = core.inventoryStatus();
      const report = core.dailyReport();
      const labor = core.laborSummary();
      const customers = core.customerProfiles();
      const auditEvents = core.auditEvents ? core.auditEvents(20) : [];
      const managerAlerts = core.managerAlerts ? core.managerAlerts() : [];
      const inventoryItems = inventoryFilter === 'low' ? inventory.lowStock : inventory.items;
      document.querySelector('[data-manager-alert-count]').textContent = managerAlerts.length;
      document.querySelector('[data-manager-alerts]').innerHTML = managerAlerts.length ? managerAlerts.map((alert) => `
        <div class="admin-line ${alert.severity === 'danger' ? 'attention-line' : ''}">
          <div>
            <strong>${t(`alert_${alert.type}`)}</strong>
            <div class="muted">${alert.summary}</div>
          </div>
          <div class="btn-row">
            ${alert.amount ? `<span class="price">${yen(alert.amount)}</span>` : ''}
            ${alert.quantity ? `<span class="status ${alert.severity === 'danger' ? 'new' : alert.severity === 'warning' ? 'preparing' : 'done'}">${alert.quantity}</span>` : ''}
          </div>
        </div>
      `).join('') : `<div class="empty small">${t('manager_alerts_empty')}</div>`;
      document.querySelector('[data-admin-menu]').innerHTML = store.menu.map((item) => `
        <div class="admin-line">
          <div>
            <strong>${item.icon} ${itemName(item)}</strong>
            <div class="muted">${item.categoryId} · ${yen(item.price)} · ${item.soldOut ? t('soldout') : t('selling')}</div>
          </div>
          <div class="btn-row">
            <button class="btn ghost" data-edit="${item.id}">${t('edit')}</button>
            <button class="btn ${item.soldOut ? 'primary' : 'danger'}" data-soldout="${item.id}">${item.soldOut ? t('restart_sales') : t('stop_sales')}</button>
          </div>
        </div>
      `).join('');
      document.querySelector('[name="categoryId"]').innerHTML = store.categories.map((category) => `<option value="${category.id}">${category.nameJa} / ${category.nameZh}</option>`).join('');
      document.querySelector('[data-admin-tables]').innerHTML = store.tables.map((table) => `<div class="table-line"><strong>${table.area}-${table.id}</strong><span>${table.seats}${t('seats')} · ${table.enabled ? table.status : t('disable_table')}</span></div>`).join('');
      document.querySelector('[data-low-stock-count]').textContent = `${t('low_stock')} ${inventory.lowStock.length}`;
      document.querySelector('[data-inventory-form] [name="menuItemId"]').innerHTML = store.menu.map((item) => `<option value="${item.id}">${itemName(item)}</option>`).join('');
      document.querySelector('[data-movement-form] [name="menuItemId"]').innerHTML = store.menu.map((item) => `<option value="${item.id}">${itemName(item)}</option>`).join('');
      document.querySelectorAll('[data-inventory-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.inventoryFilter === inventoryFilter);
      });
      document.querySelector('[data-inventory-list]').innerHTML = inventoryItems.map((item) => `
        <div class="admin-line ${item.lowStock ? 'attention-line' : ''}">
          <div>
            <strong>${item.nameJa} / ${item.nameZh}</strong>
            <div class="muted">${t('stock')}: ${item.stock} · ${t('safety_stock')}: ${item.safetyStock}</div>
          </div>
          <div class="btn-row">
            <span class="status ${item.lowStock ? 'new' : 'done'}">${item.lowStock ? t('low_stock') : t('selling')}</span>
            <button class="btn ghost" data-edit-inventory="${item.menuItemId}">${t('edit')}</button>
          </div>
        </div>
      `).join('') || `<div class="empty small">${t('payment_history_empty')}</div>`;
      document.querySelector('[data-inventory-movements]').innerHTML = core.inventoryMovements().slice(0, 8).map((entry) => {
        const item = store.menu.find((menuItem) => menuItem.id === entry.menuItemId);
        return `
          <div class="table-line">
            <div>
              <strong>${item ? item.nameJa : entry.menuItemId}</strong>
              <div class="muted">${t(entry.type)} · ${entry.note || '-'}</div>
            </div>
            <span class="price">${entry.quantity > 0 ? '+' : ''}${entry.quantity} / ${entry.stockAfter}</span>
          </div>
        `;
      }).join('') || `<div class="empty small">${t('payment_history_empty')}</div>`;
      document.querySelector('[data-report-orders]').textContent = report.orderCount;
      document.querySelector('[data-report-sales]').textContent = yen(report.salesTotal);
      document.querySelector('[data-report-open]').textContent = yen(report.openTotal);
      document.querySelector('[data-top-items]').innerHTML = report.topItems.length ? report.topItems.slice(0, 5).map((item) => `
        <div class="table-line"><strong>${item.nameJa}</strong><span>${item.quantity} · ${yen(item.total)}</span></div>
      `).join('') : `<div class="empty small">${t('payment_history_empty')}</div>`;
      const paymentEntries = Object.entries(report.paymentMethods);
      document.querySelector('[data-payment-methods]').innerHTML = paymentEntries.length ? paymentEntries.map(([method, total]) => `
        <div class="table-line"><strong>${paymentText(method)}</strong><span class="price">${yen(total)}</span></div>
      `).join('') : `<div class="empty small">${t('payment_history_empty')}</div>`;
      document.querySelector('[data-on-duty-count]').textContent = `${t('on_duty')} ${labor.onDuty.length}`;
      document.querySelector('[data-schedule-form] [name="staffId"]').innerHTML = labor.staff.map((staff) => `<option value="${staff.id}">${staff.name} / ${staff.role}</option>`).join('');
      if (!document.querySelector('[data-schedule-form] [name="date"]').value) {
        document.querySelector('[data-schedule-form] [name="date"]').value = todayKey();
      }
      document.querySelector('[data-labor-worked]').textContent = formatMinutes(labor.totals.workedMinutes);
      document.querySelector('[data-labor-wage]').textContent = yen(labor.totals.estimatedWages);
      document.querySelector('[data-staff-list]').innerHTML = labor.staff.map((staff) => {
        const activeEntry = labor.entries.find((entry) => entry.staffId === staff.id && !entry.clockOut);
        const dayEntry = labor.entries.find((entry) => entry.staffId === staff.id);
        const schedule = labor.schedules.find((entry) => entry.staffId === staff.id);
        return `
          <div class="admin-line">
            <div>
              <strong>${staff.name}</strong>
              <div class="muted">${staff.role} · ${staff.active ? t('enabled') : t('disable_table')} · ${t('hourly_wage')}: ${yen(staff.hourlyWage)}</div>
              ${schedule ? `<div class="muted">${t('staff_schedule')}: ${schedule.startTime}-${schedule.endTime} · ${t('scheduled_time')}: ${formatMinutes(schedule.scheduledMinutes)}</div>` : ''}
              ${dayEntry ? `<div class="muted">${t('worked_time')}: ${formatMinutes(dayEntry.workedMinutes)} · ${t('break_time')}: ${formatMinutes(dayEntry.breakMinutes)} · ${t('estimated_wage')}: ${yen(dayEntry.estimatedWage)}</div>` : ''}
              ${dayEntry && (dayEntry.lateMinutes || dayEntry.earlyLeaveMinutes) ? `<div class="btn-row labor-alerts">${dayEntry.lateMinutes ? `<span class="status new">${t('late')} ${dayEntry.lateMinutes}m</span>` : ''}${dayEntry.earlyLeaveMinutes ? `<span class="status new">${t('early_leave')} ${dayEntry.earlyLeaveMinutes}m</span>` : ''}</div>` : ''}
            </div>
            <div class="btn-row">
              <button class="btn ghost" data-edit-staff="${staff.id}">${t('edit')}</button>
              ${!activeEntry ? `<button class="btn primary" data-clock="in:${staff.id}" ${staff.active ? '' : 'disabled'}>${t('clock_in')}</button>` : ''}
              ${activeEntry?.status === 'working' ? `<button class="btn warn" data-clock="break:${staff.id}">${t('start_break')}</button><button class="btn danger" data-clock="out:${staff.id}">${t('clock_out')}</button>` : ''}
              ${activeEntry?.status === 'break' ? `<button class="btn primary" data-clock="back:${staff.id}">${t('end_break')}</button><button class="btn danger" data-clock="out:${staff.id}">${t('clock_out')}</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
      document.querySelector('[data-customer-count]').textContent = customers.length;
      document.querySelector('[data-customer-list]').innerHTML = customers.length ? customers.map((customer) => `
        <div class="customer-line">
          <div>
            <strong>${customer.name || '-'}</strong>
            <div class="muted">${customer.phone} · ${t('order_count')}: ${customer.orderCount} · ${t('total_spent')}: ${yen(customer.totalSpent)}</div>
            <div class="muted">${t('last_order')}: ${customer.lastOrderId || '-'}</div>
          </div>
          <form class="customer-note-form" data-customer-note-form="${customer.phone}">
            <input name="note" value="${customer.note || ''}" placeholder="${t('customer_note')}">
            <button class="btn ghost" type="submit">${t('save_customer_note')}</button>
          </form>
        </div>
      `).join('') : `<div class="empty small">${t('payment_history_empty')}</div>`;
      document.querySelector('[data-audit-count]').textContent = auditEvents.length;
      document.querySelector('[data-audit-log]').innerHTML = auditEvents.length ? auditEvents.map((entry) => `
        <div class="table-line">
          <div>
            <strong>${entry.actor} · ${entry.module}</strong>
            <div class="muted">${entry.summary || entry.action}</div>
            <div class="muted">${entry.target || '-'}${entry.amount ? ` · ${yen(entry.amount)}` : ''}${entry.quantity ? ` · ${entry.quantity}` : ''}</div>
          </div>
          <span class="muted">${new Date(entry.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `).join('') : `<div class="empty small">${t('audit_empty')}</div>`;
      document.querySelector('[data-table-qr]').innerHTML = store.tables.map((table) => {
        const url = tableUrl(table);
        return `
          <article class="card qr-card ${table.enabled ? '' : 'soldout'}">
            <div class="qr-head">
              <div>
                <strong>${table.area}-${table.id}</strong>
                <div class="muted">${table.seats}${t('seats')} · ${table.enabled ? t('enabled') : t('disable_table')}</div>
              </div>
              <button class="btn ghost" data-edit-table="${table.id}">${t('edit')}</button>
            </div>
            <div class="qr-code">
              <img src="${qrImageUrl(url)}" alt="QR ${table.id}">
            </div>
            <span class="url-box">${url}</span>
            <div class="btn-row">
              <a class="btn ghost" href="${url}" target="_blank" rel="noreferrer">${t('open_order')}</a>
              <a class="btn ghost" href="${qrImageUrl(url)}" target="_blank" rel="noreferrer">${t('download_qr')}</a>
              <button class="btn warn" data-regenerate-table="${table.id}">${t('regenerate_qr')}</button>
              <button class="btn ${table.enabled ? 'danger' : 'primary'}" data-toggle-table="${table.id}">${table.enabled ? t('disable_table') : t('enable_table')}</button>
            </div>
          </article>
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
      const editTable = event.target.closest('[data-edit-table]');
      if (editTable) {
        const table = core.loadStore().tables.find((entry) => entry.id === editTable.dataset.editTable);
        Object.entries(table).forEach(([key, value]) => {
          const field = document.querySelector(`[data-table-form] [name="${key}"]`);
          if (!field) return;
          if (field.type === 'checkbox') field.checked = Boolean(value);
          else field.value = value;
        });
      }
      const editInventory = event.target.closest('[data-edit-inventory]');
      if (editInventory) {
        const item = core.inventoryStatus().items.find((entry) => entry.menuItemId === editInventory.dataset.editInventory);
        const form = document.querySelector('[data-inventory-form]');
        form.elements.menuItemId.value = item.menuItemId;
        form.elements.stock.value = item.stock;
        form.elements.safetyStock.value = item.safetyStock;
      }
      const inventoryFilterButton = event.target.closest('[data-inventory-filter]');
      if (inventoryFilterButton) {
        inventoryFilter = inventoryFilterButton.dataset.inventoryFilter;
        render();
      }
      const editStaff = event.target.closest('[data-edit-staff]');
      if (editStaff) {
        const staff = core.laborSummary().staff.find((entry) => entry.id === editStaff.dataset.editStaff);
        Object.entries(staff).forEach(([key, value]) => {
          const field = document.querySelector(`[data-staff-form] [name="${key}"]`);
          if (!field) return;
          if (field.type === 'checkbox') field.checked = Boolean(value);
          else field.value = value;
        });
      }
      const clock = event.target.closest('[data-clock]');
      if (clock) {
        const [action, staffId] = clock.dataset.clock.split(':');
        if (action === 'in') core.clockIn(staffId);
        if (action === 'break') core.startBreak(staffId);
        if (action === 'back') core.endBreak(staffId);
        if (action === 'out') core.clockOut(staffId);
        notify(t('timeclock_updated'));
        render();
      }
      const regenerateTable = event.target.closest('[data-regenerate-table]');
      if (regenerateTable) {
        core.regenerateTableToken(regenerateTable.dataset.regenerateTable);
        notify(t('table_token_updated'));
        render();
      }
      const toggleTable = event.target.closest('[data-toggle-table]');
      if (toggleTable) {
        core.toggleTableEnabled(toggleTable.dataset.toggleTable);
        notify(t('table_enabled_updated'));
        render();
      }
      const reset = event.target.closest('[data-reset]');
      if (reset) {
        core.resetDemo();
        if (cloud?.configured?.()) {
          cloud.resetOrders().then(() => syncCloud(render)).catch((error) => {
            console.warn('Cloud reset failed', error);
            notify('Cloud sync error');
          });
        }
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
        price: Number(form.get('price')),
        desc: form.get('desc'),
        recommended: form.get('recommended') === 'on',
        soldOut: form.get('soldOut') === 'on'
      });
      event.currentTarget.reset();
      notify(t('menu_saved'));
      render();
    });

    document.querySelector('[data-table-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.upsertTable({
        id: form.get('id'),
        area: form.get('area'),
        seats: Number(form.get('seats')),
        enabled: form.get('enabled') === 'on'
      });
      event.currentTarget.reset();
      event.currentTarget.elements.enabled.checked = true;
      notify(t('table_saved'));
      render();
    });

    document.querySelector('[data-inventory-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.adjustInventory(form.get('menuItemId'), {
        stock: Number(form.get('stock')),
        safetyStock: Number(form.get('safetyStock'))
      });
      notify(t('inventory_saved'));
      render();
    });

    document.querySelector('[data-movement-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.recordInventoryMovement(form.get('menuItemId'), {
        type: form.get('type'),
        quantity: Number(form.get('quantity')),
        note: form.get('note')
      });
      event.currentTarget.elements.quantity.value = 1;
      event.currentTarget.elements.note.value = '';
      notify(t('movement_saved'));
      render();
    });

    document.querySelector('[data-staff-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.upsertStaff({
        id: form.get('id'),
        name: form.get('name'),
        role: form.get('role'),
        hourlyWage: Number(form.get('hourlyWage')),
        active: form.get('active') === 'on'
      });
      event.currentTarget.reset();
      event.currentTarget.elements.active.checked = true;
      notify(t('staff_saved'));
      render();
    });

    document.querySelector('[data-schedule-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      core.upsertStaffSchedule({
        staffId: form.get('staffId'),
        date: form.get('date'),
        startTime: form.get('startTime'),
        endTime: form.get('endTime'),
        breakMinutes: Number(form.get('breakMinutes'))
      });
      notify(t('schedule_saved'));
      render();
    });

    document.addEventListener('submit', (event) => {
      const form = event.target.closest('[data-customer-note-form]');
      if (!form) return;
      event.preventDefault();
      core.updateCustomerNote(form.dataset.customerNoteForm, new FormData(form).get('note'));
      notify(t('customer_note_saved'));
      render();
    });

    window.addEventListener('storage', render);
    window.addEventListener('irakutech:lang', render);
    cloud?.startPolling?.(core, render);
    render();
  }

  i18n?.init();
  if (view === 'order') mountOrder();
  if (view === 'takeout') mountTakeout();
  if (view === 'kitchen') mountKitchen();
  if (view === 'checkout') mountCheckout();
  if (view === 'admin') mountAdmin();
})();
