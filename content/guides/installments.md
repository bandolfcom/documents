---
title: Taksitler
description: Direct installment_count, hosted taksit sorgusu, iframe ve ürün sayfası tablosu.
category: Ödeme İşlemleri
slug: /docs/guides/installments
order: 1
---

# Taksitler

Taksit, çekim tutarını aya böler. Desteklenen sayı sağlayıcı, kart BIN'i ve sizin seçiminize bağlıdır.

## Direct API

Alan: `installment_count`.

Kabul edilen değerler: `0`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`.

`0` tek çekimdir. `1` gönderirseniz doğrulama hatası alırsınız.

Tutar `amount` alanındaki değerdir. BANDOLF Direct'te taksit komisyonunu sizin yerinize eklemez. Komisyonlu tutarı siz hesaplayıp `amount` olarak gönderin.

## Hosted checkout

Oturum açarken:

- `options.no_installment: true` taksit seçimini kapatır.
- `options.max_installment` üst sınırı 1-12 yapar.

Sayfa kart numarası BIN'ini alınca `POST /pay/{session}/installments` çağırır. Gövde kartın ilk hanelerini içerir. Yanıt `options` listesidir. Her seçenek taksit sayısı ve ödenecek tutarı gösterir.

Sağlayıcı cevap vermezse varsayılan çarpanlar kullanılır.

Müşteri formda `installment_count` seçer. Hosted çekimde `amount` bu seçime göre güncellenebilir.

KDV oturum toplamına zaten yansımıştır. Taksit çarpanı bu toplam üzerindendir.

## Iframe

- `no_installment=1` yalnız tek çekim.
- `max_installment=0` sağlayıcının izin verdiği azami taksit.
- `max_installment` 0-12 arası integer.

Bu alanlar HMAC string'ine girer. Token hesaplarken POST ile aynı değerleri kullanın. Göndermezseniz hash tarafında da `"0"` varsayılanını kullanın.

## Ürün sayfası tablosu

Secret istemezseniz HTML iframe kullanın: [HTML taksit tablosu](/docs/api/installment-table). Kendi UI'niz için JSON: [Taksit tablosu JSON](/docs/api/get-installments). Maliyet hesabı: [Maliyet kuralları](/docs/guides/costs).

Tutar iki biçimde gider:

- `amount=1299.90` — ondalıklı TL
- `amount_minor=129990` — kuruş (iframe `payment_amount` ile aynı)

`amount=1299` yalnızca 1.299,00 TL demektir. Kuruş için ondalık veya `amount_minor` kullanın.

Tablo yalnızca **3, 6, 9 ve 12** taksit satırlarını gösterir. JSON `options` listesindeki 1–12 aralığı HTML'de yoktur; karşılaştırma için `programs` alanını kullanın.

Arka plan rengi URL ile değişir: `bg` veya `background` (`#FFFFFF`, `ffffff` vb.). Varsayılan `#EEF0F3`. Kart üst şeridi sağlayıcının birincil rengidir; admin panelden ayarlanır.

Canlı POS BIN sorgusu ürün sayfası tablosunda yoktur.

## Kart tipi

Direct `card.type` dünya, bonus, axess gibi program adlarını alır. Taksit vade bazı POS'larda bu tipe bağlıdır. Boş bırakabilirsiniz. Sağlayıcı BIN'den çözer.
