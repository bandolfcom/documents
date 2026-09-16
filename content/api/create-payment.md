---
title: Ödeme oluştur
description: Direct API ile kart çekimi. POST /api/v1/payments.
category: API Reference
slug: /docs/api/create-payment
order: 4
type: api
method: POST
endpoint: /api/v1/payments
featured: true
---

# Ödeme oluştur

Kart bilgisiyle çekim başlatır. PCI yükümlülüğü size aittir.

```
POST https://api.bandolf.com/api/v1/payments
Authorization: Bearer sk_test_xxxxxxxx
Content-Type: application/json
```

Başarı: `201`. Gövde `{ "data": Payment }`.

## İstek alanları

### Kök

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `amount` | Evet | number | min 0.01 |
| `currency` | Evet | string | Aktif kodlar + `TL` |
| `order_id` | Evet | string | max 64, merchant tekil |
| `provider_id` | Hayır | integer | `banks.id` var olmalı |
| `installment_count` | Hayır | integer | 0 veya 2-12 |
| `customer` | Evet | object | |
| `card` | Evet | object | |
| `return_urls` | Evet | object | |
| `basket` | Hayır | array | |
| `metadata` | Hayır | object | |
| `options` | Hayır | object | |

### `customer`

| Alan | Zorunlu | Tip | Max |
|------|---------|-----|-----|
| `id` | Hayır | string | 64 |
| `email` | Evet | email | 100 |
| `name` | Evet | string | 60 |
| `phone` | Evet | string | 20 |
| `address` | Evet | string | 400 |

### `card`

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `holder_name` | Evet | string | max 50 |
| `number` | Evet | string | 13-19 |
| `expiry_month` | Evet | string | regex `^(0?[1-9]|1[0-2])$` |
| `expiry_year` | Evet | string | 2 veya 4 hane |
| `cvv` | Evet | string | 3-4 |
| `type` | Hayır | string | advantage, axess, combo, bonus, cardfinans, maximum, paraf, world, saglamkart |

Kart ay/yıl geçmişteyse 422. Mesaj `card.expiry_month` üzerinde.

### `return_urls`

| Alan | Zorunlu | Tip |
|------|---------|-----|
| `success` | Evet | URL max 400 |
| `failure` | Evet | URL max 400 |

### `basket[]`

| Alan | Zorunlu (basket varsa) |
|------|------------------------|
| `name` | string max 255 |
| `price` | herhangi (string veya sayı) |
| `quantity` | integer min 1 |

### `options`

| Alan | Tip |
|------|-----|
| `non_3d` | boolean |
| `sync_mode` | boolean |
| `allow_not_enrolled` | boolean |

## curl örneği

```bash
curl -X POST https://api.bandolf.com/api/v1/payments \
  -H "Authorization: Bearer sk_test_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.99,
    "currency": "TRY",
    "order_id": "ORD-1001",
    "installment_count": 0,
    "customer": {
      "id": "cus_123",
      "email": "test@example.com",
      "name": "Paytr Test",
      "phone": "05555555555",
      "address": "Test Mahallesi No:1 Istanbul"
    },
    "card": {
      "holder_name": "TEST KARTI",
      "number": "9792030394440796",
      "expiry_month": "12",
      "expiry_year": "99",
      "cvv": "000"
    },
    "return_urls": {
      "success": "https://example.com/payment/success",
      "failure": "https://example.com/payment/failure"
    },
    "basket": [
      { "name": "Test Ürün", "price": "100.99", "quantity": 1 }
    ],
    "metadata": { "shop": "web" },
    "options": { "non_3d": true, "sync_mode": true }
  }'
```

## Node örneği

```javascript
const res = await fetch('https://api.bandolf.com/api/v1/payments', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.BANDOLF_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 100.99,
    currency: 'TRY',
    order_id: `ORD-${Date.now()}`,
    customer: {
      email: 'test@example.com',
      name: 'Paytr Test',
      phone: '05555555555',
      address: 'Test Mahallesi No:1 Istanbul',
    },
    card: {
      holder_name: 'TEST KARTI',
      number: '9792030394440796',
      expiry_month: '12',
      expiry_year: '99',
      cvv: '000',
    },
    return_urls: {
      success: 'https://example.com/payment/success',
      failure: 'https://example.com/payment/failure',
    },
  }),
});
const json = await res.json();
if (!res.ok) throw new Error(json.error?.message || res.status);
console.log(json.data.id, json.data.status);
```

## PHP örneği

```php
<?php
$payload = [
    'amount' => 100.99,
    'currency' => 'TRY',
    'order_id' => 'ORD-'.date('YmdHis'),
    'customer' => [
        'email' => 'test@example.com',
        'name' => 'Paytr Test',
        'phone' => '05555555555',
        'address' => 'Test Mahallesi No:1 Istanbul',
    ],
    'card' => [
        'holder_name' => 'TEST KARTI',
        'number' => '9792030394440796',
        'expiry_month' => '12',
        'expiry_year' => '99',
        'cvv' => '000',
    ],
    'return_urls' => [
        'success' => 'https://example.com/payment/success',
        'failure' => 'https://example.com/payment/failure',
    ],
];
$ch = curl_init('https://api.bandolf.com/api/v1/payments');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer '.getenv('BANDOLF_SECRET_KEY'),
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);
$raw = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$result = json_decode($raw, true);
```

## Başarı yanıtı (`succeeded`)

```json
{
  "data": {
    "id": "01J8Z3Y4X5W6V7U8T9S0R1Q2P3",
    "object": "payment",
    "status": "succeeded",
    "status_label": "Başarılı",
    "amount": 100.99,
    "currency": "TRY",
    "order_id": "ORD-1001",
    "provider_id": 12,
    "provider_order_id": null,
    "installment_count": 0,
    "environment": "test",
    "customer": {
      "email": "test@example.com",
      "name": "Paytr Test",
      "phone": "05555555555",
      "address": "Test Mahallesi No:1 Istanbul"
    },
    "risk": {
      "status": "ALLOW",
      "status_label": "Allow",
      "action": "ALLOW",
      "action_label": "Allow",
      "applied_rule": null,
      "risk_score": 0,
      "signals": [],
      "matches": []
    },
    "action": null,
    "metadata": {
      "shop": "web",
      "return_urls": {
        "success": "https://example.com/payment/success",
        "failure": "https://example.com/payment/failure"
      }
    },
    "created_at": "2026-09-16T20:00:00+00:00",
    "updated_at": "2026-09-16T20:00:01+00:00",
    "succeeded_at": "2026-09-16T20:00:01+00:00",
    "failed_at": null
  }
}
```

`failure` anahtarı yalnızca `status=failed` iken eklenir.

## `requires_action` yanıtı

```json
{
  "data": {
    "id": "01J...",
    "object": "payment",
    "status": "requires_action",
    "status_label": "Ek işlem gerekli",
    "action": {
      "type": "redirect",
      "redirect_url": "https://api.bandolf.com/odeme/3ds/odeme/01J..."
    }
  }
}
```

`action.type` değerleri: `form_post`, `html`, `redirect`, `none`.

## `failed` yanıtı

```json
{
  "data": {
    "status": "failed",
    "status_label": "Başarısız",
    "failure": {
      "code": "FRAUD_BLACKLIST",
      "message": "Ödeme kara liste kaydı nedeniyle engellendi."
    },
    "failed_at": "2026-09-16T20:00:00+00:00"
  }
}
```

Fraud block HTTP 201 dönebilir. Kayıt oluşmuştur. `error` nesnesi yoktur.

## İş kuralı 422

```json
{
  "error": {
    "code": "payment_error",
    "message": "Bu order_id ile zaten bir ödeme kaydı mevcut."
  }
}
```

## 500

```json
{
  "error": {
    "code": "internal_error",
    "message": "Ödeme işlenirken beklenmeyen bir hata oluştu."
  }
}
```

Kart numarası loglara düşmemelidir. BANDOLF istisnayı `report()` eder.

Nesne alanlarının tam listesi: [Nesneler](/docs/reference/objects).
