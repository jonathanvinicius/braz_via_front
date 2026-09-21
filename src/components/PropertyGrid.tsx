import type { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';

type Props = {
  items: Property[];
};

export function PropertyGrid({ items }: Props) {
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
