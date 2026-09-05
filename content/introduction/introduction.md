---
title: Giriş
description: Bandolf ödeme orkestrasyon platformuna genel bakış ve geliştirici dokümantasyonuna giriş.
category: Başlangıç
slug: /docs/introduction
order: 1
featured: true
---

# Bandolf Dokümantasyonuna Hoş Geldiniz

**Ödeme altyapısının yeni katmanı** — Bandolf, işletmelerin farklı ödeme sağlayıcılarını tek bir altyapı üzerinden yönetmesini sağlayan yeni nesil **ödeme orkestrasyon platformudur**.

Bu dokümantasyon; API entegrasyonu, sandbox ortamı, webhook altyapısı, akıllı routing ve operasyon yönetimi için ihtiyaç duyacağınız tüm teknik kaynakları içerir.

> **Ödemeyi yeniden düşünün.** Tek entegrasyonla bankalar, ödeme kuruluşları, alternatif ödeme yöntemleri ve global sağlayıcılara bağlanın — kod tabanınızı her yeni sağlayıcı için baştan yazmanız gerekmez.

---

## Bandolf nedir?

Bandolf, merchant ile ödeme dünyası arasında **orchestration katmanı** olarak konumlanır. İşletmelerin ödeme süreçlerini yalnızca yönetmekle kalmaz; routing kuralları, failover, retry mekanizmaları ve sağlayıcı seçimi ile optimize eder.

```
Merchant  →  BANDOLF  →  Sağlayıcılar
              │
              ├── Bankalar & Sanal POS
              ├── Ödeme & E-Para Kuruluşları
              ├── Alternatif Ödeme Yöntemleri
              ├── Global Ödeme Yöntemleri
              └── Alışveriş Kredisi Çözümleri
```

**Tek entegrasyon. Çoklu ödeme altyapısı.**

| Katman | Rol |
|--------|-----|
| **Merchant** | Ödeme isteğini Bandolf API'sine gönderir |
| **Bandolf** | Routing, failover, retry ve sağlayıcı seçimini yönetir |
| **Sağlayıcılar** | Bankalar, PSP'ler, APM ve global ödeme kanalları |

> [!tip]
> Bandolf'un ürün vizyonu, çözümleri ve yol haritası hakkında daha fazla bilgi için [bandolf.com](https://bandolf.com) adresini ziyaret edin.

---

## Ödeme ağı

Bandolf ile **81+ entegrasyon** ve büyüyen bir ödeme ekosistemine tek API üzerinden erişin. Yeni bir sağlayıcı eklemek için kod tabanınızı baştan yazmanız gerekmez — panelden açın, routing kurallarınızı tanımlayın, canlıya alın.

:::tabs

:::tab Bankalar & Sanal POS
Türkiye'nin önde gelen bankalarının sanal POS altyapılarına Bandolf üzerinden bağlanın; kartlı tahsilatı tek panelden yönetin.

**17 sağlayıcı** — Akbank, Anadolubank, DenizBank, Fibabanka, Garanti BBVA, Halkbank, ING, Kuveyt Türk, QNB, TEB, Türkiye Finans, Türkiye İş Bankası, Vakıf Katılım, VakıfBank, Yapı Kredi, Ziraat Bankası, Ziraat Katılım.

:::tab Ödeme Kuruluşları
Elektronik para kuruluşları ve ödeme hizmeti sağlayıcıları (PSP) ile entegrasyon. Farklı lisans modellerine uygun tahsilat akışları.

:::tab Alternatif Ödeme
QR ödemeler, ödeme linkleri, hosted checkout ve APM kanalları. Müşterilerinize tercih ettikleri ödeme yöntemini sunun.

:::tab Global & Kredi
Global ödeme yöntemleri ve alışveriş kredisi çözümleri. Uluslararası ve yerel finansman seçeneklerini tek platformda birleştirin.

:::

> [!note]
> Gösterilen sağlayıcı listesi sürekli genişlemektedir. Detaylı entegrasyon durumu için [bandolf.com](https://bandolf.com) üzerinden ekibimizle iletişime geçin.

---

## Orchestration nasıl çalışır?

Bandolf, her ödeme isteğini tanımladığınız kurallara göre en uygun sağlayıcıya yönlendirir:

1. **İstek alınır** — Merchant, Bandolf API'sine ödeme isteği gönderir.
2. **Routing uygulanır** — Tanımlı kurallar (kart tipi, tutar, sağlayıcı durumu vb.) değerlendirilir.
3. **Sağlayıcı seçilir** — En uygun banka, PSP veya APM kanalı otomatik seçilir.
4. **Failover & retry** — Başarısızlık durumunda alternatif sağlayıcıya geçiş ve yeniden deneme.
5. **Sonuç bildirilir** — Webhook ve API yanıtı ile merchant bilgilendirilir.

> [!warning]
> Canlı ortamda işlem yapmadan önce [Sandbox](/docs/development/sandbox) ortamında entegrasyonunuzu test etmenizi öneririz.

---

## Platform yetenekleri

Bandolf, fintech altyapısından operasyon yönetimine kadar geniş bir platform sunar:

| Alan | Özellikler |
|------|------------|
| **Ödemeler** | Ödeme oluşturma, iade, iptal, durum takibi |
| **Akıllı Yönlendirme** | Routing kuralları, failover, retry, sağlayıcı seçimi |
| **Sağlayıcı Yönetimi** | POS, credential ve sağlayıcı durumu yönetimi |
| **Dolandırıcılık** | Kurallar, kara/beyaz liste, kart parmak izi |
| **Ödeme Deneyimi** | Payment form, hosted checkout, QR, ödeme linkleri |
| **Pazaryeri** | Alt merchant, split payment, komisyon, settlement |
| **İzleme** | Başarı oranları, downtime, uyarılar |
| **Güvenlik** | PCI-DSS, webhook doğrulama, kimlik doğrulama |

---

## Dokümantasyonda neler var?

Bu site, Bandolf ile entegrasyon sürecinizde ihtiyaç duyacağınız tüm teknik kaynakları sunar:

- **[Hızlı Başlangıç](/docs/quickstart)** — İlk API çağrınızı dakikalar içinde yapın
- **[Temel Kavramlar](/docs/concepts)** — Payment, provider, routing ve webhook kavramları
- **[Kimlik Doğrulama](/docs/authentication)** — API anahtarları ve güvenli istek imzalama
- **[API Referansı](/docs/api)** — Endpoint'ler, parametreler ve hata kodları
- **[Webhook'lar](/docs/webhooks)** — Olay tipleri ve gerçek zamanlı bildirimler
- **[Sandbox](/docs/development/sandbox)** — Test ortamı ve entegrasyon doğrulama

---

## Sonraki adımlar

Ödeme altyapısının yeni işletim sistemini inşa ediyoruz. Bugün Bandolf, ödeme sağlayıcılarını tek bir altyapıda birleştiriyor; yarın ise işletmelerin ödeme süreçlerini optimize eden, öğrenen ve ölçeklendiren global bir **payment infrastructure platformu** olmayı hedefliyor.

> [!tip]
> Entegrasyona hemen başlamak için [Hızlı Başlangıç](/docs/quickstart) rehberini takip edin. API anahtarınızı almak ve sandbox ortamında ilk ödemenizi oluşturmak 10 dakikadan kısa sürer.

**Ödemelerin geleceğini birlikte inşa edelim.**
