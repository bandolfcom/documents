---
title: Hosted sayfalar
description: HTML checkout, taksit JSON, iframe ve 3DS path'leri.
category: Sistem API
slug: /docs/api/hosted-pages
order: 4
type: api
---

# Hosted sayfalar

Bunlar JSON API değildir. Tarayıcı sayfalarıdır. API host'undadır. CSRF `web` grubundadır.

## Checkout oturumu

```
GET  https://api.bandolf.com/pay/{sessionPublicId}
POST https://api.bandolf.com/pay/{sessionPublicId}
POST https://api.bandolf.com/pay/{sessionPublicId}/installments
```

GET HTML form döner. Session `open` değilse hata view.

POST kart + e-posta + fatura + `installment_count` gönderir. `SubmitHostedCheckoutRequest` doğrular.

Installments JSON:

İstek kart BIN bilgisi (hosted formun AJAX'i). Yanıt:

```json
{
  "options": []
}
```

422:

```json
{
  "message": "Ödeme oturumunun süresi doldu.",
  "options": []
}
```

## Ödeme linki

```
GET https://api.bandolf.com/pay/link/{pl_token}
GET https://api.bandolf.com/pay/link/{pl_token}/success
GET https://api.bandolf.com/pay/link/{pl_token}/failure
```

Token `pl_` ile başlar. Success/failure merchant URL vermediyse BANDOLF sayfasıdır.

## Iframe ödeme

```
GET  https://api.bandolf.com/odeme/guvenli/{token}
POST https://api.bandolf.com/odeme/guvenli/{token}
GET  https://api.bandolf.com/odeme/3ds/{token}
POST https://api.bandolf.com/odeme/3ds/{token}
```

Token `get-token` yanıtındaki 64 karakterdir.

## Direct 3DS sayfası

```
GET  https://api.bandolf.com/odeme/3ds/odeme/{paymentPublicId}
POST https://api.bandolf.com/odeme/3ds/odeme/{paymentPublicId}
```

Sandbox `redirect_url` bu yola işaret eder.

## Test mağaza

```
https://api.bandolf.com/test/merchant
```

Arama motoru noindex. Demo amaçlıdır.

## Not

Bu sayfaları kendi API client'ınızdan JSON gibi parse etmeyin. Müşteri tarayıcısı açsın. Server-side HTML scrape etmeyin.
