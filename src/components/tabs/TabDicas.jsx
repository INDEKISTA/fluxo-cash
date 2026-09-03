import { TrendingDown, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'

export default function TabDicas({ salario, totalGastos, gastos }) {
  const percentualGasto = salario > 0 ? (totalGastos / salario * 100) : 0
  const saldo = salario - totalGastos

  // Gerar dicas baseadas no percentual de gastos
  const gerarDicas = () => {
    const dicas = []

    if (percentualGasto > 80) {
      dicas.push({
        tipo: 'alerta',
        titulo: '🚨 Atenção! Gastos altos',
        descricao: `Você já gastou ${percentualGasto.toFixed(1)}% do seu salário. Tente reduzir despesas.`,
        cor: 'red'
      })
    } else if (percentualGasto > 60) {
      dicas.push({
        tipo: 'aviso',
        titulo: '⚠️ Gastos moderados',
        descricao: `Você gastou ${percentualGasto.toFixed(1)}% do salário. Mantenha controle!`,
        cor: 'yellow'
      })
    } else {
      dicas.push({
        tipo: 'sucesso',
        titulo: '✅ Parabéns! Gastos controlados',
        descricao: `Você gastou apenas ${percentualGasto.toFixed(1)}% do salário. Ótimo controle!`,
        cor: 'green'
      })
    }

    // Dica sobre saldo
    if (saldo > 0) {
      dicas.push({
        tipo: 'info',
        titulo: '💰 Você tem saldo positivo',
        descricao: `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponível. Considere poupar!`,
        cor: 'blue'
      })
    } else {
      dicas.push({
        tipo: 'alerta',
        titulo: '🚨 Alerta: Saldo negativo',
        descricao: `Você ultrapassou o orçamento em R$ ${Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}!`,
        cor: 'red'
      })
    }

    // Dicas gerais
    const dicasGerais = [
      {
        titulo: '🎯 Defina um limite de gastos',
        descricao: 'Tente gastar no máximo 70% do seu salário com gastos variáveis.',
        icon: Lightbulb
      },
      {
        titulo: '📊 Acompanhe categorias',
        descricao: 'Identifique qual categoria consome mais e tente reduzir 10%.',
        icon: TrendingDown
      },
      {
        titulo: '🏦 Reserve para emergências',
        descricao: 'Separe 10-20% do salário para um fundo de emergência.',
        icon: AlertCircle
      },
      {
        titulo: '💳 Cuidado com parceladas',
        descricao: 'Muitas parcelas podem comprometer seu orçamento futuro.',
        icon: CheckCircle
      },
      {
        titulo: '🎁 Revise gastos supérfluos',
        descricao: 'Procure por assinaturas ou gastos que você não está usando.',
        icon: TrendingDown
      }
    ]

    return { alertas: dicas, gerais: dicasGerais }
  }

  const { alertas, gerais } = gerarDicas()

  // Análise de maior gasto
  const maiorGasto = gastos.length > 0
    ? gastos.reduce((max, g) => (g.valor > max.valor ? g : max))
    : null

  const categoriasMaiorGasto = {}
  gastos.forEach(g => {
    if (!categoriasMaiorGasto[g.nome]) {
      categoriasMaiorGasto[g.nome] = 0
    }
    categoriasMaiorGasto[g.nome] += g.valor
  })
  const categoriaMaior = Object.entries(categoriasMaiorGasto).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="space-y-6">
      {/* Alertas Principais */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">📊 Análise do Seu Orçamento</h3>
        {alertas.map((alerta, idx) => {
          const cores = {
            red: 'bg-red-50 border-red-200 text-red-900',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
            green: 'bg-green-50 border-green-200 text-green-900',
            blue: 'bg-blue-50 border-blue-200 text-blue-900'
          }
          return (
            <div key={idx} className={`border-l-4 border-gray-200 p-4 rounded ${cores[alerta.cor]}`}>
              <h4 className="font-bold mb-1">{alerta.titulo}</h4>
              <p className="text-sm">{alerta.descricao}</p>
            </div>
          )
        })}
      </div>

      {/* Insights */}
      {gastos.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">🔍 Seus Insights</h3>
          <div className="space-y-3">
            {maiorGasto && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Gasto individual maior:</span>
                <span className="font-bold text-primary">
                  {maiorGasto.nome} - R$ {maiorGasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {categoriaMaior && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Categoria com mais gastos:</span>
                <span className="font-bold text-primary">
                  {categoriaMaior[0]} - R$ {categoriaMaior[1].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">Total de gastos registrados:</span>
              <span className="font-bold text-primary">{gastos.length} transações</span>
            </div>
          </div>
        </div>
      )}

      {/* Dicas Gerais */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">💡 Dicas de Economia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gerais.map((dica, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{dica.titulo.split(' ')[0]}</div>
                <div>
                  <h4 className="font-bold mb-1">{dica.titulo.slice(2)}</h4>
                  <p className="text-sm text-gray-600">{dica.descricao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <h4 className="font-bold text-blue-900 mb-2">📝 Recomendações Personalizadas</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          {percentualGasto < 50 && (
            <li>✅ Você está em ótima situação! Considere aumentar sua poupança.</li>
          )}
          {percentualGasto > 70 && (
            <li>⚠️ Tente identificar despesas desnecessárias e reduzi-las.</li>
          )}
          {saldo > 0 && (
            <li>💰 Você tem {(saldo / salario * 100).toFixed(1)}% do salário disponível. Invista ou poupe!</li>
          )}
          {gastos.length > 10 && (
            <li>📊 Você tem muitos gastos pequenos. Agrupe categorias para melhor controle.</li>
          )}
          {gastos.length === 0 && (
            <li>👉 Comece registrando seus gastos para obter recomendações personalizadas.</li>
          )}
        </ul>
      </div>

      {/* Meta de Economia */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3">🎯 Seu Potencial de Economia</h3>
        <div className="space-y-2">
          <p className="text-sm opacity-90">
            Se você reduzir {Math.max(percentualGasto - 70, 10).toFixed(1)}% dos gastos:
          </p>
          <p className="text-3xl font-bold">
            R$ {(salario * Math.max(percentualGasto - 70, 10) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm opacity-90">poderiam ser economizados mensalmente!</p>
        </div>
      </div>
    </div>
  )
}
