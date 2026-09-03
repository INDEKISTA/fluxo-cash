import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { LogOut, Plus, Trash2 } from 'lucide-react'
import TabGastos from './tabs/TabGastos'
import TabParceladas from './tabs/TabParceladas'
import TabDicas from './tabs/TabDicas'

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('gastos')
  const [gastos, setGastos] = useState([])
  const [parceladas, setParceladas] = useState([])
  const [salario, setSalario] = useState(0)
  const [loading, setLoading] = useState(true)

  // Carregar dados do Firestore
  useEffect(() => {
    if (!user) return

    const q = query(collection(db, 'usuarios', user.uid, 'dados'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
      setGastos(docs.filter(d => d.data().tipo === 'gasto').map(d => ({ id: d.id, ...d.data() })))
      setParceladas(docs.filter(d => d.data().tipo === 'parcelada').map(d => ({ id: d.id, ...d.data() })))
      
      const salarioDoc = docs.find(d => d.data().tipo === 'salario')
      setSalario(salarioDoc?.data().valor || 0)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const adicionarGasto = async (nome, valor) => {
    try {
      await addDoc(collection(db, 'usuarios', user.uid, 'dados'), {
        tipo: 'gasto',
        nome,
        valor: parseFloat(valor),
        data: new Date(),
        pago: false
      })
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error)
    }
  }

  const deletarGasto = async (id) => {
    try {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'dados', id))
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  const adicionarParcelada = async (nome, valorTotal, parcelas, tipo) => {
    try {
      await addDoc(collection(db, 'usuarios', user.uid, 'dados'), {
        tipo: 'parcelada',
        nome,
        valorTotal: parseFloat(valorTotal),
        parcelas: parseInt(parcelas),
        parcelasPagas: 0,
        tipoCartao: tipo,
        data: new Date()
      })
    } catch (error) {
      console.error('Erro ao adicionar parcelada:', error)
    }
  }

  const marcarParcelasPagas = async (id, novasParcelas) => {
    try {
      await updateDoc(doc(db, 'usuarios', user.uid, 'dados', id), {
        parcelasPagas: novasParcelas
      })
    } catch (error) {
      console.error('Erro ao atualizar parcelas:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const totalGastos = gastos.reduce((acc, g) => acc + g.valor, 0)
  const saldo = salario - totalGastos
  const percentualGasto = salario > 0 ? (totalGastos / salario * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">💰 FLUXO CASH</h1>
            <p className="text-sm text-gray-200">Bem-vindo, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Salário</p>
            <p className="text-3xl font-bold text-primary">
              R$ {salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {salario === 0 && <p className="text-xs text-orange-500 mt-2">⚠️ Defina seu salário</p>}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Total Gasto</p>
            <p className="text-3xl font-bold text-red-500">
              R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">{percentualGasto}% do salário</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Saldo Disponível</p>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Gastos Registrados</p>
            <p className="text-3xl font-bold text-secondary">{gastos.length}</p>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex border-b">
            {['gastos', 'parceladas', 'dicas'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === tab
                    ? 'border-b-4 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab === 'gastos' && '💳 Gastos'}
                {tab === 'parceladas' && '📊 Parceladas'}
                {tab === 'dicas' && '💡 Dicas'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'gastos' && (
              <TabGastos
                salario={salario}
                setSalario={setSalario}
                user={user}
                gastos={gastos}
                totalGastos={totalGastos}
                adicionarGasto={adicionarGasto}
                deletarGasto={deletarGasto}
              />
            )}
            {activeTab === 'parceladas' && (
              <TabParceladas
                parceladas={parceladas}
                adicionarParcelada={adicionarParcelada}
                marcarParcelasPagas={marcarParcelasPagas}
                user={user}
              />
            )}
            {activeTab === 'dicas' && (
              <TabDicas
                salario={salario}
                totalGastos={totalGastos}
                gastos={gastos}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
