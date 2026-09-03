# 🔥 Guia de Configuração Firebase para Fluxo Cash

Este guia mostra como configurar o Firebase para a aplicação funcionar completamente.

## 📋 Pré-requisitos

- Conta Google (gmail)
- Alguns minutos livres

## ✅ Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique **"Adicionar Projeto"**
3. Nome do projeto: `fluxo-cash` (ou outro nome)
4. Desabilite "Google Analytics" (opcional)
5. Clique **"Criar projeto"**
6. Aguarde a criação (~30 segundos)

## ✅ Passo 2: Habilitar Autenticação

1. No menu lateral, clique **"Autenticação"**
2. Clique na aba **"Provedores de login"**
3. Clique no provedor **"Email/Senha"**
4. Habilite "Email/Senha"
5. Habilite "Link de email (sem senha)" (opcional)
6. Clique **"Salvar"**

## ✅ Passo 3: Criar Banco Firestore

1. No menu lateral, clique **"Firestore Database"**
2. Clique **"Criar banco de dados"**
3. Selecione **"Começar no modo de teste"**
4. Selecione localização: **"América do Sul (São Paulo)"**
5. Clique **"Criar"**
6. Aguarde a criação (~1 minuto)

## ✅ Passo 4: Configurar Regras de Segurança

**IMPORTANTE:** Por padrão, Firestore está aberto para qualquer um. Vamos proteger:

1. No Firestore, clique na aba **"Regras"**
2. Substitua o conteúdo por:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem acessar seus próprios dados
    match /usuarios/{uid}/dados/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

3. Clique **"Publicar"**

## ✅ Passo 5: Obter Credenciais

1. Clique no ícone ⚙️ (engrenagem) no topo
2. Clique **"Configurações do Projeto"**
3. Clique a aba **"Geral"**
4. Scroll para "Seus Apps"
5. Clique em **"Aplicativo da Web"** (ícone `</>`), se não tiver clique **"Adicionar app"**
6. Nome: `fluxo-cash-web`
7. Clique **"Registrar app"**
8. Você verá o código de configuração:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```

## ✅ Passo 6: Configurar Variáveis de Ambiente

1. Na raiz do projeto Fluxo Cash, crie arquivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234
```

2. **Salve o arquivo**

## ✅ Passo 7: Testar Localmente

1. Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

2. Acesse `http://localhost:3000`
3. Clique em **"Não tem conta? Criar agora"**
4. Crie uma conta com seu email
5. Após o login, adicione um gasto
6. Volte ao [Firebase Console > Firestore](https://console.firebase.google.com) e confirme que os dados aparecem

## ✅ Passo 8: Deploy na Vercel (Produção)

1. Push seu código para GitHub:

```bash
git add .
git commit -m "Setup completo com Firebase"
git push
```

2. Acesse [Vercel.com](https://vercel.com)
3. Clique **"New Project"**
4. Importe seu repositório do GitHub
5. Na seção **"Environment Variables"**, adicione:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

6. Clique **"Deploy"**

## ⚠️ IMPORTANTE: Habilitar Google Sign-In (Opcional)

Se quiser adicionar "Login com Google" no futuro:

1. Em Autenticação > Provedores
2. Clique em "Google"
3. Habilite
4. Selecione um email de suporte
5. Salve

## 🔍 Verificar Status

### Firestore está funcionando?
- Vá a Firestore Database
- Você deve ver uma coleção `usuarios`
- Dentro dela, uma coleção `dados` com seus gastos

### Autenticação está funcionando?
- Vá a Autenticação
- Você deve ver sua conta de teste

### Dados são privados?
- Outro usuário (em outro navegador) não pode ver seus dados
- Regras de segurança protegem tudo

## 🆘 Troubleshooting

### "Firebase não foi configurado"
- Verifique o arquivo `.env.local`
- Confirme que não há espaços extras
- Reinicie `npm run dev`

### "Autenticação não funciona"
- Confirme que Email/Senha está habilitado
- Tente com outro email

### "Dados não aparecem no Firestore"
- Verifique as regras de segurança
- Confirme que está logado com o mesmo email

### "Erro ao fazer login"
- Limpe cache do navegador
- Tente em modo privado/incógnito
- Verifique o console (F12 > Console)

## 💰 Plano Gratuito Suficiente?

Sim! Para um usuário pessoal:
- **Firestore:** 50k leituras/dia (você usará ~5-10)
- **Storage:** 1GB (você usará ~100KB)
- **Autenticação:** Ilimitada
- **Custo:** R$ 0,00

## 📚 Documentação Oficial

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [React + Firebase](https://firebase.google.com/docs/web/setup)

---

**Pronto! Seu Firebase está configurado e seguro!** 🚀
