import jsPDF from 'jspdf'

export const exportarRelatorioPDF = (nomePerfil, salario, totalGastos, gastosMes, gastosPorCategoria, nomeMes, isDark) => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Título
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('💰 FLUXO CASH', pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 12
    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')
    doc.text(`Relatório de ${nomeMes}`, pageWidth / 2, yPosition, { align: 'center' })
    
    yPosition += 12
    doc.text(`Usuário: ${nomePerfil}`, 20, yPosition)
    
    yPosition += 15

    // Resumo de Valores
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Resumo do Mês', 20, yPosition)
    
    yPosition += 10
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
    
    const saldo = salario - totalGastos
    doc.text(`Salário: R$ ${salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition)
    yPosition += 7
    doc.text(`Total Gasto: R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition)
    yPosition += 7
    doc.text(`Saldo Disponível: R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition)
    yPosition += 7
    doc.text(`Percentual Gasto: ${(totalGastos / salario * 100).toFixed(1)}%`, 20, yPosition)
    
    yPosition += 20

    // Gastos Registrados (sem autoTable)
    if (gastosMes.length > 0) {
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Gastos Registrados', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      doc.setFont(undefined, 'bold')
      doc.text('Data', 20, yPosition)
      doc.text('Descrição', 50, yPosition)
      doc.text('Categoria', 120, yPosition)
      doc.text('Valor', 170, yPosition)
      
      yPosition += 7
      doc.setDrawColor(200, 200, 200)
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 3

      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      gastosMes.forEach((gasto, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
        }

        const data = new Date(gasto.data?.toDate?.() || gasto.data).toLocaleDateString('pt-BR')
        const categoria = gasto.categoria || 'Outros'
        const valor = `R$ ${gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

        doc.text(data, 20, yPosition)
        doc.text(gasto.nome.substring(0, 25), 50, yPosition)
        doc.text(categoria.substring(0, 20), 120, yPosition)
        doc.text(valor, 170, yPosition)

        yPosition += 6

        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240)
          doc.rect(20, yPosition - 6, pageWidth - 40, 6, 'F')
        }
      })

      yPosition += 10
    }

    // Resumo por Categoria
    if (Object.keys(gastosPorCategoria).length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('Resumo por Categoria', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      Object.entries(gastosPorCategoria).forEach(([categoria, dados]) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = 20
        }

        const valor = `R$ ${dados.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        const percentual = ((dados.value / totalGastos) * 100).toFixed(1)
        
        doc.setFont(undefined, 'normal')
        doc.text(`${categoria}: ${valor} (${percentual}%)`, 20, yPosition)
        yPosition += 7
      })
    }

    // Rodapé
    const dataAtual = new Date().toLocaleDateString('pt-BR')
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.text(`Gerado em: ${dataAtual} | FLUXO CASH`, pageWidth / 2, pageHeight - 10, { align: 'center' })

    // Salvar PDF
    doc.save(`Relatorio_FluxoCash_${nomeMes.replace(' ', '_')}.pdf`)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    alert('Erro ao gerar PDF: ' + error.message)
  }
}