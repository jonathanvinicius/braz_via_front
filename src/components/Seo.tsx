import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
  jsonLd?: unknown;
  robots?: string;
};

const LISTING_JSONLD_ID = 'brazvia-listing-jsonld';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function upsertJsonLd(id: string, serialized: string) {
  const existing = document.getElementById(id);
  if (!serialized) {
    existing?.remove();
    return;
  }
  const script = existing ?? document.createElement('script');
  script.id = id;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = serialized;
  if (!existing) document.head.appendChild(script);
}

export function Seo({
  title,
  description,
  url,
  image,
  jsonLd,
  robots = 'index, follow',
}: SeoProps) {
  const serializedJsonLd = jsonLd == null ? '' : JSON.stringify(jsonLd);

  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', 'pt_BR');
    upsertMeta('property', 'og:site_name', 'Brazvia');
    upsertMeta('property', 'og:image', image ?? '');
    upsertCanonical(url);
    upsertJsonLd(LISTING_JSONLD_ID, serializedJsonLd);
  }, [title, description, url, image, robots, serializedJsonLd]);

  return null;
}
