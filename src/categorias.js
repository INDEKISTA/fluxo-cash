export const CATEGORIAS_PADRAO = [
  { id: 'alimentacao', nome: 'Alimentação', emoji: '🍔', cor: '#ef4444' },
  { id: 'moradia', nome: 'Moradia', emoji: '🏠', cor: '#f59e0b' },
  { id: 'transporte', nome: 'Transporte', emoji: '🚗', cor: '#10b981' },
  { id: 'utilities', nome: 'Utilities', emoji: '💡', cor: '#3b82f6' },
  { id: 'telefone', nome: 'Telefone/Celular', emoji: '📱', cor: '#8b5cf6' },
  { id: 'cartoes', nome: 'Cartões/Débito', emoji: '💳', cor: '#ec4899' },
  { id: 'emprestimos', nome: 'Empréstimos', emoji: '💰', cor: '#ef4444' },
  { id: 'trabalho', nome: 'Trabalho', emoji: '👔', cor: '#6366f1' },
  { id: 'entretenimento', nome: 'Entretenimento', emoji: '🎮', cor: '#f97316' },
  { id: 'vestuario', nome: 'Vestuário', emoji: '👕', cor: '#ec4899' },
  { id: 'saude', nome: 'Saúde/Médico', emoji: '🏥', cor: '#06b6d4' },
  { id: 'educacao', nome: 'Educação', emoji: '📚', cor: '#14b8a6' },
  { id: 'outros', nome: 'Outros', emoji: '✅', cor: '#6b7280' },
]

export function obterCategoria(idCategoria) {
  return CATEGORIAS_PADRAO.find(c => c.id === idCategoria) || CATEGORIAS_PADRAO[CATEGORIAS_PADRAO.length - 1]
}

export function getCor(idCategoria) {
  const categoria = obterCategoria(idCategoria)
  return categoria.cor
}

export function getEmoji(idCategoria) {
  const categoria = obterCategoria(idCategoria)
  return categoria.emoji
}