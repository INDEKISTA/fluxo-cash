import { useState } from 'react'
import { Upload, X, Check, AlertCircle } from 'lucide-react'
import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { parseCSV } from '../utils/csvParser'

export default function ImportarCSV({ user, isDark, onImportSuccess }) {
  const [mostraModal, setMostraModal] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [progresso, setProgresso] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const [tipo, setTipo] = useState('') // 'sucesso', 'erro', 'aviso'
  const [gastosParaImportar, setGastosParaImportar] = useState([])

  const handleArquivoSelecionado = async (e) => {
    const arquivo = e.target.files[0]
    if (!arquivo) return

    try {
      setTipo('')
      setMensagem('Lendo arquivo...')
      
      const texto = await arquivo.text()
      const gastos = parseCSV(texto)
      
      setGastosParaImportar(gastos)
      setMensagem(`✅ ${gastos.length} gastos encontrados! Clique em "Confirmar Importação" para prosseguir.`)
      setTipo('aviso')
    } catch (error) {
      setMensagem(`❌ Erro ao processar arquivo: ${error.message}`)
      setTipo('erro')
      setGastosParaImportar([])
    }

    // Limpa input
    e.target.value = ''
  }

  const handleImportar = async () => {
    if (gastosParaImportar.length === 0) {
      setMensagem('❌ Nenhum gasto para importar')
      setTipo('erro')
      return
    }

    setCarregando(true)
    setProgresso(0)
    setMensagem('Importando gastos...')

    try {
      let importados = 0
      const total = gastosParaImportar.length

      for (const gasto of gastosParaImportar) {
        const gastoId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        
        await setDoc(doc(db, 'usuarios', user.uid, 'dados', gastoId), gasto)
        
        importados++
        setProgresso(Math.round((importados / total) * 100))
      }

      setMensagem(`✅ ${importados} gastos importados com sucesso!`)
      setTipo('sucesso')
      setGastosParaImportar([])
      
      // Recarrega página após 2 segundos
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Erro ao importar:', error)
      setMensagem(`❌ Erro ao importar: ${error.message}`)
      setTipo('erro')
      setCarregando(false)
    }
  }

  const handleCancelar = () => {
    setMostraModal(false)
    setGastosParaImportar([])
    setMensagem('')
    setTipo('')
    setProgresso(0)
  }

  return (
    <>
      <button
        onClick={() => setMostraModal(true)}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 mb-4"
      >
        <Upload size={20} /> Importar CSV
      </button>

      {mostraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📥 Importar Gastos CSV
              </h2>
              <button
                onClick={handleCancelar}
                className={`p-2 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>
            </div>

            {gastosParaImportar.length === 0 ? (
              <>
                <div className={`p-6 rounded-lg border-2 border-dashed text-center mb-4 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-300' 
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                }`}>
                  <Upload size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-3">Selecione um arquivo CSV</p>
                  <label className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer font-semibold">
                    Escolher Arquivo
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleArquivoSelecionado}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className={`p-4 rounded-lg mb-4 ${
                  isDark 
                    ? 'bg-blue-900 text-blue-200 border border-blue-800' 
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}>
                  <p className="text-xs font-semibold mb-2">📋 Formato esperado:</p>
                  <p className="text-xs font-mono">
                    Nome,Valor,Categoria,Data
                  </p>
                  <p className="text-xs mt-2">Exemplo:</p>
                  <p className="text-xs font-mono">
                    Supermercado,150.50,alimentacao,2026-09-06
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Gastos para importar: {gastosParaImportar.length}
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {gastosParaImportar.slice(0, 5).map((gasto, idx) => (
                      <div key={idx} className={`text-xs p-2 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                        <span className="font-semibold">{gasto.nome}</span>
                        <span className={`ml-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {gasto.categoria}
                        </span>
                      </div>
                    ))}
                    {gastosParaImportar.length > 5 && (
                      <div className={`text-xs p-2 text-center italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        + {gastosParaImportar.length - 5} mais...
                      </div>
                    )}
                  </div>
                </div>

                {carregando && (
                  <div className="mb-4">
                    <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                    <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {progresso}%
                    </p>
                  </div>
                )}
              </>
            )}

            {mensagem && (
              <div className={`p-3 rounded-lg mb-4 text-sm flex gap-2 items-start ${
                tipo === 'sucesso' 
                  ? isDark 
                    ? 'bg-green-900 text-green-200 border border-green-800' 
                    : 'bg-green-50 text-green-900 border border-green-200'
                  : tipo === 'erro'
                  ? isDark
                    ? 'bg-red-900 text-red-200 border border-red-800'
                    : 'bg-red-50 text-red-900 border border-red-200'
                  : isDark
                  ? 'bg-yellow-900 text-yellow-200 border border-yellow-800'
                  : 'bg-yellow-50 text-yellow-900 border border-yellow-200'
              }`}>
                {tipo === 'sucesso' ? <Check size={16} /> : tipo === 'erro' ? <AlertCircle size={16} /> : <AlertCircle size={16} />}
                <span>{mensagem}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCancelar}
                className={`flex-1 px-4 py-2 rounded font-semibold ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancelar
              </button>
              {gastosParaImportar.length > 0 && (
                <button
                  onClick={handleImportar}
                  disabled={carregando}
                  className={`flex-1 px-4 py-2 rounded font-semibold text-white ${
                    carregando
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {carregando ? 'Importando...' : 'Confirmar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}