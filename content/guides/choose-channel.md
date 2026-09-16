---
title: Kanal seçimi
description: Direct API, hosted checkout, iframe ve ödeme linki arasında karar verin.
category: Guides
slug: /docs/guides/choose-channel
order: 1
featured: true
---

# Kanal seçimi

Dört kanal aynı sağlayıcı katmanına çıkar. Fark, kartın nerede girdiği ve sizin yazdığınız kod miktarıdır.

## Karar tablosu

| Soru | Direct API | Hosted checkout | Iframe | Ödeme linki |
|------|------------|-----------------|--------|-------------|
| Kart mağaza sunucusuna gelir mi? | Evet | Hayır | Hayır | Hayır |
| PCI yükü | Yüksek | Düşük | Düşük | Düşük |
| Özel ödeme UI | Tam kontrol | BANDOLF sayfası | Kendi sayfada iframe | BANDOLF sayfası |
| Kimlik | Bearer secret | Bearer secret | HMAC | Panel (API yok) |
| Kayıt tablosu | `payments` | `payment_sessions` + `payments` | `orders` (+ sonra payment) | `payment_links` + session + payment |
| En iyi olduğu yer | Mobil uygulama, mevcut PCI ortamı | E-ticaret, hızlı entegrasyon | PayTR'den geçiş, gömülü form | WhatsApp, saha, kod yazmayan ekip |

## Direct API'yi ne zaman seçin

- Kart UI'niz zaten var.
- Native mobil SDK kartı sizin backend'inize gönderiyor.
- Taksit ve BIN kararını kendi ekranınızda göstermek istiyorsunuz.
- PCI DSS süreciniz kart verisini işlemeye uygun.

Gitmeyin eğer kartı tarayıcıdan doğrudan BANDOLF'e değil de log'a yazıyorsanız. Kartı loglamayın.

Rehber: [Direct ödemeler](/docs/guides/direct-payments). Endpoint: [Ödeme oluştur](/docs/api/create-payment).

## Hosted checkout'u ne zaman seçin

- En hızlı ve en az PCI'lı yol istiyorsunuz.
- Müşteriyi BANDOLF domain'ine yönlendirmek sorun değil.
- Satır, kargo, indirim ve KDV özetini BANDOLF'un hesaplamasını istiyorsunuz.
- Fatura adresi toplamak istiyorsunuz.

Müşteri `https://api.bandolf.com/pay/{id}` sayfasını görür. Marka adı merchant kaydından gelir.

Rehber: [Hosted checkout](/docs/guides/hosted-checkout). Endpoint: [Oturum oluştur](/docs/api/create-checkout-session).

## Iframe'i ne zaman seçin

- Müşteri sizin domain'inizde kalsın istiyorsunuz.
- PayTR iframe entegrasyonunuz var. URL ve key değiştirerek geçeceksiniz.
- Kart BANDOLF'ta girilsin ama sayfa sizin checkout'unuzun içinde dursun.

Token'ı sunucuda alın. Iframe `src` değerine `/odeme/guvenli/{token}` koyun.

Rehber: [Iframe](/docs/guides/iframe). Endpoint: [Token al](/docs/api/get-token).

## Ödeme linkini ne zaman seçin

- Yazılım ekibiniz yok veya bu satış kanalı API kullanmıyor.
- Tutarı siz belirliyorsunuz. Müşteri linke tıklıyor.
- QR veya mesaj ile tahsilat.

Link panelden üretilir. Public REST create endpoint'i yoktur.

Rehber: [Ödeme linkleri](/docs/guides/payment-links).

## Ortak kurallar

Hangi kanalı seçerseniz seçin:

1. `order_id` / `merchant_oid` merchant içinde tekil olsun.
2. En az bir aktif POS bağlayın veya `provider_id` verin.
3. Success ve failure URL'leri HTTPS olsun.
4. Stok ve sipariş onayını yalnızca güvenilir bir sunucu sinyaline bağlayın. Müşteri success URL'sini kendisi açabilir. Outbound webhook henüz yoktur. Onay için `GET /api/v1/payments/{id}` veya panel kaydına bakın.

## Kanalları karıştırmayın

Aynı `order_id` ile hem checkout oturumu hem Direct ödeme açmayın. Tablolar ayrıdır ama operasyon karışır. Iframe `merchant_oid` de ayrı alandır. Üç kanalda da aynı sipariş numarasını kullanabilirsiniz. Yine de her kanal kendi tekillik kontrolünü yapar.
