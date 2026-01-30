import { useMemo, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import type { CheckoutCustomer, CheckoutDelivery } from '@/types'
import { getCustomerProfile } from '@/api/customers'
import { isApiError } from '@/api/client'
import { CheckoutProgress } from './CheckoutProgress'

interface EmailLookupStepProps {
  initialCustomer: CheckoutCustomer
  initialDelivery: CheckoutDelivery
  onBack: () => void
  onContinue: (data: { customer: CheckoutCustomer; delivery: CheckoutDelivery }) => void
}

export function EmailLookupStep({ initialCustomer, initialDelivery, onBack, onContinue }: EmailLookupStepProps) {
  const [email, setEmail] = useState(initialCustomer.email)
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  const isValid = useMemo(() => email.trim().length > 3 && email.includes('@'), [email])

  const handleContinue = async () => {
    if (!isValid) {
      setError('Ingresa un correo válido.')
      return
    }
    setError(null)
    setStatus('loading')
    try {
      const response = await getCustomerProfile(email.trim())
      onContinue({
        customer: response.data.customer,
        delivery: response.data.delivery ?? initialDelivery,
      })
      return
    } catch (err) {
      if (isApiError(err) && err.status === 404) {
        onContinue({
          customer: { ...initialCustomer, email: email.trim() },
          delivery: initialDelivery,
        })
        return
      }
      setError(isApiError(err) ? err.message : 'No se pudo validar el correo.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="p-8">
      <CheckoutProgress currentStep="EMAIL" />
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={onBack} className="p-3 bg-dark/5 rounded-2xl">
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-black text-dark tracking-tighter">Email</h2>
      </div>

      <div className="space-y-4">
        <label className="text-xs uppercase tracking-[0.3em] text-dark/40 font-black">Correo del cliente</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="w-full px-5 py-4 rounded-xl bg-dark/5 border-2 border-transparent focus:border-info focus:bg-white outline-none transition-all"
        />
        {error && <p className="text-sm text-red-500 font-semibold">{error}</p>}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isValid || status === 'loading'}
          className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? 'Validando...' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}
