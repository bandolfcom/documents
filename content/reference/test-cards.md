---
title: Test kartları ve veriler
description: PayTR örnek PAN, taksit değerleri, subject enum, anahtar önekleri.
category: Referans
slug: /docs/reference/test-cards
order: 4
---

# Test kartları ve veriler

Canlıda kullanmayın. Test anahtarı ve Sandbox veya banka test kimlik bilgileri ile deneyin.

## PayTR örnek kartı

| Alan | Değer |
|------|-------|
| PAN | `9792030394440796` |
| Ay | `12` |
| Yıl | `99` |
| CVV | `000` |
| İsim | `TEST KARTI` |

Tutar örneği: `100.99` TRY. `order_id`: `ORDER-1001`.

## Direct taksit

Geçerli: `0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12`.

Geçersiz: `1`, negatif, 13.

## Kart program `card.type`

`advantage`, `axess`, `combo`, `bonus`, `cardfinans`, `maximum`, `paraf`, `world`, `saglamkart`.

## Para birimi

Yedek liste: `TRY`, `USD`, `EUR`. `TRY` varken `TL` kabul edilir. Yanıtta `TRY` görünür.

## Anahtar önekleri

| Önek | Anlam |
|------|-------|
| `pk_test_` | Public test |
| `sk_test_` | Secret test |
| `pk_live_` | Public live |
| `sk_live_` | Secret live |
| `pl_` | Ödeme linki public token |

Secret rastgele kısmı 32 karakter küçük harf. Salt 32 rastgele karakter.

Payment, session, order id: ULID. Form id: UUID.

## İletişim subject

`sales-partnership`, `support`, `marketing-press`, `accounting`, `human-resources`, `legal`, `other`.

## Abuse alan adları

| Alan | Varsayılan |
|------|------------|
| Honeypot | `_bandolf_hp` |
| Loaded at | `_bandolf_loaded_at` |
| Turnstile | `turnstile_token` |
| Min saniye | 2 |
| Rate | 10 / 60 dakika |

## Health bileşen adları

`api`, `web-panel`, `authentication`, `database`, `cache`, `network`, `webhooks`, `email`, `payments`, `workers`, `scheduler`, `notifications`.

## Merchant roller

`OWNER`, `ADMIN`, `DEVELOPER`, `FINANCE`, `OPERATIONS`, `SUPPORT`, `READ_ONLY`.

## Iframe varsayılanları

`no_installment=0`, `max_installment=0`, `currency=TL`, `test_mode=0`, `timeout_limit=30`, `debug_on=0`.

Hash hesaplarken POST etmediğiniz alanın varsayılan string'ini kullanın.
