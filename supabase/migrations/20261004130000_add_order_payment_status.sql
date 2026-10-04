-- Add explicit payment state without changing the existing payment method field.
-- Safe default keeps all existing orders pending until confirmed by the kitchen/provider.
alter table public.orders
  add column if not exists payment_status text not null default 'pending';

alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));

create index if not exists orders_payment_status_idx
  on public.orders (payment_status);
