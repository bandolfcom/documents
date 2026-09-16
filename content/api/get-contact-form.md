---
title: İletişim formu şeması
description: Sabit landing form şeması. GET /api/v1/contact-form.
category: API Reference
slug: /docs/api/get-contact-form
order: 11
type: api
method: GET
endpoint: /api/v1/contact-form
---

# İletişim formu şeması

Kimlik yok.

```
GET https://api.bandolf.com/api/v1/contact-form
```

## 200

```json
{
  "name": "İletişim Formu",
  "description": "Landing sayfası iletişim formu",
  "fields": [
    {
      "name": "first_name",
      "label": "İsim",
      "type": "text",
      "required": true,
      "max_length": 100
    },
    {
      "name": "last_name",
      "label": "Soyisim",
      "type": "text",
      "required": true,
      "max_length": 100
    },
    {
      "name": "phone",
      "label": "Telefon",
      "type": "tel",
      "required": true,
      "max_length": 30
    },
    {
      "name": "email",
      "label": "E-posta",
      "type": "email",
      "required": true,
      "max_length": 255
    },
    {
      "name": "message",
      "label": "Mesaj",
      "type": "textarea",
      "required": true,
      "max_length": 5000
    },
    {
      "name": "subject",
      "label": "Konu",
      "type": "select",
      "required": true,
      "options": [
        { "value": "sales-partnership", "label": "Satış / İş Ortaklıkları" },
        { "value": "support", "label": "Destek" },
        { "value": "marketing-press", "label": "Pazarlama-Basın" },
        { "value": "accounting", "label": "Muhasebe" },
        { "value": "human-resources", "label": "İnsan Kaynakları" },
        { "value": "legal", "label": "Hukuk" },
        { "value": "other", "label": "Diğer" }
      ]
    }
  ],
  "abuse_protection": {},
  "submit_url": "https://api.bandolf.com/api/v1/contact-form/submissions"
}
```

`abuse_protection` dinamik formdaki ile aynı anahtarları taşır (captcha, honeypot, loaded_at, min_submit_seconds, rate_limit).

`submit_url` her zaman API host'undaki submissions yoludur.
