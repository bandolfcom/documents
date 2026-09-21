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

## Sorgu

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `amount` | Evet | number | min 0.01, max 10_000_000 |
| `currency` | Hayır | string | Varsayılan `TRY` |
| `card_type` | Hayır | string | Varsayılan `credit` |
| `card_brand` | Hayır | string | Varsayılan `any` |
| `card_country` | Hayır | string | Varsayılan `TR` |
| `max_installment` | Hayır | integer | 1-12 |

Pasif anahtar veya pasif merchant: HTML 404. Mesaj: "Taksit tablosu bulunamadı."

`amount` yoksa HTML 422. Mesaj: "Tutar alanı zorunludur."

Test anahtarı sayfada "Test ortamı" rozeti gösterir.

Sayfa, mağazanın açık POS’larına bağlı kart programlarını gösterir. Garanti → Bonus, Akbank → Axess, Yapı Kredi / VakıfBank → World gibi. PayTR / iyzico gibi toplayıcılar yalnız issuer banka yoksa tüm programları açar. Her kartta 3 / 6 / 9 / 12 için **Taksit Tutarı** ve **Toplam Tutar** vardır. Tek çekim satırı yoktur. Komisyon oranı yazılmaz.

Tutarlar hosted checkout vade çarpanlarıdır. Canlı POS BIN sorgusu yoktur.

## Iframe

Sayfa `Content-Security-Policy: frame-ancestors *` gönderir. `X-Frame-Options` yoktur.

```html
<iframe
  src="https://api.bandolf.com/odeme/taksit/pk_live_xxxxxxxx?amount=1299.90&currency=TRY"
  title="Taksit tablosu"
  style="width:100%;border:0;min-height:520px"
></iframe>
```

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
