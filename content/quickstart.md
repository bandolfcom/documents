---
title: Hızlı başlangıç
description: API anahtarı alın, ilk checkout oturumunu veya Direct ödemeyi oluşturun.
category: Getting Started
slug: /docs/quickstart
order: 2
featured: true
---

# Hızlı başlangıç

Bu sayfa sizi ilk çalışan isteğe götürür. Kart verisini kendi sunucunuzda tutmak istemiyorsanız hosted checkout kullanın. Kartı kendi backend'inizde işliyorsanız Direct API kullanın.

## 1. Hesap ve anahtar

1. Merchant paneline girin: `https://app.bandolf.com/user/login`
2. **Geliştirici > API anahtarları** sayfasını açın.
3. Test ortamı için bir anahtar oluşturun.
4. `sk_test_...` secret değerini bir kez kopyalayın. Secret daha sonra maskelenir.
5. Iframe kullanacaksanız `salt_key` değerini de kaydedin.

Secret anahtarı tarayıcıya, mobil uygulamaya veya Git deposuna koymayın. Yalnızca sunucu tarafında kullanın.

## 2. Ortam adresleri

Canlı API tabanı: `https://api.bandolf.com`

Tüm örneklerde bu adres kullanılır. Test anahtarı (`sk_test_`) ile istek atın. Canlıya geçince `sk_live_` ve aynı tabanı kullanırsınız.

## 3. Kimlik doğrulama

Secret anahtarı iki yoldan biriyle gönderin.

```http
Authorization: Bearer sk_test_xxxxxxxx
```

veya

```http
X-Api-Key: sk_test_xxxxxxxx
```

İkisi birden gerekmez. Bearer varsa o kullanılır.

## 4. Önerilen yol: hosted checkout

Kart BANDOLF sayfasında girilir. Mağaza yalnızca oturum açar ve müşteriyi `url` alanına yönlendirir.

```bash
curl -X POST https://api.bandolf.com/api/v1/checkout-sessions \
  -H "Authorization: Bearer sk_test_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-1001",
    "currency": "TRY",
    "line_items": [
      {
        "name": "Studio kablosuz kulaklık",
        "quantity": 1,
        "unit_amount": 999.90
      }
    ],
    "customer": {
      "email": "musteri@example.com",
      "name": "Ada Yılmaz",
      "phone": "05555555555"
    },
    "return_urls": {
      "success": "https://magaza.example.com/odeme-basarili",
      "failure": "https://magaza.example.com/odeme-hata"
    }
  }'
```

Başarılı yanıt `201` döner.

```json
{
  "data": {
    "id": "01JEXAMPLEULID000000000000",
    "object": "checkout_session",
    "status": "open",
    "order_id": "ORD-1001",
    "amount": 1199.88,
    "currency": "TRY",
    "url": "https://api.bandolf.com/pay/01JEXAMPLEULID000000000000",
    "expires_at": "2026-09-16T22:00:00+00:00"
  }
}
```

Müşteriyi `data.url` adresine yönlendirin. Varsayılan KDV oranı yüzde 20'dir. `999.90` birim fiyatı için toplam `1199.88` olur. KDV'yi değiştirmek için `summary.tax_rate` gönderin.

Oturum süresi varsayılan 60 dakikadır. `options.expires_in_minutes` ile 5 ile 1440 dakika arasında değişir.

Aynı `order_id` ikinci kez gönderilirse `422` alırsınız.

## 5. Alternatif yol: Direct API

Kart mağaza sunucusundan geçer. Bu yolu yalnızca PCI süreciniz hazırsa kullanın.

```bash
curl -X POST https://api.bandolf.com/api/v1/payments \
  -H "Authorization: Bearer sk_test_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.99,
    "currency": "TRY",
    "order_id": "ORD-1002",
    "installment_count": 0,
    "customer": {
      "email": "test@example.com",
      "name": "Paytr Test",
      "phone": "05555555555",
      "address": "Test Mahallesi No:1 Istanbul"
    },
    "card": {
      "holder_name": "TEST KARTI",
      "number": "9792030394440796",
      "expiry_month": "12",
      "expiry_year": "99",
      "cvv": "000"
    },
    "return_urls": {
      "success": "https://example.com/payment/success",
      "failure": "https://example.com/payment/failure"
    },
    "basket": [
      { "name": "Test Ürün", "price": "100.99", "quantity": 1 }
    ],
    "options": {
      "non_3d": true,
      "sync_mode": true
    }
  }'
```

Başarılı yanıt `201` ve `data.status` alanını döner. Olası durumlar:

| `status` | Anlam |
|----------|-------|
| `succeeded` | Ödeme alındı |
| `failed` | Reddedildi |
| `requires_action` | 3D Secure veya form yönlendirmesi var |
| `processing` | Sağlayıcı callback bekleniyor |
| `review` | Fraud incelemesi |

`requires_action` geldiğinde `data.action` içindeki `form_post`, `html` veya `redirect` tipini işleyin. Ayrıntı: [3D Secure](/docs/guides/three-d-secure).

## 6. Ödemeyi sorgulayın

```bash
curl https://api.bandolf.com/api/v1/payments/01JEXAMPLEULID000000000000 \
  -H "Authorization: Bearer sk_test_xxxxxxxx"
```

Checkout oturumu için:

```bash
curl https://api.bandolf.com/api/v1/checkout-sessions/01JEXAMPLEULID000000000000 \
  -H "Authorization: Bearer sk_test_xxxxxxxx"
```

Merchant'a giden webhook henüz yoktur. Sonucu API sorgusu, hosted dönüş URL'si veya panelden takip edin.

## 7. POS bağlantısı

İstek atmadan önce merchant'a en az bir aktif sağlayıcı bağlayın.

1. Panelde **POS > Sağlayıcılar** sayfasını açın.
2. PayTR, VakıfBank, Garanti veya Sandbox seçin.
3. Credential alanlarını doldurun ve kaydı etkinleştirin.

`provider_id` göndermezseniz BANDOLF aktif ve desteklenen ilk sağlayıcıyı seçer. Sıra: `sort_order`, sonra `id`.

Test için BANDOLF Sandbox yeterlidir. Gerçek banka credential'ı gerekmez.

## 8. Sık ilk hatalar

| Belirti | Neden |
|---------|-------|
| `401 unauthenticated` | Anahtar yok, yanlış veya merchant pasif |
| `422 payment_error` / sağlayıcı yapılandırılmamış | POS bağlanmamış veya kapalı |
| `422` aynı `order_id` | Merchant bazında sipariş numarası tekildir |
| Kart son kullanma hatası | Ay `01` ile `12` arası olmalı. Kart süresi dolmuş olmamalı. |
| Iframe `Geçersiz bandolf_token` | HMAC yanlış ortamın key veya salt'ı ile üretilmiş |

## Sonraki adımlar

- [Kimlik doğrulama](/docs/authentication)
- [Kanal seçimi](/docs/guides/choose-channel)
- [Direct ödeme oluştur](/docs/api/create-payment)
- [Checkout oturumu oluştur](/docs/api/create-checkout-session)
- [Iframe token al](/docs/api/get-token)
