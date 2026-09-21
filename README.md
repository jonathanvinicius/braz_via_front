# BRAZVIA Front

Frontend da plataforma BRAZVIA Negócios Imobiliários — vitrine de imóveis por região.

## Stack

- Vite + React + TypeScript
- CSS próprio (Syne + DM Sans, paleta charcoal/ouro)

## Rodar local

```bash
npm install
npm run dev
```

## Logo

Coloque a arte oficial em `public/logo-brazvia.jpg` (ou `.png`) e, se quiser, troque as referências em `Hero` / `Footer` dos SVGs atuais pela imagem.

## Estrutura

- `src/components` — Header, Hero, filtros, grid de imóveis
- `src/data/properties.ts` — dados mock por região
- `src/styles/global.css` — design system

## API local

O front consome o backend em `braz-via`.

```bash
# em braz-via
docker compose up -d db
npm install && npm run db:migrate && npm run db:seed && npm run dev
```

`.env` deste front:

```
API_URL=http://localhost:3333/api
```

Admin: http://localhost:5174/admin — `admin@brazvia.local` + qualquer senha (mock).
