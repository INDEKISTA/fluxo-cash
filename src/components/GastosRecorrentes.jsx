import { useState, useEffect } from 'react'
import { Repeat2, Trash2, Plus, Check } from 'lucide-react'
import { db } from '../firebase'
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { obterGastosRecorrentes, desmarcarComoRecorrente } from '../utils/gastosRecorrentes'

export default function GastosRecorrentes({ user, gastos, isDark }) {
  const [gastosRecorrentes, setGastosRecorrentes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const recorrentes = obterGastosRecorrentes(gastos)
    setGastosRecorrentes(recorrentes)
    setCarregando(false)
  }, [gastos])

  const handleDesmarcarRecorrente = async (gastoId) => {
    if (!window.confirm('Desmarcar este gasto como recorrente?')) return

    try {
      await desmarcarComoRecorrente(db, user.uid, gastoId)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao desmarcar: ' + error.message)
    }
  }

  const handleDeletarRecorrente = async (gastoId) => {
    if (!window.confirm('Deletar este gasto recorrente? Ele deixará de aparecer nos próximos meses.')) return

    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'dados', gastoId))
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao deletar: ' + error.message)
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Carregando...</p>
      </div>
    )
  }

  if (gastosRecorrentes.length === 0) {
    return (
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} p-6 rounded-lg border-2 text-center`}>
        <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-blue-900'}`}>
          🔄 Nenhum gasto recorrente
        </p>
        <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-blue-700'}`}>
          Marque um gasto como recorrente para que ele se repita todo mês automaticamente
        </p>
      </div>
    )
  }

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-6 rounded-lg border`}>
      <h3 className={`font-bold text-lg mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Repeat2 size={24} className="text-purple-500" /> Gastos Recorrentes
      </h3>

      <div className="space-y-3">
        {gastosRecorrentes.map((gasto) => (
          <div
            key={gasto.id}
            className={`p-4 rounded-lg flex items-center justify-between ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'
            } border-l-4 border-purple-500 transition-all`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Repeat2 size={18} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                <div>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {gasto.nome}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Repete todo mês automaticamente
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="font-bold text-purple-600 dark:text-purple-400">
                  R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {gasto.categoria || 'Outros'}
                </p>
              </div>

              <button
                onClick={() => handleDesmarcarRecorrente(gasto.id)}
                className={`px-3 py-1 rounded font-semibold text-sm transition ${
                  isDark
                    ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-200'
                    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900'
                }`}
              >
                Desmarcar
              </button>

              <button
                onClick={() => handleDeletarRecorrente(gasto.id)}
                className={`p-2 rounded transition ${
                  isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
        <p className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-900'}`}>
          💰 Total Recorrente Mensal:
        </p>
        <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
          R$ {gastosRecorrentes
            .reduce((acc, g) => acc + g.valor, 0)
            .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}