---
title: Hata kodları
description: error.code, fraud kodları ve iframe reason listesi.
category: Referans
slug: /docs/reference/error-codes
order: 3
---

# Hata kodları

## `error.code`

| Kod | HTTP | Mesaj örneği |
|-----|------|----------------|
| `unauthenticated` | 401 | Geçerli bir API anahtarı gerekli. / API anahtarı geçersiz veya merchant aktif değil. |
| `payment_error` | 422 | Ödeme iş kuralı metni |
| `internal_error` | 500 | Ödeme işlenirken beklenmeyen bir hata oluştu. |
| `not_found` | 404 | Ödeme bulunamadı. / Ödeme oturumu bulunamadı. |
| `checkout_session_error` | 422 | Bu order_id ile zaten bir ödeme oturumu mevcut. |
| `form_not_found` | 404 | Form bulunamadı veya aktif değil. |
| `provider_not_configured` | 422 | Ödeme sağlayıcısı yapılandırılmamış. |
| `validation_failed` | 422 | Gönderilen veriler geçersiz. |
| `submission_rejected` | 422 | Abuse (honeypot vb.) |
| `component_not_found` | 404 | Bilinmeyen health bileşeni. |

## `failure.code` (ödeme nesnesi)

Fraud:

| Kod | Anlam |
|-----|-------|
| `FRAUD_BLACKLIST` | Kara liste |
| `FRAUD_RULE_BLOCK` | Kural BLOCK |
| `FRAUD_GRAYLIST_BLOCK` | Graylist BLOCK |
| `FRAUD_RULE_REVIEW` | Kural REVIEW (`status` review) |
| `FRAUD_REVIEW` | Graylist REVIEW |

Sağlayıcı kodları bankaya göre değişir. Örnek: `05`, `DECLINED`, PayTR `msg` alanı.

## Iframe `reason`

| reason |
|--------|
| merchant_id zorunludur. |
| user_ip zorunludur. |
| merchant_oid zorunludur. |
| email zorunludur. |
| payment_amount zorunludur. |
| payment_amount kuruş cinsinden tam sayı olmalıdır. |
| bandolf_token zorunludur. |
| user_name zorunludur. |
| user_address zorunludur. |
| user_phone zorunludur. |
| merchant_ok_url zorunludur. |
| merchant_fail_url zorunludur. |
| Geçersiz merchant_id. |
| Mağaza bulunamadı veya aktif değil. |
| Bu ortam için aktif API anahtarı bulunamadı. |
| Geçersiz bandolf_token. |
| Ödeme sağlayıcısı yapılandırılmamış. |
| Bu merchant_oid ile zaten bir sipariş kaydı mevcut. |

## Direct `payment_error` mesajları

| Mesaj |
|-------|
| Bu order_id ile zaten bir ödeme kaydı mevcut. |
| Ödeme sağlayıcısı bulunamadı. |
| Ödeme sağlayıcısı yapılandırılmamış. |
| Seçilen ödeme sağlayıcısı aktif değil. |
| Seçilen sağlayıcı henüz desteklenmiyor. |
| Desteklenmeyen POS altyapısı: {etiket} |

## Checkout HTML mesajları

| Mesaj |
|-------|
| Ödeme oturumu bulunamadı. |
| Bu ödeme oturumu zaten tamamlandı. |
| Ödeme oturumunun süresi doldu. |
| Bu ödeme oturumu artık kullanılamıyor. |

## Taksit tablosu HTML mesajları

| Mesaj | HTTP |
|-------|------|
| Taksit tablosu bulunamadı. | 404 |
| Tutar alanı zorunludur. | 422 |

## İletişim formu validation

| Kural | Mesaj |
|-------|-------|
| first_name.required | İsim alanı zorunludur. |
| last_name.required | Soyisim alanı zorunludur. |
| phone.required | Telefon alanı zorunludur. |
| email.required | E-posta alanı zorunludur. |
| email.email | Geçerli bir e-posta adresi girin. |
| message.required | Mesaj alanı zorunludur. |
| subject.required | Konu seçimi zorunludur. |
| subject.enum | Geçersiz konu seçimi. |
