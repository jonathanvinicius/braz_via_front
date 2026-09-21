import {
  properties as seedProperties,
  regions,
  type Property,
  type RegionId,
} from '../data/properties';

const STORAGE_KEY = 'brazvia.properties.v1';

export type PropertyInput = Omit<Property, 'id' | 'slug' | 'regionLabel' | 'image'> & {
  id?: string;
  slug?: string;
  image?: string;
};

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export function regionLabelFromId(region: Exclude<RegionId, 'todas'>) {
  return regions.find((item) => item.id === region)?.label ?? region;
}

function readStorage(): Property[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Property[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadProperties(): Property[] {
  return readStorage() ?? structuredClone(seedProperties);
}

export function saveProperties(items: Property[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createPropertyId() {
  return `prop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeProperty(input: PropertyInput, existing?: Property): Property {
  const title = input.title.trim();
  const images = (input.images ?? []).filter(Boolean);
  const image = input.image || images[0] || existing?.image || '';
  const region = input.region;
  const baseSlug = input.slug?.trim() || slugify(title) || createPropertyId();

  return {
    id: existing?.id ?? input.id ?? createPropertyId(),
    slug: baseSlug,
    title,
    region,
    regionLabel: regionLabelFromId(region),
    neighborhood: input.neighborhood.trim(),
    size: Number(input.size) || 0,
    lotSize: input.lotSize ? Number(input.lotSize) : undefined,
    bedrooms: Number(input.bedrooms) || 0,
    bathrooms: Number(input.bathrooms) || 0,
    suites: input.suites ? Number(input.suites) : undefined,
    parking: Number(input.parking) || 0,
    price: Number(input.price) || 0,
    evaluatedPrice: input.evaluatedPrice
      ? Number(input.evaluatedPrice)
      : undefined,
    type: input.type,
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    image,
    images: images.length ? images : image ? [image] : [],
    featured: Boolean(input.featured),
    headline: input.headline?.trim() || undefined,
    description: input.description.trim(),
    highlights: input.highlights.map((item) => item.trim()).filter(Boolean),
    whatsappMessage: input.whatsappMessage?.trim() || undefined,
  };
}

export function resetPropertiesToSeed() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(seedProperties);
}
