# Audit Log Design

## Goal

Add a lightweight operations audit log to the izakaya demo so a small restaurant owner can see what changed, when it changed, and which area of the business was affected.

## Scope

This version stores audit events in the existing local demo store. It does not add a Supabase audit table yet, because the current sales demo must stay simple and stable. Cloud order sync remains unchanged.

## Events To Record

- Order submitted from dine-in and takeout flows.
- Kitchen status changed to preparing or done.
- Table checkout and outside order checkout.
- Business day close saved.
- Table operations: open, transfer, merge, clear.
- Menu item saved, sold-out toggled.
- Table QR/table settings changed.
- Inventory stock saved, inventory movement recorded.
- Staff saved, schedule saved, clock in, break start/end, clock out.
- Customer note saved.
- Demo data reset.

## Data Model

Each event is stored as:

- `id`: generated event id.
- `createdAt`: ISO timestamp.
- `module`: one of `order`, `kitchen`, `checkout`, `admin`, `inventory`, `staff`, `table`, `customer`, `system`.
- `action`: concise action key.
- `actor`: display name such as `顾客`, `厨房`, `会计`, `店长`.
- `target`: affected order/table/menu/staff/customer id.
- `summary`: readable description.
- `amount`: optional money amount.
- `quantity`: optional count.
- `meta`: optional plain object for small details.

## UI

The admin page gains an "操作日志" panel in the report/management area. It shows the latest 20 events with time, module, actor, summary, and optional amount/quantity.

## Testing

Core tests verify event creation for orders, status updates, checkout, inventory, staff time clock, customer note, and reset. Site readiness tests verify the admin page contains the audit log mount point.

