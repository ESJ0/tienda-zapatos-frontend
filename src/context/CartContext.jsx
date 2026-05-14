import { createContext, useContext, useReducer, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

// ── Reducer ───────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id),
      }

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        ),
      }

    case 'CLEAR':
      return { items: [] }

    default:
      return state
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem     = useCallback((product) => dispatch({ type: 'ADD_ITEM', product }), [])
  const removeItem  = useCallback((id)      => dispatch({ type: 'REMOVE_ITEM', id }),   [])
  const updateQty   = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }), [])
  const clearCart   = useCallback(()        => dispatch({ type: 'CLEAR' }),              [])

  // useMemo: solo recalcula cuando cambian los items
  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  )

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  )

  return (
    <CartContext.Provider value={{
      items: state.items,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}