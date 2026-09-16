---
title: API hata sözleşmesi
description: JSON error nesnesi, doğrulama ve iframe sapması.
category: API Reference
slug: /docs/api/errors
order: 3
type: api
---

# API hata sözleşmesi

Rehber özeti: [Hatalar](/docs/guides/errors). Bu sayfa makine sözleşmesidir.

## Biçim A (orkestrasyon)

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Kullanıldığı yerler: 401, payment 422/500, checkout 422, payment/session 404, form 404, health 404, form abuse.

Form doğrulaması ek alan açar:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Gönderilen veriler geçersiz.",
    "details": {
      "email": ["..."]
    }
  }
}
```

## Biçim B (doğrulama)

İstek gövdesi şema doğrulamasından geçemezse HTTP 422 döner:

```json
{
  "message": "...",
  "errors": {
    "card.expiry_month": ["Kart son kullanma ayı 01-12 arasında olmalıdır."]
  }
}
```

`provider_id.exists` mesajı: "Geçerli bir ödeme sağlayıcısı seçin."

`card.expiry` dolmuş: `CardExpiry::EXPIRED_MESSAGE`.

## Biçim C (iframe)

HTTP 200.

```json
{
  "status": "failed",
  "reason": "Geçersiz bandolf_token."
}
```

## Biçim D (hosted installments)

HTTP 422.

```json
{
  "message": "Ödeme oturumunun süresi doldu.",
  "options": []
}
```

## Kod tablosu

Bakınız [Hata kodları](/docs/reference/error-codes).
