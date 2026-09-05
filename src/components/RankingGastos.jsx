import { Trophy, TrendingUp } from 'lucide-react'
import { gerarRankingGastos } from '../utils/ranking'
import { useMemo } from 'react'

const COLORS = [
  '#fbbf24', // ouro
  '#c0c0c0', // prata
  '#cd7f32', // bronze
  '#3b82f6', // azul
  '#8b5cf6'  // roxo
]

export default function RankingGastos({ gastos, totalGastos, isDark }) {
  const ranking = useMemo(() => {
    const mesAtual = new Date().getMonth()
    const anoAtual = new Date().getFullYear()

    const gastosMes = gastos.filter(g => {
      const data = new Date(g.data?.toDate?.() || g.data)
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
    })

    return gerarRankingGastos(gastosMes)
  }, [gastos])

  if (ranking.topDespesas.length === 0) {
    return null
  }

  // Calcular percentual de cada categoria
  const topCategoriasComPercentual = ranking.topCategorias.map(cat => ({
    ...cat,
    percentual: totalGastos > 0 ? (cat.total / totalGastos) * 100 : 0
  }))

  return (
    <div className="space-y-6">
      {/* TOP 5 MAIORES DESPESAS */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Trophy size={24} className="text-yellow-500" /> Top 5 Maiores Despesas
        </h3>

        <div className="space-y-3">
          {ranking.topDespesas.map((despesa, index) => {
            const percentualDeSalario = (despesa.valor / (despesa.valor * 5)).toFixed(1) // simplificado
            const percentualDoTotal = totalGastos > 0 ? ((despesa.valor / totalGastos) * 100).toFixed(1) : 0

            return (
              <div
                key={despesa.id}
                className={`p-4 rounded-lg flex items-center gap-4 transition-all hover:shadow-lg ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                style={{
                  borderLeft: `4px solid ${COLORS[index]}`
                }}
              >
                {/* Posição */}
                <div className="flex-shrink-0">
                  <span className="text-3xl font-bold">{despesa.emoji}</span>
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {despesa.nome}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(despesa.data?.toDate?.() || despesa.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Valor e Percentual */}
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {percentualDoTotal}% do total
                  </p>
                </div>

                {/* Barra de progresso */}
                <div className="hidden md:flex flex-col gap-1 w-20">
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(percentualDoTotal, 100)}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* TOP 5 CATEGORIAS */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <TrendingUp size={24} className="text-blue-500" /> Categorias com Maior Consumo
        </h3>

        <div className="space-y-4">
          {topCategoriasComPercentual.map((categoria, index) => (
            <div key={categoria.categoria} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{categoria.emoji}</span>
                  <div>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {categoria.categoria}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {categoria.quantidade} gasto{categoria.quantidade > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                    R$ {categoria.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    {categoria.percentual.toFixed(1)}% do total
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(categoria.percentual, 100)}%`,
                    backgroundColor: COLORS[index]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDark ? 'bg-gradient-to-br from-yellow-900 to-yellow-800' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'} p-4 rounded-lg`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-yellow-200' : 'text-yellow-900'}`}>
            🥇 Maior Despesa
          </p>
          <p className={`text-lg font-bold mt-2 ${isDark ? 'text-yellow-100' : 'text-yellow-900'}`}>
            {ranking.maiorDespesa?.nome}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
            R$ {ranking.maiorDespesa?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-50 to-red-100'} p-4 rounded-lg`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-red-200' : 'text-red-900'}`}>
            📉 Menor Despesa
          </p>
          <p className={`text-lg font-bold mt-2 ${isDark ? 'text-red-100' : 'text-red-900'}`}>
            {ranking.menorDespesa?.nome}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-800'}`}>
            R$ {ranking.menorDespesa?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-50 to-green-100'} p-4 rounded-lg`}>
          <p className={`text-sm font-semibold ${isDark ? 'text-green-200' : 'text-green-900'}`}>
            📊 Total de Gastos
          </p>
          <p className={`text-lg font-bold mt-2 ${isDark ? 'text-green-100' : 'text-green-900'}`}>
            {ranking.topDespesas.length} no top
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-green-300' : 'text-green-800'}`}>
            Representam o ranking
          </p>
        </div>
      </div>
    </div>
  )
}