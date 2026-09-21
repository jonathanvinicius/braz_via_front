import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageCarousel } from '../components/ImageCarousel';
import { useProperties } from '../context/PropertiesContext';
import { formatPrice, getWhatsAppLink } from '../data/properties';

export function PropertyDetailPage() {
  const { slug } = useParams();
  const { getBySlug } = useProperties();
  const property = useMemo(
    () => (slug ? getBySlug(slug) : undefined),
    [slug, getBySlug],
  );
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [property?.id]);

  if (!property) {
    return (
      <div className="app-shell">
        <Header />
        <section className="container detail-missing">
          <h1>Imóvel não encontrado</h1>
          <Link to="/" className="btn-gold">
            Voltar para a vitrine
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const gallery = property.images.length ? property.images : [property.image];
  const savings =
    property.evaluatedPrice && property.evaluatedPrice > property.price
      ? property.evaluatedPrice - property.price
      : null;

  return (
    <div className="app-shell">
      <Header />

      <section className="detail-page">
        <div className="container">
          <Link to="/#imoveis" className="detail-back">
            ← Voltar aos imóveis
          </Link>

          <div className="detail-layout">
            <div className="detail-gallery">
              <ImageCarousel
                className="detail-carousel"
                images={gallery}
                alt={property.title}
                badge={property.featured ? 'Destaque' : undefined}
                index={activeImage}
                onIndexChange={setActiveImage}
              />
              <div className="detail-thumbs">
                {gallery.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    className={
                      index === activeImage
                        ? 'detail-thumb active'
                        : 'detail-thumb'
                    }
                    onClick={() => setActiveImage(index)}
                    aria-label={`Ver foto ${index + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="detail-summary">
              <p className="property-region">
                {property.regionLabel} · {property.neighborhood}
              </p>
              <h1>{property.headline ?? property.title}</h1>

              <div className="detail-price-block">
                <strong>{formatPrice(property.price)}</strong>
                {property.evaluatedPrice ? (
                  <span className="detail-evaluated">
                    Avaliado em {formatPrice(property.evaluatedPrice)}
                  </span>
                ) : null}
                {savings ? (
                  <span className="detail-savings">
                    {formatPrice(savings)} abaixo da avaliação
                  </span>
                ) : null}
              </div>

              <ul className="detail-quick">
                <li>{property.size} m² construídos</li>
                {property.lotSize ? <li>{property.lotSize} m² de terreno</li> : null}
                {property.bedrooms > 0 ? (
                  <li>
                    {property.bedrooms} quartos
                    {property.suites ? ` (${property.suites} suíte)` : ''}
                  </li>
                ) : null}
                {property.bathrooms > 0 ? (
                  <li>{property.bathrooms} banheiros</li>
                ) : null}
                {property.parking > 0 ? (
                  <li>{property.parking} vagas</li>
                ) : null}
                <li>{property.type}</li>
              </ul>

              <div className="detail-tags">
                {property.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="detail-actions">
                <a
                  className="btn-gold"
                  href={getWhatsAppLink(property)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar no WhatsApp
                </a>
                <a className="btn-outline dark" href="tel:+5562991518816">
                  Ligar agora
                </a>
              </div>
            </aside>
          </div>

          <div className="detail-body">
            <article>
              <h2>Sobre o imóvel</h2>
              <p>{property.description}</p>

              <h3>Detalhes</h3>
              <ul className="detail-highlights">
                {property.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <aside className="detail-cta-card">
              <h3>Agende uma visita</h3>
              <p>
                Entre em contato com a BRAZVIA para mais informações ou para
                agendar uma visita em {property.neighborhood}.
              </p>
              <a
                className="btn-gold"
                href={getWhatsAppLink(property)}
                target="_blank"
                rel="noreferrer"
              >
                Quero visitar
              </a>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
