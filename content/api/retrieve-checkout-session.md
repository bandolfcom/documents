---
title: Checkout oturumu getir
description: Oturum ve bağlı ödeme id. GET /api/v1/checkout-sessions/{id}.
category: Ödemeler API
slug: /docs/api/retrieve-checkout-session
order: 4
type: api
method: GET
endpoint: /api/v1/checkout-sessions/{sessionId}
---

# Checkout oturumu getir

```
GET https://api.bandolf.com/api/v1/checkout-sessions/{sessionId}
Authorization: Bearer sk_test_xxxxxxxx
```

`{sessionId}` oturumun ULID kimliğidir.

İlişkili `payment` yüklenir. Tamamlanmış oturumda `payment_id` dolu olur.

## curl

```bash
curl https://api.bandolf.com/api/v1/checkout-sessions/01JSESSIONULID00000000000 \
  -H "Authorization: Bearer $BANDOLF_KEY"
```

## 200

Create ile aynı `checkout_session` nesnesi. Farklar:

- `status`: `open` | `complete` | `expired`
- `payment_id`: bağlı ödemenin id değeri veya null
- `completed_at`: complete ise ISO zaman

Ödeme detayı bu yanıtta gömülü tam Payment nesnesi olarak dönmez. `payment_id` ile [Ödeme getir](/docs/api/retrieve-payment) çağırın.

## 404

```json
{
  "error": {
    "code": "not_found",
    "message": "Ödeme oturumu bulunamadı."
  }
}
```

Başka merchant'ın oturumu de 404'tür.

## Poll önerisi

Success URL'ye gelen istekte session id'yi query'de taşımıyorsanız kendi `order_id` eşlemenizi tutun. Session id'yi create yanıtında siparişinize kaydedin. Müşteri döndüğünde GET session + GET payment yapın.
