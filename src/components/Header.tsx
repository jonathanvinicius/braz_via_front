import { Link } from 'react-router-dom';
import { getBrokerWhatsAppLink, openWhatsApp } from '../data/properties';

type HeaderProps = {
  onOpenFilters?: () => void;
};

const BROKER_WHATSAPP_URL = getBrokerWhatsAppLink();

export function Header({ onOpenFilters }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/#topo" className="brand">
          <img src="/logo-mark.png" alt="" className="brand-mark" />
          <span className="brand-text">
            <strong>BRAZVIA</strong>
            <small>Negócios Imobiliários</small>
          </span>
        </Link>

        <nav className="header-nav" aria-label="Principal">
          <Link to="/#imoveis">Imóveis</Link>
          <Link to="/#regioes">Regiões</Link>
          <Link to="/#anunciar">Anunciar</Link>
          <Link to="/#contato">Contato</Link>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn-ghost" onClick={onOpenFilters}>
            Filtrar
          </button>
          <a
            className="btn-gold"
            href={BROKER_WHATSAPP_URL}
            onClick={(event) => {
              event.preventDefault();
              openWhatsApp();
            }}
          >
            Falar com corretor
          </a>
        </div>
      </div>
    </header>
  );
}
