export type RegionId =
  | 'todas'
  | 'anapolis'
  | 'goiania'
  | 'brasilia'
  | 'caldas-novas'
  | 'rio-quente';

export type Property = {
  id: string;
  slug: string;
  title: string;
  region: Exclude<RegionId, 'todas'>;
  regionLabel: string;
  neighborhood: string;
  size: number;
  lotSize?: number;
  bedrooms: number;
  bathrooms: number;
  suites?: number;
  parking: number;
  price: number;
  evaluatedPrice?: number;
  type: 'Casa' | 'Apartamento' | 'Cobertura' | 'Terreno' | 'Comercial';
  tags: string[];
  image: string;
  images: string[];
  featured?: boolean;
  sortOrder?: number;
  headline?: string;
  description: string;
  highlights: string[];
  whatsappMessage?: string;
};

export const regions: { id: RegionId; label: string }[] = [
  { id: 'todas', label: 'Todas as regiões' },
  { id: 'anapolis', label: 'Anápolis' },
  { id: 'goiania', label: 'Goiânia' },
  { id: 'brasilia', label: 'Brasília' },
  { id: 'caldas-novas', label: 'Caldas Novas' },
  { id: 'rio-quente', label: 'Rio Quente' },
];

export const properties: Property[] = [
  {
    id: 'sao-joao-430',
    slug: 'casa-bairro-sao-joao-anapolis',
    title: 'Casa moderna no Bairro São João',
    region: 'anapolis',
    regionLabel: 'Anápolis',
    neighborhood: 'São João',
    size: 110,
    lotSize: 170,
    bedrooms: 3,
    bathrooms: 2,
    suites: 1,
    parking: 2,
    price: 430000,
    evaluatedPrice: 480000,
    type: 'Casa',
    tags: ['Oportunidade', 'Área gourmet', 'Nova', 'Custo-benefício'],
    image: '/properties/sao-joao/photo-04.jpg',
    images: [
      '/properties/sao-joao/photo-04.jpg',
      '/properties/sao-joao/photo-01.jpg',
      '/properties/sao-joao/photo-16.jpg',
      '/properties/sao-joao/photo-07.jpg',
      '/properties/sao-joao/photo-09.jpg',
      '/properties/sao-joao/photo-13.jpg',
      '/properties/sao-joao/photo-11.jpg',
      '/properties/sao-joao/photo-06.jpg',
      '/properties/sao-joao/photo-10.jpg',
      '/properties/sao-joao/photo-05.jpg',
      '/properties/sao-joao/photo-08.jpg',
      '/properties/sao-joao/photo-02.jpg',
      '/properties/sao-joao/photo-03.jpg',
      '/properties/sao-joao/photo-12.jpg',
      '/properties/sao-joao/photo-14.jpg',
      '/properties/sao-joao/photo-15.jpg',
    ],
    featured: true,
    headline: 'Oportunidade no Bairro São João – Anápolis/GO',
    description:
      'Excelente oportunidade para quem busca uma casa moderna, espaçosa e com ótimo custo-benefício. Imóvel avaliado em aproximadamente R$ 480.000,00, com valor de venda de R$ 430.000,00 — cerca de R$ 50 mil abaixo da avaliação. Ideal tanto para moradia quanto para investimento.',
    highlights: [
      'Aproximadamente 110 m² de área construída',
      'Terreno com aproximadamente 170 m²',
      '3 quartos, sendo 1 suíte',
      'Banheiro social',
      'Sala ampla e confortável',
      'Cozinha',
      'Área gourmet',
      'Área de serviço',
      'Garagem para 2 carros',
    ],
    whatsappMessage:
      'Olá! Tenho interesse na casa do Bairro São João (Anápolis) anunciada por R$ 430.000.',
  },
  {
    id: '1',
    slug: 'casa-contemporanea-jardim-america',
    title: 'Casa contemporânea com piscina',
    region: 'anapolis',
    regionLabel: 'Anápolis',
    neighborhood: 'Jardim América',
    size: 280,
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    price: 1250000,
    type: 'Casa',
    tags: ['Piscina', 'Moderna', 'Condomínio'],
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Casa contemporânea com piscina em condomínio, acabamento alto padrão e salas integradas.',
    highlights: ['Piscina', 'Condomínio fechado', 'Área gourmet'],
  },
  {
    id: '2',
    slug: 'apartamento-setor-bueno',
    title: 'Apartamento alto padrão no Setor Bueno',
    region: 'goiania',
    regionLabel: 'Goiânia',
    neighborhood: 'Setor Bueno',
    size: 145,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    price: 890000,
    type: 'Apartamento',
    tags: ['Lazer completo', 'Vista'],
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Apartamento alto padrão com lazer completo no Setor Bueno.',
    highlights: ['3 quartos', '2 vagas', 'Lazer completo'],
  },

  {
    id: '4',
    slug: 'casa-vila-jaiara',
    title: 'Casa térrea em condomínio fechado',
    region: 'anapolis',
    regionLabel: 'Anápolis',
    neighborhood: 'Vila Jaiara',
    size: 190,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    price: 680000,
    type: 'Casa',
    tags: ['Pronto para morar'],
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Casa térrea pronta para morar em condomínio fechado.',
    highlights: ['3 quartos', '2 vagas', 'Condomínio'],
  },
  {
    id: '5',
    slug: 'apartamento-caldas-novas',
    title: 'Apartamento perto das águas termais',
    region: 'caldas-novas',
    regionLabel: 'Caldas Novas',
    neighborhood: 'Centro',
    size: 98,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    price: 420000,
    type: 'Apartamento',
    tags: ['Investimento', 'Turismo'],
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Apartamento ideal para investimento em Caldas Novas.',
    highlights: ['2 quartos', 'Próximo às águas termais'],
  },
  {
    id: '6',
    slug: 'chale-rio-quente',
    title: 'Chalé moderno em Rio Quente',
    region: 'rio-quente',
    regionLabel: 'Rio Quente',
    neighborhood: 'Parque das Fontes',
    size: 160,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    price: 750000,
    type: 'Casa',
    tags: ['Natureza', 'Lazer'],
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Chalé moderno com contato com a natureza em Rio Quente.',
    highlights: ['3 quartos', 'Área de lazer'],
  },
  {
    id: '7',
    slug: 'sala-comercial-anhanguera',
    title: 'Sala comercial na Av. Anhanguera',
    region: 'goiania',
    regionLabel: 'Goiânia',
    neighborhood: 'Setor Central',
    size: 85,
    bedrooms: 0,
    bathrooms: 1,
    parking: 1,
    price: 510000,
    type: 'Comercial',
    tags: ['Alto fluxo'],
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Sala comercial em ponto de alto fluxo.',
    highlights: ['Ponto comercial', '1 vaga'],
  },
  {
    id: '8',
    slug: 'terreno-pedra-branca',
    title: 'Terreno residencial em Anápolis',
    region: 'anapolis',
    regionLabel: 'Anápolis',
    neighborhood: 'Residencial Pedra Branca',
    size: 450,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    price: 290000,
    type: 'Terreno',
    tags: ['Oportunidade'],
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Terreno residencial com ótimo potencial.',
    highlights: ['450 m²', 'Residencial'],
  },
];

export function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}

export const WHATSAPP_PHONE = '5562991518816';

export function getBrokerWhatsAppLink(
  message = 'Olá! Gostaria de falar com um corretor da BRAZVIA.',
) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

export function getWhatsAppLink(property: Property) {
  const message =
    property.whatsappMessage ??
    `Olá! Tenho interesse no imóvel ${property.title} (${property.neighborhood}).`;
  return getBrokerWhatsAppLink(message);
}

export function openWhatsApp(message?: string) {
  const url = getBrokerWhatsAppLink(message);
  window.location.assign(url);
}
