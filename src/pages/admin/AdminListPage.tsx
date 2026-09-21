import { useEffect, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../../context/PropertiesContext';
import { formatPrice, type Property } from '../../data/properties';

export function AdminListPage() {
  const { properties, loading, error, deleteProperty, reorderProperties } =
    useProperties();
  const [items, setItems] = useState<Property[]>(properties);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(properties);
  }, [properties]);

  const moveItem = (fromId: string, toId: string) => {
    if (fromId === toId) return items;
    const fromIndex = items.findIndex((item) => item.id === fromId);
    const toIndex = items.findIndex((item) => item.id === toId);
    if (fromIndex < 0 || toIndex < 0) return items;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const onDragStart = (event: DragEvent<HTMLTableRowElement>, id: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  const onDragOver = (event: DragEvent<HTMLTableRowElement>, id: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (id !== overId) setOverId(id);
  };

  const onDrop = async (event: DragEvent<HTMLTableRowElement>, toId: string) => {
    event.preventDefault();
    const fromId = draggingId ?? event.dataTransfer.getData('text/plain');
    setDraggingId(null);
    setOverId(null);
    if (!fromId) return;
    const next = moveItem(fromId, toId);
    setItems(next);
    setSaving(true);
    try {
      await reorderProperties(next.map((item) => item.id));
    } catch {
      setItems(properties);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-list">
      <div className="admin-list-head">
        <div>
          <h1>Anúncios</h1>
          <p>
            {loading
              ? 'Carregando…'
              : `${properties.length} imóveis cadastrados. Arraste pela alça para mudar a ordem na vitrine.`}
          </p>
        </div>
        <div className="admin-list-actions">
          <Link to="/admin/novo" className="btn-gold">
            Novo anúncio
          </Link>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {saving ? <p className="admin-muted">Salvando ordem…</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th aria-label="Reordenar" />
              <th>Foto</th>
              <th>Título</th>
              <th>Região</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((property) => (
              <tr
                key={property.id}
                draggable
                onDragStart={(event) => onDragStart(event, property.id)}
                onDragOver={(event) => onDragOver(event, property.id)}
                onDrop={(event) => void onDrop(event, property.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setOverId(null);
                }}
                className={
                  [
                    draggingId === property.id ? 'is-dragging' : '',
                    overId === property.id && draggingId !== property.id
                      ? 'is-drop-target'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined
                }
              >
                <td>
                  <span className="admin-drag-handle" title="Arrastar para reordenar">
                    <span />
                    <span />
                    <span />
                  </span>
                </td>
                <td>
                  <img className="admin-thumb" src={property.image} alt="" />
                </td>
                <td>
                  <strong>{property.title}</strong>
                  <div className="admin-muted">{property.neighborhood}</div>
                </td>
                <td>{property.regionLabel}</td>
                <td>{formatPrice(property.price)}</td>
                <td>
                  <span
                    className={
                      property.featured ? 'admin-pill featured' : 'admin-pill'
                    }
                  >
                    {property.featured ? 'Destaque' : 'Publicado'}
                  </span>
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link to={`/imovel/${property.slug}`} target="_blank">
                      Ver
                    </Link>
                    <Link to={`/admin/editar/${property.id}`}>Editar</Link>
                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => {
                        if (confirm(`Excluir "${property.title}"?`)) {
                          void deleteProperty(property.id);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
