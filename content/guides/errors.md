---
title: Hatalar
description: HTTP kodları, error.code değerleri, iframe reason ve doğrulama yanıtları.
category: Guides
slug: /docs/guides/errors
order: 14
---

# Hatalar

JSON API tutarlı bir hata nesnesi kullanır. Iframe ayrı bir sözleşmeye sahiptir.

## Standart gövde

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "Geçerli bir API anahtarı gerekli."
  }
}
```

Bazı doğrulama cevapları şu biçimdedir:

```json
{
  "message": "The amount field is required.",
  "errors": {
    "amount": ["The amount field is required."]
  }
}
```

Form gönderimi `details` anahtarını kullanır.

## HTTP kodları

| Kod | Ne zaman |
|-----|----------|
| 200 | Iframe sonuç (success veya failed). Health operational. GET payment. |
| 201 | Payment veya session veya form submission oluştu |
| 401 | API anahtarı yok veya geçersiz |
| 404 | Kayıt yok, form yok, health bileşeni yok |
| 422 | İş kuralı veya doğrulama |
| 500 | Yakalanmamış istisna (ödeme) |
| 503 | Health degraded veya down |

## `error.code` listesi

| code | HTTP | Kaynak |
|------|------|--------|
| `unauthenticated` | 401 | Geçersiz veya eksik API anahtarı |
| `payment_error` | 422 | Ödeme iş kuralı |
| `internal_error` | 500 | Beklenmeyen ödeme hatası |
| `not_found` | 404 | Payment veya checkout session |
| `checkout_session_error` | 422 | Session create |
| `form_not_found` | 404 | Form şema veya submit |
| `validation_failed` | 422 | Form alanları |
| `submission_rejected` | 422 | Honeypot veya timing |
| `component_not_found` | 404 | `/healths/{bilinmeyen}` |

Rate limit ve captcha hataları da `error.code` ile döner. Mesaj Türkçedir.

## Ödeme iş kuralı mesajları

Bunlar `payment_error` ile 422 döner.

- Bu order_id ile zaten bir ödeme kaydı mevcut.
- Ödeme sağlayıcısı bulunamadı.
- Ödeme sağlayıcısı yapılandırılmamış.
- Seçilen ödeme sağlayıcısı aktif değil.
- Seçilen sağlayıcı henüz desteklenmiyor.
- Ödeme kara liste kaydı nedeniyle engellendi.
- Ödeme fraud kuralı nedeniyle engellendi.
- Ödeme graylist kaydı nedeniyle engellendi.

Review durumunda HTTP 201 olabilir. Çünkü kayıt oluşmuştur. `status` `review` olur. Bu bir 422 değildir.

## Checkout mesajları

- Bu order_id ile zaten bir ödeme oturumu mevcut. (`422 checkout_session_error`)
- Ödeme oturumu bulunamadı. (`404`)
- HTML sayfada: oturum tamamlandı, süresi doldu, kullanılamıyor.

## Iframe

HTTP 200 + `status: failed` + `reason` string. Kod alanı yoktur.

Doğrulama da aynı şekildedir. `failedValidation` JSON'u `errors` üretmez.

## Sağlayıcı hatası

`status: failed` ve `failure` nesnesi:

```json
{
  "failure": {
    "code": "05",
    "message": "Reddedildi"
  }
}
```

Kod bankadan bankaya değişir. Normalization vizyondadır. Bugün ham kod dönebilir. Merchant her banka için ayrı tablo tutmak zorunda kalabilir.

## Ne yapmalısınız

1. 401: anahtarı ve merchant aktifliğini kontrol edin.
2. 422 `payment_error`: mesajı loglayın. `order_id` çakışmasında yeni id üretin.
3. 201 + `failed`: müşteriye `failure.message` gösterin. Aynı kartı sonsuz denemeyin. Velocity kuralı tetiklenir.
4. 201 + `processing`: 2-5 saniye sonra GET edin. Timeout koyun.
5. 500: id yoksa destek notu ile istek gövdesini (kart hariç) paylaşın. Kartı paylaşmayın.
