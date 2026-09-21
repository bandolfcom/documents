---
title: Health özeti
description: Tüm bileşenlerin durumu. GET /healths.
category: Sistem API
slug: /docs/api/health
order: 1
type: api
method: GET
endpoint: /healths
---

# Health özeti

Kimlik yok. Statuspage ve uptime robot burayı tarar.

```
GET https://api.bandolf.com/healths
```

## 200 veya 503

```json
{
  "status": "operational",
  "scope": "summary",
  "checked_at": "2026-09-16T20:00:00+00:00",
  "components": {
    "api": {
      "component": "api",
      "status": "operational",
      "message": null,
      "checked_at": "2026-09-16T20:00:00+00:00",
      "meta": {}
    },
    "database": {
      "component": "database",
      "status": "operational",
      "message": null,
      "checked_at": "2026-09-16T20:00:00+00:00",
      "meta": { "driver": "pgsql" }
    }
  }
}
```

`status` özeti: herhangi biri `down` ise `down`. Aksi halde herhangi biri `degraded` ise `degraded`. Hepsi `operational` ise `operational`.

HTTP:

| status | HTTP |
|--------|------|
| operational | 200 |
| degraded | 503 |
| down | 503 |

## Bileşenler

| Anahtar | Kontrol |
|---------|---------|
| `api` | API yüzeyi |
| `web-panel` | Merchant paneli |
| `authentication` | Kimlik doğrulama |
| `database` | Veritabanı |
| `cache` | Önbellek |
| `network` | Ağ bağlantısı |
| `webhooks` | Banka callback'leri |
| `email` | E-posta |
| `payments` | Ödeme altyapısı |
| `workers` | Kuyruk işçileri |
| `scheduler` | Zamanlanmış işler |
| `notifications` | Bildirimler |

Tek bileşen: [Health bileşeni](/docs/api/health-component).

## curl

```bash
curl -s https://api.bandolf.com/healths | jq .status
```
