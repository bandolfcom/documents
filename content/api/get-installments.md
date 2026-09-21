---
title: Taksit tablosu JSON
description: Müşteri taksit seçenekleri ve satır maliyeti. GET /api/v1/installments.
category: Maliyet ve Taksit API
slug: /docs/api/get-installments
order: 3
type: api
method: GET
endpoint: /api/v1/installments
---

# Taksit tablosu JSON

Müşteriye gösterilecek taksit satırlarını döner. Secret anahtar gerekir. Her satıra eşleşen merchant maliyeti eklenir.

Kendi arayüzünüzü çizecekseniz bu endpoint'i kullanın. Yalnız tablo gösterecekseniz [HTML taksit tablosu](/docs/api/installment-table) yeter.

```
GET https://api.bandolf.com/api/v1/installments?amount=1000&currency=TRY
Authorization: Bearer sk_test_xxxxxxxx
Accept: application/json
```

## Sorgu

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `amount` | `amount_minor` yoksa evet | number | min 0.01, max 10_000_000. Ondalıklı TL (`1299.90`) |
| `amount_minor` | `amount` yoksa evet | integer | min 1, max 1_000_000_000. Kuruş (`129990` = 1.299,90 TL) |
| `currency` | Hayır | string | Varsayılan `TRY` |

`amount` ve `amount_minor` birlikte gönderilirse `amount` kullanılır. Iframe `payment_amount` ile aynı kuruş biçimidir.
| `card_type` | Hayır | string | Varsayılan `credit` |
| `card_brand` | Hayır | string | Varsayılan `any` |
| `card_country` | Hayır | string | Varsayılan `TR` |
| `provider_id` | Hayır | integer | Maliyet bu sağlayıcıdan. Yoksa ilk etkin sağlayıcı |
| `max_installment` | Hayır | integer | 1-12. Tek çekim her zaman kalır |

Müşteri tutarları hosted checkout vade çarpanlarıdır. BIN / canlı POS sorgusu yoktur.

`options` tüm taksit sayılarını (tek çekim dahil) döner. `programs` HTML tablodaki kart programı ızgarasıdır. Kartlar mağazanın açık POS’larına göre seçilir (Garanti → Bonus, Akbank → Axess). Kart başlığı o POS’un `/providers/banks/*.svg` logosudur. Toplayıcı (PayTR, iyzico) yalnız issuer banka yoksa tüm programları doldurur; o zaman logo kart ailesinin bankasına aittir (WORLD → Yapı Kredi). Her programın `options` listesi 3 / 6 / 9 / 12 satırıdır (`max_installment` üst sınırı keser). `programs[].provider_slug` ve `programs[].logo_url` hangi POS ve logonun kullanıldığını gösterir. `programs[].colors` sağlayıcı marka renklerini verir (`primary`, `secondary`, `alternative`); HTML tabloda üst şerit `primary` rengini kullanır.

HTML ile karşılaştırırken `data.programs` kullanın; üst seviye `options` banka bazlı değildir.

`cost` alanı HTML tabloda yoktur. Birden fazla sağlayıcı varsa `provider_id` gönderin.

## 200

Gövde `{ "data": InstallmentTable }`.

```json
{
  "data": {
    "object": "installment_table",
    "amount": 1000,
    "currency": "TRY",
    "options": [
      {
        "count": 1,
        "label": "Tek çekim",
        "monthly": "1.000,00",
        "base_total": "1.000,00",
        "total": "1.000,00",
        "term_diff_amount": "0,00",
        "is_cash_price": true,
        "pricing_label": "Peşin fiyatına",
        "currency": "TRY",
        "cost": {
          "provider_id": 12,
          "provider_name": "Garanti BBVA",
          "provider_slug": "garanti-bbva",
          "matched_rule_id": null,
          "source": "default",
          "commission_rate": "1.8000",
          "fixed_fee": "0.00",
          "commission_amount": "18.00",
          "total_cost": "18.00",
          "effective_rate": "1.8000"
        }
      },
      {
        "count": 9,
        "label": "9 taksit",
        "monthly": "116,11",
        "base_total": "1.000,00",
        "total": "1.045,00",
        "term_diff_amount": "45,00",
        "is_cash_price": false,
        "pricing_label": "Vade farklı",
        "currency": "TRY",
        "cost": {
          "provider_id": 12,
          "source": "rule",
          "commission_rate": "3.2000",
          "total_cost": "32.00"
        }
      }
    ],
    "programs": [
      {
        "code": "axess",
        "name": "Axess",
        "provider_id": 1,
        "provider_name": "Akbank",
        "provider_slug": "akbank",
        "logo_url": "https://api.bandolf.com/providers/banks/akbank.svg",
        "colors": {
          "primary": "#E30613",
          "secondary": "#FFFFFF",
          "alternative": "#000000"
        },
        "options": [
          {
            "count": 3,
            "label": "3 taksit",
            "monthly": "333,33",
            "total": "1.000,00",
            "is_cash_price": true,
            "currency": "TRY",
            "cost": {
              "source": "default",
              "commission_rate": "1.8000"
            }
          }
        ]
      }
    ]
  }
}
```

`monthly`, `total` ve `term_diff_amount` Türkçe para biçimidir (`1.045,00`). Hesap için `count` ve `amount` kullanın.

Etkin sağlayıcı yoksa `cost` `null` olur. Satırlar yine döner.

## 401

Secret yok veya geçersiz.

## 422

`amount` yoksa Laravel doğrulama. Yapılandırılmamış `provider_id` için `provider_not_configured`.

## curl

```bash
curl -s "$BANDOLF_BASE/api/v1/installments?amount=1000" \
  -H "Authorization: Bearer $BANDOLF_KEY" \
  -H "Accept: application/json"
```
