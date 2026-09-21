---
title: Taksitler
description: Direct installment_count, hosted taksit sorgusu ve iframe max_installment.
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

## Kart tipi

Direct `card.type` dünya, bonus, axess gibi program adlarını alır. Taksit vade bazı POS'larda bu tipe bağlıdır. Boş bırakabilirsiniz. Sağlayıcı BIN'den çözer.
