import { createContext, useCallback, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export const ToastContext = createContext({ toast: () => {} })

const DURACAO_MS = 4000

const estilos = {
  success: { cor: 'bg-green-50 border-green-200 text-green-700', barra: 'bg-green-500', Icone: CheckCircle2 },
  error: { cor: 'bg-red-50 border-red-200 text-red-600', barra: 'bg-red-500', Icone: AlertTriangle },
  info: { cor: 'bg-indigo-50 border-indigo-200 text-indigo-700', barra: 'bg-indigo-500', Icone: Info },
}

let proximoId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remover = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback((mensagem, tipo = 'info') => {
    const id = proximoId++
    setToasts((prev) => [...prev, { id, mensagem, tipo }])
    timers.current[id] = setTimeout(() => remover(id), DURACAO_MS)
  }, [remover])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((t) => {
          const { cor, barra, Icone } = estilos[t.tipo]
          return (
            <div
              key={t.id}
              onClick={() => remover(t.id)}
              className={`animate-toast-in pointer-events-auto cursor-pointer overflow-hidden rounded-lg border shadow-lg ${cor}`}
            >
              <div className="flex items-start gap-2 px-4 py-3 text-sm font-medium">
                <Icone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t.mensagem}</span>
              </div>
              <div
                className={`h-1 ${barra} animate-toast-progress`}
                style={{ animationDuration: `${DURACAO_MS}ms` }}
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
