---
title: İletişim formu gönder
description: Landing iletişim kaydı. POST /api/v1/contact-form/submissions.
category: Iframe ve Formlar API
slug: /docs/api/submit-contact-form
order: 5
type: api
method: POST
endpoint: /api/v1/contact-form/submissions
---

# İletişim formu gönder

```
POST https://api.bandolf.com/api/v1/contact-form/submissions
Content-Type: application/json
```

Önce kötüye kullanım koruması, sonra alan doğrulama.

## Gövde

| Alan | Zorunlu | Kural |
|------|---------|-------|
| `first_name` | Evet | string max 100 |
| `last_name` | Evet | string max 100 |
| `phone` | Evet | string max 30 |
| `email` | Evet | email max 255 |
| `message` | Evet | string max 5000 |
| `subject` | Evet | enum değerleri |

Subject: `sales-partnership`, `support`, `marketing-press`, `accounting`, `human-resources`, `legal`, `other`.

Honeypot ve loaded_at dinamik formdaki gibi eklenmelidir. Captcha açıksa `turnstile_token` ekleyin.

## Örnek

```bash
curl -X POST https://api.bandolf.com/api/v1/contact-form/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Ada",
    "last_name": "Yılmaz",
    "phone": "05555555555",
    "email": "ada@example.com",
    "message": "Entegrasyon hakkında bilgi almak istiyorum.",
    "subject": "sales-partnership",
    "_bandolf_hp": "",
    "_bandolf_loaded_at": 1726500000
  }'
```

## 201

```json
{
  "id": "01JCONTACTSUB000000000000",
  "message": "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
  "submitted_at": "2026-09-16T20:40:00+00:00"
}
```

Mesaj formun başarı metnidir. Varsayılan: "Mesajınız alındı. En kısa sürede size dönüş yapacağız."

## 422 subject

Mesaj: "Geçersiz konu seçimi."

Zorunlu alan mesajları Türkçedir. Örnek: "İsim alanı zorunludur."

## Abuse

Dinamik formdaki `error.code` + `message` biçimi.
