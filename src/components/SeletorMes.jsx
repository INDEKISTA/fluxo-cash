import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function SeletorMes({ mesSelecionado, anoSelecionado, onMudarMes, isDark }) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const handleMesAnterior = () => {
    let novoMes = mesSelecionado - 1
    let novoAno = anoSelecionado

    if (novoMes < 0) {
      novoMes = 11
      novoAno -= 1
    }

    onMudarMes(novoMes, novoAno)
  }

  const handleProximoMes = () => {
    let novoMes = mesSelecionado + 1
    let novoAno = anoSelecionado

    if (novoMes > 11) {
      novoMes = 0
      novoAno += 1
    }

    onMudarMes(novoMes, novoAno)
  }

  const handleMesAtual = () => {
    const hoje = new Date()
    onMudarMes(hoje.getMonth(), hoje.getFullYear())
  }

  const ehMesAtual = () => {
    const hoje = new Date()
    return mesSelecionado === hoje.getMonth() && anoSelecionado === hoje.getFullYear()
  }

  return (
    <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-gradient-to-r from-blue-100 to-blue-50'} p-6 rounded-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={24} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
          <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-blue-900'}`}>
            Filtrar por Mês
          </h3>
        </div>
        
        {!ehMesAtual() && (
          <button
            onClick={handleMesAtual}
            className={`px-4 py-1 rounded text-sm font-semibold transition ${
              isDark
                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                : 'bg-white hover:bg-blue-50 text-blue-600 border border-blue-300'
            }`}
          >
            Mês Atual
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleMesAnterior}
          className={`p-2 rounded-lg transition ${
            isDark
              ? 'bg-blue-800 hover:bg-blue-700 text-blue-300'
              : 'bg-white hover:bg-blue-100 text-blue-600 border border-blue-300'
          }`}
          title="Mês anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className={`flex-1 text-center py-3 px-4 rounded-lg ${
          isDark 
            ? 'bg-blue-800' 
            : 'bg-white border-2 border-blue-300'
        }`}>
          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            Mês Selecionado
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>
            {meses[mesSelecionado]} {anoSelecionado}
          </p>
        </div>

        <button
          onClick={handleProximoMes}
          className={`p-2 rounded-lg transition ${
            isDark
              ? 'bg-blue-800 hover:bg-blue-700 text-blue-300'
              : 'bg-white hover:bg-blue-100 text-blue-600 border border-blue-300'
          }`}
          title="Próximo mês"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-6 gap-2">
        {meses.map((mes, idx) => (
          <button
            key={idx}
            onClick={() => onMudarMes(idx, anoSelecionado)}
            className={`py-2 px-1 rounded text-xs font-semibold transition ${
              mesSelecionado === idx
                ? isDark
                  ? 'bg-green-600 text-white'
                  : 'bg-green-500 text-white'
                : isDark
                ? 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
            }`}
          >
            {mes.substring(0, 3)}
          </button>
        ))}
      </div>

      <p className={`text-xs mt-4 text-center ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
        💡 Selecione um mês para filtrar gastos
      </p>
    </div>
  )
}
