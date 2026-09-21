---
title: API genel bakış
description: Tüm public HTTP endpoint'leri, taban URL, sarmalayıcı ve sürümleme.
category: API Temelleri
slug: /docs/api/overview
order: 1
type: api
---

# API genel bakış

Taban URL:

```
https://api.bandolf.com
```

Sürüm öneki `/api/v1` Direct ödeme, checkout, maliyet, taksit ve formlar içindir. Iframe `/api/get-token` sürüm öneki kullanmaz. Health `/healths` API öneki kullanmaz. HTML taksit tablosu `/odeme/taksit/{publicKey}` sürüm öneki kullanmaz.

## Kimlik özeti

| Grup | Kimlik |
|------|--------|
| `/api/v1/payments` | Bearer veya `X-Api-Key` secret |
| `/api/v1/checkout-sessions` | aynı |
| `/api/v1/costs`, `/api/v1/installments` | aynı |
| `/api/get-token` | HMAC |
| `/api/v1/forms/*` | Form public id + abuse |
| `/api/v1/contact-form*` | abuse |
| `/healths*` | yok |
| `/api/callbacks/*` | banka |
| `/pay/*`, `/odeme/*` | token veya public key |

Ayrıntı: [API kimlik doğrulama](/docs/api/authentication).

## JSON sarmalayıcı

Ödeme, checkout, maliyet ve taksit JSON yanıtları `data` anahtarı içindedir.

```json
{
  "data": {
    "id": "01J...",
    "object": "payment"
  }
}
```

Form, iframe ve health bu sarmalayıcıyı kullanmaz.

## İçerik tipi

```http
Content-Type: application/json
Accept: application/json
```

Iframe için:

```http
Content-Type: application/x-www-form-urlencoded
```

## Endpoint haritası

### Ödeme

| Metod | Yol | Açıklama |
|-------|-----|----------|
| POST | `/api/v1/payments` | Direct çekim |
| GET | `/api/v1/payments/{id}` | Ödeme oku |

### Checkout

| Metod | Yol | Açıklama |
|-------|-----|----------|
| POST | `/api/v1/checkout-sessions` | Oturum aç |
| GET | `/api/v1/checkout-sessions/{id}` | Oturum oku |
| GET | `/pay/{id}` | HTML ödeme sayfası |
| POST | `/pay/{id}` | Kart gönder (form) |
| POST | `/pay/{id}/installments` | Taksit JSON |

### Maliyet ve taksit

| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/v1/costs` | Maliyet katalogu |
| GET | `/api/v1/costs/quote` | Senaryo maliyeti |
| GET | `/api/v1/installments` | Taksit JSON + maliyet |
| GET | `/odeme/taksit/{publicKey}` | HTML taksit tablosu |

### Iframe

| Metod | Yol | Açıklama |
|-------|-----|----------|
| POST | `/api/get-token` | Token |
| GET | `/odeme/guvenli/{token}` | Kart formu |
| POST | `/odeme/guvenli/{token}` | Kart gönder |
| GET/POST | `/odeme/3ds/{token}` | 3DS |

### Form

| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/api/v1/forms/{formId}` | Şema |
| POST | `/api/v1/forms/{formId}/submissions` | Gönder |
| GET | `/api/v1/contact-form` | Sabit şema |
| POST | `/api/v1/contact-form/submissions` | Gönder |

### Sistem

| Metod | Yol | Açıklama |
|-------|-----|----------|
| GET | `/healths` | Özet |
| GET | `/healths/{component}` | Bileşen |

### Callback (banka)

| Metod | Yol |
|-------|-----|
| POST | `/api/callbacks/paytr/{bank}` |
| GET, POST | `/api/callbacks/vakifbank/{bank}/three-d/{payment}` |
| GET, POST | `/api/callbacks/garanti/{bank}/three-d/{payment}` |

### Link

| Metod | Yol |
|-------|-----|
| GET | `/pay/link/{token}` |
| GET | `/pay/link/{token}/success` |
| GET | `/pay/link/{token}/failure` |

## Olmayan endpoint'ler

Aşağıdakiler henüz sunulmaz.

- `POST /api/v1/payments/{id}/refund`
- `POST /api/v1/payments/{id}/cancel`
- Webhook kayıt CRUD
- Kart token / vault
- Liste ödemeleri (list payments)
- SDK resmi paket uçları

İptal ve iade panelden yapılır.

## Zaman ve para

Zaman damgaları ISO-8601. Örnek: `2026-09-16T20:15:00+00:00`.

Direct `amount` ondalıklı ana para birimidir. Iframe `payment_amount` kuruş integer'dır. Karıştırmayın.

## Idempotency

Header yoktur. Tekillik `order_id` / `merchant_oid` iledir. Retry aynı gövdeyle 422 üretir. GET ile mevcut kaydı okuyun.
