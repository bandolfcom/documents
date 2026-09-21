---
title: Form gönder
description: Dinamik form submission. POST /api/v1/forms/{formId}/submissions.
category: Iframe ve Formlar API
slug: /docs/api/submit-form
order: 3
type: api
method: POST
endpoint: /api/v1/forms/{formId}/submissions
---

# Form gönder

```
POST https://api.bandolf.com/api/v1/forms/{formId}/submissions
Content-Type: application/json
```

Dosya alanı varsa `multipart/form-data`. `{formId}` şemadaki `id` (UUID).

Secret anahtar gerekmez. Abuse alanları gerekir.

## Gövde

Şemadaki her `fields[].name` bir anahtardır. Ek olarak:

| Alan | Görev |
|------|-------|
| `_bandolf_hp` | Boş bırakın |
| `_bandolf_loaded_at` | Formun açıldığı unix timestamp (saniye) |
| `turnstile_token` | Captcha açıksa Cloudflare token |

`_token` ve `_method` yok sayılır.

Disabled veya readonly alanlar `nullable` doğrulanır. Değer zorunlu tutulmaz.

## JSON örneği

```bash
NOW=$(date +%s)
curl -X POST https://api.bandolf.com/api/v1/forms/3f1c8a2e-4b6d-4c1a-9e0f-123456789abc/submissions \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"ada@example.com\",
    \"_bandolf_hp\": \"\",
    \"_bandolf_loaded_at\": $((NOW - 5))
  }"
```

`loaded_at` şimdiden en az `min_submit_seconds` kadar önce olmalıdır. Varsayılan 2 saniye. Çok eski değer de reddedilebilir. Formu açtığınız anı gönderin.

## 201

```json
{
  "id": "01JSUBMISSIONID00000000000",
  "message": "Teşekkürler.",
  "submitted_at": "2026-09-16T20:30:00+00:00"
}
```

`id` gönderimin `public_id` değeridir.

## 404

`form_not_found` (şema ile aynı).

## 422 doğrulama

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Gönderilen veriler geçersiz.",
    "details": {
      "email": ["E-posta alanı zorunludur."]
    }
  }
}
```

## 422 abuse

```json
{
  "error": {
    "code": "submission_rejected",
    "message": "..."
  }
}
```

Honeypot doluysa, süre kısa ise, rate limit aşıldıysa, captcha geçersizse bu aileye düşersiniz. Status bazen 422 dışına çıkabilir.

## Dosya

`allowFiles` istekte o alan `hasFile` ise true olur. Max 10240 KB. `accept` MIME listesi alandaysa uygulanır. `multiple` true ise dizi beklenir. Dosyalar `local` diskte `form-submissions/{formId}` altına gider. Public URL üretilmez.

Rate limit: IP + form, varsayılan 10 deneme / 60 dakika.
