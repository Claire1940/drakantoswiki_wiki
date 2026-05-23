"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Gift,
  Swords,
  UserRound,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
  moduleLinkMap: ModuleLinkMap;
}

const SECTION_IDS = [
  "release-date-and-beta-access",
  "codes-and-rewards",
  "beginner-guide",
  "heroes-guide",
  "hero-tier-list",
  "builds-and-skills-guide",
  "dungeons-and-missions-guide",
  "pvp-guide",
] as const;

export default function HomePageClient({ latestArticles, locale, moduleLinkMap }: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drakantoswiki.wiki";
  const heroImageUrl = new URL("/images/hero.webp", siteUrl).toString();
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const [missionExpanded, setMissionExpanded] = useState<number | null>(null);

  const getLocalizedHref = (href: string) => {
    if (locale === "en") return href;
    return `/${locale}${href}`;
  };

  const renderLinkedModuleTitle = (moduleKey: string, title: string) => {
    const link = moduleLinkMap[moduleKey];
    if (!link?.url) {
      return <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{title}</h2>;
    }

    return (
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <Link
          href={getLocalizedHref(link.url)}
          className="hover:text-[hsl(var(--nav-theme-light))] transition-colors underline-offset-4 hover:underline"
          title={link.title || title}
        >
          {title}
        </Link>
      </h2>
    );
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Drakantos Wiki",
        description:
          "Complete Drakantos Wiki covering heroes, builds, PvP maps, dungeons, artifacts, and beginner guides for the free-to-play pixel art MMORPG on Steam.",
        image: {
          "@type": "ImageObject",
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          caption: "Drakantos - Free-to-Play Pixel Art MMORPG",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Drakantos Wiki",
        alternateName: "Drakantos",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://drakantos.com/",
          "https://store.steampowered.com/app/2454980/Drakantos/",
          "https://discord.gg/drakantos",
          "https://x.com/PlayDrakantos",
          "https://www.youtube.com/@playdrakantos",
          "https://www.reddit.com/r/drakantos/",
        ],
      },
      {
        "@type": "VideoObject",
        name: "Drakantos | Official Gameplay Trailer",
        description:
          "Official Drakantos gameplay trailer showcasing heroes, PvP combat, dungeons, and MMO progression systems.",
        uploadDate: "2025-03-20",
        thumbnailUrl: heroImageUrl,
        embedUrl: "https://www.youtube.com/embed/CCXVQxJkBtQ",
        url: "https://www.youtube.com/watch?v=CCXVQxJkBtQ",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>
      <aside className="hidden xl:block fixed top-20 w-40 z-10" style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}>
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6">
              <WandSparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">{t.hero.title}</h1>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)] text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2454980/Drakantos/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 border border-border hover:bg-white/10 rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature videoId="CCXVQxJkBtQ" title="Drakantos | Official Gameplay Trailer" />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title} <span className="text-[hsl(var(--nav-theme-light))]">{t.tools.titleHighlight}</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">{t.tools.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <a
              href="#release-date-and-beta-access"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[0]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "0ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[0].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>
            <a
              href="#codes-and-rewards"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[1]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "50ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[1].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>
            <a
              href="#beginner-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[2]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "100ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[2].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>
            <a
              href="#heroes-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[3]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "150ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[3].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>
            <a
              href="#hero-tier-list"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[4]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "200ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[4].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>
            <a
              href="#builds-and-skills-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[5]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "250ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[5].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>
            <a
              href="#dungeons-and-missions-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[6]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "300ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[6].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>
            <a
              href="#pvp-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(SECTION_IDS[7]);
              }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
              style={{ animationDelay: "350ms" }}
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[7].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>
          </div>
        </div>
      </section>

      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} className="md:hidden" />
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} className="hidden md:flex" />

      <section id="release-date-and-beta-access" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosReleaseDateAndBetaAccess", t.modules.drakantosReleaseDateAndBetaAccess.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosReleaseDateAndBetaAccess.intro}</p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.drakantosReleaseDateAndBetaAccess.items.map((item: any, index: number) => (
              <div
                key={index}
                className="grid gap-4 rounded-xl border border-border bg-white/5 p-4 md:grid-cols-[auto_1fr] md:p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                  <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">{item.step}</span>
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold md:text-xl">{item.title}</h3>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1 text-xs">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground md:text-base">{item.description}</p>
                  <p className="mt-3 text-sm font-medium text-[hsl(var(--nav-theme-light))]">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} className="md:hidden" />
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} className="hidden md:flex" />

      <section id="codes-and-rewards" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosCodesAndRewards", t.modules.drakantosCodesAndRewards.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosCodesAndRewards.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.drakantosCodesAndRewards.items.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-5 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1">{item.status}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{item.label}</h3>
                <p className="text-sm font-semibold text-[hsl(var(--nav-theme-light))] mb-2">{item.code}</p>
                <p className="text-sm text-muted-foreground mb-3">{item.reward}</p>
                <p className="text-sm">{item.how_to_claim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosBeginnerGuide", t.modules.drakantosBeginnerGuide.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosBeginnerGuide.intro}</p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.drakantosBeginnerGuide.items.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-4 md:p-6 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] text-[hsl(var(--nav-theme-light))] font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
                <p className="mt-3 text-sm border-l-2 border-[hsl(var(--nav-theme)/0.4)] pl-3 text-[hsl(var(--nav-theme-light))]">{item.player_tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="heroes-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosHeroesGuide", t.modules.drakantosHeroesGuide.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosHeroesGuide.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.modules.drakantosHeroesGuide.items.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-5 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1">{item.archetype}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.hero}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.availability}</p>
                <p className="text-sm">{item.gameplay_note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hero-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosHeroTierList", t.modules.drakantosHeroTierList.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosHeroTierList.intro}</p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.drakantosHeroTierList.items.map((tier: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-4 md:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[hsl(var(--nav-theme))] px-3 py-1 text-xs font-semibold text-white">Tier {tier.tier}</span>
                  <h3 className="text-lg font-bold">{tier.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tier.heroes.map((hero: any, heroIndex: number) => (
                    <div key={heroIndex} className="rounded-lg border border-border bg-background/60 p-4">
                      <p className="font-semibold text-[hsl(var(--nav-theme-light))] mb-1">{hero.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{hero.bestFor.join(" | ")}</p>
                      <p className="text-sm text-muted-foreground">{hero.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="builds-and-skills-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosBuildsAndSkillsGuide", t.modules.drakantosBuildsAndSkillsGuide.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosBuildsAndSkillsGuide.intro}</p>
          </div>

          <div className="hidden md:block scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full">
              <thead className="bg-[hsl(var(--nav-theme)/0.15)]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Build Layer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">What It Changes</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">How To Use</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.drakantosBuildsAndSkillsGuide.items.map((row: any, index: number) => (
                  <tr key={index} className="border-t border-border bg-background/50">
                    <td className="px-4 py-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{row.buildLayer}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{row.whatItChanges}</td>
                    <td className="px-4 py-3 text-sm">{row.howToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden scroll-reveal space-y-3">
            {t.modules.drakantosBuildsAndSkillsGuide.items.map((row: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-4">
                <h3 className="font-semibold text-[hsl(var(--nav-theme-light))] mb-2">{row.buildLayer}</h3>
                <p className="text-sm text-muted-foreground mb-2">{row.whatItChanges}</p>
                <p className="text-sm">{row.howToUse}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dungeons-and-missions-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosDungeonsAndMissionsGuide", t.modules.drakantosDungeonsAndMissionsGuide.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosDungeonsAndMissionsGuide.intro}</p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.drakantosDungeonsAndMissionsGuide.items.map((item: any, index: number) => (
              <div key={index} className="overflow-hidden rounded-xl border border-border">
                <button
                  onClick={() => setMissionExpanded(missionExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{item.title}</span>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform ${missionExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {missionExpanded === index && <div className="px-5 pb-5 text-sm text-muted-foreground">{item.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {mobileBannerAd && <AdBanner type={mobileBannerAd.type} adKey={mobileBannerAd.adKey} className="md:hidden" />}

      <section id="pvp-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            {renderLinkedModuleTitle("drakantosPvpGuide", t.modules.drakantosPvpGuide.title)}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{t.modules.drakantosPvpGuide.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.drakantosPvpGuide.items.map((item: any, index: number) => (
              <div key={index} className="rounded-xl border border-border bg-white/5 p-5 hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3 flex items-center gap-2">
                  <Swords className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2 py-1">{item.type}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection title={t.faq.title} titleHighlight={t.faq.titleHighlight} subtitle={t.faq.subtitle} questions={t.faq.questions} />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection title={t.cta.title} description={t.cta.description} joinCommunity={t.cta.joinCommunity} joinGame={t.cta.joinGame} />
      </Suspense>

      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} className="md:hidden" />
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} className="hidden md:flex" />

      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">{t.footer.title}</h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://discord.gg/drakantos" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.discord}</a></li>
                <li><a href="https://x.com/PlayDrakantos" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.twitter}</a></li>
                <li><a href="https://www.youtube.com/@playdrakantos" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.youtube}</a></li>
                <li><a href="https://www.reddit.com/r/drakantos/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.reddit}</a></li>
                <li><a href="https://steamcommunity.com/app/2454980" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.steamCommunity}</a></li>
                <li><a href="https://store.steampowered.com/app/2454980/Drakantos/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.steamStore}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.about}</Link></li>
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.privacy}</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.terms}</Link></li>
                <li><Link href="/copyright" className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition">{t.footer.copyrightNotice}</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
