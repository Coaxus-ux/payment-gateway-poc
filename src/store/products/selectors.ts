import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export const selectProducts = (state: RootState) => state.products.items
export const selectProductsStatus = (state: RootState) => state.products.status
export const selectProductsError = (state: RootState) => state.products.error
export const selectProductDetailStatus = (state: RootState) => state.products.detailStatus
export const selectProductDetailError = (state: RootState) => state.products.detailError

export const selectProductById = createSelector(
  [selectProducts, (_: RootState, productId: string) => productId],
  (products, productId) => products.find((product) => product.id === productId)
)
