import { setRequestLocale } from 'next-intl/server'
import { getLatestArticles } from '@/lib/getLatestArticles'
import type { Language } from '@/lib/content'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drakantoswiki.wiki'
  const url = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`
  const title = 'Drakantos Wiki - Heroes, PvP Maps & Builds'
  const description =
    'Drakantos Wiki with heroes, PvP maps, builds, dungeons, artifacts, orbs, quests, housing, market tips, beta updates, and beginner guides for Steam players.'
  const image = new URL('/images/hero.webp', siteUrl).toString()

  return {
    title,
    description,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'Drakantos Wiki',
      images: [
        {
          url: image,
          width: 1920,
          height: 1080,
          alt: 'Drakantos Wiki - Heroes, PvP Maps, and Builds',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)
  return <HomePageClient latestArticles={latestArticles} locale={locale} moduleLinkMap={moduleLinkMap} />
}
