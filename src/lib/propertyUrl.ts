import type { Property } from '../data/properties';
import { slugify } from './propertyStore';

export function publicSlugMap(catalog: Property[]) {
  const used = new Set<string>();
  const map = new Map<string, string>();
  const ordered = [...catalog].sort((left, right) => left.id.localeCompare(right.id));

  for (const property of ordered) {
    const type = slugify(property.type) || 'imovel';
    const city = slugify(property.regionLabel || property.region) || 'cidade';
    const compact = property.id.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'imovel';
    let length = Math.min(4, compact.length);
    let candidate = `${type}-${city}-${compact.slice(0, length)}`;

    while (used.has(candidate) && length < compact.length) {
      length += 1;
      candidate = `${type}-${city}-${compact.slice(0, length)}`;
    }

    let extra = 2;
    while (used.has(candidate)) {
      candidate = `${type}-${city}-${compact}-${extra}`;
      extra += 1;
    }

    used.add(candidate);
    map.set(property.id, candidate);
  }

  return map;
}

export function findPropertyByRouteKey(
  catalog: Property[],
  slugs: Map<string, string>,
  key: string,
) {
  let decoded = key;
  try {
    decoded = decodeURIComponent(key);
  } catch {
    decoded = key;
  }

  const byPublicSlug = catalog.find((item) => slugs.get(item.id) === decoded);
  if (byPublicSlug) return byPublicSlug;

  const byId = catalog.find((item) => item.id === decoded);
  if (byId) return byId;

  return catalog.find((item) => item.slug === decoded);
}
