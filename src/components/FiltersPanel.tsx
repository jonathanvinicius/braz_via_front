type Filters = {
  query: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  onlyNew: boolean;
};

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
  open: boolean;
  onClose: () => void;
};

const types = ['Todos', 'Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial'];

export function FiltersPanel({ filters, onChange, open, onClose }: Props) {
  return (
    <aside className={open ? 'filters open' : 'filters'} aria-label="Filtros">
      <div className="filters-head">
        <h3>Filtros</h3>
        <button type="button" className="btn-ghost compact" onClick={onClose}>
          Fechar
        </button>
      </div>

      <label className="field">
        <span>Busca</span>
        <input
          type="search"
          placeholder="Bairro, condomínio, palavra-chave"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Tipo</span>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Quartos</span>
        <select
          value={filters.bedrooms}
          onChange={(e) => onChange({ ...filters, bedrooms: e.target.value })}
        >
          <option value="qualquer">Qualquer</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </label>

      <div className="field">
        <span>
          Preço até {filters.maxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
        </span>
        <input
          type="range"
          min={200000}
          max={3000000}
          step={50000}
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
        />
      </div>

      <label className="check">
        <input
          type="checkbox"
          checked={filters.onlyNew}
          onChange={(e) => onChange({ ...filters, onlyNew: e.target.checked })}
        />
        Apenas destaques
      </label>
    </aside>
  );
}

export type { Filters };
