import { useEffect } from 'react';
import { generateSEOHead } from '@/utils/seo';

export interface SEOComponentProps {
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

export const SEO: React.FC<SEOComponentProps> = (props) => {
  useEffect(() => {
    const { metaTags, linkTags } = generateSEOHead(props);

    const existingMetaTags = document.querySelectorAll('meta[data-seo="true"]');
    existingMetaTags.forEach((tag) => tag.remove());

    const existingLinkTags = document.querySelectorAll('link[data-seo="true"]');
    existingLinkTags.forEach((tag) => tag.remove());

    metaTags.forEach((meta) => {
      const metaTag = document.createElement('meta');

      if (meta.property) {
        metaTag.setAttribute('property', meta.property);
      } else if (meta.name) {
        metaTag.setAttribute('name', meta.name);
      }

      metaTag.setAttribute('content', meta.content || '');
      metaTag.setAttribute('data-seo', 'true');
      document.head.appendChild(metaTag);
    });

    linkTags.forEach((link) => {
      const linkTag = document.createElement('link');
      linkTag.setAttribute('rel', link.rel);
      linkTag.setAttribute('href', link.href);
      linkTag.setAttribute('data-seo', 'true');
      document.head.appendChild(linkTag);
    });

    if (props.title) {
      document.title = `${props.title} - Silsilah Keluarga`;
    } else {
      document.title = 'Silsilah Keluarga';
    }

    return () => {
      const seoMetaTags = document.querySelectorAll('meta[data-seo="true"]');
      seoMetaTags.forEach((tag) => tag.remove());

      const seoLinkTags = document.querySelectorAll('link[data-seo="true"]');
      seoLinkTags.forEach((tag) => tag.remove());
    };
  }, [props]);

  return null;
};
