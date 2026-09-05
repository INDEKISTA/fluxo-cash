import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Plus, Trash2, DollarSign, Edit2, Check, X, TrendingUp, TrendingDown } from 'lucide-react'
import { db } from '../../firebase'
import { doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { CATEGORIAS_PADRAO } from '../../categorias'

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#14b8a6', '#6366f1', '#6b7280']

export default function TabGastos({ salario, setSalario, user, gastos, totalGastos, isDark }) {
  const [novoGastoNome, setNovoGastoNome] = useState('')
  const [novoGastoValor, setNovoGastoValor] = useState('')
  const [novoGastoCategoria, setNovoGastoCategoria] = useState('outros')
  const [novoSalario, setNovoSalario] = useState(salario.toString())
  const [editandoSalario, setEditandoSalario] = useState(false)
  const [editandoGasto, setEditandoGasto] = useState(null)
  const [editarNome, setEditarNome] = useState('')
  const [editarValor, setEditarValor] = useState('')
  const [editarCategoria, setEditarCategoria] = useState('')
  const [categorias, setCategorias] = useState(CATEGORIAS_PADRAO)
  const [mostrarsAdicionarCategoria, setMostrarAdicionarCategoria] = useState(false)
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('')
  const [meta, setMeta] = useState(0)
  const [editandoMeta, setEditandoMeta] = useState(false)
  const [novoMeta, setNovoMeta] = useState('0')

  useEffect(() => {
    carregarCategorias()
  }, [user])

  useEffect(() => {
    carregarMeta()
  }, [user])

  const carregarCategorias = async () => {
    try {
      const docRef = doc(db, 'usuarios', user.uid, 'dados', 'categorias-personalizadas')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const categoriasPersonalizadas = docSnap.data().categorias || []
        setCategorias([...CATEGORIAS_PADRAO, ...categoriasPersonalizadas])
      } else {
        setCategorias(CATEGORIAS_PADRAO)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      setCategorias(CATEGORIAS_PADRAO)
    }
  }

  const carregarMeta = async () => {
    try {
      const docRef = doc(db, 'usuarios', user.uid, 'dados', 'meta')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setMeta(docSnap.data().valor || 0)
        setNovoMeta(docSnap.data().valor?.toString() || '0')
      }
    } catch (error) {
      console.error('Erro ao carregar meta:', error)
    }
  }

  const salvarCategoriasNoFirestore = async (novasCategorias) => {
    try {
      const categoriasPersonalizadas = novasCategorias.filter(
        c => !CATEGORIAS_PADRAO.find(p => p.id === c.id)
      )
      
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', 'categorias-personalizadas'), {
        tipo: 'categorias-personalizadas',
        categorias: categoriasPersonalizadas,
        dataAtualizacao: new Date()
      })
    } catch (error) {
      console.error('Erro ao salvar categorias:', error)
    }
  }

  const mesAtual = new Date().getMonth()
  const anoAtual = new Date().getFullYear()

  const gastosMes = gastos.filter(g => {
    const data = new Date(g.data?.toDate?.() || g.data)
    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
  })

  const totalGastosMes = gastosMes.reduce((acc, g) => acc + g.valor, 0)

  // Calcular gastos dos últimos 3 meses
  const calcularGastosMes = (mes, ano) => {
    return gastos.filter(g => {
      const data = new Date(g.data?.toDate?.() || g.data)
      return data.getMonth() === mes && data.getFullYear() === ano
    }).reduce((acc, g) => acc + g.valor, 0)
  }

  const setembro = calcularGastosMes(8, 2026)
  const agosto = calcularGastosMes(7, 2026)
  const julho = calcularGastosMes(6, 2026)

  const dadosComparativo = [
    { mes: 'Julho', valor: julho },
    { mes: 'Agosto', valor: agosto },
    { mes: 'Setembro', valor: setembro }
  ]

  const diferenca = setembro - agosto
  const tendencia = diferenca > 0 ? 'Aumento' : 'Redução'

  const handleAdicionarGasto = async (e) => {
    e.preventDefault()
    if (!novoGastoNome || !novoGastoValor) return

    try {
      const novoGastoId = Date.now().toString()
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', novoGastoId), {
        tipo: 'gasto',
        nome: novoGastoNome,
        valor: parseFloat(novoGastoValor),
        categoria: novoGastoCategoria,
        data: new Date(),
        pago: false
      })
      setNovoGastoNome('')
      setNovoGastoValor('')
      setNovoGastoCategoria('outros')
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
    setEditarCategoria(gasto.categoria || 'outros')
  }

  const handleSalvarEdicao = async (id) => {
    if (!editarNome || !editarValor) return

    try {
      await updateDoc(doc(db, 'usuarios', user.uid, 'dados', id), {
        nome: editarNome,
        valor: parseFloat(editarValor),
        categoria: editarCategoria
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
    setEditarCategoria('')
  }

  const handleAdicionarCategoria = async () => {
    if (!novaCategoriaNome.trim()) return

    const novaCategoria = {
      id: novaCategoriaNome.toLowerCase().replace(/\s+/g, '-'),
      nome: novaCategoriaNome,
      emoji: '✨',
      cor: COLORS[Math.floor(Math.random() * COLORS.length)]
    }

    const novasCategorias = [...categorias, novaCategoria]
    setCategorias(novasCategorias)
    
    await salvarCategoriasNoFirestore(novasCategorias)
    
    setNovaCategoriaNome('')
    setMostrarAdicionarCategoria(false)
  }

  const handleDeletarCategoria = async (idCategoria) => {
    if (!window.confirm('Tem certeza que deseja deletar esta categoria?')) return

    const novasCategorias = categorias.filter(c => c.id !== idCategoria)
    setCategorias(novasCategorias)
    
    await salvarCategoriasNoFirestore(novasCategorias)
  }

  const handleSalvarMeta = async () => {
    const valorMeta = parseFloat(novoMeta)
    if (valorMeta < 0) return

    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', 'meta'), {
        tipo: 'meta',
        valor: valorMeta,
        mes: mesAtual,
        ano: anoAtual
      })
      setMeta(valorMeta)
      setEditandoMeta(false)
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
    }
  }

  const handleDeletarMeta = async () => {
    setMeta(0)
    setNovoMeta('0')
    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', 'meta'), {
        tipo: 'meta',
        valor: 0
      })
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
    }
  }

  const gastosPorCategoria = {}
  gastosMes.forEach(g => {
    const categoria = categorias.find(c => c.id === (g.categoria || 'outros'))
    const chave = categoria?.nome || 'Outros'
    if (!gastosPorCategoria[chave]) {
      gastosPorCategoria[chave] = {
        value: 0,
        cor: categoria?.cor || '#6b7280',
        emoji: categoria?.emoji || '✅',
        id: categoria?.id || 'outros'
      }
    }
    gastosPorCategoria[chave].value += g.valor
  })

  const chartData = Object.entries(gastosPorCategoria).map(([nome, dados]) => ({
    name: `${dados.emoji} ${nome}`,
    value: parseFloat(dados.value.toFixed(2)),
    color: dados.cor
  }))

  const saldo = salario - totalGastosMes
  const percentualGasto = salario > 0 ? (totalGastosMes / salario * 100).toFixed(1) : 0
  const nomeMes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const maiorGasto = Object.entries(gastosPorCategoria).length > 0 
    ? Object.entries(gastosPorCategoria).reduce((a, b) => b[1].value > a[1].value ? b : a)
    : null

  const menorGasto = Object.entries(gastosPorCategoria).length > 0
    ? Object.entries(gastosPorCategoria).reduce((a, b) => b[1].value < a[1].value ? b : a)
    : null

  const mediaGasto = Object.keys(gastosPorCategoria).length > 0
    ? totalGastosMes / Object.keys(gastosPorCategoria).length
    : 0

  return (
    <div className="space-y-6">
      {/* Salário */}
      <div className={`bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-700 dark:to-blue-700 text-white p-6 rounded-lg`}>
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
            className="bg-white dark:bg-gray-800 text-green-600 dark:text-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
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
              className="bg-white dark:bg-gray-800 text-green-600 dark:text-yellow-400 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      {/* Meta de Economia */}
      <div className={`${isDark ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-100 to-pink-100'} p-6 rounded-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎯 Meta - {nomeMes}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditandoMeta(!editandoMeta)}
              className={`px-3 py-1 rounded font-semibold ${
                isDark 
                  ? 'bg-white text-purple-600 hover:bg-gray-100' 
                  : 'bg-white text-purple-600 hover:bg-gray-50'
              }`}
            >
              {editandoMeta ? 'Cancelar' : 'Editar'}
            </button>
            {meta > 0 && !editandoMeta && (
              <button
                onClick={handleDeletarMeta}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Deletar
              </button>
            )}
          </div>
        </div>

        {editandoMeta && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={novoMeta}
              onChange={(e) => setNovoMeta(e.target.value)}
              placeholder="Digite sua meta"
              className={`flex-1 px-3 py-2 rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
              step="0.01"
            />
            <button
              onClick={handleSalvarMeta}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
            >
              Salvar
            </button>
          </div>
        )}

        <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between mb-2">
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Meta: R$ {meta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Saldo: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {meta > 0 ? (
            <>
              <div className={`w-full h-6 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <div
                  className={`h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-white ${
                    saldo >= meta
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}
                  style={{ width: `${Math.min((saldo / meta) * 100, 100)}%` }}
                >
                  {saldo > 0 && Math.round((saldo / meta) * 100)}%
                </div>
              </div>
              
              <div className="mt-3 text-center">
                {saldo >= meta ? (
                  <div className="p-3 rounded-lg bg-green-900 text-green-200">
                    <p className="font-bold text-lg">🎉 META ATINGIDA!</p>
                    <p className="text-sm">Economizou R$ {(saldo - meta).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}!</p>
                  </div>
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Faltam <span className="font-bold text-orange-500">R$ {(meta - saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Defina uma meta! 🎯
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico + Cards */}
        {chartData.length > 0 ? (
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
            <h3 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📊 Distribuição - {nomeMes}
            </h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Gráfico */}
              <div className="col-span-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `R$ ${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        color: isDark ? '#fff' : '#000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Cards */}
              <div className="space-y-3 col-span-1">
                {maiorGasto && (
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-900'}`}>
                    <p className="text-xs font-semibold opacity-75">💰 Maior</p>
                    <p className="font-bold text-sm mt-1">{maiorGasto[0].split(' ')[1]}</p>
                    <p className="text-xs mt-1">R$ {maiorGasto[1].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}

                {menorGasto && (
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-900'}`}>
                    <p className="text-xs font-semibold opacity-75">📉 Menor</p>
                    <p className="font-bold text-sm mt-1">{menorGasto[0].split(' ')[1]}</p>
                    <p className="text-xs mt-1">R$ {menorGasto[1].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}

                <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-900'}`}>
                  <p className="text-xs font-semibold opacity-75">📊 Média</p>
                  <p className="font-bold text-sm mt-1">{Object.keys(gastosPorCategoria).length} cats</p>
                  <p className="text-xs mt-1">R$ {mediaGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              {chartData.map((item, index) => (
                <div key={index} className={`flex items-center gap-2 p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} p-6 rounded-lg text-center`}>
            <p>Nenhum gasto registrado</p>
          </div>
        )}

        {/* Adicionar Gasto */}
        <div className="space-y-4">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Adicionar Gasto
          </h3>
          <form onSubmit={handleAdicionarGasto} className="space-y-3">
            <input
              type="text"
              placeholder="Nome"
              value={novoGastoNome}
              onChange={(e) => setNovoGastoNome(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
              required
            />

            <select
              value={novoGastoCategoria}
              onChange={(e) => setNovoGastoCategoria(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
            >
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Valor"
              value={novoGastoValor}
              onChange={(e) => setNovoGastoValor(e.target.value)}
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-black'
              }`}
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Adicionar
            </button>

            <button
              type="button"
              onClick={() => setMostrarAdicionarCategoria(!mostrarsAdicionarCategoria)}
              className={`w-full py-2 rounded-lg font-bold ${
                isDark
                  ? 'bg-blue-900 hover:bg-blue-800 text-blue-200'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
              }`}
            >
              <Plus size={16} className="inline mr-2" /> Categoria
            </button>

            {mostrarsAdicionarCategoria && (
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={novaCategoriaNome}
                  onChange={(e) => setNovaCategoriaNome(e.target.value)}
                  className={`w-full px-3 py-2 border rounded mb-2 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAdicionarCategoria}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
                >
                  Criar
                </button>
              </div>
            )}
          </form>

          <div className={`${isDark ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'} p-4 rounded-lg border`}>
            <p className="text-sm font-semibold mb-2">📊 Resumo</p>
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

      {/* Comparativo Mês a Mês */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <div className="flex items-center gap-3 mb-6">
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📈 Comparativo Mês a Mês
          </h3>
          {diferenca !== 0 && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              diferenca > 0 
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
            }`}>
              {diferenca > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-bold">
                {tendencia} R$ {Math.abs(diferenca).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosComparativo}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="mes" stroke={isDark ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#fff',
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: isDark ? '#fff' : '#000'
              }}
              formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="valor" fill="#10b981" name="Gasto Total" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Julho</p>
            <p className={`font-bold text-lg mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              R$ {julho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Agosto</p>
            <p className={`font-bold text-lg mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              R$ {agosto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-4 rounded-lg text-center border-2 border-green-500 ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-green-300' : 'text-green-600'}`}>Setembro (Atual)</p>
            <p className={`font-bold text-lg mt-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
              R$ {setembro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Categorias */}
      {categorias.length > CATEGORIAS_PADRAO.length && (
        <div>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ⚙️ Categorias
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categorias.filter(c => !CATEGORIAS_PADRAO.find(p => p.id === c.id)).map(cat => (
              <div
                key={cat.id}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: cat.cor }}>●</span>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cat.emoji} {cat.nome}
                  </span>
                </div>
                <button
                  onClick={() => handleDeletarCategoria(cat.id)}
                  className={`${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'} p-1 rounded`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Gastos */}
      {gastosMes.length > 0 && (
        <div>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Gastos de {nomeMes}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(gastosPorCategoria).map(([nomeCat, dados]) => (
              <div key={nomeCat} className={`${isDark ? 'bg-gray-700 rounded-lg overflow-hidden' : 'bg-gray-50 rounded-lg border border-gray-200'}`}>
                <div className={`p-3 flex items-center gap-2 font-semibold ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`} style={{ borderLeft: `4px solid ${dados.cor}` }}>
                  <span style={{ color: dados.cor }}>●</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{nomeCat}</span>
                  <span className={`ml-auto font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    R$ {dados.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="space-y-2 p-2">
                  {gastosMes.filter(g => (g.categoria || 'outros') === dados.id).map(gasto => (
                    <div
                      key={gasto.id}
                      className={`flex justify-between items-center p-3 rounded ${
                        isDark 
                          ? 'bg-gray-600 hover:bg-gray-500' 
                          : 'bg-white hover:bg-gray-50'
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
                                ? 'bg-gray-500 text-white' 
                                : 'bg-white text-black border border-gray-300'
                            }`}
                          />
                          <select
                            value={editarCategoria}
                            onChange={(e) => setEditarCategoria(e.target.value)}
                            className={`px-2 py-1 rounded text-sm ${
                              isDark 
                                ? 'bg-gray-500 text-white' 
                                : 'bg-white text-black border border-gray-300'
                            }`}
                          >
                            {categorias.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.emoji} {cat.nome}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={editarValor}
                            onChange={(e) => setEditarValor(e.target.value)}
                            step="0.01"
                            className={`w-24 px-2 py-1 rounded text-sm ${
                              isDark 
                                ? 'bg-gray-500 text-white' 
                                : 'bg-white text-black border border-gray-300'
                            }`}
                          />
                          <button
                            onClick={() => handleSalvarEdicao(gasto.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelarEdicao}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded"
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
                              className={`${isDark ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-500 hover:bg-blue-50'} p-2 rounded`}
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletarGasto(gasto.id)}
                              className={`${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'} p-2 rounded`}
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}