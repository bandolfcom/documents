---
title: Ortamlar ve adresler
description: Test ve live anahtarlar, production host'ları ve istek biçimleri.
category: Başlangıç
slug: /docs/environments
order: 5
---

# Ortamlar ve adresler

BANDOLF test ve canlıyı anahtar önekiyle ayırır. Host adları da yüzeye göre değişir.

## Test ve live

| | Test | Live |
|--|------|------|
| Public anahtar | `pk_test_` | `pk_live_` |
| Secret anahtar | `sk_test_` | `sk_live_` |
| Iframe `test_mode` | `1` | `0` |
| Ödeme kaydı `environment` | `TEST` | `LIVE` |

Test anahtarı ile atılan ödeme `environment: test` döner. Live anahtar `live` döner. API yanıtında bu alan küçük harftir.

Test ödemesi gerçek karta çekim yapmamalıdır. Yine de bağlı sağlayıcının test/prod kimlik bilgilerini doğru girdiğinizden emin olun. Yanlışlıkla canlı POS bilgilerini test anahtarıyla kullanmak risklidir. Sandbox sağlayıcısını test için tercih edin.

## Production host'ları

| Yüzey | Host | Örnek yollar |
|-------|------|--------------|
| API | `api.bandolf.com` | `/api/v1/payments`, `/api/v1/costs`, `/healths`, `/pay/{id}`, `/odeme/taksit/{pk}` |
| Merchant paneli | `app.bandolf.com` | `/user/login`, `/user/` |
| Kök | `bandolf.com` | Merchant panele yönlendirme |
| Durum | `bandolf.statuspage.io` | Harici durum sayfası |
| Dokümantasyon | `docs.bandolf.com` | Bu sitenin yayını |

Checkout sayfaları API host'undadır. Örnek: `https://api.bandolf.com/pay/{sessionId}`.

## Test mağazası

API host'unda demo mağaza vardır.

```
https://api.bandolf.com/test/merchant
```

Bu mağaza checkout akışını uçtan uca gösterir.

## CORS ve içerik tipi

JSON endpoint'ler `Content-Type: application/json` bekler. Iframe `get-token` form-urlencoded veya JSON kabul eder. HMAC alanları string birleşimi olduğu için form-urlencoded daha güvenlidir. `payment_amount` sayısını JSON'da sayı değil string göndermek hash kaymasını azaltır.

## TLS

Production API ve paneller HTTPS kullanır. HTTP'ye düşmeyin.
