---
title: Maliyet kuralları
description: Komisyon katalogu, quote ve ürün sayfası taksit tablosu.
category: Ödeme İşlemleri
slug: /docs/guides/costs
order: 2
---

# Maliyet kuralları

Maliyet, merchant'ın POS komisyonudur. Müşteriye gösterilen taksit tutarı değildir.

Kuralları panelden yazarsınız: `/user/pos/providers/{id}/cost`. API bunları okur. Yazma API'si yoktur.

Komisyon çekim yönlendirmesini seçmez. Fiyatlandırma ve rapor içindir.

## İki yüzey

1. JSON. Secret anahtar. Kendi backend'iniz maliyet ve taksit seçeneklerini çeker.
2. HTML. Public anahtar. Ürün sayfasına iframe gömersiniz. Secret gerekmez.

JSON maliyet oranlarını döner. HTML dönmez.

## Eşleşme

Quote bir kural seçer. Koşullar:

- Para birimi tam eşleşme
- Kart tipi tam eşleşme (`credit` veya `debit`)
- Marka: kural `any` ise her marka, değilse tam eşleşme
- Ülke: `any`, `international` (TR dışı) veya ISO kod
- Taksit sayısı kural aralığında
- Tutar aralığında (boş sınır açık demektir)
- `valid_from` / `valid_until` içinde (boş sınır açık demektir)

Birden fazla kural tutarsa daha spesifik olan kazanır. Eşitlikte düşük `priority` (panel: düşük sayı = yüksek öncelik), sonra küçük `id`.

Eşleşme yoksa sağlayıcının varsayılan komisyon ve sabit ücreti kullanılır. Varsayılan para birimi quote para biriminden farklıysa oran 0 kabul edilir.

## Müşteri taksiti

Müşteri satırları hosted checkout ile aynıdır. `CheckoutInstallments` vade çarpanları:

- 1, 2, 3, 6: peşin fiyatına
- 9: %4,5
- 12: %7
- diğer sayılar: %3

Canlı POS BIN sorgusu (iyzico / VakıfBank) bu API'de yoktur. O akış checkout oturumu ve kart ister.

## Iframe

Checkout'taki `payment_amount` kuruş değerini doğrudan gönderin. Sitenizin arka planına uyması için `bg` ekleyin (`#` URL'de `%23`):

```html
<iframe
  src="https://api.bandolf.com/odeme/taksit/pk_live_xxxxxxxx?amount_minor=129990&currency=TRY&bg=%23FFFFFF"
  title="Taksit tablosu"
  style="width:100%;border:0;min-height:320px;background:transparent;"
></iframe>
```

Yüksekliği otomatik almak için:

```html
<script>
window.addEventListener('message', function (event) {
  if (!event.data || event.data.source !== 'bandolf-installment-table') return
  var frame = document.querySelector('iframe[title="Taksit tablosu"]')
  if (frame) frame.style.height = event.data.height + 'px'
})
</script>
```

Ürün sayfası görünüm örneği ve tam iframe rehberi: [HTML taksit tablosu](/docs/api/installment-table).

Ayrıntı: [Maliyetleri getir](/docs/api/get-costs), [Maliyet hesapla](/docs/api/quote-cost), [Taksit tablosu JSON](/docs/api/get-installments).
