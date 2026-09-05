export const verificarAlertas = (salario, totalGastos, gastos, parceladas) => {
  const notificacoes = []
  const id = Date.now()

  // 🚨 ALERTA: Gasto > 80% do salário
  const percentualGasto = (totalGastos / salario) * 100
  if (percentualGasto > 80 && percentualGasto <= 100) {
    notificacoes.push({
      id: `alerta-80-${id}`,
      tipo: 'alerta',
      titulo: '⚠️ Limite de 80% Atingido!',
      mensagem: `Você gastou R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${percentualGasto.toFixed(1)}% do salário)`
    })
  }

  // 🔴 CRÍTICO: Gasto > 100% do salário
  if (percentualGasto > 100) {
    notificacoes.push({
      id: `alerta-100-${id}`,
      tipo: 'alerta',
      titulo: '🔴 ORÇAMENTO ULTRAPASSADO!',
      mensagem: `Você gastou ${(percentualGasto - 100).toFixed(1)}% a mais do que seu salário`
    })
  }

  // 💰 AVISO: Despesa muito alta (> 30% do salário)
  gastos.forEach(gasto => {
    const percentualDespesa = (gasto.valor / salario) * 100
    if (percentualDespesa > 30) {
      notificacoes.push({
        id: `despesa-alta-${gasto.id}`,
        tipo: 'aviso',
        titulo: '💸 Despesa Muito Alta!',
        mensagem: `"${gasto.nome}" (R$ ${gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) representa ${percentualDespesa.toFixed(1)}% do seu salário`
      })
    }
  })

  // 📅 LEMBRETE: Parcelas a pagar
  if (parceladas && parceladas.length > 0) {
    parceladas.forEach(parcela => {
      if (parcela.status === 'em-andamento') {
        const parcelasRestantes = parcela.qtdParcelas - (parcela.parcelasPagas || 0)
        
        if (parcelasRestantes > 0) {
          notificacoes.push({
            id: `parcela-${parcela.id}`,
            tipo: 'info',
            titulo: '📊 Parcelas Pendentes',
            mensagem: `${parcela.nome}: ${parcelasRestantes} de ${parcela.qtdParcelas} parcelas a pagar`
          })
        }
      }
    })
  }

  return notificacoes
}

export const gerarIdUnico = () => {
  return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}