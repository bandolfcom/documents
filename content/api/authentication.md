---
title: API kimlik doğrulama
description: Bearer ve X-Api-Key kullanımı, 401 gövdeleri.
category: API Temelleri
slug: /docs/api/authentication
order: 2
type: api
---

# API kimlik doğrulama

Bu sayfa yalnızca secret anahtarlı JSON API içindir. Iframe HMAC [Token al](/docs/api/get-token) sayfasındadır.

## Header

```http
POST /api/v1/payments HTTP/1.1
Host: api.bandolf.com
Authorization: Bearer sk_test_xxxxxxxx
Content-Type: application/json
Accept: application/json
```

Alternatif:

```http
X-Api-Key: sk_test_xxxxxxxx
```

`Authorization` değeri `Bearer ` ile başlıyorsa (7 karakter + boşluk) o secret kullanılır. Aksi halde `X-Api-Key` okunur. İkisi de yoksa 401.

Secret düz metin olarak saklanmaz. Anahtar hash ile doğrulanır. Pasif anahtar veya pasif merchant 401 döner.

## 401 örnekleri

Eksik:

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "Geçerli bir API anahtarı gerekli."
  }
}
```

Yanlış veya pasif merchant:

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "API anahtarı geçersiz veya merchant aktif değil."
  }
}
```

Public `pk_` anahtarı da "geçersiz"e düşer. Çünkü hash secret'a aittir.

## curl

```bash
export BANDOLF_KEY=sk_test_xxxxxxxx
export BANDOLF_BASE=https://api.bandolf.com

curl -s "$BANDOLF_BASE/api/v1/payments/01JEXAMPLE" \
  -H "Authorization: Bearer $BANDOLF_KEY" \
  -H "Accept: application/json"
```

## Test / live karışması

Live anahtar test POS'una, test anahtar live POS'una bağlanabilir. Bu uygulama seviyesinde engellenmez. Ortamı merchant-bank credential'ınız belirler. Anahtar yalnızca kaydın `environment` alanını işaretler. Karıştırmayın.
