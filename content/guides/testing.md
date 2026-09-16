---
title: Test etmek
description: Sandbox, test kartları ve test mağazası.
category: Guides
slug: /docs/guides/testing
order: 13
---

# Test etmek

Canlı POS'a basmadan iki katman vardır: BANDOLF Sandbox sağlayıcısı ve API test anahtarı.

## Test anahtarı

`sk_test_` ile istek atın. Ödeme kaydı `environment: test` olur. Canlı POS kimlik bilgilerini test merchant'ına bağlamayın. Sandbox bankasını bağlayın.

## BANDOLF Sandbox

POS altyapısı `BANDOLF_SANDBOX`. Charge gerçek bankaya gitmez. Sonuç `requires_action` ve 3DS sayfasıdır. Akışı tarayıcıda tamamlayın.

Direct `options.non_3d` Sandbox'ta 3DS'i atlatmaz. Gateway bilinçli olarak action ister.

## Test kartı örneği

PayTR testlerinde kullanılan örnek:

| Alan | Değer |
|------|-------|
| Numara | `9792030394440796` |
| Son kullanma | `12 / 99` |
| CVV | `000` |
| İsim | `TEST KARTI` |

Bu kart PayTR test ortamı içindir. Canlıda denemeyin. VakıfBank ve Garanti kendi test PAN'larını banka dokümanından alır.

Süresi dolmuş kart Direct doğrulamasında 422 olur. Yıl `99` uzak geleceğe denk gelir.

Daha fazla kart: [Test kartları](/docs/reference/test-cards).

## Test mağazası

```
https://api.bandolf.com/test/merchant
```

Sepet, checkout ve sonuç sayfaları BANDOLF hosted akışını gösterir.

## Iframe'i test etme

1. Test anahtarı ve salt
2. `test_mode=1`
3. Dışarıdan görünen `user_ip` (loopback bazı HMAC senaryolarında sorun çıkarır)
4. Yeni `merchant_oid`
5. Panelde Sandbox veya test PayTR

## Direct'i test etme

Test anahtarı ve Sandbox sağlayıcısı ile `POST /api/v1/payments` atın. Gerçek karta çekim yapmadan akışı doğrulayın.

## Webhook yokken doğrulama

Asenkron PayTR ödemesinde `processing` sonrası callback'i bekleyin. Yerelde callback'i PayTR'den almak için public URL gerekir. ngrok veya benzeri tünel kullanın. URL, sağlayıcı kaydındaki webhook/callback adresi ile aynı host olmalıdır.
