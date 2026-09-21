---
title: Merchant paneli
description: Üye işyeri arayüzünün menüleri, roller ve güvenlik akışı.
category: Operasyon ve Araçlar
slug: /docs/guides/merchant-panel
order: 6
---

# Merchant paneli

Host: `https://app.bandolf.com`. Path öneki `/user`.

Bu panel günlük operasyon içindir. API entegrasyonunun yerine geçmez.

## Giriş

1. `/user/login` e-posta ve şifre
2. `/user/login/verify` e-posta kodu
3. 2FA açıksa TOTP
4. Merchant ataması yoksa içeride ilerleyemezsiniz

Şifre unuttum: `/user/forgot-password`. Davet: `/user/invitations/{token}/register`.

Dil: `/user` altında locale değiştirilir. Desteklenen diller panelde listelenir.

## Ana menü

| Bölüm | Path | İş |
|-------|------|-----|
| Özet | `/user/` | Dashboard |
| POS sağlayıcıları | `/user/pos/providers` | Credential, aç/kapa |
| POS izleme | `/user/pos/monitoring` | Skor, kesinti, alarm |
| İşlemler | `/user/payments/transactions` | Order ve payment detay, iptal, iade |
| İadeler | `/user/payments/refunds` | İade listesi |
| Raporlar | `/user/payments/reports` | Özet ve export job |
| Linkler | `/user/payments/links` | Ödeme linki CRUD |
| Fraud listeler | `/user/fraud/lists` | White/gray/black |
| Fraud kurallar | `/user/fraud/rules` | Kural ağacı, simülasyon |
| API anahtarları | `/user/developer/api-keys` | Test/live key |
| Sandbox | `/user/developer/sandbox` | Test işlem detayı |
| Entegrasyonlar | `/user/developer/integrations` | Katalog (hazır e-ticaret vizyonu) |
| Profil | `/user/profile` | Ad, avatar |
| Güvenlik | `/user/security` | Şifre, 2FA, giriş logları |
| Mağaza ayarı | `/user/merchant/settings` | Unvan, vergi, logo |
| Ekip | `/user/merchant/team` | Davet ve üye silme |

Birden fazla merchant'ınız varsa panelden bağlam değiştirirsiniz.

## Roller

Atama sahip veya yönetici tarafından yapılır.

Geliştirici API anahtarı üretir. Finans iade bakar. Salt okunur değişiklik yapamaz.

## Güvenlik sayfası

Şifre değişimi e-posta kodu ister. 2FA açmak da e-posta onayı + TOTP kodu ister.

Giriş denemeleri güvenlik sayfasındaki kayıtlarda görünür.

## Coming soon

`/user/coming-soon/{page}` henüz yazılmamış menü öğeleri içindir.

## API anahtarı UI notları

Secret tam metin yalnızca oluşturulduğu anda görünür. Sonra `sk_test_••••••••••••` maskesi vardır. Salt benzer şekilde maskelenir. Kaybettiyseniz yeni anahtar üretin. Eski anahtarı pasifleştirin. Aktif tavan 5'tir.
