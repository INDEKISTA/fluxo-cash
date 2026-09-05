import { updateDoc, doc } from 'firebase/firestore'

export const marcarComoRecorrente = async (db, userId, gastoId, gastoData) => {
  try {
    await updateDoc(doc(db, 'usuarios', userId, 'dados', gastoId), {
      recorrente: true,
      gatoRecorrenteOriginalId: gastoId,
      dataInicio: gastoData.data
    })
    alert('✅ Gasto marcado como recorrente! Ele se repetirá todo mês.')
    setTimeout(() => window.location.reload(), 500)
    return { sucesso: true }
  } catch (error) {
    console.error('Erro ao marcar como recorrente:', error)
    alert('Erro ao marcar como recorrente: ' + error.message)
    return { sucesso: false, erro: error.message }
  }
}

export const desmarcarComoRecorrente = async (db, userId, gastoId) => {
  try {
    await updateDoc(doc(db, 'usuarios', userId, 'dados', gastoId), {
      recorrente: false
    })
    return { sucesso: true }
  } catch (error) {
    console.error('Erro ao desmarcar como recorrente:', error)
    alert('Erro ao desmarcar: ' + error.message)
    return { sucesso: false, erro: error.message }
  }
}

export const obterGastosRecorrentes = (gastos) => {
  return gastos.filter(g => g.recorrente === true)
}