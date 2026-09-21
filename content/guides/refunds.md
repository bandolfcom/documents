---
title: İptal ve iade
description: Panelden cancel ve refund. Public REST henüz yok.
category: Ödeme İşlemleri
slug: /docs/guides/refunds
order: 3
---

# İptal ve iade

İptal aynı gün provizyonu geri alır. İade başarılı çekimi kısmen veya tamamen müşteriye döndürür. İkisi de merchant panelindeki işlem detayından çalışır.

Public API endpoint'i yoktur. `POST /api/v1/payments/{id}/refund` henüz yok.

## Panel yolları

- Liste: `/user/payments/transactions`
- Detay: `/user/payments/transactions/payments/{payment}`
- İptal: aynı sayfada cancel
- İade: tutar girerek refund
- İade listesi: `/user/payments/refunds`

## Koşullar

İptal:

- Ödeme merchant'a ait olmalı
- Durum iptale uygun olmalı (başarılı ve henüz iade edilmemiş gibi sağlayıcı kuralları)
- Referans işlem numarası sağlayıcı yanıtından okunur

İade:

- Tutar orijinal tutarı aşamaz
- Kısmi iade sağlayıcı destekliyorsa gider
- Her deneme bir işlem kaydı açar

Başarıda ödeme durumu `cancelled` veya `refunded` olur. Başarısız denemede işlem kaydı `failed` kalır. Panel mesajı gösterir.

## Sağlayıcı desteği

Garanti (GVP) ve VakıfBank XML iptal/iade yolları bağlıdır. PayTR ve Sandbox bu serviste aynı olgunlukta olmayabilir. Desteklenmeyen altyapıda hata mesajı alırsınız.

Aynı ödeme için birden fazla iade denemesi operation geçmişinde durur.

## Kayıt

| Alan | Anlam |
|------|-------|
| `type` | `CANCEL` veya `REFUND` |
| `status` | başarılı / başarısız |
| `amount` | İptalde tam tutar, iadede girilen tutar |
| `reference_transaction_id` | Banka referansı |

IP, iade isteğinde sağlayıcıya iletilir.

## Muhasebe

BANDOLF marketplace split veya payout yapmaz. İade bankadan döner. Sizin ERP'niz `refunded` durumunu izlemelidir. Webhook olmadığı için periyodik GET veya panel raporu kullanın.
