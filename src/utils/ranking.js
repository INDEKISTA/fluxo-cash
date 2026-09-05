export const gerarRankingGastos = (gastos) => {
  if (gastos.length === 0) {
    return {
      topDespesas: [],
      topCategorias: [],
      maiorDespesa: null,
      menorDespesa: null
    }
  }

  // TOP 5 MAIORES DESPESAS
  const topDespesas = gastos
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)
    .map((gasto, index) => ({
      ...gasto,
      posicao: index + 1,
      emoji: ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index]
    }))

  // TOP 5 CATEGORIAS POR CONSUMO
  const categoriasAgrupadas = {}
  gastos.forEach(gasto => {
    const categoria = gasto.categoria || 'Outros'
    if (!categoriasAgrupadas[categoria]) {
      categoriasAgrupadas[categoria] = {
        categoria,
        total: 0,
        quantidade: 0,
        gastos: []
      }
    }
    categoriasAgrupadas[categoria].total += gasto.valor
    categoriasAgrupadas[categoria].quantidade += 1
    categoriasAgrupadas[categoria].gastos.push(gasto)
  })

  const topCategorias = Object.values(categoriasAgrupadas)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((cat, index) => ({
      ...cat,
      posicao: index + 1,
      emoji: ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index],
      percentual: 0 // vai ser calculado lá
    }))

  const maiorDespesa = topDespesas[0] || null
  const menorDespesa = gastos.reduce((a, b) => a.valor < b.valor ? a : b)

  return {
    topDespesas,
    topCategorias,
    maiorDespesa,
    menorDespesa
  }
}