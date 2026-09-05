export const gerarDicas = (gastosPorCategoria, totalGastos, salario) => {
  const dicas = []

  if (totalGastos === 0 || Object.keys(gastosPorCategoria).length === 0) {
    return [
      {
        id: 'dica-inicio',
        tipo: 'info',
        titulo: '👋 Bem-vindo ao Fluxo Cash!',
        mensagem: 'Comece a registrar seus gastos para receber dicas inteligentes',
        emoji: '📊'
      }
    ]
  }

  // Calcular média por categoria
  const mediaPorCategoria = totalGastos / Object.keys(gastosPorCategoria).length
  const mediaGeral = totalGastos / 1 // para comparação

  // 1️⃣ DICAS DE GASTOS ACIMA DA MÉDIA
  Object.entries(gastosPorCategoria).forEach(([categoria, dados]) => {
    const percentualDaMedia = (dados.value / mediaPorCategoria) * 100

    if (percentualDaMedia > 150) {
      // Muito acima da média
      const economia = dados.value - mediaPorCategoria
      dicas.push({
        id: `dica-alta-${categoria}`,
        tipo: 'aviso',
        titulo: `💸 Gastos Altos com ${categoria}`,
        mensagem: `Você gasta R$ ${dados.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com ${categoria} (${(percentualDaMedia - 100).toFixed(0)}% acima da média). Economizaria R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} se igualasse a média.`,
        economia: economia,
        categoria: categoria,
        emoji: '⚠️'
      })
    } else if (percentualDaMedia > 120) {
      // Acima da média
      const economia = dados.value - mediaPorCategoria
      dicas.push({
        id: `dica-acima-${categoria}`,
        tipo: 'info',
        titulo: `📌 Atenção com ${categoria}`,
        mensagem: `Você gasta R$ ${dados.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com ${categoria}. Uma pequena redução poderia economizar R$ ${economia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
        economia: economia,
        categoria: categoria,
        emoji: '💡'
      })
    }
  })

  // 2️⃣ DICAS DE ECONOMIA GERAL
  const percentualGasto = (totalGastos / salario) * 100

  if (percentualGasto > 90) {
    dicas.push({
      id: 'dica-orçamento-critico',
      tipo: 'alerta',
      titulo: '🚨 Orçamento Crítico!',
      mensagem: `Você está gastando ${percentualGasto.toFixed(1)}% do seu salário. Reduza os gastos em R$ ${(totalGastos - salario * 0.8).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para atingir 80%.`,
      emoji: '🔴'
    })
  } else if (percentualGasto > 80) {
    const reducao = totalGastos - salario * 0.8
    dicas.push({
      id: 'dica-orçamento-aviso',
      tipo: 'aviso',
      titulo: '⚠️ Acima do Ideal',
      mensagem: `Você está gastando ${percentualGasto.toFixed(1)}% do seu salário. Reduza R$ ${reducao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para chegar a 80%.`,
      emoji: '⚠️'
    })
  } else if (percentualGasto < 50) {
    dicas.push({
      id: 'dica-economia-boa',
      tipo: 'sucesso',
      titulo: '✅ Excelente Controle!',
      mensagem: `Você está gastando apenas ${percentualGasto.toFixed(1)}% do seu salário. Parabéns! Você está economizando R$ ${(salario - totalGastos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      emoji: '🎉'
    })
  }

  // 3️⃣ DICA: MAIOR GASTO
  const maiorGasto = Object.entries(gastosPorCategoria).reduce((a, b) => 
    b[1].value > a[1].value ? b : a
  )

  if (maiorGasto && maiorGasto[1].value > salario * 0.25) {
    dicas.push({
      id: 'dica-maior-gasto',
      tipo: 'info',
      titulo: `📊 Sua Maior Despesa`,
      mensagem: `${maiorGasto[0]} é sua maior despesa (R$ ${maiorGasto[1].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Considere revisar este gasto.`,
      economia: maiorGasto[1].value * 0.1,
      categoria: maiorGasto[0],
      emoji: '📈'
    })
  }

  // 4️⃣ DICA: OPORTUNIDADE DE ECONOMIA
  const totalEconomia = dicas.reduce((acc, d) => acc + (d.economia || 0), 0)

  if (totalEconomia > 50) {
    dicas.push({
      id: 'dica-total-economia',
      tipo: 'sucesso',
      titulo: '💰 Oportunidade de Economia',
      mensagem: `Se você implementar as dicas acima, poderia economizar R$ ${totalEconomia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por mês!`,
      emoji: '🎯'
    })
  }

  return dicas.length > 0 ? dicas : [
    {
      id: 'dica-parabens',
      tipo: 'sucesso',
      titulo: '🎉 Tudo Certo!',
      mensagem: 'Seus gastos estão bem distribuídos e controlados. Parabéns!',
      emoji: '✨'
    }
  ]
}