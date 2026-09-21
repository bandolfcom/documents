---
title: Ödeme linkleri
description: Panelden pl_ token'lı link üretin, müşteriyi hosted sayfaya gönderin.
category: Ödeme İşlemleri
slug: /docs/guides/payment-links
order: 2
---

# Ödeme linkleri

Ödeme linki kod yazmadan tahsilat içindir. Public REST create endpoint'i yoktur. Link merchant panelinden açılır.

Adres:

```
https://api.bandolf.com/pay/link/{token}
```

Token `pl_` ile başlar.

## Panelden oluşturma

Yol: **Ödemeler > Linkler > Yeni**.

| Alan | Kural |
|------|-------|
| Başlık | Zorunlu, en fazla 120 karakter |
| Açıklama | Opsiyonel, 500 karakter |
| Tutar | En az 0,01 |
| Para birimi | Aktif currency kodu |
| Kullanım | `unlimited`, `once`, `limited` |
| `usage_limit` | `limited` ise en az 2, en fazla 100000 |
| Müşteri bilgisi topla | Varsayılan açık |
| Ön doldurulmuş müşteri | ad, e-posta, telefon |
| Başlangıç / bitiş | Bitiş gelecekte ve başlangıçtan sonra |
| success_url / failure_url | Opsiyonel. Yoksa BANDOLF kendi sonuç sayfasını gösterir. |

## Durumlar

| Durum | Anlam |
|-------|-------|
| `ACTIVE` | Ödenebilir |
| `INACTIVE` | Elle kapatıldı |
| `EXPIRED` | Süre doldu |
| `COMPLETED` | Kota doldu veya ödendi (moda göre) |
| `CANCELLED` | İptal. Yeniden açılamaz. |

İptal edilmiş link tekrar `ACTIVE` yapılamaz.

Üzerinde `succeeded`, `processing`, `requires_action`, `pending` veya `review` ödeme varsa tutar ve para birimi kilitlenir.

## Müşteri deneyimi

1. Link açılır.
2. BANDOLF içeride bir checkout session üretir.
3. Müşteri hosted forma benzer ekranı görür.
4. Çekim hosted checkout ile aynı motor üzerinden yapılır.
5. Success/failure sizin URL'niz veya `/pay/link/{token}/success` ve `.../failure`.

## Güvenlik

Token tahmin edilmesi zordur. Yine de tutarı düşük, süreyi kısa tutun. Sınırsız linki genel internete uzun süre açık bırakmayın. Kota ve `expires_at` kullanın.

Linki kim bilir ödeyebilir. Kart sahibi sizin müşteriniz olmayabilir. Başlık ve tutarı mesajda net yazın.

## API ile bağ

Link kimliği ödeme nesnesine `payment_link_id` olarak yazılır. Public ödeme JSON'u bu alanı şu an döndürmez. Panel işlem detayında görünür. Programatik izleme için işlem listesini veya ileride eklenecek webhook'u bekleyin.
