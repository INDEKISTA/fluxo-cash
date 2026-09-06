export const parseCSV = (text) => {
  const linhas = text.trim().split('\n')
  if (linhas.length < 2) {
    throw new Error('Arquivo CSV vazio ou inválido')
  }

  // Pula header e processa dados
  const gastos = []
  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i].trim()
    if (!linha) continue

    // Suporta CSV com ou sem aspas
    const partes = linha.split(',').map(p => p.trim().replace(/^"|"$/g, ''))
    
    if (partes.length < 3) {
      console.warn(`Linha ${i + 1} incompleta, pulando...`)
      continue
    }

    const nome = partes[0]
    const valor = parseFloat(partes[1])
    const categoria = partes[2] || 'outros'
    const data = partes[3] ? new Date(partes[3]) : new Date()

    // Validação
    if (!nome || isNaN(valor) || valor <= 0) {
      console.warn(`Linha ${i + 1} inválida (nome ou valor), pulando...`)
      continue
    }

    gastos.push({
      tipo: 'gasto',
      nome: nome,
      valor: valor,
      categoria: categoria.toLowerCase(),
      data: data,
      pago: true,
      recorrente: false,
      importadoCSV: true
    })
  }

  if (gastos.length === 0) {
    throw new Error('Nenhum gasto válido encontrado no arquivo')
  }

  return gastos
}

export const validarGasto = (gasto) => {
  if (!gasto.nome || gasto.nome.trim() === '') {
    return { valido: false, erro: 'Nome é obrigatório' }
  }
  if (isNaN(gasto.valor) || gasto.valor <= 0) {
    return { valido: false, erro: 'Valor deve ser um número maior que 0' }
  }
  return { valido: true }
}