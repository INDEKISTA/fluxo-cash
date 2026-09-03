# 💰 FLUXO CASH - PWA de Controle Financeiro

Aplicação moderna para controlar seus gastos mensais com análises inteligentes, gráficos, dicas de economia e suporte a compras parceladas.

## ✨ Funcionalidades

- 💰 **Registro de Salário** - Defina seu salário mensal
- 💳 **Gastos** - Adicione gastos com nome e valor
- 📊 **Gráficos** - Visualize a distribuição de seus gastos com gráfico de pizza
- 🛍️ **Parceladas** - Controle compras parceladas (cartão de crédito e boleto)
- 💡 **Dicas** - Recomendações personalizadas baseadas nos seus gastos
- 🔐 **Autenticação** - Login seguro com Firebase
- 💾 **Sincronização** - Dados sincronizados com Firebase (nuvem)
- 📱 **PWA** - Instalável como app no celular
- 🌐 **Offline** - Funciona sem internet com sincronização automática

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **Backend:** Firebase (Firestore + Authentication)
- **PWA:** Service Workers
- **Deploy:** Vercel

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Firebase (grátis)
- Conta no GitHub
- Conta no Vercel

## 🚀 Instalação Local

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/fluxo-cash.git
cd fluxo-cash
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative "Autenticação com Email/Senha"
4. Crie um banco Firestore
5. Copie as credenciais (clique em ⚙️ > Configurações do Projeto > SDK do Web App)
6. Crie arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

7. Atualize o arquivo `src/firebase.js` com suas variáveis:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:3000`

### 5. Build para produção

```bash
npm run build
```

## 📤 Deploy na Vercel

### Opção 1: Via CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 2: Via GitHub (Automático)

1. Push seu código para GitHub:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/fluxo-cash.git
git push -u origin main
```

2. Acesse [Vercel Dashboard](https://vercel.com)
3. Clique "New Project"
4. Selecione seu repositório GitHub
5. Configure as variáveis de ambiente (.env)
6. Clique "Deploy"

### Configurar Variáveis na Vercel

1. Vá para Configurações do Projeto
2. Environment Variables
3. Adicione as mesmas variáveis do `.env.local`

## 📱 Instalar como App

### No Android
1. Abra a aplicação no navegador
2. Menu ⋮ > "Instalar app"

### No iOS
1. Abra no Safari
2. Compartilhar > "Adicionar à Tela inicial"

## 🔧 Estrutura do Projeto

```
fluxo-cash/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── components/
│   │   ├── Login.jsx       # Tela de autenticação
│   │   ├── Dashboard.jsx   # Dashboard principal
│   │   └── tabs/
│   │       ├── TabGastos.jsx       # Aba de gastos
│   │       ├── TabParceladas.jsx   # Aba de parceladas
│   │       └── TabDicas.jsx        # Aba de dicas
│   ├── firebase.js         # Configuração Firebase
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entrada da aplicação
│   └── index.css          # Estilos globais
├── index.html             # HTML principal
├── package.json           # Dependências
├── vite.config.js         # Configuração Vite
├── tailwind.config.js     # Configuração Tailwind
└── README.md              # Este arquivo
```

## 💾 Estructura do Banco de Dados (Firestore)

```
usuarios/
└── {uid}/
    └── dados/
        ├── salario-doc
        │   ├── tipo: "salario"
        │   └── valor: 3000
        ├── gasto-doc-1
        │   ├── tipo: "gasto"
        │   ├── nome: "Supermercado"
        │   ├── valor: 250
        │   └── data: timestamp
        └── parcelada-doc-1
            ├── tipo: "parcelada"
            ├── nome: "Notebook"
            ├── valorTotal: 3000
            ├── parcelas: 12
            ├── parcelasPagas: 3
            └── tipoCartao: "credito"
```

## 🎯 Recursos Principais

### Gastos
- Adicione gastos com nome e valor
- Visualize em gráfico de pizza
- Veja total e percentual gasto
- Delete gastos se necessário

### Parceladas
- Registre compras parceladas
- Rastreie o progresso das parcelas
- Marque parcelas como pagas
- Suporte a cartão de crédito e boleto

### Dicas
- Análise automática dos gastos
- Recomendações personalizadas
- Insights sobre suas categorias
- Potencial de economia

## 🔐 Segurança

- Autenticação Firebase com Email/Senha
- Reset de senha automático via email
- Dados encriptados em trânsito (HTTPS)
- Regras de segurança do Firestore (apenas dados do usuário)
- Service Worker com validação de cache

## 📊 Consumo de Recursos Firebase

- **Firestore Reads:** ~0.1-0.5 por dia
- **Firestore Writes:** ~0.1-0.5 por dia
- **Storage:** ~5-10KB por mês
- **Plano Gratuito:** 1GB + 50k operações/dia

**Você não pagará nada!** 🎉

## 🐛 Troubleshooting

### Firebase não funciona
- Verifique as variáveis de ambiente
- Confirme que Firestore está ativado
- Verifique as regras de segurança

### Build falha
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente
- Verifique a versão do Node (18+)

### App não funciona offline
- Confirme que Service Worker está ativado (Chrome DevTools > Application)
- Verifique se manifest.json está correto

## 📝 Licença

MIT - Sinta-se livre para usar e modificar!

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou envie um PR.

## 📞 Suporte

Dúvidas? Abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ para seus gastos financeiros** 💰
