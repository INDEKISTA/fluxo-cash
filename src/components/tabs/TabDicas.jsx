import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { gerarDicas } from '../../utils/dicasInteligentes'
import { AlertCircle, Lightbulb, TrendingDown, Target, CheckCircle } from 'lucide-react'

export default function TabDicas({ user, gastos, salario, isDark }) {
  const [dicas, setDicas] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarDicas = async () => {
      try {
        const mesAtual = new Date().getMonth()
        const anoAtual = new Date().getFullYear()

        // Filtrar gastos do mês
        const gastosMes = gastos.filter(g => {
          const data = new Date(g.data?.toDate?.() || g.data)
          return data.getMonth() === mesAtual && data.getFullYear() === anoAtual
        })

        const totalGastosMes = gastosMes.reduce((acc, g) => acc + g.valor, 0)

        // Calcular gastos por categoria
        const gastosPorCategoria = {}
        gastosMes.forEach(g => {
          const categoria = g.categoria || 'Outros'
          if (!gastosPorCategoria[categoria]) {
            gastosPorCategoria[categoria] = { value: 0 }
          }
          gastosPorCategoria[categoria].value += g.valor
        })

        // Gerar dicas
        const dicasGeradas = gerarDicas(gastosPorCategoria, totalGastosMes, salario)
        setDicas(dicasGeradas)
      } catch (error) {
        console.error('Erro ao carregar dicas:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarDicas()
  }, [gastos, salario, user])

  const getIconePorTipo = (tipo) => {
    switch (tipo) {
      case 'alerta':
        return <AlertCircle size={24} />
      case 'aviso':
        return <AlertCircle size={24} />
      case 'info':
        return <Lightbulb size={24} />
      case 'sucesso':
        return <CheckCircle size={24} />
      default:
        return <Lightbulb size={24} />
    }
  }

  const getCorPorTipo = (tipo) => {
    switch (tipo) {
      case 'alerta':
        return isDark
          ? 'bg-red-900 border-red-700 text-red-100'
          : 'bg-red-50 border-red-200 text-red-900'
      case 'aviso':
        return isDark
          ? 'bg-yellow-900 border-yellow-700 text-yellow-100'
          : 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'info':
        return isDark
          ? 'bg-blue-900 border-blue-700 text-blue-100'
          : 'bg-blue-50 border-blue-200 text-blue-900'
      case 'sucesso':
        return isDark
          ? 'bg-green-900 border-green-700 text-green-100'
          : 'bg-green-50 border-green-200 text-green-900'
      default:
        return isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const getCorIconePorTipo = (tipo) => {
    switch (tipo) {
      case 'alerta':
        return isDark ? 'text-red-400' : 'text-red-600'
      case 'aviso':
        return isDark ? 'text-yellow-400' : 'text-yellow-600'
      case 'info':
        return isDark ? 'text-blue-400' : 'text-blue-600'
      case 'sucesso':
        return isDark ? 'text-green-400' : 'text-green-600'
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600'
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          ⏳ Carregando dicas...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} p-6 rounded-lg`}>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💡 Dicas Inteligentes
        </h2>
        <p className={`${isDark ? 'text-blue-200' : 'text-blue-900'}`}>
          Análise automática dos seus gastos com sugestões de economia
        </p>
      </div>

      {dicas.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'bg-gray-800 rounded-lg' : 'bg-gray-50 rounded-lg'}`}>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Nenhuma dica disponível. Registre mais gastos!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dicas.map((dica) => (
            <div
              key={dica.id}
              className={`p-6 rounded-lg border-2 flex gap-4 ${getCorPorTipo(dica.tipo)}`}
            >
              <div className={`flex-shrink-0 ${getCorIconePorTipo(dica.tipo)}`}>
                {dica.emoji && <span className="text-3xl">{dica.emoji}</span>}
              </div>

              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {dica.titulo}
                </h3>
                <p className={`text-sm mb-3 leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {dica.mensagem}
                </p>

                {dica.economia && dica.economia > 0 && (
                  <div
                    className={`mt-3 p-2 rounded text-sm font-semibold flex items-center gap-2 ${
                      isDark
                        ? 'bg-green-900 text-green-200'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <TrendingDown size={16} />
                    Possível economia: R$ {dica.economia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo de Impacto */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg border-2`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Target size={20} /> 🎯 Resumo de Impacto
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Total de Dicas
            </p>
            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {dicas.length}
            </p>
          </div>

          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Economia Potencial
            </p>
            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              R$ {dicas
                .reduce((acc, d) => acc + (d.economia || 0), 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Alertas
            </p>
            <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {dicas.filter(d => d.tipo === 'alerta').length}
            </p>
          </div>
        </div>
      </div>

      {/* Dicas de Uso */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg border`}>
        <h3 className={`font-bold text-lg mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
          💭 Como Usar as Dicas
        </h3>
        <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>✅ Revise as categorias com gastos acima da média</li>
          <li>✅ Compare seu percentual de gasto com a meta de 80%</li>
          <li>✅ Identifique oportunidades reais de economia</li>
          <li>✅ Ajuste seus hábitos e acompanhe a evolução</li>
        </ul>
      </div>
    </div>
  )
}