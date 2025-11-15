import type { MetaFunction } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useLoaderData, useNavigation } from '@remix-run/react';
import TrustBadges from '../components/TrustBadges';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import SkeletonCard from '../components/SkeletonCard';
import HeroVideo from '../components/HeroVideo';
// BackgroundVariants removed per requirement: keep only Emerald Teal site-wide

export const meta: MetaFunction = () => ([
  { title: 'Kyrgyz State University — MATHWA Official Admissions' },
  { name: 'description', content: 'Official admissions representation for Kyrgyz State University (Arabaev KSU) via MATHWA.' },
]);

type FeaturedUniversity = {
  slug: string;
  name: string;
  hero_image_url?: string;
  overview?: string;
};
type University = FeaturedUniversity;

export async function loader() {
  try {
    // Prefer 4000 in dev unless PUBLIC_SERVER_BASE_URL is explicitly set
    const envBase = import.meta.env.PUBLIC_SERVER_BASE_URL as string | undefined;
    const apiBasePrimary = envBase ? envBase : 'http://localhost:4000';
    const apiBaseFallback = envBase ? 'http://localhost:4000' : 'http://localhost:4001';
    let res = await fetch(`${apiBasePrimary}/api/universities`).catch(() => null as any);
    if (!res || !res.ok) {
      res = await fetch(`${apiBaseFallback}/api/universities`).catch(() => null as any);
    }
    let resSettings = await fetch(`${apiBasePrimary}/api/site-settings`).catch(() => null as any);
    if (!resSettings || !resSettings.ok) {
      resSettings = await fetch(`${apiBaseFallback}/api/site-settings`).catch(() => null as any);
    }
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    const list = (data?.universities ?? []) as University[];
    const featured = list[0] ?? null;
    let settings = {
      hero_title: 'Study MBBS Abroad with Confidence',
      hero_subtitle: 'Transparent fees, visa assistance, and student housing.',
      hero_video_mp4_url: '',
      hero_video_webm_url: '',
      hero_video_poster_url: '',
    } as any;
    if (resSettings.ok) {
      const sj = await resSettings.json();
      settings = sj?.settings ?? settings;
    }
    return { featured, universities: list, settings } as { featured: FeaturedUniversity | null; universities: University[]; settings: any };
  } catch (e) {
    return { featured: null, universities: [], settings: null } as { featured: FeaturedUniversity | null; universities: University[]; settings: any };
  }
}

export default function Index() {
  const { featured, universities, settings } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';
  return (
    <div className="relative">
      {/* Hero Video */}
      <div className="px-4">
        <HeroVideo
          srcMp4={settings?.hero_video_mp4_url}
          srcWebm={settings?.hero_video_webm_url}
          poster={settings?.hero_video_poster_url}
          title={settings?.hero_title}
          subtitle={settings?.hero_subtitle}
          showTitleSubtitle={false}
          overlay="none"
          // Partner badge not required now; hide it
          showPartnerBadge={false}
        />
      </div>
      <section className="mt-8 px-4">
        <div className="max-w-5xl mx-auto">
          <TrustBadges />
        </div>
      </section>

      {/* Background theme variants removed */}

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Stats />
        </div>
      </section>

      {/* Universities list */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Explore Universities</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            )}
            {!isLoading && universities.length > 0 && (
              <>
                {universities.map((u) => (
                  <a key={u.slug} href={`/universities/${u.slug}`} className="block rounded-xl overflow-hidden border border-slate-200 hover:shadow transition-shadow">
                    <img
                      src={u.hero_image_url || ''}
                      alt={u.name}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-40 object-cover bg-gradient-to-br from-royalBlue/10 to-blue-100/20"
                      onError={(e) => {
                        // Fallback to official logo when hero image is missing to avoid white boxes
                        e.currentTarget.src = '/ksu-logo.png';
                        e.currentTarget.style.objectFit = 'contain';
                        e.currentTarget.style.padding = '8px';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    />
                    <div className="p-4">
                      <div className="font-semibold">{u.name}</div>
                      <p className="text-slate-600 text-sm mt-1">{u.overview ?? 'Government accredited MBBS program with affordable fees.'}</p>
                      <div className="mt-3 inline-block px-3 py-2 rounded-md bg-royalBlue text-white">View Details</div>
                    </div>
                  </a>
                ))}
              </>
            )}
            {!isLoading && universities.length === 0 && (
              <div className="glass rounded-xl p-6">
                <div className="font-semibold">Universities will appear here soon.</div>
                <p className="text-slate-600 text-sm mt-1">We are fetching live data. Please check back in a moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold">What students say</h2>
          <div className="mt-4">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-4">
            <FAQ />
          </div>
        </div>
      </section>
    </div>
  );
}
