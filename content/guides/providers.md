---
title: Ödeme sağlayıcıları
description: PayTR, VakıfBank, Garanti, Sandbox ve katalogdaki diğer POS'lar.
category: Operasyon ve Araçlar
slug: /docs/guides/providers
order: 3
---

# Ödeme sağlayıcıları

Merchant BANDOLF'e bir kez bağlanır. POS bilgileri panele girilir. Sağlayıcı, `pos_infrastructure` değerine göre seçilir.

## Çalışan sağlayıcılar

### PayTR (`PAYTR_GATEWAY`)

- Direct charge form POST
- Senkron success/fail JSON
- `wait_callback` -> ödeme `processing`
- Webhook: `POST /api/callbacks/paytr/{bank}`
- HMAC doğrulama
- Yanıt gövdesi `OK`

### VakıfBank (`VAKIFBANK_VIRTUAL_POS`)

- Non-3D XML sale
- 3DS enrollment + ACS
- Callback: `/api/callbacks/vakifbank/{bank}/three-d/{payment}`
- İptal ve iade XML servisi

### Garanti BBVA GVP (`GVP`)

- 3DS ve XML
- Callback: `/api/callbacks/garanti/{bank}/three-d/{payment}`
- İptal ve iade XML servisi

### BANDOLF Sandbox (`BANDOLF_SANDBOX`)

- Gerçek banka çağrısı yok
- Charge her zaman `requires_action`
- Redirect BANDOLF 3DS sayfası
- Test kartları ile kullanılır

## Katalog ama entegrasyon yok

Katalogda başka banka ve kuruluşlar da görünür. Entegrasyonu açılmamış bir sağlayıcı seçilirse ödeme "Seçilen sağlayıcı henüz desteklenmiyor." ile düşer.

## Merchant tarafı

Yol: `/user/pos/providers`. Sağlayıcıyı açın, kimlik alanlarını doldurun, kaydı etkin bırakın.

Panelde sık görülen alan adları: `api_key`, `api_secret`, `username`, `password`, `merchant_id`, `terminal_id`, `client_id`, `store_key`.

`provider_id` Direct istekte sağlayıcının sayısal kimliğidir. Slug gönderilmez.

## Maliyet kuralları

Komisyon kuralları çekim yönlendirmesini bugün otomatik seçmez. Fiyatlandırma ve rapor içindir. Akıllı routing vizyondadır, tam ürün değildir.

Kuralları okumak: [Maliyet kuralları](/docs/guides/costs), [Maliyetleri getir](/docs/api/get-costs).
