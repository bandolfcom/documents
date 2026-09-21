---
title: Checkout oturumu oluştur
description: Hosted ödeme oturumu aç. POST /api/v1/checkout-sessions.
category: Ödemeler API
slug: /docs/api/create-checkout-session
order: 3
type: api
method: POST
endpoint: /api/v1/checkout-sessions
featured: true
---

# Checkout oturumu oluştur

Kartı BANDOLF sayfasında toplamak için oturum açar.

```
POST https://api.bandolf.com/api/v1/checkout-sessions
Authorization: Bearer sk_test_xxxxxxxx
Content-Type: application/json
```

Başarı: `201`.

## İstek alanları

| Alan | Zorunlu | Kural |
|------|---------|-------|
| `order_id` | Evet | string max 64, tekil |
| `currency` | Evet | aktif kod + TL |
| `line_items` | Evet | min 1 eleman |
| `line_items[].name` | Evet | max 255 |
| `line_items[].description` | Hayır | max 500 |
| `line_items[].image` | Hayır | URL max 500 |
| `line_items[].quantity` | Evet | integer min 1 |
| `line_items[].unit_amount` | Evet | number min 0.01 |
| `summary` | Hayır | object |
| `summary.subtotal` | Hayır | number min 0 (bilgi, toplam yine satırdan) |
| `summary.discount` | Hayır | number min 0 |
| `summary.shipping` | Hayır | number min 0 |
| `summary.tax_rate` | Hayır | 0-100. Yoksa 20 |
| `summary.shipping_label` | Hayır | max 100 |
| `customer` | Hayır | object |
| `return_urls.success` | Evet | URL |
| `return_urls.failure` | Evet | URL |
| `options` | Hayır | object |
| `metadata` | Hayır | object |

### `customer` ayrıntı

| Alan | Kural |
|------|-------|
| `email` | email max 100 |
| `name` | max 60 |
| `phone` | max 20 |
| `address` | max 400 |
| `billing.line1` / `billing_address_line1` | max 255 |
| `billing.line2` / `billing_address_line2` | max 255 |
| `billing.postal_code` / `billing_postal_code` | max 20 |
| `billing.city` / `billing_city` | max 100 |
| `billing.country` / `billing_country` | tam 2 karakter |

### `options`

| Alan | Kural |
|------|-------|
| `provider_id` | var olan bank id |
| `max_installment` | 1-12 |
| `no_installment` | boolean |
| `installments` | string max 50 |
| `non_3d` | boolean |
| `sync_mode` | boolean |
| `expires_in_minutes` | 5-1440, varsayılan 60 |
| `collect_billing_address` | boolean, varsayılan true |

## Örnek istek

```bash
curl -X POST https://api.bandolf.com/api/v1/checkout-sessions \
  -H "Authorization: Bearer sk_test_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-2001",
    "currency": "TRY",
    "line_items": [
      {
        "name": "Studio kablosuz kulaklık",
        "description": "Siyah",
        "image": "https://cdn.example.com/p1.png",
        "quantity": 1,
        "unit_amount": 999.90
      }
    ],
    "summary": {
      "discount": 0,
      "shipping": 0,
      "tax_rate": 20,
      "shipping_label": "Standart kargo"
    },
    "customer": {
      "email": "ada@example.com",
      "name": "Ada Yılmaz",
      "phone": "05555555555",
      "billing": {
        "line1": "Test Mahallesi No:1",
        "postal_code": "34000",
        "city": "Istanbul",
        "country": "TR"
      }
    },
    "return_urls": {
      "success": "https://magaza.example.com/ok",
      "failure": "https://magaza.example.com/fail"
    },
    "options": {
      "expires_in_minutes": 45,
      "collect_billing_address": true
    },
    "metadata": { "cart_id": "c_1" }
  }'
```

`999.90` + yüzde 20 KDV = `1199.88` oturum tutarı.

## 201 yanıt

```json
{
  "data": {
    "id": "01JSESSIONULID00000000000",
    "object": "checkout_session",
    "status": "open",
    "order_id": "ORD-2001",
    "amount": 1199.88,
    "currency": "TRY",
    "order_summary": {},
    "line_items": [],
    "customer": {},
    "return_urls": {
      "success": "https://magaza.example.com/ok",
      "failure": "https://magaza.example.com/fail"
    },
    "options": {},
    "metadata": { "cart_id": "c_1" },
    "payment_id": null,
    "url": "https://api.bandolf.com/pay/01JSESSIONULID00000000000",
    "expires_at": "2026-09-16T21:00:00+00:00",
    "completed_at": null,
    "created_at": "2026-09-16T20:15:00+00:00",
    "updated_at": "2026-09-16T20:15:00+00:00"
  }
}
```

Müşteriyi `data.url` adresine yönlendirin. `url` `route('pay.show')` çıktısıdır. Host `API_DOMAIN` olur.

## 422

```json
{
  "error": {
    "code": "checkout_session_error",
    "message": "Bu order_id ile zaten bir ödeme oturumu mevcut."
  }
}
```

Alan doğrulama hataları `message` + `errors` biçiminde de gelebilir.

Kart bu endpoint'te yoktur. Kart `/pay/{id}` HTML formundadır.
