import type { AdminTransaction } from '@/types'
import { fetchJson } from './client'

export interface AdminTransactionsResponse {
  total: number
  items: AdminTransaction[]
}

export async function listAdminTransactions(email: string, limit = 50, offset = 0) {
  const query = new URLSearchParams({ email, limit: String(limit), offset: String(offset) })
  return fetchJson<AdminTransactionsResponse>(`/admin/transactions?${query.toString()}`)
}
