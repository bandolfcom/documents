---
title: Iframe entegrasyonu
description: HMAC ile token alın ve BANDOLF ödeme sayfasını iframe içine gömün.
category: Ödeme Entegrasyonu
slug: /docs/guides/iframe
order: 4
---

# Iframe entegrasyonu

Iframe kanalında kart mağaza sunucusuna gelmez. Siz sipariş ve müşteri bilgilerini HMAC ile gönderirsiniz. BANDOLF token üretir. Müşteri BANDOLF sayfasında kartını girer.

Sözleşme PayTR iframe 1. adımıyla uyumludur. PayTR entegrasyonunuz varsa URL, merchant_id, key ve salt değişir. Hash formülü aynı kalır.

## Kimlik bilgileri

| PayTR adı | BANDOLF karşılığı |
|-----------|-------------------|
| `merchant_id` | `merchants.id` (sayısal, string gönderin) |
| `merchant_key` | API `secret_key` (`sk_test_` veya `sk_live_`) |
| `merchant_salt` | API `salt_key` |

`test_mode=1` test anahtarını kullanır. `0` live anahtarı kullanır. Yanlış çift `Geçersiz bandolf_token.` üretir.

Public `pk_` anahtarı HMAC'de yoktur.

## HMAC

```
hash_str =
  merchant_id + user_ip + merchant_oid + email + payment_amount
  + user_basket + no_installment + max_installment + currency + test_mode

bandolf_token = base64( HMAC-SHA256( hash_str + salt, secret_key ) )
```

Kurallar:

- Alanlar gönderilen string haliyle birleşir. JSON `true` göndermeyin. `"1"` ve `"0"` kullanın.
- `user_basket` decode edilmeden hash'e girer.
- `payment_amount` kuruştur. `9.99 TL` -> `999`. Hash'e `"999"` girer.
- `currency` hash'e sizin gönderdiğiniz değerle girer. `TL` gönderdiyseniz `TL` hash'lenir. BANDOLF içeride `TRY` saklar.
- Alan adı `bandolf_token` olsun. `paytr_token` da kabul edilir.

Token'ı hesapladıktan sonra sepeti yeniden encode etmeyin. Aynı string'i POST edin.

## Tutar

```
TL tutar * 100 = payment_amount
10.50 -> 1050
9.99  -> 999
1     -> 100
```

Kuruşu mağaza yuvarlar. Tam sayı gönderin.

## Sepet

```php
base64_encode(json_encode([
    ["Ürün adı", "18.00", 1],
    ["Ürün adı 2", "33.25", 2],
], JSON_UNESCAPED_UNICODE));
```

Satır fiyatı TL string'dir. `payment_amount` tüm siparişin kuruş toplamıdır. Nesne biçimi `{name, price, quantity}` da çözülür.

## Endpoint

```
POST https://api.bandolf.com/api/get-token
Content-Type: application/x-www-form-urlencoded
```

JSON da kabul edilir. Hash kaymasını önlemek için form-urlencoded kullanın. Authorization header yoktur.

## Başarı

HTTP çoğu zaman `200`'dür. `status` alanına bakın.

```json
{
  "status": "success",
  "token": "64karakterurlsafe"
}
```

Token'ı iframe'e koyun.

```html
<iframe
  src="https://api.bandolf.com/odeme/guvenli/TOKEN"
  id="bandolf-iframe"
  style="width: 100%; border: 0;"
></iframe>
```

Süre `timeout_limit` dakikadır. Varsayılan 30, aralık 1-1440. Süre dolunca sayfa hata verir.

## Hata

```json
{
  "status": "failed",
  "reason": "Geçersiz bandolf_token."
}
```

Doğrulama `errors` nesnesi dönmez. İlk mesaj `reason` içindedir.

| reason | Anlam |
|--------|-------|
| `merchant_id zorunludur.` | Eksik alan |
| `payment_amount kuruş cinsinden tam sayı olmalıdır.` | Tutar kuruş değil |
| `Geçersiz merchant_id.` | Sayısal değil |
| `Mağaza bulunamadı veya aktif değil.` | Id yok veya pasif |
| `Bu ortam için aktif API anahtarı bulunamadı.` | test_mode ile eşleşen key yok |
| `Geçersiz bandolf_token.` | HMAC uyuşmuyor |
| `Ödeme sağlayıcısı yapılandırılmamış.` | Desteklenen POS yok |
| `Bu merchant_oid ile zaten bir sipariş kaydı mevcut.` | Tekillik |

## Sağlayıcı seçimi

İstekte `provider_id` yoktur. BANDOLF otomatik seçer. Sıra: aktif, desteklenen, credential'lı, `sort_order`.

## ok ve fail URL

`merchant_ok_url` ve `merchant_fail_url` müşteriyi bilgilendirir. Kullanıcı bu URL'leri elle açabilir. Sipariş onayı için kullanmayın. Outbound bildirim henüz yoktur. Onayı panel veya kendi stok kilidinizle yapın. Token sonrası ödeme oluştuysa Direct payment kaydını sandbox ekranından görebilirsiniz.

## PHP örneği

```php
<?php

$merchant_id   = '1';
$merchant_key  = getenv('BANDOLF_SECRET_KEY');
$merchant_salt = getenv('BANDOLF_SALT_KEY');

$email          = 'musteri@example.com';
$payment_amount = (string) (int) round(9.99 * 100);
$merchant_oid   = 'ORD-' . date('YmdHis') . '-' . bin2hex(random_bytes(3));
$user_name      = 'Ada Yılmaz';
$user_address   = 'Test Mahallesi No:1 İstanbul';
$user_phone     = '05555555555';
$merchant_ok_url  = 'https://magaza.example.com/odeme-basarili';
$merchant_fail_url = 'https://magaza.example.com/odeme-hata';

$user_basket = base64_encode(json_encode([
    ['Studio Kablosuz Kulaklık', '9.99', 1],
], JSON_UNESCAPED_UNICODE));

$user_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
if (str_contains((string) $user_ip, ',')) {
    $user_ip = trim(explode(',', (string) $user_ip)[0]);
}

$no_installment  = '0';
$max_installment = '0';
$currency        = 'TL';
$test_mode       = '1';

$hash_str = $merchant_id . $user_ip . $merchant_oid . $email . $payment_amount
    . $user_basket . $no_installment . $max_installment . $currency . $test_mode;

$bandolf_token = base64_encode(hash_hmac('sha256', $hash_str . $merchant_salt, $merchant_key, true));

$post = [
    'merchant_id'       => $merchant_id,
    'user_ip'           => $user_ip,
    'merchant_oid'      => $merchant_oid,
    'email'             => $email,
    'payment_amount'    => $payment_amount,
    'bandolf_token'     => $bandolf_token,
    'user_basket'       => $user_basket,
    'no_installment'    => $no_installment,
    'max_installment'   => $max_installment,
    'user_name'         => $user_name,
    'user_address'      => $user_address,
    'user_phone'        => $user_phone,
    'merchant_ok_url'   => $merchant_ok_url,
    'merchant_fail_url' => $merchant_fail_url,
    'timeout_limit'     => '30',
    'currency'          => $currency,
    'test_mode'         => $test_mode,
    'debug_on'          => '1',
];

$ch = curl_init('https://api.bandolf.com/api/get-token');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $post,
    CURLOPT_TIMEOUT        => 20,
]);
$raw = curl_exec($ch);
curl_close($ch);
$result = json_decode((string) $raw, true);
if (($result['status'] ?? '') !== 'success') {
    throw new RuntimeException($result['reason'] ?? $raw);
}
$token = $result['token'];
```

## Python örneği

```python
import base64, hashlib, hmac, json, os, time
from uuid import uuid4
import requests

merchant_id = "1"
merchant_key = os.environ["BANDOLF_SECRET_KEY"]
merchant_salt = os.environ["BANDOLF_SALT_KEY"]

payment_amount = str(int(round(9.99 * 100)))
merchant_oid = f"ORD-{int(time.time())}-{uuid4().hex[:6]}"
user_ip = "1.2.3.4"
email = "musteri@example.com"
user_basket = base64.b64encode(
    json.dumps([["Studio Kablosuz Kulaklık", "9.99", 1]], ensure_ascii=False, separators=(",", ":")).encode()
).decode()
no_installment = "0"
max_installment = "0"
currency = "TL"
test_mode = "1"

hash_str = (
    merchant_id + user_ip + merchant_oid + email + payment_amount
    + user_basket + no_installment + max_installment + currency + test_mode
)
bandolf_token = base64.b64encode(
    hmac.new(merchant_key.encode(), (hash_str + merchant_salt).encode(), hashlib.sha256).digest()
).decode()

payload = {
    "merchant_id": merchant_id,
    "user_ip": user_ip,
    "merchant_oid": merchant_oid,
    "email": email,
    "payment_amount": payment_amount,
    "bandolf_token": bandolf_token,
    "user_basket": user_basket,
    "no_installment": no_installment,
    "max_installment": max_installment,
    "user_name": "Ada Yılmaz",
    "user_address": "Test Mahallesi No:1 İstanbul",
    "user_phone": "05555555555",
    "merchant_ok_url": "https://magaza.example.com/odeme-basarili",
    "merchant_fail_url": "https://magaza.example.com/odeme-hata",
    "timeout_limit": "30",
    "currency": currency,
    "test_mode": test_mode,
}
body = requests.post("https://api.bandolf.com/api/get-token", data=payload, timeout=20).json()
if body.get("status") != "success":
    raise RuntimeError(body.get("reason"))
print(body["token"])
```

`json.dumps` varsayılanı boşluk ekler. Hash sepetin base64 haline bakar. Token hesapladıktan sonra aynı `user_basket` string'ini POST edin.

## Node.js örneği

```javascript
import crypto from 'node:crypto';

const merchantId = '1';
const merchantKey = process.env.BANDOLF_SECRET_KEY;
const merchantSalt = process.env.BANDOLF_SALT_KEY;
const paymentAmount = String(Math.round(9.99 * 100));
const merchantOid = `ORD-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
const userIp = '1.2.3.4';
const email = 'musteri@example.com';
const userBasket = Buffer.from(JSON.stringify([['Studio Kablosuz Kulaklık', '9.99', 1]]), 'utf8').toString('base64');
const noInstallment = '0';
const maxInstallment = '0';
const currency = 'TL';
const testMode = '1';

const hashStr =
  merchantId + userIp + merchantOid + email + paymentAmount +
  userBasket + noInstallment + maxInstallment + currency + testMode;

const bandolfToken = crypto.createHmac('sha256', merchantKey).update(hashStr + merchantSalt).digest('base64');

const body = new URLSearchParams({
  merchant_id: merchantId,
  user_ip: userIp,
  merchant_oid: merchantOid,
  email,
  payment_amount: paymentAmount,
  bandolf_token: bandolfToken,
  user_basket: userBasket,
  no_installment: noInstallment,
  max_installment: maxInstallment,
  user_name: 'Ada Yılmaz',
  user_address: 'Test Mahallesi No:1 İstanbul',
  user_phone: '05555555555',
  merchant_ok_url: 'https://magaza.example.com/odeme-basarili',
  merchant_fail_url: 'https://magaza.example.com/odeme-hata',
  timeout_limit: '30',
  currency,
  test_mode: testMode,
});

const result = await fetch('https://api.bandolf.com/api/get-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body,
}).then((r) => r.json());

if (result.status !== 'success') {
  throw new Error(result.reason);
}
console.log(result.token);
```

## Checklist

- Test key + salt ile `test_mode=1` token alınıyor.
- Yanlış salt `Geçersiz bandolf_token.` veriyor.
- Aynı `merchant_oid` ikinci kez reddediliyor.
- `payment_amount` kuruş.
- `user_ip` hash ve body'de aynı.
- Panelde desteklenen bir POS var.
- Iframe `src` API host'unu gösteriyor (`api.bandolf.com`, app host değil).
