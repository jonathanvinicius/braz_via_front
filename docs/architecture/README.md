# Desenhos de arquitetura — BRAZVIA

Pasta canônica dos diagramas do produto. Tudo que for desenho de sistema
(backend, rede, auth, deploy) entra aqui.

## Arquivos

| Arquivo | O que é |
|---|---|
| `brazvia-backend-aws.svg` | Arquitetura AWS de produção (Lambda, Cognito, RDS, S3, CloudFront) |

Abrir o SVG no browser, no Preview, ou importar no [diagrams.net](https://app.diagrams.net/).

## Convenção

- Estilo: diagrama AWS (caixas aninhadas: Cloud → VPC → subnet pública/privada).
- Números no desenho = walkthrough no rodapé do próprio SVG.
- Não versionar PNG gerado de ferramenta, a menos que precise anexar em PR/wiki — o SVG é a fonte.

## Próximos desenhos (quando existirem)

- `brazvia-auth-cognito.svg` — login do /admin (PKCE)
- `brazvia-upload-s3.svg` — fluxo de presign
