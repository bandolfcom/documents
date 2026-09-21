---
title: POS izleme
description: Başarı oranı, kesinti, alarm ve health.
category: Operasyon ve Araçlar
slug: /docs/guides/monitoring
order: 2
---

# POS izleme

BANDOLF bağlı sağlayıcıların sağlık skorunu hesaplar. Merchant kendi alarmını kurar. Sistem bileşenleri ayrıca `/healths` ve Statuspage ile izlenir.

## Merchant paneli

Yol: `/user/pos/monitoring`.

Görebilecekleriniz:

- Sağlayıcı bazlı başarı oranı
- Kesinti olayları
- Alarm listesi
- CSV/export

Alarm oluştururken eşik, e-posta kanalı ve cooldown tanımlarsınız.

## Nasıl hesaplanır

BANDOLF sağlayıcı başarı oranını düzenli ölçer. Eşik altı değer alarm üretebilir. Sağlayıcı bağlantısı ayrıca periyodik olarak yoklanır.

Otomatik POS kapatma henüz tam ürün değildir. İzleme ve alarm vardır. Ödeme anı yönlendirmesi graylist `ROUTE_TO_PROVIDER` ve sağlayıcı sırası ile sınırlıdır.

## Sistem health

Public JSON: [Health](/docs/api/health).

Bileşenler: api, web-panel, authentication, database, cache, network, webhooks, email, payments, workers, scheduler, notifications.

HTTP `200` operational. `503` degraded veya down. Durum sayfası bu koda bakarak incident açabilir.

## Bildirim

Merchant alarmı e-posta ile gider. SMS üretim kanalı olarak sunulmaz. Telegram form başvuruları içindir, POS alarmı için değildir.
