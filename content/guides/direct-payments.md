---
title: Direct ödemeler
description: Kartı sunucunuzdan göndererek çekim alın.
category: Guides
slug: /docs/guides/direct-payments
order: 2
---

# Direct ödemeler

Direct kanalında mağaza sunucusu kartı BANDOLF'e JSON olarak gönderir. BANDOLF fraud kontrolü yapar. Sonra bağlı sağlayıcıya gider.

Endpoint: `POST /api/v1/payments`. Kimlik: secret anahtar.

## Akış

```
Mağaza sunucusu
  -> Authorization: Bearer sk_...
  -> JSON (amount, customer, card, return_urls)
Bandolf
  -> fraud
  -> provider seç
  -> çekim
  -> JSON { data: payment }
Mağaza
  -> status succeeded ise siparişi ayır
  -> requires_action ise action'ı tarayıcıda işle
  -> processing ise sonra GET ile sor
```

## Zorunlu gövde

- `amount` sayı, en az `0.01`. Birim: ana para. `100.99` = 100,99 TRY. Kuruş değil.
- `currency` aktif kod. `TRY` veya `TL`, `USD`, `EUR`.
- `order_id` string, en fazla 64 karakter. Merchant içinde tekil.
- `customer.email`, `customer.name`, `customer.phone`, `customer.address`
- `card.holder_name`, `card.number`, `card.expiry_month`, `card.expiry_year`, `card.cvv`
- `return_urls.success`, `return_urls.failure` geçerli URL

Kart ayı `01` ile `12` (baştaki sıfır opsiyonel). Yıl 2 veya 4 hane. Kart süresi dolmuşsa istek 422 olur.

## Opsiyonel gövde

| Alan | Açıklama |
|------|----------|
| `provider_id` | Sağlayıcı kimliği. Yoksa otomatik seçim. |
| `installment_count` | `0` veya `2`..`12`. `1` geçersizdir. Tek çekim için `0` gönderin. |
| `customer.id` | Fraud müşteri kimliği. En fazla 64 karakter. |
| `card.type` | `advantage`, `axess`, `combo`, `bonus`, `cardfinans`, `maximum`, `paraf`, `world`, `saglamkart` |
| `basket[]` | `name`, `price`, `quantity` |
| `metadata` | Serbest JSON. BANDOLF fingerprint ve BIN'i içine ekler. |
| `options.non_3d` | `true` ise 3DS'siz deneme. Fraud `REQUIRE_3DS` bunu ezer. |
| `options.sync_mode` | Sağlayıcıya iletilir. |
| `options.allow_not_enrolled` | 3DS kayıtlı değilse davranış. |

## IP

BANDOLF kart isteğindeki IP'yi sizin gövdenizden almaz. Şu sırayla çözer:

1. `X-Forwarded-For` ilk adres
2. `X-Real-Ip`
3. İsteğin kaynak IP'si
4. Yedek `127.0.0.1`

Değer 39 karaktere kesilir. Fraud IP listesi bu değere bakar.

## Başarılı oluşturma

HTTP `201`. Gövde `data` sarmalayıcısı içindedir.

`status` değerine göre davranın.

### `succeeded`

Parayı aldınız. `succeeded_at` doludur. Müşteriyi kendi success sayfanıza alın.

### `failed`

`failure.code` ve `failure.message` vardır. Fraud block kodları:

- `FRAUD_BLACKLIST`
- `FRAUD_RULE_BLOCK`
- `FRAUD_GRAYLIST_BLOCK`

Sağlayıcı reddi bankanın kodu ve mesajıdır.

### `review`

Fraud kuralı veya graylist incelemeye aldı. Sağlayıcıya gidilmedi. Kod: `FRAUD_RULE_REVIEW` veya `FRAUD_REVIEW`. Operasyon panelden bakar.

### `requires_action`

3DS var. `action` doldurulur.

```json
{
  "action": {
    "type": "form_post",
    "form": {
      "url": "https://acs.example.com",
      "method": "POST",
      "fields": {}
    }
  }
}
```

Diğer tipler: `html`, `redirect`, `none`. Tarayıcıda işleyin. Sunucuda ACS'e POST yapmayın.

### `processing`

PayTR `wait_callback` benzeri asenkron cevap. Callback gelene kadar `GET /api/v1/payments/{id}` ile bakın.

## Aynı siparişi tekrar göndermeyin

İkinci `POST` aynı `order_id` ile `422` döner.

```json
{
  "error": {
    "code": "payment_error",
    "message": "Bu order_id ile zaten bir ödeme kaydı mevcut."
  }
}
```

Idempotent retry istiyorsanız önce GET edin. Yoksa yeni `order_id` kullanın. HTTP `Idempotency-Key` header'ı yoktur.

## Sağlayıcı hataları

| Mesaj | Neden |
|-------|-------|
| Ödeme sağlayıcısı bulunamadı. | `provider_id` yok |
| Ödeme sağlayıcısı yapılandırılmamış. | MerchantBank kapalı veya credential boş |
| Seçilen ödeme sağlayıcısı aktif değil. | Banka pasif |
| Seçilen sağlayıcı henüz desteklenmiyor. | Gateway yazılmamış altyapı |

Beklenmeyen istisna `500` ve `internal_error` döner. Mesaj: "Ödeme işlenirken beklenmeyen bir hata oluştu."

## Kartı saklamayın

BANDOLF yanıtında PAN dönmez. Kendi veritabanınıza da yazmayın. Tokenization ürünü henüz yoktur.

## Tam alan listesi ve örnekler

[Ödeme oluştur](/docs/api/create-payment) sayfasına bakın.
