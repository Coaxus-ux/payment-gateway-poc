import { useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import { cn } from '@/utils/cn'

export type ToastVariant = 'error' | 'info' | 'success'

interface ToastProps {
  message: string
  requestId?: string
  variant?: ToastVariant
  duration?: number
  onDismiss: () => void
}

export function Toast({ message, requestId, variant = 'info', duration = 4000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = window.setTimeout(() => onDismiss(), duration)
    return () => window.clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <div
        className={cn(
          'min-w-[260px] max-w-sm rounded-2xl px-5 py-4 shadow-2xl border text-sm font-semibold flex items-start gap-3 backdrop-blur-xl',
          variant === 'error' && 'bg-red-500/90 border-red-200 text-white',
          variant === 'success' && 'bg-emerald-500/90 border-emerald-200 text-white',
          variant === 'info' && 'bg-dark/90 border-white/10 text-white'
        )}
      >
        <div className="flex-1">
          <p className="leading-snug">{message}</p>
          {requestId && <p className="text-[10px] uppercase tracking-widest mt-2 opacity-70">Request ID: {requestId}</p>}
        </div>
        <button type="button" onClick={onDismiss} className="p-1 -m-1 opacity-70 hover:opacity-100">
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
