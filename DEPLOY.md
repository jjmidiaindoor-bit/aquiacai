# Deploy na Vercel - Aqui Açaí

## Passos para Deploy

### 1. Acesse a Vercel
- Vá para: https://vercel.com
- Faça login com sua conta GitHub

### 2. Importe o Projeto
- Clique em "Add New..." → "Project"
- Selecione o repositório: `jjmidiaindoor-bit/aquiacai`
- Clique em "Import"

### 3. Configure as Variáveis de Ambiente
Na seção "Environment Variables", adicione as seguintes variáveis:

```
VITE_SUPABASE_PROJECT_ID=pbwznxgolvigdasmwave
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBid3pueGdvbHZpZ2Rhc213YXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODUwNjEsImV4cCI6MjA4ODc2MTA2MX0.OmyvEad-ClRtCHNToAZhDKfs1GYFq0fyUKOEQbX0tK0
VITE_SUPABASE_URL=https://pbwznxgolvigdasmwave.supabase.co
```

### 4. Deploy
- Clique em "Deploy"
- Aguarde o build finalizar (aproximadamente 2-3 minutos)

### 5. Acesse seu Site
Após o deploy, a Vercel fornecerá uma URL como:
- `https://aquiacai.vercel.app`
- Ou um domínio personalizado se você configurar

## Configurações Automáticas

O projeto já está configurado com:
- ✅ `vercel.json` - Configuração de build e rotas
- ✅ `.vercelignore` - Arquivos ignorados no deploy
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite

## Deploy Automático

Após o primeiro deploy, qualquer push para a branch `main` no GitHub irá automaticamente:
1. Fazer rebuild do projeto
2. Atualizar o site em produção

## Domínio Personalizado (Opcional)

Para adicionar um domínio personalizado:
1. Vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Configure os DNS conforme instruções da Vercel
