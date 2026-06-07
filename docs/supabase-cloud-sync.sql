create table if not exists public.izakaya_orders (
  id text primary key,
  restaurant_id text not null default 'demo',
  table_id text not null default '',
  order_type text not null default 'dine-in',
  status text not null default 'new',
  payment_status text not null default 'unpaid',
  payment_method text not null default '',
  received_amount integer not null default 0,
  change_amount integer not null default 0,
  customer jsonb not null default '{"name":"","phone":""}'::jsonb,
  fulfillment jsonb not null default '{}'::jsonb,
  fulfillment_status text not null default 'pending',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.izakaya_order_lines (
  id bigserial primary key,
  restaurant_id text not null default 'demo',
  order_id text not null references public.izakaya_orders(id) on delete cascade,
  menu_item_id text not null,
  name_ja text not null,
  name_zh text not null,
  price integer not null default 0,
  quantity integer not null default 1,
  note text not null default '',
  line_index integer not null default 0
);

create index if not exists izakaya_orders_restaurant_created_idx
  on public.izakaya_orders (restaurant_id, created_at desc);

create index if not exists izakaya_order_lines_restaurant_order_idx
  on public.izakaya_order_lines (restaurant_id, order_id, line_index);

alter table public.izakaya_orders enable row level security;
alter table public.izakaya_order_lines enable row level security;

drop policy if exists "demo orders read" on public.izakaya_orders;
drop policy if exists "demo orders insert" on public.izakaya_orders;
drop policy if exists "demo orders update" on public.izakaya_orders;
drop policy if exists "demo orders delete" on public.izakaya_orders;
drop policy if exists "demo order lines read" on public.izakaya_order_lines;
drop policy if exists "demo order lines insert" on public.izakaya_order_lines;
drop policy if exists "demo order lines update" on public.izakaya_order_lines;
drop policy if exists "demo order lines delete" on public.izakaya_order_lines;

create policy "demo orders read"
  on public.izakaya_orders for select
  to anon, authenticated
  using (restaurant_id = 'demo');

create policy "demo orders insert"
  on public.izakaya_orders for insert
  to anon, authenticated
  with check (restaurant_id = 'demo');

create policy "demo orders update"
  on public.izakaya_orders for update
  to anon, authenticated
  using (restaurant_id = 'demo')
  with check (restaurant_id = 'demo');

create policy "demo orders delete"
  on public.izakaya_orders for delete
  to anon, authenticated
  using (restaurant_id = 'demo');

create policy "demo order lines read"
  on public.izakaya_order_lines for select
  to anon, authenticated
  using (restaurant_id = 'demo');

create policy "demo order lines insert"
  on public.izakaya_order_lines for insert
  to anon, authenticated
  with check (restaurant_id = 'demo');

create policy "demo order lines update"
  on public.izakaya_order_lines for update
  to anon, authenticated
  using (restaurant_id = 'demo')
  with check (restaurant_id = 'demo');

create policy "demo order lines delete"
  on public.izakaya_order_lines for delete
  to anon, authenticated
  using (restaurant_id = 'demo');

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.izakaya_orders to anon, authenticated;
grant select, insert, update, delete on public.izakaya_order_lines to anon, authenticated;
grant usage, select on sequence public.izakaya_order_lines_id_seq to anon, authenticated;
