---
title: Maliyet hesapla
description: Senaryo için eşleşen kural ve komisyon. GET /api/v1/costs/quote.
category: Maliyet ve Taksit API
slug: /docs/api/quote-cost
order: 2
type: api
method: GET
endpoint: /api/v1/costs/quote
---

# Maliyet hesapla

Tutar, taksit ve kart koşullarına göre merchant maliyetini hesaplar. Secret anahtar gerekir.

```
GET https://api.bandolf.com/api/v1/costs/quote?amount=1000&installment_count=3&card_brand=visa
Authorization: Bearer sk_test_xxxxxxxx
Accept: application/json
```

## Sorgu

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `amount` | Evet | number | min 0.01, max 10_000_000 |
| `installment_count` | Evet | integer | `0` tek çekimdir. `1`-`12` de kabul |
| `currency` | Hayır | string | Varsayılan `TRY`. `TL` → `TRY` |
| `card_type` | Hayır | string | `credit` (varsayılan) veya `debit` |
| `card_brand` | Hayır | string | `any` (varsayılan), `visa`, `mastercard`, `troy`, `amex`, `other` |
| `card_country` | Hayır | string | Varsayılan `TR`. `any`, `international` veya ISO |
| `provider_id` | Hayır | integer | `banks.id`. Yoksa etkin her sağlayıcı |

Eşleşme kuralları: [Maliyet kuralları](/docs/guides/costs).

`source` değeri `rule` veya `default`.

## 200

Gövde `{ "data": CostQuote }`.

```json
{
  "data": {
    "object": "cost_quote",
    "amount": 1000,
    "currency": "TRY",
    "installment_count": 3,
    "card_type": "credit",
    "card_brand": "visa",
    "card_country": "TR",
    "quotes": [
      {
        "provider_id": 12,
        "provider_name": "Garanti BBVA",
        "provider_slug": "garanti-bbva",
        "matched_rule_id": 41,
        "source": "rule",
        "commission_rate": "2.5000",
        "fixed_fee": "0.00",
        "commission_amount": "25.00",
        "total_cost": "25.00",
        "effective_rate": "2.5000"
      }
    ]
  }
}
```

Komisyon yüzde olarak saklanır. `1.80` = %1.80. `total_cost` = komisyon tutarı + sabit ücret.

Etkin sağlayıcı yoksa ve `provider_id` yoksa `quotes` boş dizidir.

## 401

Secret yok veya geçersiz.

## 422

Doğrulama Laravel `errors` biçimindedir.

Yapılandırılmamış sağlayıcı:

```json
{
  "error": {
    "code": "provider_not_configured",
    "message": "Ödeme sağlayıcısı yapılandırılmamış."
  }
}
```

## curl

```bash
curl -s "$BANDOLF_BASE/api/v1/costs/quote?amount=1000&installment_count=3&card_brand=visa" \
  -H "Authorization: Bearer $BANDOLF_KEY" \
  -H "Accept: application/json"
```
