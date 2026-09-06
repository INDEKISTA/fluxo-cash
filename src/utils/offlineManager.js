export const salvarGastoOffline = (userId, gasto) => {
  const chave = `offline_gastos_${userId}`
  const gastos = JSON.parse(localStorage.getItem(chave)) || []
  gastos.push({
    ...gasto,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    offline: true
  })
  localStorage.setItem(chave, JSON.stringify(gastos))
  console.log('✅ Gasto salvo offline:', gasto.nome)
}

export const obterGastosOffline = (userId) => {
  const chave = `offline_gastos_${userId}`
  const gastos = JSON.parse(localStorage.getItem(chave)) || []
  console.log('📂 Gastos offline:', gastos)
  return gastos
}

export const limparGastosOffline = (userId) => {
  const chave = `offline_gastos_${userId}`
  localStorage.removeItem(chave)
  console.log('🗑️ Gastos offline limpos')
}
