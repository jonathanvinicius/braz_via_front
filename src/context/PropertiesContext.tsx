import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Property } from '../data/properties';
import { api } from '../lib/api';
import { readPropertyList, writePropertyList } from '../lib/propertyListCache';
import { findPropertyByRouteKey, publicSlugMap } from '../lib/propertyUrl';
import type { PropertyInput } from '../lib/propertyStore';

type PropertiesContextValue = {
  properties: Property[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  getBySlug: (slug: string) => Property | undefined;
  publicSlug: (property: Property) => string;
  getById: (id: string) => Property | undefined;
  createProperty: (input: PropertyInput) => Promise<Property>;
  updateProperty: (id: string, input: PropertyInput) => Promise<Property>;
  reorderProperties: (ids: string[]) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
};


function sortByOrder(items: Property[]) {
  return [...items].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

const PropertiesContext = createContext<PropertiesContextValue | null>(null);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const storedList = useRef(readPropertyList());
  const [properties, setProperties] = useState<Property[]>(
    () => storedList.current ?? [],
  );
  const [loading, setLoading] = useState(storedList.current === null);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setError('');
    if (storedList.current === null) setLoading(true);
    try {
      const data = await api<Property[]>('/properties');
      if (!Array.isArray(data)) {
        throw new Error('Erro ao carregar imóveis');
      }
      const next = sortByOrder(data);
      setProperties(next);
      writePropertyList(next);
      storedList.current = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const publicSlugs = useMemo(() => publicSlugMap(properties), [properties]);

  const value = useMemo<PropertiesContextValue>(
    () => ({
      properties,
      loading,
      error,
      refresh,
      getBySlug: (slug) => findPropertyByRouteKey(properties, publicSlugs, slug),
      publicSlug: (property) => publicSlugs.get(property.id) ?? property.slug,
      getById: (id) => properties.find((item) => item.id === id),
      createProperty: async (input) => {
        const created = await api<Property>('/properties', {
          method: 'POST',
          body: JSON.stringify(input),
        });
        setProperties((current) => [created, ...current]);
        return created;
      },
      updateProperty: async (id, input) => {
        const updated = await api<Property>(`/properties/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        });
        setProperties((current) =>
          sortByOrder(current.map((item) => (item.id === id ? updated : item))),
        );
        return updated;
      },
      reorderProperties: async (ids) => {
        const updated = await api<Property[]>('/properties/reorder', {
          method: 'PUT',
          body: JSON.stringify({ ids }),
        });
        setProperties(sortByOrder(updated));
      },
      deleteProperty: async (id) => {
        await api<void>(`/properties/${id}`, { method: 'DELETE' });
        setProperties((current) => current.filter((item) => item.id !== id));
      },
    }),
    [properties, publicSlugs, loading, error, refresh],
  );

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx) {
    throw new Error('useProperties must be used within PropertiesProvider');
  }
  return ctx;
}
