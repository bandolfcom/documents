---
title: Hosted checkout
description: Checkout session açın, müşteriyi BANDOLF ödeme sayfasına yönlendirin.
category: Guides
slug: /docs/guides/hosted-checkout
order: 3
---

# Hosted checkout

Hosted checkout'ta kart BANDOLF sayfasında girilir. Siz oturum oluşturur ve `url` alanına yönlendirirsiniz.

## Adımlar

1. Secret anahtar ile `POST /api/v1/checkout-sessions`
2. Yanıttaki `data.url` değerine 303/302 yönlendirin
3. Müşteri kart, e-posta, isteğe bağlı fatura adresi ve taksit seçer
4. BANDOLF çekimi kendi ödeme motoruyla yapar
5. Sonuçta `return_urls.success` veya `return_urls.failure` adresine döner
6. Siz `GET /api/v1/checkout-sessions/{id}` ile `payment_id` ve `status` okursunuz

## Tutar nasıl hesaplanır

Siz `amount` göndermezsiniz. BANDOLF satırlardan üretir.

```
satır toplamı = quantity * unit_amount  (her satır)
ara toplam = satırların toplamı
indirim = summary.discount (varsayılan 0)
kargo = summary.shipping (varsayılan 0)
KDV oranı = summary.tax_rate / 100  (yoksa 0.20)
toplam = (ara toplam - indirim + kargo) + KDV
```

`tax_rate` yüzdeliktir. `20` yazın, `0.20` yazmayın. Üst sınır 100'dür.

`shipping_label` özet satırının adıdır. Varsayılan: "Standart kargo".

## Oturum ömrü

Varsayılan 60 dakika. `options.expires_in_minutes` 5 ile 1440 arasıdır. Süre dolunca durum `expired` olur. Sayfa hata gösterir.

Aynı `order_id` ile ikinci oturum `422` döner.

## Seçenekler

| Alan | Anlam |
|------|-------|
| `options.provider_id` | Sabit sağlayıcı |
| `options.max_installment` | 1-12 |
| `options.no_installment` | `true` ise taksit kapalı |
| `options.installments` | Sağlayıcıya özel string |
| `options.non_3d` | 3DS'siz deneme |
| `options.sync_mode` | Varsayılan hosted ödeme yükünde `true` |
| `options.expires_in_minutes` | Süre |
| `options.collect_billing_address` | Varsayılan `true`. `false` ise form adres sormaz. Sizin gönderdiğiniz adresi kullanır. |

## Fatura adresi

`customer.billing` nesnesi veya düz alanlar kabul edilir.

```json
"customer": {
  "email": "ada@example.com",
  "name": "Ada Yılmaz",
  "phone": "05555555555",
  "billing": {
    "line1": "Test Mahallesi No:1",
    "line2": "Daire 4",
    "postal_code": "34000",
    "city": "Istanbul",
    "country": "TR"
  }
}
```

`country` ISO 3166-1 alpha-2, tam 2 karakter.

`collect_billing_address` true iken sayfa ülke, adres, posta kodu ve şehir ister. Telefon oturumdaki `customer.phone` yoksa çekimde `05000000000` yedeklenir. Gerçek telefonu oturuma koyun.

## Taksit sorgusu

Sayfa kart BIN'ini alınca `POST /pay/{session}/installments` çağırır. Bu çağrıyı sizin yapmanız gerekmez. JSON döner: `{ "options": [ ... ] }`. Oturum ödenemezse `422` ve boş liste gelir.

## Ödeme sonrası

Oturum `complete` olur. `payment_id` doldurulur. `GET` session ile ödeme id'sini alın. Sonra `GET /api/v1/payments/{id}` ile kesin durumu okuyun.

`processing` durumunda success URL'ye gidilmiş olabilir. PayTR callback'i gecikebilir. Success sayfanız stok düşürmeden önce ödemeyi sorgulasın.

## PCI notu

Kart alanları BANDOLF HTML formundadır. Bu alanları kendi sitenizde kopyalamayın. Iframe ile gömmek istiyorsanız hosted yerine [iframe kanalını](/docs/guides/iframe) kullanın.

## Tam şema

[Checkout oturumu oluştur](/docs/api/create-checkout-session).
