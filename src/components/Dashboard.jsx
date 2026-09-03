import { useState, useEffect, useContext } from 'react'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { LogOut, Plus, Trash2, DollarSign } from 'lucide-react'
import { ThemeContext } from '../ThemeContext'
import TabGastos from './tabs/TabGastos'

export default function Dashboard({ user }) {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  const [activeTab, setActiveTab] = useState('gastos')
  const [gastos, setGastos] = useState([])
  const [salario, setSalario] = useState(0)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'usuarios', user.uid, 'dados'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
      setGastos(docs.filter(d => d.data().tipo === 'gasto').map(d => ({ id: d.id, ...d.data() })))
      const salarioDoc = docs.find(d => d.data().tipo === 'salario')
      setSalario(salarioDoc?.data().valor || 0)
    })
    return () => unsubscribe()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const totalGastos = gastos.reduce((a, g) => a + g.valor, 0)
  const saldo = salario - totalGastos

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-700 dark:to-blue-700 text-white p-4 shadow-lg transition-colors">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">💰 FLUXO CASH</h1>
              <p className="text-sm text-gray-200 dark:text-gray-300">Olá, {user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-green-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition font-semibold"
              >
                {isDark ? '☀️ Claro' : '🌙 Escuro'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg transition"
              >
                <LogOut size={20} /> Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-4">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Salário</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                R$ {salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              {salario === 0 && <p className="text-xs text-orange-500 mt-2">⚠️ Defina seu salário</p>}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Gasto</p>
              <p className="text-3xl font-bold text-red-500 dark:text-red-400">
                R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {salario > 0 ? `${(totalGastos / salario * 100).toFixed(1)}% do salário` : '0%'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Saldo Disponível</p>
              <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg transition-colors">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Gastos Registrados</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{gastos.length}</p>
            </div>
          </div>

          {/* Abas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
            <div className="flex border-b dark:border-gray-700">
              {['gastos', 'parceladas', 'dicas'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition ${
                    activeTab === tab
                      ? 'border-b-4 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {tab === 'gastos' && '💳 Gastos'}
                  {tab === 'parceladas' && '📊 Parceladas'}
                  {tab === 'dicas' && '💡 Dicas'}
                </button>
              ))}
            </div>

            <div className="p-6 dark:text-gray-100 transition-colors">
              {activeTab === 'gastos' && (
                <TabGastos
                  salario={salario}
                  setSalario={setSalario}
                  user={user}
                  gastos={gastos}
                  totalGastos={totalGastos}
                  isDark={isDark}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}