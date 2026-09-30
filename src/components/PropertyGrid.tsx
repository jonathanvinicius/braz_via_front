import type { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';

type Props = {
  items: Property[];
  loading?: boolean;
};

export function PropertyGrid({ items, loading = false }: Props) {
  if (loading && items.length === 0) {
    return (
      <div className="empty-state" aria-busy="true" aria-live="polite">
        <p>Carregando imóveis…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nenhum imóvel encontrado</h3>
        <p>Ajuste os filtros ou escolha outra região.</p>
      </div>
    );
  }

  return (
    <div className="property-grid">
      {items.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
