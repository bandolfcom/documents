---
title: 3D Secure
description: requires_action yanıtı, ACS form_post, hosted ve iframe 3DS sayfaları.
category: Ödeme Entegrasyonu
slug: /docs/guides/three-d-secure
order: 5
---

# 3D Secure

3D Secure, kartı veren bankanın ek doğrulamasıdır. Direct API bunu `status: requires_action` ile size bırakır. Hosted ve iframe kanallarında BANDOLF tarayıcı adımını kendi host'unda bitirir.

## Direct API

`POST /api/v1/payments` sonrası `data.action` bakın. Yalnızca `requires_action` iken doludur. Diğer durumlarda `null` gelir.

### `form_post`

ACS bir HTML form POST ister. `action.form` içinde hedef URL ve gizli alanlar vardır. Bu formu tarayıcıda otomatik submit edin.

```json
{
  "action": {
    "type": "form_post",
    "form": {
      "url": "https://acs.bank.example/3ds",
      "method": "POST",
      "fields": {
        "PaReq": "...",
        "TermUrl": "https://api.bandolf.com/api/callbacks/vakifbank/12/three-d/01J...",
        "MD": "..."
      }
    }
  }
}
```

`TermUrl` BANDOLF callback'idir. Bunu değiştirmeyin. Banka sonucu oraya gönderir. BANDOLF sonra sizin `return_urls` adresinize yönlendirir.

### `html`

Sağlayıcı ham HTML döndürmüştür. Sayfada olduğu gibi render edin. PayTR 3DS bu tipe düşebilir.

```json
{
  "action": {
    "type": "html",
    "html": "<html>...</html>"
  }
}
```

### `redirect`

Tek URL vardır. 302 ile gönderin.

```json
{
  "action": {
    "type": "redirect",
    "redirect_url": "https://api.bandolf.com/odeme/3ds/odeme/01J..."
  }
}
```

Sandbox bu tipi üretir. Adres BANDOLF 3DS sayfasıdır.

### `none`

Action tipi çözülemedi. Ödemeyi GET ile tekrar okuyun. Destek ekibine `id` verin.

## `non_3d` seçeneği

`options.non_3d: true` 3DS'siz denemeyi ister. Sağlayıcı ve kart buna izin vermeyebilir. Fraud graylist `REQUIRE_3DS` ise `non_3d` false yapılır. Sizin seçiminiz ezilir.

## Hosted checkout

Müşteri `/pay/{session}` formunu gönderir. 3DS gerekirse BANDOLF kendi 3DS rotasına alır. Siz `action` parse etmezsiniz. Dönüş sizin `return_urls` adresinizedir.

## Iframe

Kart `/odeme/guvenli/{token}` üzerinde girilir. 3DS `/odeme/3ds/{token}` üzerinde devam eder. Direct payment 3DS sayfası `/odeme/3ds/odeme/{payment}` yolundadır.

## Banka callback URL'leri

Bunları merchant olarak çağırmazsınız. Banka veya ACS çağırır.

```
POST https://api.bandolf.com/api/callbacks/paytr/{bankId}
GET|POST https://api.bandolf.com/api/callbacks/vakifbank/{bankId}/three-d/{paymentPublicId}
GET|POST https://api.bandolf.com/api/callbacks/garanti/{bankId}/three-d/{paymentPublicId}
```

`{bankId}` `banks` tablosunun id'sidir. Endpoint banka kaydına yazılır. Yanlış URL 3DS'i kırar.

PayTR callback'i sunucudan sunucuya gelir. Müşteri tarayıcısı bu adımda yoktur. BANDOLF `OK` metni döner.

VakıfBank ve Garanti dönüşü tarayıcıdan gelir. Controller sale/provizyonu tamamlar. Sonra merchant URL'sine yönlendirir.

Final durumdaki ödemeye gelen callback yok sayılır. `succeeded`, `failed`, `cancelled`, `refunded` finaldir.

## Return URL güvenliği

Müşteri success URL'sini sahte açabilir. 3DS bitti diye siparişi onaylamayın. `GET /api/v1/payments/{id}` ile `status` `succeeded` olmalı.
