import { useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, DollarSign } from 'lucide-react'
import { db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function TabGastos({
  salario,
  setSalario,
  user,
  gastos,
  totalGastos,
  adicionarGasto,
  deletarGasto
}) {
  const [novoGastoNome, setNovoGastoNome] = useState('')
  const [novoGastoValor, setNovoGastoValor] = useState('')
  const [novoSalario, setNovoSalario] = useState(salario.toString())
  const [editandoSalario, setEditandoSalario] = useState(false)

  const handleAdicionarGasto = async (e) => {
    e.preventDefault()
    if (!novoGastoNome || !novoGastoValor) return

    await adicionarGasto(novoGastoNome, novoGastoValor)
    setNovoGastoNome('')
    setNovoGastoValor('')
  }

  const handleSalvarSalario = async () => {
    const valor = parseFloat(novoSalario)
    if (valor <= 0) return

    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', 'salario'), {
        tipo: 'salario',
        valor
      })
      setSalario(valor)
      setEditandoSalario(false)
    } catch (error) {
      console.error('Erro ao salvar salário:', error)
    }
  }

  // Preparar dados para gráfico
  const gastosPorCategoria = {}
  gastos.forEach(g => {
    if (!gastosPorCategoria[g.nome]) {
      gastosPorCategoria[g.nome] = 0
    }
    gastosPorCategoria[g.nome] += g.valor
  })

  const chartData = Object.entries(gastosPorCategoria).map(([nome, valor]) => ({
    name: nome,
    value: parseFloat(valor.toFixed(2))
  }))

  const saldo = salario - totalGastos
  const percentualGasto = salario > 0 ? (totalGastos / salario * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Seção Salário */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Salário do Mês</p>
            <p className="text-4xl font-bold">
              R$ {salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm mt-2 opacity-75">
              Disponível: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setEditandoSalario(!editandoSalario)}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {editandoSalario ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {editandoSalario && (
          <div className="mt-4 flex gap-2">
            <input
              type="number"
              value={novoSalario}
              onChange={(e) => setNovoSalario(e.target.value)}
              className="flex-1 px-3 py-2 rounded text-black"
              placeholder="Digite o novo salário"
            />
            <button
              onClick={handleSalvarSalario}
              className="bg-white text-primary px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        {chartData.length > 0 ? (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-4">Distribuição de Gastos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `R$ ${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600">Nenhum gasto registrado ainda</p>
          </div>
        )}

        {/* Adicionar Gasto */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Adicionar Novo Gasto</h3>
          <form onSubmit={handleAdicionarGasto} className="space-y-3">
            <input
              type="text"
              placeholder="Nome do gasto (ex: Supermercado)"
              value={novoGastoNome}
              onChange={(e) => setNovoGastoNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
            <input
              type="number"
              placeholder="Valor (ex: 150.50)"
              value={novoGastoValor}
              onChange={(e) => setNovoGastoValor(e.target.value)}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-green-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} /> Adicionar Gasto
            </button>
          </form>

          {/* Resumo Rápido */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">📊 Resumo</p>
            <div className="space-y-1 text-sm text-blue-800">
              <p>Total: R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p>Percentual: {percentualGasto}%</p>
              <p className={saldo >= 0 ? 'text-green-700' : 'text-red-700'}>
                Saldo: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Gastos */}
      {gastos.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">Seus Gastos</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {gastos.map(gasto => (
              <div
                key={gasto.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-primary" />
                  <div>
                    <p className="font-semibold">{gasto.nome}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(gasto.data?.toDate?.() || gasto.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-primary">
                    R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <button
                    onClick={() => deletarGasto(gasto.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
