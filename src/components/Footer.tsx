import { getBrokerWhatsAppLink, openWhatsApp } from '../data/properties';

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-grid">
        <div>
          <img src="/logo-brazvia.png" alt="BRAZVIA" className="footer-logo" />
          <p>Mais que imóveis, novos caminhos.</p>
        </div>
        <div>
          <h4>Contato</h4>
          <p>Anápolis · Goiás</p>
          <p>
            <a
              href={getBrokerWhatsAppLink()}
              onClick={(event) => {
                event.preventDefault();
                openWhatsApp();
              }}
            >
              (62) 99151-8816
            </a>
          </p>
          <p>contato@brazvia.com.br</p>
        </div>
        <div>
          <h4>Regiões</h4>
          <p>Anápolis</p>
          <p>Goiânia</p>
          <p>Brasília</p>
          <p>Caldas Novas · Rio Quente</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <small>© {new Date().getFullYear()} BRAZVIA Negócios Imobiliários</small>
        <a href="/admin" className="footer-admin-link">
          Área administrativa
        </a>
      </div>
    </footer>
  );
}
