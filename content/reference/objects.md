---
title: Nesneler
description: Payment, CheckoutSession, risk ve form JSON şemaları.
category: Reference
slug: /docs/reference/objects
order: 1
---

# Nesneler

API'nin döndürdüğü ana JSON şekilleri.

## Payment

`object` alanı her zaman `payment`. Yanıt `{ "data": { ... } }` sarmalayıcısı içindedir.

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | string | ULID |
| `object` | string | `payment` |
| `status` | string | küçük harf enum |
| `status_label` | string | Türkçe etiket |
| `amount` | number | ana birim |
| `currency` | string | `TL` yanıtta `TRY` olur |
| `order_id` | string | sizin sipariş no |
| `provider_id` | integer \| null | `banks.id` |
| `provider_order_id` | string \| null | banka sipariş no |
| `installment_count` | integer | |
| `environment` | string | `test` veya `live` |
| `customer.email` | string | |
| `customer.name` | string | |
| `customer.phone` | string | |
| `customer.address` | string | |
| `failure` | object \| yok | yalnız failed |
| `failure.code` | string \| null | |
| `failure.message` | string \| null | |
| `risk` | object \| yok | değerlendirme yüklüyse |
| `action` | object \| null | yalnız requires_action dolu anlamında; diğerinde null |
| `metadata` | object | |
| `created_at` | string \| null | ISO-8601 |
| `updated_at` | string \| null | |
| `succeeded_at` | string \| null | |
| `failed_at` | string \| null | |

Kart, CVV, PAN dönmez.

### `action`

| `type` | Ek alanlar |
|--------|------------|
| `form_post` | `form` (url, method, fields) |
| `html` | `html` string |
| `redirect` | `redirect_url` |
| `none` | yok |

### `risk`

| Alan | Tip |
|------|-----|
| `status` | `ALLOW`, `REVIEW`, `REQUIRE_3DS`, `BLOCK`, `ROUTE_TO_PROVIDER` |
| `status_label` | string |
| `action` | aynı aile |
| `action_label` | string |
| `applied_rule` | string \| null |
| `risk_score` | number |
| `signals` | string[] |
| `matches` | array |

## CheckoutSession

`object`: `checkout_session`.

| Alan | Tip |
|------|-----|
| `id` | ULID |
| `status` | `open`, `complete`, `expired` |
| `order_id` | string |
| `amount` | number (hesaplanan toplam) |
| `currency` | büyük harf |
| `order_summary` | object |
| `line_items` | array |
| `customer` | object |
| `return_urls` | object |
| `options` | object |
| `metadata` | object |
| `payment_id` | string \| null |
| `url` | string (GET pay sayfası) |
| `expires_at` | string \| null |
| `completed_at` | string \| null |
| `created_at` | string \| null |
| `updated_at` | string \| null |

## Iframe token yanıtı

Sarmalayıcı yok.

| Alan | Tip |
|------|-----|
| `status` | `success` veya `failed` |
| `token` | string (yalnız success) |
| `reason` | string (yalnız failed) |

## Form şema

Sarmalayıcı yok. Alanlar: `id`, `name`, `description`, `success_message`, `abuse_protection`, `fields[]`.

## Form submission 201

| Alan | Tip |
|------|-----|
| `id` | public id |
| `message` | string |
| `submitted_at` | ISO-8601 |

## Health

| Alan | Tip |
|------|-----|
| `status` | `operational` \| `degraded` \| `down` |
| `scope` | `summary` veya bileşen adı |
| `checked_at` | ISO-8601 |
| `components` | map |

Her bileşen: `component`, `status`, `message`, `checked_at`, `meta`.
