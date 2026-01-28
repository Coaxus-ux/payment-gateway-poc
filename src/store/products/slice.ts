import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'
import type { ApiErrorPayload } from '@/api/client'
import { getProducts, getProductById } from '@/api/products'

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: ApiErrorPayload | null
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  detailError: ApiErrorPayload | null
  lastRequestId?: string
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  detailStatus: 'idle',
  detailError: null,
  lastRequestId: undefined,
}

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getProducts()
  } catch (error) {
    return rejectWithValue(error as ApiErrorPayload)
  }
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (productId: string, { rejectWithValue }) => {
  try {
    return await getProductById(productId)
  } catch (error) {
    return rejectWithValue(error as ApiErrorPayload)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ data: Product[]; requestId?: string }>) => {
        state.status = 'succeeded'
        state.items = action.payload.data
        state.lastRequestId = action.payload.requestId
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as ApiErrorPayload) ?? { message: 'Failed to load products' }
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading'
        state.detailError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<{ data: Product; requestId?: string }>) => {
        state.detailStatus = 'succeeded'
        state.detailError = null
        state.lastRequestId = action.payload.requestId
        const existingIndex = state.items.findIndex((product) => product.id === action.payload.data.id)
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload.data
        } else {
          state.items.push(action.payload.data)
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.detailError = (action.payload as ApiErrorPayload) ?? { message: 'Failed to load product' }
      })
  },
})

export const productsReducer = productsSlice.reducer
