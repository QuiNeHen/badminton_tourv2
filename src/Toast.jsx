import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)  // { msg, type }
  const timer = useRef(null)

  const show = useCallback((msg, type = 'ok') => {
    clearTimeout(timer.current)
    setToast({ msg, type })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'err' ? '#991B1B' : '#0A0A0A',
          color: '#fff',
          padding: '9px 22px',
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.2px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          zIndex: 9999,
          whiteSpace: 'nowrap',
          animation: 'slideUp .22s ease',
          pointerEvents: 'none',
        }}>
          {toast.msg}
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
