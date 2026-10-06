# Tw4y Marketplace — Frontend

Frontend React + Vite + TypeScript do laboratório de Web Hacking do INATEL.
Repositório: [SebastiaoKomada/twfy-front](https://github.com/SebastiaoKomada/twfy-front).
API: [SebastiaoKomada/twfy-back](https://github.com/SebastiaoKomada/twfy-back).

## Desenvolvimento local

Na raiz deste repositório, com Node.js 22 atualizado:

```bash
npm ci
cp .env.example .env
npm run dev
```

Configure `VITE_API_URL=http://localhost:8000` no `.env` e acesse
`http://localhost:5173`. A API deve estar rodando separadamente.

## Amplify Hosting

1. No console Amplify em **us-east-1**, conecte `twfy-front` e a branch `main`.
2. Os arquivos estão na raiz: mantenha a opção de monorepo desmarcada e não
   configure `AMPLIFY_MONOREPO_APP_ROOT`.
3. Configure `VITE_API_URL=https://api.seudominio.com`, sem `/api`.
4. Use o `amplify.yml` da raiz. Ele instala Node 22, executa `npm ci` e
   `npm run build`, e publica `dist/`.
5. Em **Rewrites and redirects**, copie `amplify-rewrites.json` para o editor
   JSON para permitir acesso direto às rotas React.

Após alterar `VITE_API_URL`, faça um novo build. As variáveis `VITE_*` são
públicas no JavaScript; não coloque senhas ou chaves nelas. O domínio HTTPS
da API e os IPs permitidos são configurados no backend/EC2.

O roteiro completo está em
[twfy-back/deploy/AWS.md](https://github.com/SebastiaoKomada/twfy-back/blob/main/deploy/AWS.md).
