import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../index'

const selectCartState = (state: RootState) => state.cart

export const selectCartItems = createSelector(selectCartState, (cart) => cart.items)
export const selectCheckoutData = createSelector(selectCartState, (cart) => cart.checkoutData)
export const selectCheckoutSelection = createSelector(selectCheckoutData, (data) => data.selection)
export const selectCheckoutCustomer = createSelector(selectCheckoutData, (data) => data.customer)
export const selectCheckoutDelivery = createSelector(selectCheckoutData, (data) => data.delivery)
export const selectCheckoutIds = createSelector(selectCheckoutData, (data) => ({
  transactionId: data.transactionId,
  deliveryId: data.deliveryId,
}))
export const selectCartTotalItems = createSelector(selectCartItems, (items) => items.reduce((sum, item) => sum + item.quantity, 0))
