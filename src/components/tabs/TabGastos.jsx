import { useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2, DollarSign, Edit2, Check, X } from 'lucide-react'
import { db } from '../../firebase'
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function TabGastos({
  salario,
  setSalario,
  user,
  gastos,
  totalGastos,
  isDark
}) {
  const [novoGastoNome, setNovoGastoNome] = useState('')
  const [novoGastoValor, setNovoGastoValor] = useState('')
  const [novoSalario, setNovoSalario] = useState(salario.toString())
  const [editandoSalario, setEditandoSalario] = useState(false)
  const [editandoGasto, setEditandoGasto] = useState(null)
  const [editarNome, setEditarNome] = useState('')
  const [editarValor, setEditarValor] = useState('')

  // Filtrar gastos do mês atual
  const mesAtual = new Date().getMonth()
  const anoAtual = new Date().getFullYear()

  const gastosMes = gastos.filter(g => {
    const data = new Date(g.data?.toDate?.() || g.data)
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
  })

  const totalGastosMes = gastosMes.reduce((acc, g) => acc + g.valor, 0)

  const handleAdicionarGasto = async (e) => {
    e.preventDefault()
    if (!novoGastoNome || !novoGastoValor) return

    try {
      const novoGastoId = Date.now().toString()
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', novoGastoId), {
        tipo: 'gasto',
        nome: novoGastoNome,
        valor: parseFloat(novoGastoValor),
        data: new Date(),
        pago: false
      })
      setNovoGastoNome('')
      setNovoGastoValor('')
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error)
      alert('Erro ao adicionar gasto: ' + error.message)
    }
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

  const handleDeletarGasto = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este gasto?')) return

    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'dados', id))
    } catch (error) {
      console.error('Erro ao deletar gasto:', error)
      alert('Erro ao deletar: ' + error.message)
    }
  }

  const handleEditarGasto = (gasto) => {
    setEditandoGasto(gasto.id)
    setEditarNome(gasto.nome)
    setEditarValor(gasto.valor.toString())
  }

  const handleSalvarEdicao = async (id) => {
    if (!editarNome || !editarValor) return

    try {
      await updateDoc(doc(db, 'usuarios', user.uid, 'dados', id), {
        nome: editarNome,
        valor: parseFloat(editarValor)
      })
      setEditandoGasto(null)
    } catch (error) {
      console.error('Erro ao editar gasto:', error)
      alert('Erro ao editar: ' + error.message)
    }
  }

  const handleCancelarEdicao = () => {
    setEditandoGasto(null)
    setEditarNome('')
    setEditarValor('')
  }

  // Preparar dados para gráfico
  const gastosPorCategoria = {}
  gastosMes.forEach(g => {
    if (!gastosPorCategoria[g.nome]) {
      gastosPorCategoria[g.nome] = 0
    }
    gastosPorCategoria[g.nome] += g.valor
  })

  const chartData = Object.entries(gastosPorCategoria).map(([nome, valor]) => ({
    name: nome,
    value: parseFloat(valor.toFixed(2))
  }))

  const saldo = salario - totalGastosMes
  const percentualGasto = salario > 0 ? (totalGastosMes / salario * 100).toFixed(1) : 0

  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6">
      {/* Seção Salário */}
      <div className={`bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-700 dark:to-blue-700 text-white p-6 rounded-lg transition-colors`}>
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
            className="bg-white dark:bg-gray-800 text-green-600 dark:text-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
              className="bg-white dark:bg-gray-800 text-green-600 dark:text-yellow-400 px-4 py-2 rounded font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        {chartData.length > 0 ? (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-4 rounded-lg border transition-colors`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Distribuição de Gastos - {nomeMes}
            </h3>
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
                    backgroundColor: isDark ? '#1f2937' : '#fff',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '8px',
                    color: isDark ? '#fff' : '#000'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} p-6 rounded-lg text-center transition-colors`}>
            <p>Nenhum gasto registrado neste mês</p>
          </div>
        )}

        {/* Adicionar Gasto */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Adicionar Novo Gasto
          </h3>
          <form onSubmit={handleAdicionarGasto} className="space-y-3">
            <input
              type="text"
              placeholder="Nome do gasto (ex: Supermercado)"
              value={novoGastoNome}
              onChange={(e) => setNovoGastoNome(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 transition ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
            <input
              type="number"
              placeholder="Valor (ex: 150.50)"
              value={novoGastoValor}
              onChange={(e) => setNovoGastoValor(e.target.value)}
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 transition ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} /> Adicionar Gasto
            </button>
          </form>

          {/* Resumo Rápido */}
          <div className={`${isDark ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'} p-4 rounded-lg border transition-colors`}>
            <p className="text-sm font-semibold mb-2">📊 Resumo de {nomeMes}</p>
            <div className="space-y-1 text-sm">
              <p>Total: R$ {totalGastosMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p>Percentual: {percentualGasto}%</p>
              <p className={saldo >= 0 ? (isDark ? 'text-green-400' : 'text-green-700') : (isDark ? 'text-red-400' : 'text-red-700')}>
                Saldo: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Gastos */}
      {gastosMes.length > 0 && (
        <div>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Seus Gastos de {nomeMes}
          </h3>
          <div className={`space-y-2 max-h-96 overflow-y-auto p-2 ${isDark ? 'bg-gray-800 rounded-lg' : ''}`}>
            {gastosMes.map(gasto => (
              <div
                key={gasto.id}
                className={`flex justify-between items-center p-4 rounded-lg transition ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {editandoGasto === gasto.id ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editarNome}
                      onChange={(e) => setEditarNome(e.target.value)}
                      className={`flex-1 px-2 py-1 rounded text-sm ${
                        isDark 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-black border border-gray-300'
                      }`}
                    />
                    <input
                      type="number"
                      value={editarValor}
                      onChange={(e) => setEditarValor(e.target.value)}
                      step="0.01"
                      className={`w-24 px-2 py-1 rounded text-sm ${
                        isDark 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-white text-black border border-gray-300'
                      }`}
                    />
                    <button
                      onClick={() => handleSalvarEdicao(gasto.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={handleCancelarEdicao}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <DollarSign size={20} className="text-green-500 dark:text-green-400" />
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {gasto.nome}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(gasto.data?.toDate?.() || gasto.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <button
                        onClick={() => handleEditarGasto(gasto)}
                        className={`${isDark ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-500 hover:bg-blue-50'} p-2 rounded transition`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletarGasto(gasto.id)}
                        className={`${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'} p-2 rounded transition`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}