import { formatPrice, type Property } from '../data/properties';
import { absoluteAssetUrl, canonicalPropertyUrl, SITE_NAME } from './site';

const TYPE_PLURAL: Record<string, string> = {
  Casa: 'Casas',
  Apartamento: 'Apartamentos',
  Cobertura: 'Coberturas',
  Terreno: 'Terrenos',
  Comercial: 'Imóveis comerciais',
};

const REGION_STATE: Record<string, string> = {
  anapolis: 'GO',
  goiania: 'GO',
  brasilia: 'DF',
  'caldas-novas': 'GO',
  'rio-quente': 'GO',
};

export function listingHeading(type: string, cityLabel: string | null) {
  const kind = type && type !== 'Todos' ? (TYPE_PLURAL[type] ?? type) : 'Imóveis';
  const place = cityLabel?.trim() || 'Anápolis e região';
  return `${kind} à venda em ${place}`;
}

export function listingTitle(type: string, cityLabel: string | null) {
  return `${listingHeading(type, cityLabel)} | ${SITE_NAME}`;
}

export function listingDescription(type: string, cityLabel: string | null) {
  const place = cityLabel?.trim() || 'Anápolis e região';
  if (!type || type === 'Todos') {
    return `Casas e imóveis à venda em ${place}. Seleção da ${SITE_NAME} Negócios Imobiliários.`;
  }
  return `${listingHeading(type, cityLabel)}. Seleção da ${SITE_NAME} Negócios Imobiliários.`;
}

export function propertyHeading(property: Property) {
  const type = property.type?.trim();
  const city = property.regionLabel?.trim();
  const neighborhood = property.neighborhood?.trim();
  if (type && neighborhood && city) {
    return `${type} à venda em ${neighborhood}, ${city}`;
  }
  if (type && city) return `${type} à venda em ${city}`;
  if (type) return `${type} à venda`;
  return property.headline?.trim() || property.title;
}

export function propertyDocumentTitle(property: Property) {
  if (property.type?.trim() && property.regionLabel?.trim()) {
    return `${property.type.trim()} à venda em ${property.regionLabel.trim()} | ${SITE_NAME}`;
  }
  return `${property.title} | ${SITE_NAME}`;
}

export function propertyMetaDescription(property: Property) {
  const where = [property.neighborhood?.trim(), property.regionLabel?.trim()]
    .filter(Boolean)
    .join(', ');
  const lead =
    property.type?.trim() && where
      ? `${property.type.trim()} à venda em ${where}.`
      : property.title;
  const size = property.size ? ` ${property.size} m².` : '';
  const price = property.price ? ` ${formatPrice(property.price)}.` : '';
  const text = `${lead}${size}${price} ${SITE_NAME} Negócios Imobiliários.`;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).trimEnd()}...`;
}

export function propertyImageAlt(property: Property) {
  const type = property.type?.trim();
  const neighborhood = property.neighborhood?.trim();
  const city = property.regionLabel?.trim();
  if (type && neighborhood && city) return `${type} em ${neighborhood}, ${city}`;
  if (type && city) return `${type} em ${city}`;
  if (type && neighborhood) return `${type} em ${neighborhood}`;
  return property.title;
}

export function propertyJsonLd(property: Property, publicSlug: string) {
  const url = canonicalPropertyUrl(publicSlug);
  const images = (property.images?.length ? property.images : [property.image])
    .filter(Boolean)
    .map((src) => absoluteAssetUrl(src));
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
  };
  if (property.regionLabel) address.addressLocality = property.regionLabel;
  const state = REGION_STATE[property.region];
  if (state) address.addressRegion = state;
  if (property.neighborhood) address.streetAddress = property.neighborhood;

  const listing: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: propertyHeading(property),
    description: property.description?.trim() || propertyMetaDescription(property),
    url,
    address,
    offers: {
      '@type': 'Offer',
      price: String(property.price),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url,
    },
  };
  if (images.length) listing.image = images;
  return listing;
}
