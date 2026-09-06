import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'

export default function GraficoEvolucao({ gastos, isDark }) {
  // Calcular gastos por mês (últimos 6 meses)
  const calcularGastosMes = (mes, ano) => {
    return gastos.filter(g => {
      const data = new Date(g.data?.toDate?.() || g.data)
      return data.getMonth() === mes && data.getFullYear() === ano
    }).reduce((acc, g) => acc + g.valor, 0)
  }

  // Dados dos últimos 6 meses (abril a setembro 2026)
  const abril = calcularGastosMes(3, 2026)
  const maio = calcularGastosMes(4, 2026)
  const junho = calcularGastosMes(5, 2026)
  const julho = calcularGastosMes(6, 2026)
  const agosto = calcularGastosMes(7, 2026)
  const setembro = calcularGastosMes(8, 2026)

  // Calcular tendência linear (regressão linear simples)
  const meses = [abril, maio, junho, julho, agosto, setembro]
  const n = meses.length
  const somaX = (n * (n - 1)) / 2 // 0+1+2+3+4+5
  const somaY = meses.reduce((a, b) => a + b, 0)
  const somaXY = meses.reduce((acc, val, idx) => acc + idx * val, 0)
  const somaX2 = (n * (n - 1) * (2 * n - 1)) / 6 // 0+1+4+9+16+25

  const inclinacao = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX)
  const intersecao = (somaY - inclinacao * somaX) / n

  // Previsão para próximos 3 meses (outubro, novembro, dezembro)
  const outubro = inclinacao * 6 + intersecao
  const novembro = inclinacao * 7 + intersecao
  const dezembro = inclinacao * 8 + intersecao

  // Dados do gráfico
  const dados = [
    { mes: 'Abr', valor: abril, tipo: 'real' },
    { mes: 'Mai', valor: maio, tipo: 'real' },
    { mes: 'Jun', valor: junho, tipo: 'real' },
    { mes: 'Jul', valor: julho, tipo: 'real' },
    { mes: 'Ago', valor: agosto, tipo: 'real' },
    { mes: 'Set', valor: setembro, tipo: 'real' },
    { mes: 'Out*', valor: Math.max(0, Math.round(outubro)), tipo: 'previsao' },
    { mes: 'Nov*', valor: Math.max(0, Math.round(novembro)), tipo: 'previsao' },
    { mes: 'Dez*', valor: Math.max(0, Math.round(dezembro)), tipo: 'previsao' }
  ]

  // Análise
  const media6meses = somaY / 6
  const ultimoMes = setembro
  const penultimoMes = agosto
  const variacao = ((ultimoMes - penultimoMes) / penultimoMes * 100).toFixed(1)
  const taxa = inclinacao.toFixed(1)
  const tendenciaTexto = taxa > 0 ? '📈 Crescimento' : taxa < 0 ? '📉 Redução' : '➡️ Estável'

  // Encontrar maior e menor gasto
  const maiorGasto = Math.max(abril, maio, junho, julho, agosto, setembro)
  const menorGasto = Math.min(abril, maio, junho, julho, agosto, setembro)

  return (
    <div className="space-y-6">
      {/* Cards de Análise */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className={taxa > 0 ? 'text-red-500' : 'text-green-500'} />
            <h3 className={`font-bold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>Tendência</h3>
          </div>
          <p className={`text-2xl font-bold ${taxa > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {tendenciaTexto}
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            R$ {Math.abs(taxa)}/mês
          </p>
        </div>

        <div className={`${isDark ? 'bg-purple-900 border-purple-800' : 'bg-purple-50 border-purple-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-purple-500" />
            <h3 className={`font-bold ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>Variação</h3>
          </div>
          <p className={`text-2xl font-bold ${variacao >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {variacao >= 0 ? '+' : ''}{variacao}%
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Set vs Ago
          </p>
        </div>

        <div className={`${isDark ? 'bg-green-900 border-green-800' : 'bg-green-50 border-green-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-green-500" />
            <h3 className={`font-bold ${isDark ? 'text-green-200' : 'text-green-900'}`}>Média</h3>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
            R$ {Math.round(media6meses).toLocaleString('pt-BR')}
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Últimos 6 meses
          </p>
        </div>

        <div className={`${isDark ? 'bg-orange-900 border-orange-800' : 'bg-orange-50 border-orange-200'} p-6 rounded-lg border`}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-orange-500" />
            <h3 className={`font-bold ${isDark ? 'text-orange-200' : 'text-orange-900'}`}>Out*</h3>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
            R$ {Math.round(outubro).toLocaleString('pt-BR')}
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Previsão
          </p>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📈 Evolução de Gastos (Últimos 6 meses + Previsão)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={dados}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValor)"
              name="Gastos"
              dot={{ fill: '#10b981', r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className={`text-xs mt-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          * Outubro, Novembro e Dezembro são previsões baseadas em tendência linear dos últimos 6 meses
        </p>
      </div>

      {/* Cards de Detalhes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💡 Análise Detalhada
          </h3>
          <div className="space-y-3">
            <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Maior Gasto</p>
              <p className={`text-lg font-bold text-red-500 mt-1`}>
                R$ {maiorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Menor Gasto</p>
              <p className={`text-lg font-bold text-green-500 mt-1`}>
                R$ {menorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Diferença</p>
              <p className={`text-lg font-bold text-blue-500 mt-1`}>
                R$ {(maiorGasto - menorGasto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📊 Meses Detalhados
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Abril</span>
              <span className="font-bold">R$ {abril.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Maio</span>
              <span className="font-bold">R$ {maio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Junho</span>
              <span className="font-bold">R$ {junho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Julho</span>
              <span className="font-bold">R$ {julho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Agosto</span>
              <span className="font-bold">R$ {agosto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Setembro</span>
              <span className="font-bold">R$ {setembro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className={`${isDark ? 'bg-yellow-900 border-yellow-800 text-yellow-200' : 'bg-yellow-50 border-yellow-300 text-yellow-900'} p-4 rounded-lg border flex gap-3`}>
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-bold mb-1">ℹ️ Como funciona</p>
          <p>A previsão é calculada usando regressão linear dos últimos 6 meses. Se sua tendência de gastos mudar, a previsão se ajustará automaticamente.</p>
        </div>
      </div>
    </div>
  )
}