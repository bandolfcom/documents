---
title: Ödeme getir
description: ULID ile ödeme oku. GET /api/v1/payments/{id}.
category: API Reference
slug: /docs/api/retrieve-payment
order: 5
type: api
method: GET
endpoint: /api/v1/payments/{paymentId}
---

# Ödeme getir

```
GET https://api.bandolf.com/api/v1/payments/{paymentId}
Authorization: Bearer sk_test_xxxxxxxx
Accept: application/json
```

`{paymentId}` ödemenin ULID kimliğidir. Başka bir biçim kabul edilmez.

Başka merchant'ın ödemesi 404 döner. Anahtar, sahibinin merchant'ına bağlıdır.

## curl

```bash
curl https://api.bandolf.com/api/v1/payments/01J8Z3Y4X5W6V7U8T9S0R1Q2P3 \
  -H "Authorization: Bearer $BANDOLF_KEY"
```

## 200

Şema create yanıtı ile aynıdır. `object` her zaman `payment`. Risk alanı da yüklüdür.

`processing` iken poll edin. `requires_action` iken müşteri 3DS'te olabilir. `succeeded` finaldir.

## 404

```json
{
  "error": {
    "code": "not_found",
    "message": "Ödeme bulunamadı."
  }
}
```

## 401

Standart `unauthenticated`.

Liste endpoint'i yoktur. Filtreli arama panel raporundadır.
