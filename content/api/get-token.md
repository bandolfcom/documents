---
title: Iframe token al
description: HMAC ile sipariş token'ı. POST /api/get-token.
category: Iframe ve Formlar API
slug: /docs/api/get-token
order: 1
type: api
method: POST
endpoint: /api/get-token
featured: true
---

# Iframe token al

Authorization header yoktur. Kimlik `bandolf_token` HMAC'idir.

```
POST https://api.bandolf.com/api/get-token
Content-Type: application/x-www-form-urlencoded
```

Rehber ve dil örnekleri: [Iframe](/docs/guides/iframe).

## Alanlar

### Zorunlu

| Alan | Tip | Açıklama |
|------|-----|----------|
| `merchant_id` | string max 32 | Sayısal merchant id |
| `user_ip` | string max 45 | Müşteri IP |
| `merchant_oid` | string max 64 | Tekil sipariş no |
| `email` | email max 100 | |
| `payment_amount` | integer min 1 | Kuruş |
| `bandolf_token` | string | HMAC. Yoksa `paytr_token` |
| `user_name` | string max 60 | |
| `user_address` | string max 400 | |
| `user_phone` | string max 20 | |
| `merchant_ok_url` | URL max 400 | |
| `merchant_fail_url` | URL max 400 | |

`bandolf_token` ve `paytr_token` birbirinin yerine geçer. Biri zorunlu.

### Opsiyonel

| Alan | Varsayılan | Kural |
|------|------------|-------|
| `user_basket` | `""` | Base64 JSON |
| `no_installment` | `0` | `0`/`1` |
| `max_installment` | `0` | 0-12 |
| `currency` | `TL` | TRY, TL, USD, EUR, ... |
| `test_mode` | `0` | `0`/`1` |
| `timeout_limit` | `30` | 1-1440 dakika |
| `debug_on` | `0` | `0`/`1`, yanıtı değiştirmez |

## HMAC formülü

```
hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount
         + user_basket + no_installment + max_installment + currency + test_mode

bandolf_token = base64(HMAC-SHA256(hash_str + salt_key, secret_key))
```

Ham binary HMAC, sonra Base64. Hex digest kullanmayın.

## Başarı (HTTP 200)

```json
{
  "status": "success",
  "token": "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijkl"
}
```

Token 64 karakter, küçük harf, URL-safe. Iframe:

```
https://api.bandolf.com/odeme/guvenli/{token}
```

## Hata (HTTP 200)

```json
{
  "status": "failed",
  "reason": "Geçersiz bandolf_token."
}
```

Doğrulama da aynı gövdeyi üretir. İlk hata mesajı `reason` olur.

## curl

```bash
curl -X POST https://api.bandolf.com/api/get-token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "merchant_id=1" \
  --data-urlencode "user_ip=1.2.3.4" \
  --data-urlencode "merchant_oid=ORD-1" \
  --data-urlencode "email=a@b.com" \
  --data-urlencode "payment_amount=999" \
  --data-urlencode "bandolf_token=BASE64HMAC" \
  --data-urlencode "user_name=Ada" \
  --data-urlencode "user_address=Adres" \
  --data-urlencode "user_phone=05555555555" \
  --data-urlencode "merchant_ok_url=https://magaza.example.com/ok" \
  --data-urlencode "merchant_fail_url=https://magaza.example.com/fail" \
  --data-urlencode "currency=TL" \
  --data-urlencode "test_mode=1"
```

HMAC'i bu komutta elle üretmek zordur. Önce sunucu script'i kullanın.
