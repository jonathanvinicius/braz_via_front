import { getBrokerWhatsAppLink, openWhatsApp } from '../data/properties';

const ANNOUNCE_MESSAGE = 'Olá! Quero anunciar meu imóvel na BRAZVIA.';

export function CtaBanner() {
  return (
    <section className="cta-banner" id="anunciar">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">Para proprietários e corretores</p>
          <h2>Anuncie seu imóvel na BRAZVIA</h2>
          <p>
            Alcance compradores por região com vitrine premium, filtros
            inteligentes e acompanhamento comercial.
          </p>
        </div>
        <a
          className="btn-gold"
          href={getBrokerWhatsAppLink(ANNOUNCE_MESSAGE)}
          onClick={(event) => {
            event.preventDefault();
            openWhatsApp(ANNOUNCE_MESSAGE);
          }}
        >
          Quero anunciar
        </a>
      </div>
    </section>
  );
}
