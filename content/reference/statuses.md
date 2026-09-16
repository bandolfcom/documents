---
title: Durumlar
description: Payment, session, link, order ve health durum tabloları.
category: Reference
slug: /docs/reference/statuses
order: 2
---

# Durumlar

## Payment (`status` API küçük harf)

| API | Etiket | Final |
|-----|--------|-------|
| `pending` | Beklemede | Hayır |
| `processing` | İşleniyor | Hayır |
| `requires_action` | Ek işlem gerekli | Hayır |
| `review` | İncelemede | Hayır |
| `succeeded` | Başarılı | Evet |
| `failed` | Başarısız | Evet |
| `cancelled` | İptal edildi | Evet |
| `refunded` | İade edildi | Evet |

Final kayda gelen banka callback'i yok sayılır.

Yaşam:

```
pending
  -> succeeded | failed | requires_action | processing | review

requires_action
  -> succeeded | failed

processing
  -> succeeded | failed

review
  -> (API ile otomatik çıkış yok)

succeeded
  -> cancelled | refunded  (panel operasyonu)
```

## Checkout session

| API | Ödenebilir |
|-----|------------|
| `open` | Evet |
| `complete` | Hayır |
| `expired` | Hayır |

GET pay sayfası `open` ve süresi dolmamış oturumu kabul eder. Süre dolduysa kayıt `expired` yapılır.

## Payment link

| Durum | Etiket | Ödenebilir |
|-------|--------|------------|
| `ACTIVE` | Aktif | Evet |
| `INACTIVE` | Pasif | Hayır |
| `EXPIRED` | Süresi doldu | Hayır |
| `COMPLETED` | Ödendi | Hayır |
| `CANCELLED` | İptal | Hayır |

## Order (iframe)

Ödeme satırı açılış: `AWAITING_PAYMENT`.

Bildirim: `PENDING`.

Sağlayıcı: `SELECTED`.

## Payment operation

Tip: `CANCEL`, `REFUND`.

Status: işlem başarılı veya başarısız.

## API anahtarı ortamı

API payment yanıtı: `test`, `live`.

## Health

`operational`, `degraded`, `down`.
