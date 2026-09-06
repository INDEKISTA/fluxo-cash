import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

export default function StatusOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      console.log('🟢 Conectado novamente')
      setIsOnline(true)
      setTimeout(() => window.location.reload(), 500)
    }

    const handleOffline = () => {
      console.log('🔴 Modo offline ativado')
      setIsOnline(false)
      setTimeout(() => window.location.reload(), 500)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-4 bg-red-500 text-white p-4 rounded-lg flex items-center gap-3 z-40">
      <WifiOff size={20} />
      <div>
        <p className="font-bold">⚠️ Modo Offline</p>
        <p className="text-xs">Seus dados serão salvos localmente</p>
      </div>
    </div>
  )
}