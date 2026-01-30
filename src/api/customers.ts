import type { CustomerProfile } from '@/types'
import { fetchJson } from './client'

export async function getCustomerProfile(email: string) {
  const query = new URLSearchParams({ email })
  return fetchJson<CustomerProfile>(`/customers/lookup?${query.toString()}`)
}
