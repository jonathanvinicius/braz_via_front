import type { Property } from '../data/properties';

const STORAGE_KEY = 'brazvia.properties.list';
const MAX_AGE_MS = 604800000;

type StoredPropertyList = {
  savedAt: number;
  properties: Property[];
};

function isPropertyList(value: unknown): value is Property[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Property).id === 'string' &&
        typeof (item as Property).slug === 'string',
    )
  );
}

export function readPropertyList(): Property[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredPropertyList;
    if (!stored || typeof stored.savedAt !== 'number') return null;
    if (Date.now() - stored.savedAt > MAX_AGE_MS) return null;
    if (!isPropertyList(stored.properties)) return null;
    return stored.properties;
  } catch {
    return null;
  }
}

export function writePropertyList(properties: Property[]) {
  const payload: StoredPropertyList = {
    savedAt: Date.now(),
    properties,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
