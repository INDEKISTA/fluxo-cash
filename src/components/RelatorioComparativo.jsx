import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'

export default function RelatorioComparativo({ gastos, isDark }) {
  // Calcular gastos por mês (últimos 3 meses)
  const calcularGastosMes = (mes, ano) => {
    return gastos.filter(g => {
      const data = new Date(g.data?.toDate?.() || g.data)
      return data.getMonth() === mes && data.getFullYear() === ano
    }).reduce((acc, g) => acc + g.valor, 0)
  }

  const julho = calcularGastosMes(6, 2026)
  const agosto = calcularGastosMes(7, 2026)
  const setembro = calcularGastosMes(8, 2026)

  // Crescimento %
  const crescJulhoAgosto = julho > 0 ? ((agosto - julho) / julho * 100).toFixed(1) : 0
  const crescAgostoSetembro = agosto > 0 ? ((setembro - agosto) / agosto * 100).toFixed(1) : 0

  // Previsão outubro (extrapolação linear)
  const tendencia = setembro - agosto
  const previsaoOutubro = setembro + tendencia

  // Gastos por categoria nos últimos 3 meses
  const gastosUltimos3Meses = gastos.filter(g => {
    const data = new Date(g.data?.toDate?.() || g.data)
    const mes = data.getMonth()
    const ano = data.getFullYear()
    return (
      (ano === 2026 && (mes === 6 || mes === 7 || mes === 8))
    )
  })

  // Agrupar por categoria
  const categoriasGastos = {}
  gastosUltimos3Meses.forEach(g => {
    const categoria = g.categoria || 'outros'
    if (!categoriasGastos[categoria]) {
      categoriasGastos[categoria] = 0
    }
    categoriasGastos[categoria] += g.valor
  })

  // Top 3 categorias
  const top3Categorias = Object.entries(categoriasGastos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, valor]) => ({
      categoria: cat,
      valor: valor,
      percentual: ((valor / (julho + agosto + setembro)) * 100).toFixed(1)
    }))

  // Dados para gráfico
  const dadosComparativo = [
    { mes: 'Julho', valor: julho, previsao: 0 },
    { mes: 'Agosto', valor: agosto, previsao: 0 },
    { mes: 'Setembro', valor: setembro, previsao: 0 },
    { mes: 'Outubro*', valor: 0, previsao: Math.round(previsaoOutubro) }
  ]

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

  // Insights
  const maiorMes = Math.max(julho, agosto, setembro)
  const menorMes = Math.min(julho, agosto, setembro)
  const mediaMeses = (julho + agosto + setembro) / 3
  const tendenciaTexto = tendencia > 0 ? '📈 Aumentando' : tendencia < 0 ? '📉 Diminuindo' : '➡️ Estável'

  return (
    <div className="space-y-6">
      {/* Cards de Crescimento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDark ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            {crescJulhoAgosto >= 0 ? <TrendingUp size={20} className="text-red-500" /> : <TrendingDown size={20} className="text-green-500" />}
            <h3 className={`font-bold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>Julho → Agosto</h3>
          </div>
          <p className={`text-3xl font-bold ${crescJulhoAgosto >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {crescJulhoAgosto >= 0 ? '+' : ''}{crescJulhoAgosto}%
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            R$ {julho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → R$ {agosto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`${isDark ? 'bg-purple-900 border-purple-800' : 'bg-purple-50 border-purple-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            {crescAgostoSetembro >= 0 ? <TrendingUp size={20} className="text-red-500" /> : <TrendingDown size={20} className="text-green-500" />}
            <h3 className={`font-bold ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>Agosto → Setembro</h3>
          </div>
          <p className={`text-3xl font-bold ${crescAgostoSetembro >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {crescAgostoSetembro >= 0 ? '+' : ''}{crescAgostoSetembro}%
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            R$ {agosto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → R$ {setembro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`${isDark ? 'bg-orange-900 border-orange-800' : 'bg-orange-50 border-orange-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-orange-500" />
            <h3 className={`font-bold ${isDark ? 'text-orange-200' : 'text-orange-900'}`}>Previsão Outubro</h3>
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
            R$ {Math.round(previsaoOutubro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {tendenciaTexto} ({tendencia > 0 ? '+' : ''}R$ {Math.round(tendencia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
          </p>
        </div>
      </div>

      {/* Gráfico Comparativo */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📊 Comparativo Últimos 3 Meses + Previsão
        </h3>
        <ResponsiveContainer width="100%" height={350}>
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
            <Bar dataKey="valor" fill="#10b981" name="Gasto Real" radius={[8, 8, 0, 0]} />
            <Bar dataKey="previsao" fill="#f59e0b" name="Previsão" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo de Insights */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💡 Insights & Análise
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📈 Maior Mês</p>
            <p className={`text-2xl font-bold text-red-500 mt-1`}>
              R$ {maiorMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📉 Menor Mês</p>
            <p className={`text-2xl font-bold text-green-500 mt-1`}>
              R$ {menorMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📊 Média</p>
            <p className={`text-2xl font-bold text-blue-500 mt-1`}>
              R$ {mediaMeses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📈 Tendência</p>
            <p className={`text-2xl font-bold mt-1`}>
              {tendenciaTexto}
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Categorias */}
      {top3Categorias.length > 0 && (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🏆 Top 3 Categorias (Últimos 3 Meses)
          </h3>
          <div className="space-y-3">
            {top3Categorias.map((cat, index) => (
              <div key={cat.categoria} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-yellow-500">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {cat.categoria.charAt(0).toUpperCase() + cat.categoria.slice(1)}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {cat.percentual}%
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${cat.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observações */}
      <div className={`${isDark ? 'bg-yellow-900 border-yellow-800 text-yellow-200' : 'bg-yellow-50 border-yellow-300 text-yellow-900'} p-4 rounded-lg border flex gap-3`}>
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold mb-1">ℹ️ Observações</p>
          <p>* Previsão de Outubro é baseada na tendência linear dos últimos 3 meses. Resultados reais podem variar.</p>
        </div>
      </div>
    </div>
  )
}