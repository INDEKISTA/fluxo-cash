import { useState } from 'react'
import { auth } from '../firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth'
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState('login') // 'login', 'signup', 'reset'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setMessage({ type: 'success', text: 'Login realizado com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Erro: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' })
      setLoading(false)
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setMessage({ type: 'success', text: 'Conta criada com sucesso!' })
      setEmail('')
      setPassword('')
      setTimeout(() => setMode('login'), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: `Erro: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage({ type: 'success', text: 'Email de recuperação enviado! Verifique sua caixa de entrada.' })
      setEmail('')
    } catch (error) {
      setMessage({ type: 'error', text: `Erro: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">💰 FLUXO CASH</h1>
          <p className="text-gray-600">Controle seus gastos de forma inteligente</p>
        </div>

        {/* Formulário */}
        <form onSubmit={
          mode === 'login' ? handleLogin : 
          mode === 'signup' ? handleSignup : 
          handlePasswordReset
        } className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <Mail size={20} className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          {/* Senha (não mostra no reset) */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Lock size={20} className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-transparent w-full outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Mensagens */}
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Botão Principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader size={20} className="animate-spin" />}
            {mode === 'login' && 'Entrar'}
            {mode === 'signup' && 'Criar Conta'}
            {mode === 'reset' && 'Recuperar Senha'}
          </button>
        </form>

        {/* Links de navegação */}
        <div className="mt-6 space-y-2 text-center text-sm">
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('signup')}
                className="block w-full text-primary hover:underline font-medium"
              >
                Não tem conta? Criar agora
              </button>
              <button
                onClick={() => setMode('reset')}
                className="block w-full text-gray-600 hover:text-primary"
              >
                Esqueceu a senha?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => setMode('login')}
              className="block w-full text-primary hover:underline font-medium"
            >
              Já tem conta? Faça login
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => setMode('login')}
              className="block w-full text-primary hover:underline font-medium"
            >
              Voltar para login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
