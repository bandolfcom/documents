---
title: Health bileşeni
description: Tek bileşen. GET /healths/{component}.
category: Sistem API
slug: /docs/api/health-component
order: 2
type: api
method: GET
endpoint: /healths/{component}
---

# Health bileşeni

```
GET https://api.bandolf.com/healths/database
```

`{component}` şu listededir:

`api`, `web-panel`, `authentication`, `database`, `cache`, `network`, `webhooks`, `email`, `payments`, `workers`, `scheduler`, `notifications`.

## 200 / 503

```json
{
  "status": "operational",
  "scope": "database",
  "checked_at": "2026-09-16T20:00:00+00:00",
  "components": {
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

`scope` bileşen adıdır. Özet endpoint'te `summary` olur.

## 404

```json
{
  "error": {
    "code": "component_not_found",
    "message": "Bilinmeyen health bileşeni."
  }
}
```

Statuspage her bileşene ayrı URL tarasın:

```
https://api.bandolf.com/healths/api
https://api.bandolf.com/healths/web-panel
https://api.bandolf.com/healths/authentication
https://api.bandolf.com/healths/database
https://api.bandolf.com/healths/cache
https://api.bandolf.com/healths/network
https://api.bandolf.com/healths/webhooks
https://api.bandolf.com/healths/email
https://api.bandolf.com/healths/payments
https://api.bandolf.com/healths/workers
https://api.bandolf.com/healths/scheduler
https://api.bandolf.com/healths/notifications
```
