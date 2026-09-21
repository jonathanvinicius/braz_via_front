import { regions, type RegionId } from '../data/properties';

type Props = {
  active: RegionId;
  onChange: (region: RegionId) => void;
};

export function RegionStrip({ active, onChange }: Props) {
  return (
    <section className="region-strip" id="regioes">
      <div className="container">
        <div className="region-head">
          <h2>Compre por região</h2>
          <p>Escolha onde quer morar ou investir e veja as oportunidades.</p>
        </div>
        <div className="region-pills" role="tablist" aria-label="Regiões">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              role="tab"
              aria-selected={active === region.id}
              className={active === region.id ? 'pill active' : 'pill'}
              onClick={() => onChange(region.id)}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
