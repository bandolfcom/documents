---
title: HTML taksit tablosu
description: Public key ile iframe taksit tablosu. GET /odeme/taksit/{publicKey}.
category: Maliyet ve Taksit API
slug: /docs/api/installment-table
order: 4
type: api
method: GET
endpoint: /odeme/taksit/{publicKey}
---

# HTML taksit tablosu

JSON değildir. Tarayıcı HTML sayfasıdır. Secret istemez. `public_key` (`pk_test_` / `pk_live_`) path'tedir.

Amaç: ürün sayfasına iframe gömmek. Komisyon oranı HTML'de yoktur.

```
GET https://api.bandolf.com/odeme/taksit/pk_live_xxxxxxxx?amount=1299.90&currency=TRY
```

## Tutar biçimi

`amount` **ondalıklı ana para birimi** (TL) alır. Kuruş için nokta kullanın:

| Gösterim | `amount` |
|----------|----------|
| 1.299,90 TL | `1299.90` |
| 9,99 TL | `9.99` |
| 1.000 TL | `1000` |

`amount=1299` → **1.299,00 TL** demektir; 1.299,90 TL değildir.

Iframe ödeme token'ında `payment_amount` kuruş integer'dır (`9.99 TL` → `999`). Taksit tablosunda aynı kuruş değerini `amount_minor` ile gönderebilirsiniz:

```
?amount_minor=129990
```

`amount` ve `amount_minor` birlikte gönderilirse `amount` kullanılır. x10 veya benzeri bir çarpan yoktur; TRY için kuruş = ana birim × **100**.

## Sorgu

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `amount` | `amount_minor` yoksa evet | number | min 0.01, max 10_000_000 |
| `amount_minor` | `amount` yoksa evet | integer | min 1, max 1_000_000_000 (kuruş) |
| `currency` | Hayır | string | Varsayılan `TRY` |
| `card_type` | Hayır | string | Varsayılan `credit` |
| `card_brand` | Hayır | string | Varsayılan `any` |
| `card_country` | Hayır | string | Varsayılan `TR` |
| `max_installment` | Hayır | integer | 1-12 |
| `bg` | Hayır | string | Sayfa arka plan rengi (hex). `background` ile aynı |
| `background` | Hayır | string | `bg` ile aynı |

Pasif anahtar veya pasif merchant: HTML 404. Mesaj: "Taksit tablosu bulunamadı."

`amount` ve `amount_minor` yoksa HTML 422. Mesaj: "Tutar alanı zorunludur."

Test anahtarı sayfada "Test ortamı" rozeti gösterir.

Sayfa, mağazanın açık POS’larına bağlı kart programlarını gösterir. Garanti → Bonus, Akbank → Axess, Yapı Kredi / VakıfBank → World gibi. PayTR / iyzico gibi toplayıcılar yalnız issuer banka yoksa tüm programları açar. Her kartta 3 / 6 / 9 / 12 taksit satırı vardır. Tek çekim satırı yoktur. Komisyon oranı yazılmaz.

Tutarlar hosted checkout vade çarpanlarıdır. Canlı POS BIN sorgusu yoktur.

## Görünüm

Responsive ızgara:

| Genişlik | Sütun |
|----------|-------|
| &lt; 690px | 1 (tam genişlik) |
| 690px – 1009px | 2 |
| 1010px+ | 4 |

Her kart:

- Üstte sağlayıcının **birincil rengi** ile ince şerit
- Ortada banka logosu
- Tablo başlığı arka planı sabit `#CFFFF7`
- Metin rengi sabit `#000A6B`
- Satır ayırıcıları sabit `#5AD0BD`
- Birincil renk admin panelden sağlayıcı bazında ayarlanır (`primary_color`, `secondary_color`, `alternative_color`)

Varsayılan sayfa arka planı `#EEF0F3`. Mağaza sitesine uydurmak için URL'ye hex gönderin:

```
?amount_minor=129990&bg=%23FFFFFF
?amount_minor=129990&background=fff7f7
```

Kabul edilen biçimler: `#RRGGBB`, `#RGB`, `RRGGBB`, `RGB`. Geçersiz veya boş değerde varsayılan arka plan kullanılır. Renk adları (`red`, `transparent` vb.) kabul edilmez.

Ürün sayfasında örnek görünüm:

![Ürün sayfasında iframe taksit tablosu örneği](/example-installement-iframe.png)

## Iframe

Sayfa `Content-Security-Policy: frame-ancestors *` gönderir. `X-Frame-Options` yoktur.

```html
<div style="width:100%;overflow:hidden;border-radius:16px;">
  <iframe
    id="bandolf-installment-table"
    title="Taksit tablosu"
    loading="lazy"
    style="display:block;width:100%;min-height:320px;border:0;outline:0;background:transparent;"
    src="https://api.bandolf.com/odeme/taksit/pk_live_xxxxxxxx?amount_minor=129990&currency=TRY&bg=%23FFFFFF"
  ></iframe>
</div>

<script>
window.addEventListener('message', function (event) {
  if (!event.data || event.data.source !== 'bandolf-installment-table') return
  var frame = document.getElementById('bandolf-installment-table')
  if (frame && typeof event.data.height === 'number') {
    frame.style.height = Math.max(320, event.data.height) + 'px'
  }
})
</script>
```

`bg` parametresini sitenizin arka plan rengine göre ayarlayın. Örnek: beyaz sayfa için `bg=%23FFFFFF`, açık pembe için `bg=%23FFF7F7`.

Iframe checkout'tan gelen `payment_amount` ile `amount_minor` kullanın; tutarlar birebir eşleşir.

Yükseklik için iframe `postMessage` yayınlar:

```json
{
  "source": "bandolf-installment-table",
  "height": 420
}
```

```html
<script>
window.addEventListener('message', function (event) {
  if (!event.data || event.data.source !== 'bandolf-installment-table') return
  var frame = document.querySelector('iframe[title="Taksit tablosu"]')
  if (frame) frame.style.height = event.data.height + 'px'
})
</script>
```

Rate limit: 60 istek / dakika / IP.

Arama motoru noindex.

Bu sayfayı sunucu tarafında scrape etmeyin. Müşteri tutarlarını JSON almak için [Taksit tablosu JSON](/docs/api/get-installments) kullanın.

## Olmayanlar

- Canlı POS BIN sorgusu
- Komisyon / maliyet alanı
- Secret anahtar
- CORS JSON (bu bir belge sayfasıdır)
