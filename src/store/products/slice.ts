import { createSlice } from '@reduxjs/toolkit'
import type { Product } from '@/types'
import { MOCK_PRODUCTS } from './mock'

interface ProductsState {
  items: Product[]
}

const initialState: ProductsState = {
  items: MOCK_PRODUCTS,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
})

export const productsReducer = productsSlice.reducer
