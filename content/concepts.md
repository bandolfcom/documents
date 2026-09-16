---
title: Kavramlar
description: Merchant, anahtar, sağlayıcı, ödeme, oturum, sipariş ve fraud terimleri.
category: Getting Started
slug: /docs/concepts
order: 3
---

# Kavramlar

Bu sayfa BANDOLF dilini açıklar. API alan adları ve panel menüleri bu terimleri kullanır.

## Merchant

Merchant, üye işyeridir. Her ödeme bir merchant'a aittir. API anahtarı, POS bağlantısı, fraud kuralı ve ödeme linki merchant kapsamında yaşar.

Merchant aktif değilse API anahtarı reddedilir. Yanıt `401` olur.

## Kullanıcı ve rol

Kullanıcı merchant paneline e-posta ve şifre ile girer. Bir kullanıcı birden fazla merchant'a bağlanabilir. Bağlantıdaki rol yetkiyi belirler.

| Rol | Değer |
|-----|-------|
| Sahip | `OWNER` |
| Yönetici | `ADMIN` |
| Geliştirici | `DEVELOPER` |
| Finans | `FINANCE` |
| Operasyon | `OPERATIONS` |
| Destek | `SUPPORT` |
| Salt okunur | `READ_ONLY` |

Girişte e-posta doğrulama kodu istenir. İsteğe bağlı TOTP 2FA açılabilir.

## API anahtarı

Her anahtarın ortamı `TEST` veya `LIVE` olur.

| Alan | Açıklama |
|------|----------|
| `public_key` | `pk_test_` veya `pk_live_` |
| `secret_key` | `sk_test_` veya `sk_live_` |
| `salt_key` | Iframe HMAC tuzu |
| `is_default` | Ortamın varsayılan anahtarı |
| `is_active` | Pasif anahtar isteği reddeder |

Direct API ve checkout secret anahtar ister. Iframe HMAC secret ve salt ister. Public anahtar Direct API'de yetki vermez.

## Banka (sağlayıcı)

Sistemde "banka" yalnızca klasik banka değildir. Ödeme kuruluşu, e-para ve cüzdan da sağlayıcı olarak durur.

Önemli alanlar:

- `pos_infrastructure`: Teknik entegrasyon tipi. Bu alana bakılarak gateway seçilir.
- `is_active` ve `sort_order`: Seçim sırası.

## Merchant sağlayıcı kaydı

Bir merchant'ın belirli bir sağlayıcıya özel ayarıdır. Mağaza kimlik bilgileri, varsa genel varsayılanın üzerine yazılır.

Mağaza kaydı kapalıysa (`is_enabled = false`) o sağlayıcı kullanılamaz.

## Payment

Direct API, hosted checkout ve ödeme linki sonunda bir ödeme kaydı üretir. Kimlik bir ULID'dir. API'de `id` olarak döner.

`order_id` sizin sipariş numaranızdır. Aynı merchant için tekildir.

## PaymentSession

Hosted checkout oturumudur. Müşteri kartı girmeden önce açılır. Durumlar: `open`, `complete`, `expired`.

`url` alanı BANDOLF ödeme sayfasıdır: `https://api.bandolf.com/pay/{public_id}`.

## Order

Iframe kanalının sipariş kaydıdır. Direct ödemeler `payments` nesnesini kullanır. Iframe `orders` nesnesini kullanır.

Siparişin ödeme, bildirim ve sağlayıcı durumları ayrı ilerler.

Token 64 karakter, küçük harf, URL güvenlidir. Süre `timeout_limit` dakikadır. Varsayılan 30 dakikadır.

## PaymentLink

Panelden üretilen ödeme bağlantısıdır. Public token `pl_` ile başlar. Sayfa adresi: `https://api.bandolf.com/pay/link/{token}`.

Kullanım modları: sınırsız, tek kullanımlık, belirli adet.

## Ortam (environment)

API anahtarının ortamı ödemeye kopyalanır. Test anahtarı test ödemesi üretir. Live anahtar canlı ödemesi üretir.

Iframe'de ortam `test_mode` alanından gelir. `1` test, `0` live demektir. HMAC o ortamın anahtarıyla doğrulanır.

## POS altyapısı

Sağlayıcı seçimi slug ile yapılmaz. `pos_infrastructure` ile yapılır. Aynı altyapıyı kullanan bankalar aynı entegrasyonu paylaşabilir.

Desteklenen altyapılar:

- `PAYTR_GATEWAY`
- `VAKIFBANK_VIRTUAL_POS`
- `GVP`
- `BANDOLF_SANDBOX`

## 3D Secure

Kartı veren bankanın ek doğrulamasıdır. Direct API `status: requires_action` döner. `action` içinde form, HTML veya yönlendirme URL'si vardır.

Hosted ve iframe kanallarında BANDOLF bu adımı kendi sayfasında yönetir.

## Fraud

Ödeme öncesi risk katmanıdır. İki mekanizma vardır.

1. Listeler: whitelist, graylist, blacklist. Kimlik türleri: kart fingerprint, BIN, IP, e-posta, müşteri id.
2. Kurallar: alan, operatör ve aksiyon ağacı. Aksiyonlar: `ALLOW`, `REVIEW`, `BLOCK`.

Blacklist eşleşmesi ödemeyi `failed` yapar. Graylist `REVIEW`, `REQUIRE_3DS`, `BLOCK` veya `ROUTE_TO_PROVIDER` uygulayabilir. Kural `REVIEW` ise ödeme `review` durumunda kalır. Sağlayıcıya gitmez.

## Health

`/healths` kimlik istemez. Durum sayfası ve izleme araçları burayı yoklar. Bileşenler: api, web-panel, authentication, database, cache, network, webhooks, email, payments, workers, scheduler, notifications.

## Public form

BANDOLF'te tanımlanan formlardır. Şema `GET /api/v1/forms/{formId}` ile alınır. Gönderim `POST /api/v1/forms/{formId}/submissions` ile yapılır. Merchant API anahtarı gerekmez. Formun `public_id` değeri yeterlidir.

Landing iletişim formu ayrıdır. Sabit alanları vardır. Endpoint: `/api/v1/contact-form`.
