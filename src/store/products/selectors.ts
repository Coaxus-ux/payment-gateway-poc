import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export const selectProducts = (state: RootState) => state.products.items

export const selectProductById = createSelector(
  [selectProducts, (_: RootState, productId: string) => productId],
  (products, productId) => products.find((product) => product.id === productId)
)
