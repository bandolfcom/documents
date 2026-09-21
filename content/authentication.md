---
title: Kimlik doğrulama
description: API anahtarları, header'lar, HMAC ve panel oturumları.
category: Başlangıç
slug: /docs/authentication
order: 4
---

# Kimlik doğrulama

BANDOLF üç ayrı kimlik modeli kullanır. Karıştırmayın.

1. Merchant API anahtarı. Direct ödeme ve checkout için.
2. Iframe HMAC. `get-token` için.
3. Panel oturumu. Cookie tabanlı. Merchant kullanıcıları için.

## Merchant API anahtarı

### Anahtarı nereden alırsınız

Merchant paneli: **Geliştirici > API anahtarları**.

Oluştururken ortam seçersiniz: Test veya Production. Secret ve salt bir kez tam görünür. Sonra maskelenir.

Limit: merchant başına en fazla 5 aktif anahtar.

### Header

Tercih edilen yol:

```http
Authorization: Bearer sk_live_xxxxxxxx
```

Alternatif:

```http
X-Api-Key: sk_live_xxxxxxxx
```

`Authorization` Bearer ile başlıyorsa `X-Api-Key` okunmaz.

### Hangi endpoint'ler anahtar ister

| Endpoint | Anahtar |
|----------|---------|
| `POST /api/v1/payments` | Secret |
| `GET /api/v1/payments/{id}` | Secret |
| `POST /api/v1/checkout-sessions` | Secret |
| `GET /api/v1/checkout-sessions/{id}` | Secret |

Anahtar hash ile doğrulanır. Merchant veya anahtar aktif değilse istek `401` olur.

### 401 yanıtı

Anahtar yoksa:

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "Geçerli bir API anahtarı gerekli."
  }
}
```

Anahtar geçersizse veya merchant pasifse:

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "API anahtarı geçersiz veya merchant aktif değil."
  }
}
```

### Public anahtar

`pk_test_` ve `pk_live_` değerleri Direct API'de kabul edilmez. Public anahtarı iframe HMAC'inde de kullanmayın.

## Iframe HMAC

`POST /api/get-token` Authorization header almaz. Kimlik `bandolf_token` alanındadır.

Formül PayTR iframe 1. adımıyla aynıdır.

```
hash_str =
  merchant_id
  + user_ip
  + merchant_oid
  + email
  + payment_amount
  + user_basket
  + no_installment
  + max_installment
  + currency
  + test_mode

bandolf_token = base64( HMAC-SHA256( hash_str + salt_key, secret_key ) )
```

`merchant_id` merchant kaydının sayısal id'sidir. `secret_key` ilgili ortamın `sk_test_` veya `sk_live_` değeridir. `salt_key` aynı anahtar satırının tuzudur.

`test_mode=1` ise test anahtarı doğrulanır. `test_mode=0` ise live anahtar doğrulanır.

`paytr_token` alanı da kabul edilir. İkisinden biri yeter. Tercih `bandolf_token` olsun.

HMAC'i tarayıcıda hesaplamayın. Hesabı mağaza sunucusunda yapın.

Ayrıntı ve dil örnekleri: [Iframe rehberi](/docs/guides/iframe) ve [Token al](/docs/api/get-token).

## Anahtar gerektirmeyen endpoint'ler

Aşağıdaki çağrılar public'tir. Yine de kötüye kullanım koruması olabilir.

| Endpoint | Koruma |
|----------|--------|
| `POST /api/get-token` | HMAC |
| `GET /api/v1/forms/{formId}` | Aktif form id |
| `POST /api/v1/forms/{formId}/submissions` | Honeypot, süre, rate limit, isteğe bağlı Turnstile |
| `GET /api/v1/contact-form` | Yok |
| `POST /api/v1/contact-form/submissions` | Form abuse koruması |
| `GET /healths` | Yok |
| `GET /healths/{component}` | Yok |
| `GET /pay/{session}` | Oturum id'sini bilmek |
| `GET /pay/link/{token}` | Link token'ını bilmek |
| `GET /odeme/guvenli/{token}` | Iframe token'ını bilmek |
| Banka callback'leri | Sağlayıcı imzası veya 3DS parametreleri |

Public checkout URL'sini rastgele tahmin etmek zordur. Yine de `order_id` ve tutar gibi bilgileri URL'de sızdırmayın. Dönüş adreslerini kendi domain'inizde tutun.

## Panel oturumları

Merchant paneline e-posta ve şifre ile girilir. Sonra e-posta doğrulama kodu istenir. 2FA açıksa TOTP kodu da gerekir. En az bir merchant ataması olmayan kullanıcı içeride ilerleyemez.

Şifre sıfırlama e-posta ile gider. Davet bağlantısı ile yeni kullanıcı kaydı açılabilir.

## Secret saklama önerileri

1. Secret'ı ortam değişkeninde tutun. Örnek: `BANDOLF_SECRET_KEY`.
2. Test ve live anahtarları ayırın. Live anahtarı staging'e koymayın.
3. Çalışan ayrıldığında ilgili anahtarı panelden pasifleştirin veya silin.
4. Anahtarı loglamayın. BANDOLF istek gövdesindeki token alanlarını iframe kaydında temizler. Sizin loglarınız da aynı disiplini izlemelidir.
5. Rotasyon için yeni anahtar açın, uygulamayı güncelleyin, eski anahtarı kapatın. Aynı anda 5 aktif anahtar sınırı vardır.
