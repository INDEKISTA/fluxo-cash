import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { db } from '../../firebase'
import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore'

export default function TabParceladas({ user, isDark }) {
  const [parceladas, setParceladas] = useState([])
  const [novaParceladaNome, setNovaParceladaNome] = useState('')
  const [novaParceladaValor, setNovaParceladaValor] = useState('')
  const [novaParceladaQtd, setNovaParceladaQtd] = useState('')
  const [novaParceladaCartao, setNovaParceladaCartao] = useState('nubank')

  const CARTOES = {
    nubank: { nome: 'Nubank', emoji: '🟣', cor: '#8b5cf6' },
    hipercard: { nome: 'Hipercard', emoji: '🔵', cor: '#3b82f6' },
    magalu: { nome: 'Magalu', emoji: '🔴', cor: '#ef4444' },
    credito: { nome: 'Crédito', emoji: '💳', cor: '#f59e0b' },
    boleto: { nome: 'Boleto', emoji: '📄', cor: '#10b981' },
    debito: { nome: 'Débito', emoji: '🏦', cor: '#06b6d4' }
  }

  useEffect(() => {
    carregarParceladas()
  }, [user])

  const carregarParceladas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'usuarios', user.uid, 'dados'))
      const parceladasArray = []
      
      snapshot.docs.forEach(doc => {
        if (doc.data().tipo === 'parcelada') {
          parceladasArray.push({
            id: doc.id,
            ...doc.data()
          })
        }
      })
      
      setParceladas(parceladasArray)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleAdicionarParcelada = async (e) => {
    e.preventDefault()
    if (!novaParceladaNome || !novaParceladaValor || !novaParceladaQtd) return

    try {
      const novaParceladaId = Date.now().toString()
      const valorTotal = parseFloat(novaParceladaValor)
      const qtdParcelas = parseInt(novaParceladaQtd)
      
      const parcelas = []
      for (let i = 1; i <= qtdParcelas; i++) {
        parcelas.push({
          numero: i,
          paga: false,
          dataPagamento: null
        })
      }

      await setDoc(doc(db, 'usuarios', user.uid, 'dados', novaParceladaId), {
        tipo: 'parcelada',
        nome: novaParceladaNome,
        valorTotal: valorTotal,
        qtdParcelas: qtdParcelas,
        cartao: novaParceladaCartao,
        parcelas: parcelas,
        dataCriacao: new Date(),
        ativa: true
      })

      setNovaParceladaNome('')
      setNovaParceladaValor('')
      setNovaParceladaQtd('')
      setNovaParceladaCartao('nubank')
      carregarParceladas()
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro: ' + error.message)
    }
  }

  const handlePagarParcela = async (parceladaId, numeroParcela) => {
    try {
      const parcelada = parceladas.find(p => p.id === parceladaId)
      if (!parcelada) return

      const novasParcelas = parcelada.parcelas.map(p => {
        if (p.numero === numeroParcela) {
          return {
            ...p,
            paga: !p.paga,
            dataPagamento: !p.paga ? new Date() : null
          }
        }
        return p
      })

      await updateDoc(doc(db, 'usuarios', user.uid, 'dados', parceladaId), {
        parcelas: novasParcelas,
        ativa: novasParcelas.some(p => !p.paga)
      })

      carregarParceladas()
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const handleDeletarParcelada = async (id) => {
    if (!window.confirm('Deletar?')) return

    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'dados', id))
      carregarParceladas()
    } catch (error) {
      alert('Erro: ' + error.message)
    }
  }

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const parceladasAtivas = parceladas.filter(p => p.ativa)
  const parceladasFinalizadas = parceladas.filter(p => !p.ativa)

  return (
    <div className="space-y-6">
      {/* Adicionar */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ➕ Adicionar Nova Parcelada
        </h3>

        <form onSubmit={handleAdicionarParcelada} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da compra"
            value={novaParceladaNome}
            onChange={(e) => setNovaParceladaNome(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Valor total (ex: 1500.75)"
              value={novaParceladaValor}
              onChange={(e) => setNovaParceladaValor(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              required
            />

            <input
              type="text"
              placeholder="Qtd parcelas (ex: 12)"
              value={novaParceladaQtd}
              onChange={(e) => setNovaParceladaQtd(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              required
            />

            <select
              value={novaParceladaCartao}
              onChange={(e) => setNovaParceladaCartao(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            >
              {Object.entries(CARTOES).map(([key, cartao]) => (
                <option key={key} value={key}>{cartao.emoji} {cartao.nome}</option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
            >
              <Plus size={18} className="inline" /> Adicionar
            </button>
          </div>
        </form>
      </div>

      {/* Ativas */}
      {parceladasAtivas.length > 0 && (
        <div>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💳 Parceladas em Aberto ({parceladasAtivas.length})
          </h3>

          <div className="space-y-6">
            {parceladasAtivas.map(parcelada => {
              const cartao = CARTOES[parcelada.cartao] || CARTOES.credito
              const parcelasPagas = parcelada.parcelas.filter(p => p.paga).length
              const percentualPago = (parcelasPagas / parcelada.qtdParcelas) * 100
              const valorParcela = parcelada.valorTotal / parcelada.qtdParcelas

              return (
                <div
                  key={parcelada.id}
                  className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}
                  style={{ borderLeftColor: cartao.cor, borderLeftWidth: '4px' }}
                >
                  {/* Título */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {parcelada.nome}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: cartao.cor }}>
                          {cartao.emoji} {cartao.nome}
                        </span>
                        <span className={`font-bold text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          R$ {formatarValor(parcelada.valorTotal)}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleDeletarParcelada(parcelada.id)} className={`${isDark ? 'text-red-400' : 'text-red-500'} p-2`}>
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Cards Destaque */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className={`p-4 rounded-lg text-center border-2 ${isDark ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-700 border-green-500'}`}>
                      <p className="text-xs font-bold opacity-75">✅ PAGAS</p>
                      <p className="font-bold text-3xl">{parcelasPagas}</p>
                      <p className="text-xs mt-1">de {parcelada.qtdParcelas}</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg text-center border-2 ${isDark ? 'bg-orange-900 text-orange-200 border-orange-700' : 'bg-orange-100 text-orange-700 border-orange-500'}`}>
                      <p className="text-xs font-bold opacity-75">⏳ FALTAM</p>
                      <p className="font-bold text-3xl">{parcelada.qtdParcelas - parcelasPagas}</p>
                      <p className="text-xs mt-1">parcelas</p>
                    </div>

                    <div className={`p-4 rounded-lg text-center border-2 ${isDark ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-500'}`}>
                      <p className="text-xs font-bold opacity-75">📊 PROGRESSO</p>
                      <p className="font-bold text-3xl">{Math.round(percentualPago)}%</p>
                      <p className="text-xs mt-1">concluído</p>
                    </div>
                  </div>

                  {/* Barra */}
                  <div className={`w-full h-4 rounded-full overflow-hidden mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${percentualPago}%` }} />
                  </div>

                  <p className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Valor/parcela: <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>R$ {formatarValor(valorParcela)}</span>
                  </p>

                  {/* Parcelas */}
                  <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Clique para marcar como paga:
                  </p>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-4">
                    {parcelada.parcelas.map((parcela) => (
                      <button
                        key={parcela.numero}
                        onClick={() => handlePagarParcela(parcelada.id, parcela.numero)}
                        className={`p-2 rounded font-bold text-xs ${
                          parcela.paga
                            ? isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                            : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {parcela.numero} {parcela.paga && '✓'}
                      </button>
                    ))}
                  </div>

                  {parcelasPagas === parcelada.qtdParcelas && (
                    <div className={`p-3 rounded-lg text-center font-bold ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>
                      🎉 Finalizada!
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Finalizadas */}
      {parceladasFinalizadas.length > 0 && (
        <div>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ✅ Finalizadas ({parceladasFinalizadas.length})
          </h3>

          <div className="space-y-3">
            {parceladasFinalizadas.map(parcelada => {
              const cartao = CARTOES[parcelada.cartao] || CARTOES.credito
              return (
                <div key={parcelada.id} className={`p-4 rounded-lg flex justify-between items-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`} style={{ borderLeftColor: cartao.cor, borderLeftWidth: '4px' }}>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{parcelada.nome}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cartao.emoji} {cartao.nome} • R$ {formatarValor(parcelada.valorTotal)} • {parcelada.qtdParcelas}x
                    </p>
                  </div>
                  <button onClick={() => handleDeletarParcelada(parcelada.id)} className={`${isDark ? 'text-red-400' : 'text-red-500'} p-2`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Vazio */}
      {parceladas.length === 0 && (
        <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} p-12 rounded-lg text-center`}>
          <p className="text-lg font-semibold">Nenhuma parcelada</p>
        </div>
      )}
    </div>
  )
}