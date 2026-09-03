# ⚡ QUICKSTART - Comece em 5 Minutos

## 🎯 Objetivo Final
Você terá uma PWA de controle financeiro funcionando no seu celular!

## 📝 Checklist Rápido

### Parte 1: Setup Firebase (2 minutos)

- [ ] Acesse https://console.firebase.google.com
- [ ] Crie um projeto novo (nome: `fluxo-cash`)
- [ ] Ative "Autenticação > Email/Senha"
- [ ] Crie "Firestore Database" (modo teste, São Paulo)
- [ ] Copie as credenciais (⚙️ > Configurações > SDK do Web App)

### Parte 2: Setup Local (2 minutos)

- [ ] Clone/baixe os arquivos do projeto
- [ ] Abra terminal na pasta `fluxo-cash`
- [ ] Execute: `npm install`
- [ ] Crie arquivo `.env.local` com suas credenciais
- [ ] Execute: `npm run dev`
- [ ] Abra `http://localhost:3000`

### Parte 3: Teste (1 minuto)

- [ ] Crie uma conta
- [ ] Defina um salário
- [ ] Adicione um gasto
- [ ] Veja o gráfico
- [ ] Confira as dicas

## 🚀 Próximos Passos

1. **Deploy na Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Instalar no Celular:**
   - Abra a PWA no Chrome (Android)
   - Toque no menu ⋮ > "Instalar app"
   - Pronto! Funciona offline também

## 📱 Versão Local vs Produção

| Feature | Local | Vercel |
|---------|-------|--------|
| Funciona offline | ✅ | ✅ |
| Sincroniza com Firebase | ✅ | ✅ |
| URL legal | localhost:3000 | seu-dominio.vercel.app |
| Instalável | ✅ | ✅ |
| Disponível sempre | Só localmente | 24/7 ☁️ |

## 🆘 Erro Comum: "Firebase não configurado"

**Solução:**
1. Verifique o arquivo `.env.local`
2. Copie exatamente as credenciais
3. Não coloque aspas nas variáveis
4. Reinicie `npm run dev`

## 📚 Documentos Importantes

- 📖 **README.md** - Documentação completa
- 🔥 **FIREBASE_SETUP.md** - Passo a passo Firebase
- ⚡ **QUICKSTART.md** - Este arquivo

## 💬 Próximas Melhorias

Após tudo funcionando, você pode:
- ✅ Adicionar mais categorias de gastos
- ✅ Exportar relatórios em PDF
- ✅ Compartilhar com parceiro/cônjuge
- ✅ Integrar com bancos
- ✅ Notificações de alerta

## 🎉 Você está pronto!

Se tudo deu certo, você tem uma PWA profissional de controle financeiro funcionando! 

**Próximas vezes:** Apenas `npm run dev` 

---

**Dúvidas?** Leia os outros arquivos .md ou abra uma issue!
