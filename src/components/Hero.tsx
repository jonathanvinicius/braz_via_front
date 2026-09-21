export function Hero() {
  return (
    <section className="hero" id="topo">
      <div className="hero-media" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt=""
        />
        <div className="hero-scrim" />
      </div>

      <div className="container hero-content">
        <img
          src="/logo-brazvia.png"
          alt="BRAZVIA Negócios Imobiliários"
          className="hero-logo"
        />
        <p className="hero-tagline">Mais que imóveis, novos caminhos</p>
        <h1>Encontre o imóvel certo na região certa.</h1>
        <p className="hero-lead">
          Plataforma de vendas por região — Anápolis, Goiânia, Brasília e
          interior goiano — com curadoria BRAZVIA.
        </p>
        <div className="hero-cta">
          <a className="btn-gold" href="#imoveis">
            Ver imóveis
          </a>
          <a className="btn-outline" href="#regioes">
            Explorar por região
          </a>
        </div>
      </div>
    </section>
  );
}
