export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  noIndex?: boolean;
}

export const generateSEOHead = (props: SEOProps) => {
  const {
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    robots,
    noIndex,
  } = props;

  const fullTitle = title ? `${title} - Silsilah Keluarga` : 'Silsilah Keluarga';
  const fullDescription = description || 'Temukan dan jelajahi silsilah keluarga Anda dengan mudah dan aman.';
  const fullKeywords = keywords ? [...keywords, 'silsilah', 'keluarga', 'genealogi', 'riwayat keluarga'].join(', ') : 'silsilah, keluarga, genealogi, riwayat keluarga';
  
  const metaTags = [
    // Basic SEO
    { name: 'title', content: fullTitle },
    { name: 'description', content: fullDescription },
    { name: 'keywords', content: fullKeywords },
    { name: 'robots', content: noIndex ? 'noindex, nofollow' : robots || 'index, follow' },
    
    // Open Graph
    { property: 'og:title', content: ogTitle || fullTitle },
    { property: 'og:description', content: ogDescription || fullDescription },
    { property: 'og:image', content: ogImage || '/og-image.jpg' },
    { property: 'og:url', content: ogUrl || window.location.href },
    { property: 'og:type', content: ogType },
    { property: 'og:site_name', content: 'Silsilah Keluarga' },
    
    // Twitter Card
    { name: 'twitter:card', content: twitterCard },
    { name: 'twitter:title', content: twitterTitle || fullTitle },
    { name: 'twitter:description', content: twitterDescription || fullDescription },
    { name: 'twitter:image', content: twitterImage || ogImage || '/og-image.jpg' },
  ];

  const linkTags = [];
  if (canonical) {
    linkTags.push({ rel: 'canonical', href: canonical });
  }

  return { metaTags, linkTags };
};

export const getDefaultSEO = (): SEOProps => ({
  title: 'Silsilah Keluarga',
  description: 'Temukan dan jelajahi silsilah keluarga Anda dengan mudah dan aman.',
  keywords: ['silsilah', 'keluarga', 'genealogi', 'riwayat keluarga', 'pohon keluarga'],
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

export const getPersonSEO = (personName: string, personDetails?: string): SEOProps => ({
  title: `${personName} - Silsilah Keluarga`,
  description: personDetails || `Informasi tentang ${personName} dalam silsilah keluarga.`,
  keywords: [personName, 'profil keluarga', 'silsilah', 'keluarga', 'riwayat'],
  ogType: 'profile',
  ogTitle: personName,
  ogDescription: personDetails || `Profil ${personName} dalam silsilah keluarga.`,
  twitterTitle: personName,
  twitterDescription: personDetails || `Profil ${personName} dalam silsilah keluarga.`,
});

export const getTreeSEO = (): SEOProps => ({
  title: 'Pohon Keluarga - Silsilah Keluarga',
  description: 'Jelajahi pohon keluarga dan hubungan keluarga secara interaktif.',
  keywords: ['pohon keluarga', 'silsilah', 'hubungan keluarga', 'interaktif', 'visualisasi'],
  ogType: 'website',
  ogTitle: 'Pohon Keluarga - Silsilah Keluarga',
  ogDescription: 'Jelajahi pohon keluarga dan hubungan keluarga secara interaktif.',
  twitterTitle: 'Pohon Keluarga - Silsilah Keluarga',
  twitterDescription: 'Jelajahi pohon keluarga dan hubungan keluarga secara interaktif.',
});