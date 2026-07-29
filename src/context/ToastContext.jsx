import { createContext, useCallback, useRef, useState } from 'react'

export const ToastContext = createContext({ toast: () => {} })

const estilos = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error: 'bg-red-50 border-red-200 text-red-600',
  info: 'bg-indigo-50 border-indigo-200 text-indigo-700',
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
    timers.current[id] = setTimeout(() => remover(id), 4000)
  }, [remover])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => remover(t.id)}
            className={`animate-toast-in pointer-events-auto cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${estilos[t.tipo]}`}
          >
            {t.mensagem}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
