---
title: Banka callback'leri
description: PayTR webhook, VakıfBank ve Garanti 3DS dönüş URL'leri.
category: Sistem API
slug: /docs/api/callbacks
order: 3
type: api
---

# Banka callback'leri

Bu URL'leri merchant uygulamanız çağırmaz. Banka veya ACS çağırır. Merchant olarak sizin işiniz endpoint'lerin banka panelinde / BANDOLF banka kaydında doğru olmasıdır.

Outbound merchant webhook'u yoktur. Sizin sunucunuza `payment.succeeded` POST'u gitmez.

## PayTR

```
POST https://api.bandolf.com/api/callbacks/paytr/{bank}
```

`{bank}` sağlayıcı kimliğidir.

Gövde PayTR form alanlarıdır: `merchant_oid`, `status`, `hash`, tutar vb.

BANDOLF HMAC doğrular. Ödemeyi bulur. Final değilse `succeeded` veya `failed` yazar.

Yanıt düz metin:

```
OK
```

JSON değildir. `OK` dönmezse PayTR tekrar gönderir.

## VakıfBank 3DS

```
GET|POST https://api.bandolf.com/api/callbacks/vakifbank/{bank}/three-d/{payment}
```

`{payment}` ULID. ACS `PaRes`, `MD`, `MdStatus` gönderir. BANDOLF `MdStatus` kontrol eder, provizyonu tamamlar, ödemeyi günceller, tarayıcıyı merchant `return_urls` adresine yönlendirir.

## Garanti 3DS

```
GET|POST https://api.bandolf.com/api/callbacks/garanti/{bank}/three-d/{payment}
```

GVP 3DS dönüşü. Akış VakıfBank ile aynı aileden: tarayıcı callback + XML tamamla + redirect.

## Sandbox

Banka callback'i yoktur. 3DS BANDOLF sayfasında biter: `/odeme/3ds/odeme/{payment}`.

## Güvenlik

Callback'leri public internete açmak zorundasınız. İmza veya 3DS parametresi olmadan status değişmez. Yine de URL'yi tahmin edilemez tutmak için payment ULID yeterince uzun rasgeledir.

Merchant bu path'lere CORS ile tarayıcıdan istek atmasın. PayTR sunucu tarafıdır. 3DS tarayıcı tarafıdır ama alanlar ACS'den gelir.

## Health

`/healths/webhooks` bu route'ların kayıtlı olup olmadığına bakar. Callback'in son 5 dakikada gelmiş olmasına bakmaz.
