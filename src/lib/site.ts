export const SITE_ORIGIN = 'https://brazviaimobiliaria.com.br';
export const SITE_NAME = 'Brazvia';

export function shareOrigin() {
  if (typeof window === 'undefined') return SITE_ORIGIN;
  const host = window.location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app') ||
    host.endsWith('.ngrok-free.app') ||
    host.endsWith('.ngrok.io') ||
    host.endsWith('.ngrok.app')
  ) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}

export function canonicalPropertyUrl(publicSlug: string) {
  return `${SITE_ORIGIN}/imovel/${publicSlug}`;
}

export function sharePropertyUrl(publicSlug: string) {
  return `${shareOrigin()}/imovel/${publicSlug}`;
}

export function absoluteAssetUrl(src: string) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  const path = src.startsWith('/') ? src : `/${src}`;
  return `${SITE_ORIGIN}${path}`;
}
