import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProperties } from '../../context/PropertiesContext';
import { regions, type Property } from '../../data/properties';
import { slugify, type PropertyInput } from '../../lib/propertyStore';
import { uploadImage } from '../../lib/api';

const emptyForm: PropertyInput = {
  title: '',
  region: 'anapolis',
  neighborhood: '',
  size: 0,
  lotSize: undefined,
  bedrooms: 0,
  bathrooms: 0,
  suites: undefined,
  parking: 0,
  price: 0,
  evaluatedPrice: undefined,
  type: 'Casa',
  tags: [],
  images: [],
  featured: false,
  sortOrder: undefined,
  headline: '',
  description: '',
  highlights: [],
  whatsappMessage: '',
};

function toForm(property?: Property): PropertyInput {
  if (!property) return { ...emptyForm };
  return {
    title: property.title,
    slug: property.slug,
    region: property.region,
    neighborhood: property.neighborhood,
    size: property.size,
    lotSize: property.lotSize,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    suites: property.suites,
    parking: property.parking,
    price: property.price,
    evaluatedPrice: property.evaluatedPrice,
    type: property.type,
    tags: property.tags,
    images: property.images,
    featured: property.featured,
    sortOrder: property.sortOrder,
    headline: property.headline ?? '',
    description: property.description,
    highlights: property.highlights,
    whatsappMessage: property.whatsappMessage ?? '',
  };
}


export function AdminFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, createProperty, updateProperty, loading } = useProperties();
  const existing = id ? getById(id) : undefined;
  const [form, setForm] = useState<PropertyInput>(() => toForm(existing));
  const [tagsText, setTagsText] = useState(
    () => (existing?.tags ?? []).join(', '),
  );
  const [highlightsText, setHighlightsText] = useState(
    () => (existing?.highlights ?? []).join('\n'),
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!existing) return;
    setForm(toForm(existing));
    setTagsText((existing.tags ?? []).join(', '));
    setHighlightsText((existing.highlights ?? []).join('\n'));
  }, [existing]);

  const previewSlug = useMemo(
    () => form.slug?.trim() || slugify(form.title || 'novo-imovel'),
    [form.slug, form.title],
  );

  if (id && loading) {
    return (
      <section>
        <h1>Carregando anúncio…</h1>
      </section>
    );
  }

  if (id && !existing) {
    return (
      <section>
        <h1>Anúncio não encontrado</h1>
        <Link to="/admin" className="btn-gold">
          Voltar
        </Link>
      </section>
    );
  }

  const update = <K extends keyof PropertyInput>(
    key: K,
    value: PropertyInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadImage(file)),
      );
      setForm((current) => ({
        ...current,
        images: [...(current.images ?? []), ...uploaded.map((item) => item.url)],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload da imagem');
    }
  };

  const removeImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: (current.images ?? []).filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Informe o título do anúncio.');
      return;
    }
    if (!form.neighborhood.trim()) {
      setError('Informe o bairro.');
      return;
    }
    if (!form.description.trim()) {
      setError('Informe a descrição.');
      return;
    }
    if (!(form.images ?? []).length) {
      setError('Adicione pelo menos uma foto.');
      return;
    }

    const payload: PropertyInput = {
      ...form,
      slug: previewSlug,
      tags: tagsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      highlights: highlightsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (existing) {
        await updateProperty(existing.id, payload);
        navigate('/admin');
        return;
      }

      const created = await createProperty(payload);
      navigate(`/admin/editar/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar');
    }
  };

  return (
    <section className="admin-form-page">
      <div className="admin-list-head">
        <div>
          <h1>{existing ? 'Editar anúncio' : 'Novo anúncio'}</h1>
          <p>Preencha os dados do imóvel e publique na vitrine.</p>
        </div>
        <Link to="/admin" className="btn-ghost">
          Voltar
        </Link>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form-grid">
          <label className="field">
            <span>Título *</span>
            <input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Casa moderna no Bairro São João"
            />
          </label>

          <label className="field">
            <span>Headline (opcional)</span>
            <input
              value={form.headline ?? ''}
              onChange={(e) => update('headline', e.target.value)}
              placeholder="Oportunidade no Bairro São João – Anápolis/GO"
            />
          </label>

          <label className="field">
            <span>Slug da URL</span>
            <input
              value={form.slug ?? ''}
              onChange={(e) => update('slug', e.target.value)}
              placeholder={previewSlug}
            />
            <small className="admin-muted">/imovel/{previewSlug}</small>
          </label>

          <label className="field">
            <span>Tipo</span>
            <select
              value={form.type}
              onChange={(e) =>
                update('type', e.target.value as PropertyInput['type'])
              }
            >
              {['Casa', 'Apartamento', 'Cobertura', 'Terreno', 'Comercial'].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="field">
            <span>Região</span>
            <select
              value={form.region}
              onChange={(e) =>
                update(
                  'region',
                  e.target.value as PropertyInput['region'],
                )
              }
            >
              {regions
                .filter((region) => region.id !== 'todas')
                .map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label}
                  </option>
                ))}
            </select>
          </label>

          <label className="field">
            <span>Bairro *</span>
            <input
              value={form.neighborhood}
              onChange={(e) => update('neighborhood', e.target.value)}
            />
          </label>

          <label className="field">
            <span>Preço (R$)</span>
            <input
              type="number"
              min={0}
              value={form.price || ''}
              onChange={(e) => update('price', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Valor avaliado (R$)</span>
            <input
              type="number"
              min={0}
              value={form.evaluatedPrice || ''}
              onChange={(e) =>
                update(
                  'evaluatedPrice',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </label>

          <label className="field">
            <span>Área construída (m²)</span>
            <input
              type="number"
              min={0}
              value={form.size || ''}
              onChange={(e) => update('size', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Terreno (m²)</span>
            <input
              type="number"
              min={0}
              value={form.lotSize || ''}
              onChange={(e) =>
                update(
                  'lotSize',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </label>

          <label className="field">
            <span>Quartos</span>
            <input
              type="number"
              min={0}
              value={form.bedrooms || ''}
              onChange={(e) => update('bedrooms', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Suítes</span>
            <input
              type="number"
              min={0}
              value={form.suites || ''}
              onChange={(e) =>
                update(
                  'suites',
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </label>

          <label className="field">
            <span>Banheiros</span>
            <input
              type="number"
              min={0}
              value={form.bathrooms || ''}
              onChange={(e) => update('bathrooms', Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Vagas</span>
            <input
              type="number"
              min={0}
              value={form.parking || ''}
              onChange={(e) => update('parking', Number(e.target.value))}
            />
          </label>
        </div>

        <label className="field">
          <span>Descrição *</span>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Destaques (um por linha)</span>
          <textarea
            rows={6}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
            placeholder={'3 quartos, sendo 1 suíte\nÁrea gourmet\nGaragem para 2 carros'}
          />
        </label>

        <label className="field">
          <span>Tags (separadas por vírgula)</span>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Oportunidade, Nova, Área gourmet"
          />
        </label>

        <label className="field">
          <span>Mensagem pronta do WhatsApp</span>
          <input
            value={form.whatsappMessage ?? ''}
            onChange={(e) => update('whatsappMessage', e.target.value)}
          />
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => update('featured', e.target.checked)}
          />
          Marcar como destaque na vitrine
        </label>

        <div className="field">
          <span>Fotos *</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = '';
            }}
          />
          <div className="admin-photo-grid">
            {(form.images ?? []).map((src, index) => (
              <div key={src.slice(0, 40) + index} className="admin-photo">
                <img src={src} alt="" />
                <button type="button" onClick={() => removeImage(index)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-form-actions">
          <button type="submit" className="btn-gold">
            {existing ? 'Salvar alterações' : 'Cadastrar anúncio'}
          </button>
          {existing ? (
            <Link
              className="btn-outline dark"
              to={`/imovel/${existing.slug}`}
              target="_blank"
            >
              Ver no site
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
