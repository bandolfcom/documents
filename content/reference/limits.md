---
title: Sınırlar ve eksikler
description: Sunulan ile henüz sunulmayan özellikler.
category: Referans
slug: /docs/reference/limits
order: 5
---

# Sınırlar ve eksikler

Geliştirici yanlış varsaymasın diye bu sayfa net sınır çizer.

## Sert limitler

| Konu | Değer |
|------|-------|
| Aktif API anahtarı / merchant | 5 |
| `order_id` / `merchant_oid` | max 64, merchant tekil |
| Direct tutar | min 0.01 |
| Iframe tutar | min 1 kuruş |
| Checkout satır | en az 1 |
| Checkout süre | 5-1440 dakika, varsayılan 60 |
| Iframe token süre | 1-1440, varsayılan 30 |
| Fraud kural koşulu | 50 |
| Fraud grup derinliği | 5 |
| Form dosya | 10240 KB |
| Form rate | 10 / 60 dk (varsayılan) |
| Ödeme link kullanım limiti | 2-100000 (`limited` mod) |

## Henüz yok

- Merchant outbound webhook (`payment.succeeded` gibi olaylar)
- Refund/cancel REST API
- Payment list/filter REST API
- Kart saklama, token, tekrarlayan fatura
- Kapalı devre cüzdan
- Tam akıllı routing ve retry ürünü
- Katalogdaki diğer POS sağlayıcıları
- Resmi açık kaynak SDK paketleri
- Idempotency-Key header

Health içindeki webhooks bileşeni banka dönüş URL'lerinin ayakta olup olmadığına bakar. Sizin sunucunuza giden bir olayı doğrulamaz.

## Kısmen var

| Özellik | Durum |
|---------|-------|
| 3DS | Direct, hosted, iframe çalışır |
| İptal/iade | Panel + Garanti/VakıfBank |
| Fraud | Liste + kural, Direct/hosted üzerinde |
| İzleme | Skor ve alarm var, otomatik POS kapatma tam değil |
| Formlar | Public gönderim var, başvuru güncelleme API'si yok |
| Çoklu para | `TRY`, `USD`, `EUR`. Gerçek FX ürünü ayrı |

## Vizyon

Tokenization, cüzdan, marketplace, alışveriş kredisi, EFT izleme ve hazır e-ticaret eklentileri ürün hedefidir. Bu dokümantasyon onları mevcut endpoint gibi anlatmaz.
