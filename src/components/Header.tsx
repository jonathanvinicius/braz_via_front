type HeaderProps = {
  onOpenFilters?: () => void;
};

export function Header({ onOpenFilters }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#topo" className="brand">
          <img src="/logo-mark.png" alt="" className="brand-mark" />
          <span className="brand-text">
            <strong>BRAZVIA</strong>
            <small>Negócios Imobiliários</small>
          </span>
        </a>

        <nav className="header-nav" aria-label="Principal">
          <a href="#imoveis">Imóveis</a>
          <a href="#regioes">Regiões</a>
          <a href="#anunciar">Anunciar</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn-ghost" onClick={onOpenFilters}>
            Filtrar
          </button>
          <a className="btn-gold" href="#contato">
            Falar com corretor
          </a>
        </div>
      </div>
    </header>
  );
}
