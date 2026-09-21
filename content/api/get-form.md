---
title: Form şeması getir
description: Aktif formun public şeması. GET /api/v1/forms/{formId}.
category: Iframe ve Formlar API
slug: /docs/api/get-form
order: 2
type: api
method: GET
endpoint: /api/v1/forms/{formId}
---

# Form şeması getir

Kimlik doğrulama yok. `{formId}` form `public_id` UUID değeridir. `public_token` bu yolda çalışmaz. Token HTML sayfası içindir.

```
GET https://api.bandolf.com/api/v1/forms/3f1c8a2e-4b6d-4c1a-9e0f-123456789abc
Accept: application/json
```

Pasif form 404.

## 200

```json
{
  "id": "3f1c8a2e-4b6d-4c1a-9e0f-123456789abc",
  "name": "Bülten kaydı",
  "description": "Haftalık e-posta",
  "success_message": "Teşekkürler.",
  "abuse_protection": {
    "captcha": {
      "enabled": false,
      "provider": "turnstile",
      "site_key": null,
      "token_field": "turnstile_token"
    },
    "honeypot_field": "_bandolf_hp",
    "loaded_at_field": "_bandolf_loaded_at",
    "min_submit_seconds": 2,
    "rate_limit": {
      "max_attempts": 10,
      "decay_minutes": 60
    }
  },
  "fields": [
    {
      "type": "email",
      "name": "email",
      "label": "E-posta",
      "placeholder": "ada@example.com",
      "help_text": null,
      "required": true,
      "disabled": false,
      "readonly": false,
      "default_value": null,
      "min": null,
      "max": null,
      "step": null,
      "min_length": null,
      "max_length": 255,
      "pattern": null,
      "accept": null,
      "multiple": false,
      "options": []
    }
  ]
}
```

`data` sarmalayıcısı yoktur.

Captcha `enabled` true ise `site_key` doludur. Widget'ı bu key ile çizin. Token alan adı `token_field` değeridir.

## 404

```json
{
  "error": {
    "code": "form_not_found",
    "message": "Form bulunamadı veya aktif değil."
  }
}
```

## curl

```bash
curl -s https://api.bandolf.com/api/v1/forms/3f1c8a2e-4b6d-4c1a-9e0f-123456789abc
```

HTML alternatif: `https://app.bandolf.com/forms/{public_token}`.
