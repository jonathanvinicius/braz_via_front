import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImageCarousel } from '../components/ImageCarousel';
import { Seo } from '../components/Seo';
import { useProperties } from '../context/PropertiesContext';
import { formatPrice, getWhatsAppLink } from '../data/properties';
import {
  propertyDocumentTitle,
  propertyHeading,
  propertyImageAlt,
  propertyJsonLd,
  propertyMetaDescription,
} from '../lib/pageMeta';
import { absoluteAssetUrl, canonicalPropertyUrl, sharePropertyUrl, SITE_ORIGIN } from '../lib/site';

export function PropertyDetailPage() {
  const { slug } = useParams();
  const { getBySlug, publicSlug, loading } = useProperties();
  const property = slug ? getBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === 'function';

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const image = document.querySelector('.detail-gallery img');
    if (!(image instanceof HTMLElement)) return;
    if (image.getBoundingClientRect().top >= window.innerHeight) {
      image.scrollIntoView({ block: 'start' });
    }
  }, [slug]);

  useEffect(() => {
    setActiveImage(0);
    setCopied(false);
  }, [property?.id]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (loading && !property) {
    return (
      <div className="app-shell">
        <Seo
          title="Imóvel | Brazvia"
          description="Carregando o anúncio na Brazvia."
          url={`${SITE_ORIGIN}/`}
        />
        <Header />
        <section className="container detail-missing">
          <h1>Carregando imóvel</h1>
        </section>
        <Footer />
      </div>
    );
  }

  if (!property || !slug) {
    return (
      <div className="app-shell">
        <Seo
          title="Imóvel não encontrado | Brazvia"
          description="Este anúncio não está disponível na Brazvia."
          url={`${SITE_ORIGIN}/`}
          robots="noindex, follow"
        />
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

  const code = publicSlug(property);
  if (slug !== code) {
    return <Navigate to={`/imovel/${code}`} replace />;
  }

  const gallery = property.images.length ? property.images : [property.image];
  const imageAlt = propertyImageAlt(property);
  const heading = propertyHeading(property);
  const headline = property.headline?.trim();
  const shareUrl = sharePropertyUrl(code);
  const canonicalUrl = canonicalPropertyUrl(code);
  const whatsappHref = getWhatsAppLink(property, shareUrl);
  const photo = gallery.find(Boolean);
  const savings =
    property.evaluatedPrice && property.evaluatedPrice > property.price
      ? property.evaluatedPrice - property.price
      : null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const shareLink = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: propertyDocumentTitle(property),
        text: heading,
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await copyLink();
    }
  };

  return (
    <div className="app-shell">
      <Seo
        title={propertyDocumentTitle(property)}
        description={propertyMetaDescription(property)}
        url={canonicalUrl}
        image={photo ? absoluteAssetUrl(photo) : undefined}
        jsonLd={propertyJsonLd(property, code)}
      />
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
                alt={imageAlt}
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
                    <img src={src} alt={`${imageAlt}, foto ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <aside className="detail-summary">
              <p className="property-region">
                {property.regionLabel} · {property.neighborhood}
              </p>
              <h1>{heading}</h1>
              {headline && headline !== heading ? (
                <p className="detail-headline">{headline}</p>
              ) : null}

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
                  href={whatsappHref}
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.assign(whatsappHref);
                  }}
                >
                  Falar com corretor
                </a>
                <a className="btn-outline dark" href="tel:+5562991518816">
                  Ligar agora
                </a>
                <button type="button" className="btn-outline dark" onClick={() => void copyLink()}>
                  {copied ? 'Link copiado' : 'Copiar link'}
                </button>
                {canShare ? (
                  <button type="button" className="btn-outline dark" onClick={() => void shareLink()}>
                    Compartilhar
                  </button>
                ) : null}
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
                href={whatsappHref}
                onClick={(event) => {
                  event.preventDefault();
                  window.location.assign(whatsappHref);
                }}
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
