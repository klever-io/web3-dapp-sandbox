import { useState, useEffect } from 'react';
import './App.css';

// Stellar SDK - Import correto
import * as StellarSdk from '@stellar/stellar-sdk';

// Stellar Wallets Kit - Reativado
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';

interface WalletState {
  kit: StellarWalletsKit | null
  isConnected: boolean
  publicKey: string
  walletName: string
}

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    kit: null,
    isConnected: false,
    publicKey: '',
    walletName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('DApp carregado com sucesso!')
  const [signResult, setSignResult] = useState('')

  useEffect(() => {
    // Inicializar o Stellar Wallets Kit
    try {
      const kit = new StellarWalletsKit({
        network: WalletNetwork.PUBLIC,
        selectedWalletId: 'xbull',
        modules: allowAllModules()
      })

      setWallet(prev => ({ ...prev, kit }))
      console.log('Stellar SDK carregado:', StellarSdk.Networks.PUBLIC)
      setMessage('Stellar Wallets Kit e SDK carregados com sucesso! 🎉')
    } catch (error) {
      console.error('Erro ao inicializar Stellar Wallets Kit:', error)
      setMessage('Erro ao carregar Stellar Wallets Kit: ' + (error as Error).message)
    }
  }, [])

  const connectWallet = async () => {
    if (!wallet.kit) {
      setMessage('Stellar Wallets Kit não está inicializado')
      return
    }

    setIsLoading(true)
    try {
      await wallet.kit.openModal({
        onWalletSelected: async (option) => {
          try {
            wallet.kit!.setWallet(option.id)
            const { address } = await wallet.kit!.getAddress()
            
            setWallet(prev => ({
              ...prev,
              isConnected: true,
              publicKey: address,
              walletName: option.name
            }))
            
            setMessage(`Conectado com sucesso à ${option.name}! 🎉`)
          } catch (error) {
            console.error('Erro ao obter endereço:', error)
            setMessage('Erro ao obter endereço da wallet')
          }
        },
        onClosed: () => {
          setMessage('Conexão cancelada pelo usuário')
        }
      })
    } catch (error) {
      console.error('Erro ao abrir modal:', error)
      setMessage('Erro ao conectar wallet: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: false,
      publicKey: '',
      walletName: ''
    }))
    setMessage('Wallet desconectada')
    setSignResult('')
  }

  const signTransaction = async () => {
    if (!wallet.kit || !wallet.isConnected) {
      setMessage('Wallet não conectada')
      return
    }

    // Solicitar endereço de destino
    const destinationAddress = prompt('Digite o endereço de destino (chave pública Stellar):')
    
    if (!destinationAddress) {
      setMessage('Transação cancelada - endereço de destino não fornecido')
      return
    }

    // Validar se o endereço não é igual ao da wallet conectada
    if (destinationAddress === wallet.publicKey) {
      setMessage('❌ O endereço de destino não pode ser igual ao da sua wallet')
      return
    }

    // Validar formato do endereço Stellar
    try {
      StellarSdk.Keypair.fromPublicKey(destinationAddress)
    } catch {
      setMessage('❌ Endereço de destino inválido. Use uma chave pública Stellar válida.')
      return
    }

    // Solicitar valor do pagamento
    const amountStr = prompt('Digite o valor a ser enviado (em XLM):', '1')
    
    if (!amountStr) {
      setMessage('Transação cancelada - valor não fornecido')
      return
    }

    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount <= 0) {
      setMessage('❌ Valor inválido. Digite um número maior que zero.')
      return
    }

    setIsLoading(true)
    try {
      // Criar uma transação de pagamento usando Stellar SDK
      const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org')
      const sourceAccount = await server.loadAccount(wallet.publicKey)
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC

      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationAddress,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString()
          })
        )
        .setTimeout(180)
        .build()

      // Assinar transação usando Stellar Wallets Kit
      const { signedTxXdr } = await wallet.kit.signTransaction(transaction.toXDR())
      
      setSignResult(`✅ Transação assinada com sucesso!

📋 Detalhes da Transação:
• De: ${wallet.publicKey}
• Para: ${destinationAddress}
• Valor: ${amount} XLM
• Rede: Testnet

🔐 XDR da transação assinada:
${signedTxXdr.substring(0, 100)}...

(Transação pronta para envio à rede Stellar)`)
      setMessage('Transação assinada com sucesso!')
    } catch (error) {
      console.error('Erro ao assinar transação:', error)
      setSignResult('❌ Erro ao assinar transação:\n' + (error as Error).message)
      setMessage('Erro ao assinar transação')
    } finally {
      setIsLoading(false)
    }
  }

  const signMessage = async () => {
    if (!wallet.kit || !wallet.isConnected) {
      setMessage('Wallet não conectada')
      return
    }

    setIsLoading(true)
    try {
      const messageToSign = `Olá da Stellar DApp! 
Wallet: ${wallet.walletName}
Timestamp: ${new Date().toISOString()}
Conta: ${wallet.publicKey}`

      // Assinar mensagem usando Stellar Wallets Kit
      const { signedMessage } = await wallet.kit.signMessage(messageToSign)
      
      setSignResult(`✅ Mensagem assinada com sucesso!\n\nMensagem original:\n${messageToSign}\n\nAssinatura:\n${signedMessage}`)
      setMessage('Mensagem assinada com sucesso!')
    } catch (error) {
      console.error('Erro ao assinar mensagem:', error)
      setSignResult('❌ Erro ao assinar mensagem:\n' + (error as Error).message)
      setMessage('Erro ao assinar mensagem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🌟 Stellar DApp</h1>
        <p>Teste de funcionalidades com Stellar Wallets Kit</p>
      </header>

      <main>
        {!wallet.isConnected ? (
          <div className="connect-section">
            <h2>Conectar Wallet</h2>
            <button 
              onClick={connectWallet} 
              disabled={isLoading}
              className="connect-button"
            >
              {isLoading ? 'Conectando...' : 'Conectar Wallet'}
            </button>
          </div>
        ) : (
          <div className="connected-section">
            <div className="wallet-info">
              <h2>✅ Wallet Conectada</h2>
              <p><strong>Wallet:</strong> {wallet.walletName}</p>
              <p><strong>Chave Pública:</strong> {wallet.publicKey}</p>
              <button onClick={disconnectWallet} className="disconnect-button">
                Desconectar
              </button>
            </div>

            <div className="actions-section">
              <h3>Teste de Funções</h3>
              <div className="action-buttons">
                <button 
                  onClick={signTransaction} 
                  disabled={isLoading}
                  className="action-button"
                >
                  {isLoading ? 'Assinando...' : '📝 Sign Transaction'}
                </button>
                
                <button 
                  onClick={signMessage} 
                  disabled={isLoading}
                  className="action-button"
                >
                  {isLoading ? 'Assinando...' : '✍️ Sign Message'}
                </button>
              </div>
            </div>

            {signResult && (
              <div className="result-section">
                <h3>Resultado:</h3>
                <pre className="result-text">{signResult}</pre>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="message">
            <p>{message}</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
