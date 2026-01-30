import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AdminTransaction } from '@/types'
import { listAdminTransactions } from '@/api/admin'
import { isApiError } from '@/api/client'
import { formatCurrency } from '@/utils/pricing'

export function AdminPage() {
  const [email, setEmail] = useState('')
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canLoad = useMemo(() => email.trim().length > 3 && email.includes('@'), [email])

  const loadTransactions = useCallback(async () => {
    if (!canLoad) return
    setStatus('loading')
    setErrorMessage(null)
    try {
      const response = await listAdminTransactions(email.trim())
      setTransactions(response.data.items)
      setTotal(response.data.total)
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      if (isApiError(error)) {
        setErrorMessage(error.message)
        return
      }
      setErrorMessage('No se pudo cargar el panel de admin.')
    }
  }, [canLoad, email])

  useEffect(() => {
    setTransactions([])
    setTotal(0)
  }, [email])

  return (
    <div className="min-h-screen bg-[#f6f1ec] text-[#1e1a17]">
      <header className="px-8 py-6 border-b border-black/10 bg-[#f2e9e1]">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#8c6a52]">Admin Panel</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Transacciones</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">
        <section className="bg-white rounded-[32px] shadow-xl border border-black/5 p-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="text-xs uppercase tracking-[0.3em] font-black text-[#8c6a52]">Email Admin</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full mt-2 px-4 py-3 rounded-2xl border-2 border-transparent bg-[#f6f1ec] focus:border-[#8c6a52] focus:bg-white outline-none"
              />
            </div>
            <button
              type="button"
              disabled={!canLoad || status === 'loading'}
              onClick={loadTransactions}
              className="px-6 py-3 rounded-2xl font-black text-white bg-[#1e1a17] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Cargando...' : 'Ver transacciones'}
            </button>
          </div>
          {errorMessage && <p className="text-sm text-red-500 font-semibold mt-3">{errorMessage}</p>}
          {total > 0 && (
            <p className="text-sm text-black/60 font-semibold mt-3">Total: {total} transacciones</p>
          )}
        </section>

        <section className="space-y-6">
          {transactions.length === 0 && status === 'idle' && (
            <div className="text-black/50 font-semibold">Sin transacciones para mostrar.</div>
          )}

          {transactions.map((tx) => (
            <article key={tx.id} className="bg-white rounded-[28px] shadow-lg border border-black/5 p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] font-black text-[#8c6a52]">{tx.status}</p>
                  <h2 className="text-xl font-black">{formatCurrency(tx.amount, tx.currency)}</h2>
                  <p className="text-sm text-black/60">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-sm text-black/70">
                  <p className="font-bold">{tx.customer.fullName}</p>
                  <p>{tx.customer.email}</p>
                  <p>{tx.customer.phone ?? 'Sin teléfono'}</p>
                </div>
                <div className="text-sm text-black/70">
                  <p className="font-bold">Entrega</p>
                  <p>{tx.delivery.addressLine1}</p>
                  <p>{tx.delivery.city}, {tx.delivery.country}</p>
                  <p>{tx.delivery.postalCode ?? 'N/A'}</p>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4 space-y-3">
                {tx.items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-bold">{item.productSnapshot.name}</p>
                      <p className="text-xs text-black/50">x{item.quantity} · {formatCurrency(item.unitPriceAmount, item.currency)}</p>
                    </div>
                    <p className="font-black">{formatCurrency(item.unitPriceAmount * item.quantity, item.currency)}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
