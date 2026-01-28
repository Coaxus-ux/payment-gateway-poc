import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../index'

const selectCartState = (state: RootState) => state.cart

export const selectCartItems = createSelector(selectCartState, (cart) => cart.items)
export const selectCheckoutData = createSelector(selectCartState, (cart) => cart.checkoutData)
export const selectCartTotalItems = createSelector(selectCartItems, (items) => items.reduce((sum, item) => sum + item.quantity, 0))
