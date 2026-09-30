import { useLayoutEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Seo } from '../components/Seo';
import { RegionStrip } from '../components/RegionStrip';
import { FiltersPanel, type Filters } from '../components/FiltersPanel';
import { PropertyGrid } from '../components/PropertyGrid';
import { CtaBanner } from '../components/CtaBanner';
import { Footer } from '../components/Footer';
import { useProperties } from '../context/PropertiesContext';
import { regions, type RegionId } from '../data/properties';
import { listingDescription, listingHeading, listingTitle } from '../lib/pageMeta';
import { absoluteAssetUrl, SITE_ORIGIN } from '../lib/site';

const initialFilters: Filters = {
  query: '',
  type: 'Todos',
  minPrice: 0,
  maxPrice: 3000000,
  bedrooms: 'qualquer',
  onlyNew: false,
};

export function HomePage() {
  const { hash } = useLocation();
  const { properties, loading } = useProperties();
  const [region, setRegion] = useState<RegionId>('todas');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cityLabel =
    region === 'todas'
      ? null
      : (regions.find((item) => item.id === region)?.label ?? null);
  const heading = listingHeading(filters.type, cityLabel);

  useLayoutEffect(() => {
    const sectionId = decodeURIComponent(hash.replace(/^#/, ''));
    if (!sectionId) return;

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (!section) return false;
      section.scrollIntoView({ block: 'start', inline: 'nearest' });
      return true;
    };

    scrollToSection();
    const frame = window.requestAnimationFrame(() => {
      scrollToSection();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      if (region !== 'todas' && property.region !== region) return false;
      if (filters.type !== 'Todos' && property.type !== filters.type) return false;
      if (property.price > filters.maxPrice) return false;
      if (filters.onlyNew && !property.featured) return false;
      if (filters.bedrooms !== 'qualquer') {
        const minBeds = Number(filters.bedrooms);
        if (property.bedrooms < minBeds) return false;
      }
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const haystack = [
          property.title,
          property.neighborhood,
          property.regionLabel,
          property.type,
          ...property.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [region, filters, properties]);

  return (
    <div className="app-shell">
      <Seo
        title={listingTitle(filters.type, cityLabel)}
        description={listingDescription(filters.type, cityLabel)}
        url={`${SITE_ORIGIN}/`}
        image={absoluteAssetUrl('/logo-brazvia.png')}
      />
      <Header onOpenFilters={() => setFiltersOpen(true)} />
      <Hero heading={heading} />
      <RegionStrip active={region} onChange={setRegion} />

      <section className="listings" id="imoveis">
        <div className="container listings-layout">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />

          <div className="listings-main">
            <div className="listings-head">
              <div>
                <h2>Imóveis disponíveis</h2>
                <p>
                  {loading && properties.length === 0
                    ? 'Carregando imóveis…'
                    : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`}
                </p>
              </div>
              <button
                type="button"
                className="btn-ghost mobile-only"
                onClick={() => setFiltersOpen(true)}
              >
                Abrir filtros
              </button>
            </div>
            <PropertyGrid items={filtered} loading={loading && properties.length === 0} />
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
