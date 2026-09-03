import { useState } from 'react'
import { Plus, Trash2, CreditCard } from 'lucide-react'

export default function TabParceladas({
  parceladas,
  adicionarParcelada,
  marcarParcelasPagas,
  user
}) {
  const [nome, setNome] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [parcelas, setParcelas] = useState('12')
  const [tipo, setTipo] = useState('credito')

  const handleAdicionar = async (e) => {
    e.preventDefault()
    if (!nome || !valorTotal || !parcelas) return

    await adicionarParcelada(nome, valorTotal, parcelas, tipo)
    setNome('')
    setValorTotal('')
    setParcelas('12')
    setTipo('credito')
  }

  const calcularValorParcela = (valorTotal, parcelas) => {
    return (parseFloat(valorTotal) / parseInt(parcelas)).toFixed(2)
  }

  const calcularParcelasRestantes = (totalParcelas, parcelasPagas) => {
    return totalParcelas - parcelasPagas
  }

  return (
    <div className="space-y-6">
      {/* Adicionar Parcelada */}
      <div className="bg-gradient-to-r from-accent to-orange-600 text-white p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-4">📋 Registrar Compra Parcelada</h3>
        <form onSubmit={handleAdicionar} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome da compra (ex: Notebook)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="px-4 py-2 rounded-lg text-black focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Valor total"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              step="0.01"
              className="px-4 py-2 rounded-lg text-black focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Quantidade de parcelas"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              min="1"
              max="48"
              className="px-4 py-2 rounded-lg text-black focus:outline-none"
              required
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="px-4 py-2 rounded-lg text-black focus:outline-none"
            >
              <option value="credito">💳 Cartão de Crédito</option>
              <option value="boleto">📄 Boleto</option>
              <option value="debito">🏦 Débito Parcelado</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-accent font-bold py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Adicionar Parcelada
          </button>
        </form>
      </div>

      {/* Lista de Parceladas */}
      {parceladas.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Suas Compras Parceladas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parceladas.map(item => {
              const parcelasRestantes = calcularParcelasRestantes(item.parcelas, item.parcelasPagas || 0)
              const percentualPago = (item.parcelasPagas / item.parcelas * 100).toFixed(0)
              const valorParcela = calcularValorParcela(item.valorTotal, item.parcelas)

              return (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  {/* Cabeçalho */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{item.nome}</h4>
                      <p className="text-sm text-gray-600">
                        {item.tipoCartao === 'credito' && '💳 Cartão de Crédito'}
                        {item.tipoCartao === 'boleto' && '📄 Boleto'}
                        {item.tipoCartao === 'debito' && '🏦 Débito Parcelado'}
                      </p>
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {parseFloat(item.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      R$ {valorParcela} por parcela
                    </p>
                  </div>

                  {/* Progresso */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">
                        {item.parcelasPagas}/{item.parcelas}
                      </span>
                      <span className="text-sm text-gray-600">{percentualPago}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition"
                        style={{ width: `${percentualPago}%` }}
                      />
                    </div>
                  </div>

                  {/* Restante */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <span className="font-bold text-lg">{parcelasRestantes}</span> parcelas restantes
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {parcelasRestantes > 0 && (
                      <button
                        onClick={() => marcarParcelasPagas(item.id, item.parcelasPagas + 1)}
                        className="flex-1 bg-primary hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                      >
                        ✓ Pagar Parcela
                      </button>
                    )}
                    {parcelasRestantes === 0 && (
                      <div className="flex-1 bg-green-100 text-green-800 font-semibold py-2 rounded-lg text-center">
                        ✓ Pago!
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center bg-gray-100 p-8 rounded-lg">
          <CreditCard size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">Nenhuma compra parcelada registrada</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">💡 Dica:</span> Quando você marcar um gasto como "pago" na aba de gastos,
          as parceladas serão atualizadas automaticamente se forem do mesmo cartão.
        </p>
      </div>
    </div>
  )
}
