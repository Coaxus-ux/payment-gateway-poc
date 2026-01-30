import type { CardData, CheckoutCustomer, CheckoutDelivery } from '@/types'
import { fetchJson } from './client'

export interface CreateTransactionPayload {
  items: Array<{
    productId: string
    quantity: number
  }>
  amount: number
  currency: string
  customer: CheckoutCustomer
  delivery: CheckoutDelivery
}

export interface TransactionResponse {
  id?: string
  transactionId?: string
  deliveryId?: string
  status?: string
  amount?: number
  currency?: string
}

export interface DeliveryResponse {
  id?: string
}

export interface PayTransactionResponse {
  status?: string
  transactionId?: string
  message?: string
}

export async function createTransaction(payload: CreateTransactionPayload) {
  return fetchJson<TransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateDelivery(deliveryId: string, transactionId: string, delivery: CheckoutDelivery) {
  return fetchJson<DeliveryResponse>(`/deliveries/${deliveryId}`, {
    method: 'PATCH',
    body: JSON.stringify({ transactionId, ...delivery }),
  })
}

export async function payTransaction(transactionId: string, card: CardData) {
  return fetchJson<PayTransactionResponse>(`/transactions/${transactionId}/pay`, {
    method: 'POST',
    body: JSON.stringify({
      cardNumber: card.number,
      expMonth: card.expMonth,
      expYear: card.expYear,
      cvc: card.cvc,
      holderName: card.holderName,
    }),
  })
}
