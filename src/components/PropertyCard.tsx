import { Link } from 'react-router-dom';
import { formatPrice, type Property } from '../data/properties';
import { ImageCarousel } from './ImageCarousel';

type Props = {
  property: Property;
};

export function PropertyCard({ property }: Props) {
  const images = property.images?.length ? property.images : [property.image];

  return (
    <article className="property-card">
      <div className="property-media">
        <ImageCarousel
          images={images}
          alt={property.title}
          badge={property.featured ? 'Destaque' : undefined}
        />
      </div>
      <Link to={`/imovel/${property.slug}`} className="property-card-link">
        <div className="property-body">
          <p className="property-region">
            {property.regionLabel} · {property.neighborhood}
          </p>
          <h3>{property.title}</h3>
          <ul className="property-meta">
            <li>{property.size} m²</li>
            {property.bedrooms > 0 ? <li>{property.bedrooms} quartos</li> : null}
            {property.bathrooms > 0 ? (
              <li>{property.bathrooms} banheiros</li>
            ) : null}
            <li>{property.type}</li>
          </ul>
          <div className="property-foot">
            <strong>{formatPrice(property.price)}</strong>
            <span className="btn-outline compact">Ver detalhes</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
