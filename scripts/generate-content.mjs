#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contentDir = join(__dirname, '..', 'content')

function loremBody(title) {
  return `# ${title}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Test Başlığı 1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Test Başlığı 2

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Test Başlığı 3

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
}

const pageDefinitions = [
  { file: 'introduction/introduction.md', slug: '/docs/introduction', title: 'Giriş', category: 'Başlangıç' },
  { file: 'introduction/quickstart.md', slug: '/docs/quickstart', title: 'Hızlı Başlangıç', category: 'Başlangıç' },
  { file: 'introduction/concepts.md', slug: '/docs/concepts', title: 'Temel Kavramlar', category: 'Başlangıç' },
  { file: 'introduction/authentication.md', slug: '/docs/authentication', title: 'Kimlik Doğrulama', category: 'Başlangıç' },
  { file: 'payments/overview.md', slug: '/docs/payments', title: 'Ödemeler', category: 'Ödemeler' },
  { file: 'payments/create-payment.md', slug: '/docs/payments/create-payment', title: 'Ödeme Oluşturma', category: 'Ödemeler', type: 'api', method: 'POST', endpoint: '/v1/payments' },
  { file: 'payments/payment-status.md', slug: '/docs/payments/payment-status', title: 'Ödeme Durumu', category: 'Ödemeler' },
  { file: 'payments/refunds.md', slug: '/docs/payments/refunds', title: 'İadeler', category: 'Ödemeler' },
  { file: 'payments/cancellation.md', slug: '/docs/payments/cancellation', title: 'İptal', category: 'Ödemeler' },
  { file: 'payments/payment-methods.md', slug: '/docs/payments/payment-methods', title: 'Ödeme Yöntemleri', category: 'Ödemeler' },
  { file: 'routing/overview.md', slug: '/docs/routing', title: 'Yönlendirme Genel Bakış', category: 'Akıllı Yönlendirme' },
  { file: 'routing/rules.md', slug: '/docs/routing/rules', title: 'Yönlendirme Kuralları', category: 'Akıllı Yönlendirme' },
  { file: 'routing/provider-selection.md', slug: '/docs/routing/provider-selection', title: 'Sağlayıcı Seçimi', category: 'Akıllı Yönlendirme' },
  { file: 'routing/retry.md', slug: '/docs/routing/retry', title: 'Ödeme Tekrar Deneme', category: 'Akıllı Yönlendirme' },
  { file: 'routing/failover.md', slug: '/docs/routing/failover', title: 'Yedekleme (Failover)', category: 'Akıllı Yönlendirme' },
  { file: 'providers/management.md', slug: '/docs/providers/management', title: 'Sağlayıcı Yönetimi', category: 'Sağlayıcılar' },
  { file: 'providers/pos.md', slug: '/docs/providers/pos', title: 'POS Yönetimi', category: 'Sağlayıcılar' },
  { file: 'providers/credentials.md', slug: '/docs/providers/credentials', title: 'Sağlayıcı Kimlik Bilgileri', category: 'Sağlayıcılar' },
  { file: 'providers/status.md', slug: '/docs/providers/status', title: 'Sağlayıcı Durumu', category: 'Sağlayıcılar' },
  { file: 'fraud/overview.md', slug: '/docs/fraud', title: 'Dolandırıcılık Genel Bakış', category: 'Dolandırıcılık' },
  { file: 'fraud/rules.md', slug: '/docs/fraud/rules', title: 'Dolandırıcılık Kuralları', category: 'Dolandırıcılık' },
  { file: 'fraud/blacklists.md', slug: '/docs/fraud/blacklists', title: 'Kara Listeler', category: 'Dolandırıcılık' },
  { file: 'fraud/whitelists.md', slug: '/docs/fraud/whitelists', title: 'Beyaz Listeler', category: 'Dolandırıcılık' },
  { file: 'fraud/graylists.md', slug: '/docs/fraud/graylists', title: 'Gri Listeler', category: 'Dolandırıcılık' },
  { file: 'fraud/card-fingerprints.md', slug: '/docs/fraud/card-fingerprints', title: 'Kart Parmak İzleri', category: 'Dolandırıcılık' },
  { file: 'fraud/ip-rules.md', slug: '/docs/fraud/ip-rules', title: 'IP Kuralları', category: 'Dolandırıcılık' },
  { file: 'experience/payment-links.md', slug: '/docs/experience/payment-links', title: 'Ödeme Linkleri', category: 'Ödeme Deneyimi' },
  { file: 'experience/qr-payments.md', slug: '/docs/experience/qr-payments', title: 'QR Ödemeler', category: 'Ödeme Deneyimi' },
  { file: 'experience/payment-form.md', slug: '/docs/experience/payment-form', title: 'Ödeme Formu', category: 'Ödeme Deneyimi' },
  { file: 'experience/hosted-checkout.md', slug: '/docs/experience/hosted-checkout', title: 'Barındırılan Ödeme', category: 'Ödeme Deneyimi' },
  { file: 'experience/apm.md', slug: '/docs/experience/apm', title: 'Alternatif Ödeme Yöntemleri', category: 'Ödeme Deneyimi' },
  { file: 'cards/tokenization.md', slug: '/docs/cards/tokenization', title: 'Tokenizasyon', category: 'Kartlar' },
  { file: 'cards/saved-cards.md', slug: '/docs/cards/saved-cards', title: 'Kayıtlı Kartlar', category: 'Kartlar' },
  { file: 'cards/recurring.md', slug: '/docs/cards/recurring', title: 'Tekrarlayan Ödemeler', category: 'Kartlar' },
  { file: 'marketplace/overview.md', slug: '/docs/marketplace', title: 'Pazaryeri', category: 'Pazaryeri' },
  { file: 'marketplace/sub-merchants.md', slug: '/docs/marketplace/sub-merchants', title: 'Alt Satıcılar', category: 'Pazaryeri' },
  { file: 'marketplace/split-payments.md', slug: '/docs/marketplace/split-payments', title: 'Bölünmüş Ödemeler', category: 'Pazaryeri' },
  { file: 'marketplace/commission.md', slug: '/docs/marketplace/commission', title: 'Komisyon', category: 'Pazaryeri' },
  { file: 'marketplace/payouts.md', slug: '/docs/marketplace/payouts', title: 'Ödemeler (Payout)', category: 'Pazaryeri' },
  { file: 'marketplace/settlement.md', slug: '/docs/marketplace/settlement', title: 'Mutabakat', category: 'Pazaryeri' },
  { file: 'banking/bank-transfer.md', slug: '/docs/banking/bank-transfer', title: 'Banka Transferi Takibi', category: 'Bankacılık' },
  { file: 'monitoring/overview.md', slug: '/docs/monitoring', title: 'İzleme', category: 'İzleme' },
  { file: 'monitoring/alerts.md', slug: '/docs/monitoring/alerts', title: 'Uyarılar', category: 'İzleme' },
  { file: 'monitoring/success-rates.md', slug: '/docs/monitoring/success-rates', title: 'Başarı Oranları', category: 'İzleme' },
  { file: 'monitoring/downtime.md', slug: '/docs/monitoring/downtime', title: 'Kesinti', category: 'İzleme' },
  { file: 'api/overview.md', slug: '/docs/api', title: 'API Genel Bakış', category: 'API' },
  { file: 'api/authentication.md', slug: '/docs/api/authentication', title: 'API Kimlik Doğrulama', category: 'API' },
  { file: 'api/errors.md', slug: '/docs/api/errors', title: 'API Hataları', category: 'API' },
  { file: 'webhooks/overview.md', slug: '/docs/webhooks', title: 'Webhook\'lar', category: 'API' },
  { file: 'webhooks/events.md', slug: '/docs/webhooks/events', title: 'Webhook Olayları', category: 'API' },
  { file: 'development/sdks.md', slug: '/docs/development/sdks', title: 'SDK\'lar', category: 'Geliştirme' },
  { file: 'development/sandbox.md', slug: '/docs/development/sandbox', title: 'Sandbox', category: 'Geliştirme' },
  { file: 'development/testing.md', slug: '/docs/development/testing', title: 'Test', category: 'Geliştirme' },
  { file: 'development/integrations.md', slug: '/docs/development/integrations', title: 'E-ticaret Entegrasyonları', category: 'Geliştirme' },
  { file: 'security/overview.md', slug: '/docs/security', title: 'Güvenlik', category: 'Güvenlik' },
  { file: 'security/pci-dss.md', slug: '/docs/security/pci-dss', title: 'PCI DSS', category: 'Güvenlik' },
  { file: 'security/webhooks.md', slug: '/docs/security/webhooks', title: 'Webhook Güvenliği', category: 'Güvenlik' },
  { file: 'resources/changelog.md', slug: '/docs/changelog', title: 'Değişiklik Günlüğü', category: 'Kaynaklar' },
  { file: 'resources/status.md', slug: '/status', title: 'Sistem Durumu', category: 'Kaynaklar', sidebar: false },
  { file: 'resources/faq.md', slug: '/docs/faq', title: 'SSS', category: 'Kaynaklar' },
]

const featuredSlugs = ['/docs/quickstart', '/docs/api', '/docs/payments', '/docs/fraud', '/docs/webhooks']

for (const [index, page] of pageDefinitions.entries()) {
  const filePath = join(contentDir, page.file)
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const description = `Lorem ipsum — ${page.title} test içeriği.`
  let frontmatter = `---\ntitle: ${page.title}\ndescription: ${description}\ncategory: ${page.category}\nslug: ${page.slug}\norder: ${index + 1}\n`

  if (featuredSlugs.includes(page.slug)) frontmatter += 'featured: true\n'
  if (page.sidebar === false) frontmatter += 'sidebar: false\n'
  if (page.type) frontmatter += `type: ${page.type}\n`
  if (page.method) frontmatter += `method: ${page.method}\n`
  if (page.endpoint) frontmatter += `endpoint: ${page.endpoint}\n`
  frontmatter += '---\n\n'

  writeFileSync(filePath, frontmatter + loremBody(page.title))
}

console.log(`${pageDefinitions.length} lorem ipsum içerik dosyası oluşturuldu.`)
