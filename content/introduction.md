---
title: BANDOLF nedir
description: BANDOLF ödeme orkestrasyon platformunun geliştirici tanıtımı.
category: Getting Started
slug: /docs
order: 1
featured: true
---

# BANDOLF nedir

BANDOLF, üye işyerinin (merchant) tek bir entegrasyonla birden fazla ödeme kanalını yönetmesini sağlayan ödeme geçidi ve orkestrasyon platformudur.

Merchant bir kez BANDOLF'e bağlanır. Sonra anlaşmalı olduğu banka sanal POS'ları, ödeme kuruluşları, elektronik para kuruluşları ve alternatif ödeme yöntemleriyle ayrı ayrı entegrasyon yazmak zorunda kalmaz. Yeni bir POS veya sağlayıcı eklemek, ilgili bilgilerin panele girilmesiyle yapılır.

Bu dokümantasyon, BANDOLF API'sini anlatır. Hedef kitle mağaza geliştiricileri ve entegrasyon ekipleridir.

## Ne işe yarar

BANDOLF üç işi aynı anda yapar.

1. Ödemeyi alır. Kart verisini, 3D Secure adımını ve sağlayıcı cevabını yönetir.
2. Ödemeyi doğru sağlayıcıya yönlendirir. Merchant'ın bağlı POS'ları arasından seçim yapar.
3. Risk, izleme, rapor ve operasyonu tek panelde toplar.

Merchant kendi sitesinde BANDOLF'ü çağırır. BANDOLF, Garanti BBVA, VakıfBank, PayTR veya BANDOLF Sandbox gibi bağlı bir sağlayıcıya gider. Sonuç merchant'a standart bir JSON veya hosted sayfa olarak döner.

## Ürünün üç yüzeyi

BANDOLF üç ayrı host üzerinden çalışır. Her hostun görevi farklıdır.

| Yüzey | Örnek adres | Kim kullanır |
|-------|-------------|--------------|
| API | `https://api.bandolf.com` | Mağaza sunucusu, checkout sayfaları, banka callback'leri |
| Merchant paneli | `https://app.bandolf.com` | Üye işyeri ekibi |
| Kök domain | `https://bandolf.com` | Merchant panele yönlendirme |

## Ödeme alma kanalları

Bugün çalışan dört kanal vardır.

### Direct API

Mağaza sunucusu kart bilgilerini BANDOLF'e gönderir. Endpoint: `POST /api/v1/payments`. Kimlik: secret API anahtarı. PCI yükümlülüğü mağaza tarafında yükselir. Çünkü kart mağaza sunucusundan geçer.

### Hosted checkout

Mağaza bir ödeme oturumu açar. Endpoint: `POST /api/v1/checkout-sessions`. Müşteri BANDOLF ödeme sayfasına gider. Kart BANDOLF formunda girilir. Mağaza kartı görmez.

### Iframe

Mağaza HMAC ile token alır. Endpoint: `POST /api/get-token`. Müşteri `/odeme/guvenli/{token}` sayfasında kartını girer. Sözleşme PayTR iframe 1. adımıyla uyumludur.

### Ödeme linki

Kod yazmadan ödeme alınır. Link merchant panelinden üretilir. Müşteri ` /pay/link/{token}` adresine gider. WhatsApp, Instagram ve saha satışı için uygundur.

## Bugün çalışan özellikler

Aşağıdaki başlıklar bugün kullanılabilir.

- Merchant paneli
- Test ve live API anahtarları
- Direct ödeme API'si
- Hosted checkout oturumu
- Iframe token ve güvenli ödeme sayfası
- Ödeme linki
- 3D Secure yönlendirme
- Garanti BBVA (GVP), VakıfBank, PayTR, BANDOLF Sandbox
- İptal ve iade (panel üzerinden, desteklenen sağlayıcılarda)
- Fraud listeleri ve fraud kuralları
- POS izleme ve alarm
- Form ve iletişim formu API'si
- Sistem health endpoint'leri
- Rapor dışa aktarma
- Sandbox ve test mağazası

## Henüz yayınlanmayan özellikler

Ürün vizyonunda olup henüz sunulmayan başlıklar şunlardır.

- Merchant'a giden outbound webhook (`payment.succeeded` gibi olaylar)
- Kart tokenization ve kayıtlı kart
- Kapalı devre cüzdan
- Akıllı routing ve retry'nin tam ürün hali
- Katalogdaki diğer POS sağlayıcıları
- Açık kaynak SDK paketleri

Dokümantasyon mevcut davranışı anlatır. Planlanan özellikler "henüz yok" diye işaretlenir. Böylece yanlış beklenti oluşmaz.

## Desteklenen ödeme sağlayıcıları

Gateway kodu yazılmış sağlayıcılar:

| Sağlayıcı | POS altyapısı | Direct | 3DS / callback | Iframe |
|-----------|---------------|--------|----------------|--------|
| PayTR | `PAYTR_GATEWAY` | Var | Webhook var | Var |
| VakıfBank | `VAKIFBANK_VIRTUAL_POS` | Var | 3DS redirect var | Var |
| Garanti BBVA | `GVP` | Var | 3DS callback var | Var |
| BANDOLF Sandbox | `BANDOLF_SANDBOX` | Var | 3DS sayfası var | Var |

Katalogda kayıtlı başka bankalar ve kuruluşlar vardır. Onlar için entegrasyon henüz açılmamıştır. Desteklenmeyen altyapı reddedilir.

## Kimlik modeli

Merchant, BANDOLF'te bir üye işyeridir. Kullanıcılar merchant'a rol ile bağlanır. API anahtarları merchant'a aittir.

Anahtar türleri:

| Anahtar | Önek | Kullanım |
|---------|------|----------|
| Public test | `pk_test_` | İstemci tarafı işaretleme. Direct API'de yetki vermez. |
| Secret test | `sk_test_` | Direct API ve checkout. Iframe HMAC anahtarı. |
| Public live | `pk_live_` | Canlı ortam public anahtarı |
| Secret live | `sk_live_` | Canlı ortam secret anahtarı |

Iframe HMAC'i için ek bir `salt_key` üretilir. Salt, secret ile birlikte yalnızca sunucuda tutulur.

Bir merchant'ın en fazla 5 aktif anahtarı olabilir.

## Dil ve para birimi

API hata mesajları Türkçedir. Panel arayüzü Türkçedir. Merchant paneli ayrıca İngilizce, Almanca, İspanyolca, Fransızca, Japonca, Korece, Rusça ve Çince dil dosyalarına sahiptir.

Desteklenen para birimleri `TRY`, `USD` ve `EUR` içerir. Direct API `TL` kodunu da kabul eder ve `TRY` olarak saklar.

## Bu dokümantasyonu nasıl okumalısınız

1. [Hızlı başlangıç](/docs/quickstart) ile ilk isteği atın.
2. [Kavramlar](/docs/concepts) ile terimleri öğrenin.
3. [Kanal seçimi](/docs/guides/choose-channel) ile Direct, hosted veya iframe kararını verin.
4. İlgili API sayfasındaki istek ve yanıt örneklerini kopyalayın.
