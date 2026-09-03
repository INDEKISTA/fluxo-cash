import { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { User, Mail, Save } from 'lucide-react'

export default function TabPerfil({ user, isDark }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState(user.email)
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    carregarPerfil()
  }, [user])

  const carregarPerfil = async () => {
    try {
      const docRef = doc(db, 'usuarios', user.uid, 'dados', 'perfil')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const dados = docSnap.data()
        setNome(dados.nome || '')
        setTelefone(dados.telefone || '')
        setCidade(dados.cidade || '')
      } else {
        setNome('')
        setTelefone('')
        setCidade('')
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setMensagem('Erro ao carregar perfil')
    } finally {
      setCarregando(false)
    }
  }

  const handleSalvarPerfil = async (e) => {
    e.preventDefault()
    if (!nome.trim()) {
      setMensagem('Por favor, preenchao nome')
      return
    }

    setSalvando(true)
    setMensagem('')

    try {
      await setDoc(doc(db, 'usuarios', user.uid, 'dados', 'perfil'), {
        tipo: 'perfil',
        nome: nome.trim(),
        email: email,
        telefone: telefone.trim(),
        cidade: cidade.trim(),
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      })
      setMensagem('✅ Perfil salvo com sucesso!')
      setTimeout(() => setMensagem(''), 3000)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      setMensagem('❌ Erro ao salvar perfil: ' + error.message)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className={`flex items-center gap-4 p-6 rounded-lg ${
          isDark 
            ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        } transition-colors`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDark ? 'bg-blue-700' : 'bg-blue-200'
          }`}>
            <User size={32} className={isDark ? 'text-white' : 'text-blue-600'} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {nome || 'Meu Perfil'}
            </h2>
            <p className={`${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Gerencie suas informações pessoais
            </p>
          </div>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <div className={`mb-6 p-4 rounded-lg ${
          mensagem.includes('✅')
            ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-800')
            : (isDark ? 'bg-red-900 text-red-200' : 'bg-red-50 text-red-800')
        } transition-colors`}>
          {mensagem}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSalvarPerfil} className="space-y-6">
        {/* Nome */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            👤 Nome Completo *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome completo"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-black placeholder-gray-500'
            }`}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            📧 Email
          </label>
          <div className={`w-full px-4 py-3 border rounded-lg flex items-center gap-2 ${
            isDark
              ? 'bg-gray-900 border-gray-700 text-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-600'
          }`}>
            <Mail size={20} />
            <span>{email}</span>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Para mudar seu email, acesse as configurações de segurança
          </p>
        </div>

        {/* Telefone */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            📱 Telefone (Opcional)
          </label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-9999"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-black placeholder-gray-500'
            }`}
          />
        </div>

        {/* Cidade */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            🏙️ Cidade (Opcional)
          </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Ex: São Paulo, SP"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-black placeholder-gray-500'
            }`}
          />
        </div>

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={salvando}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition ${
            salvando
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800'
          }`}
        >
          <Save size={20} />
          {salvando ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>

      {/* Informações Adicionais */}
      <div className={`mt-8 p-6 rounded-lg border ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ℹ️ Informações
        </h3>
        <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>✅ Seus dados são salvos de forma segura no Firebase</p>
          <p>✅ Você pode editar seu perfil a qualquer momento</p>
          <p>✅ Seu email é usado para login e recuperação de conta</p>
          <p>✅ Para alterar a senha, use a opção "Recuperar Senha"</p>
        </div>
      </div>
    </div>
  )
}