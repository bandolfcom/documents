---
title: Fraud
description: Kara liste, graylist, kural motoru ve ödeme risk yanıtı.
category: Ödeme İşlemleri
slug: /docs/guides/fraud
order: 4
---

# Fraud

Fraud katmanı Direct çekimden önce çalışır. Hosted ve ödeme linki de aynı kuralları kullanır.

Yönetim merchant panelindedir. Public fraud API'si yoktur.

## Listeler

Yol: `/user/fraud/lists`.

Türler:

| Tür | Öncelik | Sonuç |
|-----|---------|-------|
| Blacklist | 1 (en güçlü) | Ödeme `failed`, kod `FRAUD_BLACKLIST` |
| Graylist | 3 | Aksiyon: review, 3DS zorunlu, block, sağlayıcıya yönlendir |
| Whitelist | 4 | Akışa izin sinyali |

Kimlik türleri:

- Kart fingerprint (PAN saklanmaz, hash üretilir)
- BIN (ilk 6 veya 8 hane)
- IP
- E-posta
- Müşteri id (`customer.id`)

Eşleşme: tam (`EXACT`), CIDR (IP aralığı), desen (`PATTERN`).

Liste satırlarının süresi dolabilir. Süre dolan kayıtlar otomatik kapanır.

Graylist aksiyonları:

| Aksiyon | Davranış |
|---------|----------|
| `BLOCK` | `failed`, `FRAUD_GRAYLIST_BLOCK` |
| `REVIEW` | `review`, sağlayıcıya gitmez |
| `REQUIRE_3DS` | `non_3d` kapatılır, çekim 3DS'li devam eder |
| `ROUTE_TO_PROVIDER` | `provider_id` yerine graylist'teki banka seçilir. Banka yoksa normal seçiciye düşer. |

Aynı anda birden fazla graylist varsa şiddet sırası: block, review, 3DS, route.

## Kurallar

Yol: `/user/fraud/rules`.

Kural bir koşul ağacıdır.

- En fazla 50 koşul
- En fazla 5 seviye iç içe grup
- Gruplar AND / OR
- Aksiyon: `ALLOW`, `REVIEW`, `BLOCK`

`REVIEW` ödemeyi `review` yapar. Kod: `FRAUD_RULE_REVIEW`. `BLOCK` ödemeyi `failed` yapar. Kod: `FRAUD_RULE_BLOCK`.

Alan katalogları backend'den gelir. UI hardcoded değildir. Kategoriler: ödeme, kart, IP, müşteri, cihaz, velocity, liste üyeliği.

Örnek alanlar: `amount`, `currency`, `card_bin`, `card_fingerprint`, `ip_address`, `email`, `email_domain`, `velocity_tx_count_minutes`, `list_card_blacklisted`.

Kural simülasyonu `/user/fraud/rules/simulate` ile çalışır. Canlı çekim yapmaz.

## Ödeme yanıtındaki risk

`risk` alanı değerlendirme yüklüyse gelir.

```json
{
  "risk": {
    "status": "ALLOW",
    "status_label": "Allow",
    "action": "ALLOW",
    "action_label": "Allow",
    "applied_rule": null,
    "risk_score": 0,
    "signals": [],
    "matches": []
  }
}
```

Sinyal örnekleri: `BLACKLIST_MATCH`, `GRAYLIST_MATCH`, `WHITELIST_MATCH`, `FRAUD_RULE_MATCH`.

## Direct payload'da kimlik

Fingerprint kart numarasından türetilir. BIN ilk hanelerdir. IP header'dan gelir. E-posta `customer.email`. Müşteri id `customer.id`.

Bu kimlikleri metadata içinde de saklarız. PAN metadata'ya yazılmaz.

## Operasyon notu

Review'daki ödemeyi API ile "onayla ve çek" diye geçiremezsiniz. Böyle bir endpoint yoktur. İnceleme operasyoneldir. Müşteriye yeni bir `order_id` ile tekrar ödeme aldırtırsınız veya işlemi reddedilmiş sayarsınız.
