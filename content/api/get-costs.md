---
title: Maliyetleri getir
description: Etkin sağlayıcılar, varsayılan komisyon ve aktif kurallar. GET /api/v1/costs.
category: Maliyet ve Taksit API
slug: /docs/api/get-costs
order: 1
type: api
method: GET
endpoint: /api/v1/costs
---

# Maliyetleri getir

Merchant'ın etkin POS kayıtlarını ve aktif maliyet kurallarını döner. Secret anahtar gerekir. Credential dönmez. Pasif kural dönmez.

```
GET https://api.bandolf.com/api/v1/costs
Authorization: Bearer sk_test_xxxxxxxx
Accept: application/json
```

## Sorgu

| Alan | Zorunlu | Tip | Kural |
|------|---------|-----|-------|
| `provider_id` | Hayır | integer | `banks.id`. Verilirse yalnız o sağlayıcı |

Yapılandırılmamış `provider_id` 422 `provider_not_configured` üretir.

## 200

Gövde `{ "data": CostCatalog }`.

```json
{
  "data": {
    "object": "cost_catalog",
    "providers": [
      {
        "id": 12,
        "name": "Garanti BBVA",
        "slug": "garanti-bbva",
        "is_enabled": true,
        "bank_is_active": true,
        "default_cost": {
          "currency": "TRY",
          "commission_rate": "1.8000",
          "fixed_fee": "0.50"
        },
        "rules": [
          {
            "id": 41,
            "currency": "TRY",
            "card_type": "credit",
            "card_brand": "visa",
            "card_brand_label": "Visa",
            "card_country": "TR",
            "card_country_label": "Türkiye",
            "installment_min": 3,
            "installment_max": 6,
            "amount_min": null,
            "amount_max": null,
            "commission_rate": "2.5000",
            "fixed_fee": "0.00",
            "valid_from": null,
            "valid_until": null,
            "priority": 10
          }
        ]
      }
    ]
  }
}
```

Etkin sağlayıcı yoksa `providers` boş dizidir.

## 401

Secret yok veya geçersiz. [API kimlik doğrulama](/docs/api/authentication).

## 422

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
curl -s "$BANDOLF_BASE/api/v1/costs" \
  -H "Authorization: Bearer $BANDOLF_KEY" \
  -H "Accept: application/json"
```
