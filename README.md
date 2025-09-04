# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Stellar DApp - Teste com Stellar Wallets Kit

## Descrição

Este é um DApp (Aplicação Descentralizada) desenvolvido com React e TypeScript que demonstra a integração com o ecossistema Stellar usando o **Stellar Wallets Kit**. O aplicativo permite conectar wallets Stellar e testar funcionalidades de assinatura de transações e mensagens.

## Funcionalidades

- 🔗 **Conexão com Wallet**: Conecta com wallets Stellar suportadas
- 📝 **Sign Transaction**: Assina transações na rede Stellar
- ✍️ **Sign Message**: Assina mensagens personalizadas
- 🌐 **Rede Testnet**: Configurado para usar a rede de testes da Stellar
- 🎨 **Interface Moderna**: Design responsivo e amigável

## Tecnologias Utilizadas

- **React 19** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Stellar SDK** - SDK oficial da Stellar para JavaScript
- **Stellar Wallets Kit** - Biblioteca para integração com wallets Stellar

## Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm ou yarn

## Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Versão do Node.js (se necessário)

Se você estiver usando uma versão mais antiga do Node.js, atualize para uma versão compatível:

```bash
# Usando nvm
nvm use --lts

# Ou instale a versão LTS mais recente
nvm install --lts
```

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou na próxima porta disponível).

### 4. Build para Produção

```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── App.tsx          # Componente principal do DApp
├── App.css          # Estilos do componente principal
├── main.tsx         # Ponto de entrada da aplicação
├── index.css        # Estilos globais
└── vite-env.d.ts    # Tipos do Vite
```

## Como Usar

### 1. Conectar Wallet

1. Clique no botão "Conectar Wallet"
2. Escolha sua wallet Stellar preferida no modal
3. Autorize a conexão na sua wallet

### 2. Testar Funcionalidades

Após conectar a wallet, você pode:

- **Testar Stellar SDK**: Cria uma transação de exemplo e testa a conectividade com o Horizon
- **Preparar Mensagem**: Prepara uma mensagem para assinatura

### 3. Sign Transaction

- Cria uma transação de pagamento de exemplo
- Solicita assinatura através da wallet conectada
- Exibe o XDR da transação assinada

### 4. Sign Message

- Cria uma mensagem personalizada com timestamp
- Solicita assinatura através da wallet conectada
- Exibe a assinatura da mensagem

## Wallets Suportadas

O Stellar Wallets Kit suporta diversas wallets, incluindo:

- **Freighter** - Extensão de navegador
- **xBull** - Wallet mobile e web
- **Lobstr** - Wallet mobile
- **StellarTerm** - Interface web
- E outras compatíveis com o protocolo Stellar

## Rede de Teste

Este DApp está configurado para usar a **Stellar Testnet**. Para obter XLM de teste:

1. Visite o [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)
2. Use a opção "Create Account" para gerar uma conta de teste
3. Ou use o [Stellar Friendbot](https://friendbot.stellar.org/)

## Configuração Avançada

### Alternar Redes

Para mudar da Testnet para a Mainnet, edite o arquivo `src/App.tsx`:

```typescript
// Testnet
network: WalletNetwork.TESTNET

// Mainnet
network: WalletNetwork.PUBLIC
```

### Personalizar Wallets

Para selecionar wallets específicas, modifique a configuração:

```typescript
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: 'freighter', // ou 'xbull', 'lobstr', etc.
  modules: allowAllModules()
})
```

## Solução de Problemas

### Erro: "global is not defined"

Se você encontrar este erro, certifique-se de que o `vite.config.ts` está configurado corretamente com os polyfills.

### Problemas de Versão do Node.js

Certifique-se de usar Node.js 20.19+ ou 22.12+:

```bash
node --version
```

### Wallet não Conecta

1. Verifique se a wallet está instalada e desbloqueada
2. Certifique-se de estar na rede correta (Testnet/Mainnet)
3. Verifique se o site tem permissão para acessar a wallet

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Links Úteis

- [Documentação Stellar](https://developers.stellar.org/)
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar SDK](https://github.com/StellarCN/js-stellar-sdk)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Horizon API](https://developers.stellar.org/api)

## Status do Desenvolvimento

- [x] ✅ Setup inicial do projeto
- [x] ✅ Configuração do Vite
- [x] ✅ Interface básica do DApp
- [x] ✅ Integração com Stellar SDK
- [ ] 🔄 Integração completa com Stellar Wallets Kit
- [ ] 🔄 Testes de assinatura de transação
- [ ] 🔄 Testes de assinatura de mensagem
- [ ] ⏳ Deploy em produção

---

**Nota**: Este projeto está em desenvolvimento ativo. Algumas funcionalidades podem estar em modo de demonstração enquanto finalizamos a integração completa.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
