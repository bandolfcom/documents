---
title: Formlar
description: Public form şeması, gönderim, abuse koruması ve iletişim formu.
category: Operasyon ve Araçlar
slug: /docs/guides/forms
order: 1
---

# Formlar

BANDOLF iki form yüzeyi sunar.

1. Dinamik formlar. Şema ve gönderim API'si vardır.
2. Landing iletişim formu. Alanlar sabittir.

İkisi de merchant secret anahtarı istemez. Yine de bot koruması vardır.

## Dinamik form

Dinamik formun `public_id` (UUID) ve `public_token` (UUID) değeri vardır.

| Kullanım | URL |
|----------|-----|
| HTML sayfa | `https://app.bandolf.com/forms/{public_token}` |
| Şema | `GET https://api.bandolf.com/api/v1/forms/{public_id}` |
| Gönderim | `POST https://api.bandolf.com/api/v1/forms/{public_id}/submissions` |

Pasif form 404 döner. Mesaj: "Form bulunamadı veya aktif değil." Kod: `form_not_found`.

### Şema yanıtı

```json
{
  "id": "3f1c...",
  "name": "Bülten",
  "description": null,
  "success_message": "Teşekkürler.",
  "abuse_protection": {
    "captcha": {
      "enabled": true,
      "provider": "turnstile",
      "site_key": "0x...",
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
  "fields": []
}
```

Alan tipleri: `text`, `email`, `password`, `number`, `tel`, `url`, `search`, `date`, `datetime-local`, `time`, `month`, `week`, `color`, `range`, `checkbox`, `radio`, `select`, `textarea`, `file`, `hidden`.

Her alan `name`, `label`, `required`, `min`, `max`, `pattern`, `options` gibi kısıtlar taşıyabilir.

### Gönderim

JSON veya multipart gönderin. Dosya alanı varsa `multipart/form-data` kullanın. Dosya kuralı: `file`, en fazla 10240 KB.

Abuse alanlarını göndermelisiniz.

- `_bandolf_hp` boş kalmalı. Doluysa bot sanılır.
- `_bandolf_loaded_at` formun açıldığı unix zamanı. Çok hızlı submit reddedilir. Varsayılan en az 2 saniye.
- `turnstile_token` captcha açıksa zorunlu.

Bu üç alan veri snapshot'ına yazılmaz.

Başarı `201`:

```json
{
  "id": "sub_public_id",
  "message": "Form başarıyla gönderildi.",
  "submitted_at": "2026-09-16T20:00:00+00:00"
}
```

`message` formun `success_message` değeridir. Boşsa varsayılan Türkçe cümle kullanılır.

Doğrulama hatası `422`:

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

Abuse hatası `submission_rejected` gibi kodlarla döner. HTTP çoğu zaman 422, rate limit'te farklı status olabilir.

Gönderim kaynağı API olarak işaretlenir. IP ve user-agent kaydedilir. Telegram form ayarından açıksa kanal bildirimi gider.

Başvuru durumu public API ile güncellenmez.

## İletişim formu

Landing sayfası içindir. Şema sabit.

```
GET  /api/v1/contact-form
POST /api/v1/contact-form/submissions
```

Zorunlu alanlar:

| Alan | Tip | Limit |
|------|-----|-------|
| `first_name` | string | 100 |
| `last_name` | string | 100 |
| `phone` | string | 30 |
| `email` | e-posta | 255 |
| `message` | string | 5000 |
| `subject` | enum | aşağıda |

Subject değerleri:

- `sales-partnership` Satış / İş Ortaklıkları
- `support` Destek
- `marketing-press` Pazarlama-Basın
- `accounting` Muhasebe
- `human-resources` İnsan Kaynakları
- `legal` Hukuk
- `other` Diğer

Başarı mesajı form ayarından gelir. Varsayılan: "Mesajınız alındı. En kısa sürede size dönüş yapacağız."

İletişim formu da honeypot, süre ve rate limit koruması kullanır. Captcha form ayarına göre açılabilir.
