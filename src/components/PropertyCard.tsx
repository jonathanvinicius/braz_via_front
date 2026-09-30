import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertiesContext';
import { formatPrice, type Property } from '../data/properties';
import { propertyImageAlt } from '../lib/pageMeta';
import { ImageCarousel } from './ImageCarousel';

type Props = {
  property: Property;
};

export function PropertyCard({ property }: Props) {
  const { publicSlug } = useProperties();
  const images = property.images?.length ? property.images : [property.image];
  const imageAlt = propertyImageAlt(property);

  return (
    <article className="property-card">
      <div className="property-media">
        <ImageCarousel
          images={images}
          alt={imageAlt}
          badge={property.featured ? 'Destaque' : undefined}
        />
      </div>
      <Link to={`/imovel/${publicSlug(property)}`} className="property-card-link">
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
