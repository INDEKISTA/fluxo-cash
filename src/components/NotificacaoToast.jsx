import { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

export default function NotificacaoToast({ notificacoes, removerNotificacao }) {
  return (
    <div className="fixed top-20 right-4 space-y-3 z-50 max-w-sm">
      {notificacoes.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slideIn ${
            notif.tipo === 'alerta'
              ? 'bg-red-500 text-white'
              : notif.tipo === 'aviso'
              ? 'bg-yellow-500 text-white'
              : notif.tipo === 'sucesso'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {notif.tipo === 'alerta' && <AlertCircle size={20} />}
            {notif.tipo === 'sucesso' && <CheckCircle size={20} />}
            {notif.tipo === 'aviso' && <AlertCircle size={20} />}
            {notif.tipo === 'info' && <Info size={20} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{notif.titulo}</p>
            <p className="text-sm opacity-90">{notif.mensagem}</p>
          </div>
          <button
            onClick={() => removerNotificacao(notif.id)}
            className="flex-shrink-0 hover:opacity-75"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}