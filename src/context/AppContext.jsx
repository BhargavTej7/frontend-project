import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'farmlink-state'

const defaultState = {
  currentUserId: null,
  users: [
    {
      id: 'admin-1',
      role: 'admin',
      name: 'Bhargav Teja',
      email: '2400030791@kluniversity.in',
      password: 'bhargav',
      status: 'active',
      location: 'Global Operations',
      createdAt: Date.now(),
    },
    {
      id: 'farmer-1',
      role: 'farmer',
      name: 'Sohail ',
      email: '2400080026@kluniversity.in',
      password: 'farmer123',
      status: 'active',
      location: 'Gujarat, India',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
      expertise: ['Millets', 'Value-added snacks'],
    },
    {
      id: 'farmer-2',
      role: 'farmer',
      name: 'Bharath',
      email: '2400033014@kluniversity.in',
      password: 'farmer123',
      status: 'active',
      location: 'Ashanti, Ghana',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 32,
      expertise: ['Cocoa', 'Artisanal chocolate'],
    },
    {
      id: 'buyer-1',
      role: 'buyer',
      name: 'Global Organic Foods',
      email: '2300031957@kluniversity.in',
      password: 'buyer123',
      status: 'active',
      location: 'Berlin, Germany',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    },
    {
      id: 'buyer-2',
      role: 'buyer',
      name: 'Artisan Market Collective',
      email: '2400080018@kluniversity.in',
      password: 'buyer123',
      status: 'active',
      location: 'Austin, USA',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    },
  ],
  products: [
    {
      id: 'product-1',
      farmerId: 'farmer-1',
      name: 'Spiced Pearl Millet Snack Mix',
      description:
        'Hand-roasted pearl millet clusters infused with regional spices, ready for international shipping.',
      category: 'Processed Foods',
      price: 14.5,
      stock: 220,
      unit: 'packs',
      lastUpdated: Date.now() - 1000 * 60 * 60 * 5,
      certifications: ['Organic Certified', 'Fair Trade Compliant'],
      images: [
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80',
      ],
      status: 'approved',
      valueAdd: ['Cold-pressed oil coating', 'Dehydrated herbs infusion'],
    },
    {
      id: 'product-2',
      farmerId: 'farmer-2',
      name: 'Single-Origin Cocoa Nibs',
      description:
        'Stone-ground cocoa nibs with traceable origin, ideal for bean-to-bar chocolate makers.',
      category: 'Artisan Ingredients',
      price: 19.75,
      stock: 120,
      unit: 'kg',
      lastUpdated: Date.now() - 1000 * 60 * 60 * 24 * 2,
      certifications: ['Rainforest Alliance', 'HACCP'],
      images: [
        'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
      ],
      status: 'approved',
      valueAdd: ['Solar fermentation', 'Hand-sorted beans'],
    },
  ],
  orders: [
    {
      id: 'order-1',
      buyerId: 'buyer-1',
      productId: 'product-2',
      farmerId: 'farmer-2',
      quantity: 45,
      totalPrice: 45 * 19.75,
      status: 'in_transit',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      updatedAt: Date.now() - 1000 * 60 * 60 * 12,
      notes: 'Require moisture-proof packaging',
    },
    {
      id: 'order-2',
      buyerId: 'buyer-2',
      productId: 'product-1',
      farmerId: 'farmer-1',
      quantity: 150,
      totalPrice: 150 * 14.5,
      status: 'delivered',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      notes: 'Interested in exclusive flavor collaboration',
    },
  ],
  feedback: [
    {
      id: 'feedback-1',
      orderId: 'order-2',
      buyerId: 'buyer-2',
      farmerId: 'farmer-1',
      rating: 5,
      comment:
        'Exceptional flavor and packaging. Our customers love the story behind this product.',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
  ],
}

const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER_USER: 'REGISTER_USER',
  TOGGLE_USER_STATUS: 'TOGGLE_USER_STATUS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  APPROVE_PRODUCT: 'APPROVE_PRODUCT',
  PLACE_ORDER: 'PLACE_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  ADD_FEEDBACK: 'ADD_FEEDBACK',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN: {
      return { ...state, currentUserId: action.payload.userId }
    }
    case ACTIONS.LOGOUT: {
      return { ...state, currentUserId: null }
    }
    case ACTIONS.REGISTER_USER: {
      return { ...state, users: [...state.users, action.payload.user] }
    }
    case ACTIONS.TOGGLE_USER_STATUS: {
      const { userId } = action.payload
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === 'active' ? 'suspended' : 'active',
              }
            : user,
        ),
      }
    }
    case ACTIONS.ADD_PRODUCT: {
      return { ...state, products: [action.payload.product, ...state.products] }
    }
    case ACTIONS.UPDATE_PRODUCT: {
      const { productId, updates } = action.payload
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === productId ? { ...product, ...updates } : product,
        ),
      }
    }
    case ACTIONS.DELETE_PRODUCT: {
      const { productId } = action.payload
      return {
        ...state,
        products: state.products.filter((product) => product.id !== productId),
        orders: state.orders.filter((order) => order.productId !== productId),
      }
    }
    case ACTIONS.APPROVE_PRODUCT: {
      const { productId, status } = action.payload
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === productId ? { ...product, status } : product,
        ),
      }
    }
    case ACTIONS.PLACE_ORDER: {
      return { ...state, orders: [action.payload.order, ...state.orders] }
    }
    case ACTIONS.UPDATE_ORDER_STATUS: {
      const { orderId, status } = action.payload
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: Date.now() }
            : order,
        ),
      }
    }
    case ACTIONS.ADD_FEEDBACK: {
      return {
        ...state,
        feedback: [action.payload.feedback, ...state.feedback],
      }
    }
    default:
      return state
  }
}

const initializer = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (_error) {
    // ignore JSON errors and fallback to defaults
  }
  return defaultState
}

const randomId = (prefix) =>
  `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)}`

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState, initializer)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (_error) {
      // Ignore storage quota issues
    }
  }, [state])

  const currentUser = state.currentUserId
    ? state.users.find((user) => user.id === state.currentUserId) ?? null
    : null

  const login = (email, password) => {
    const user = state.users.find(
      (candidate) =>
        candidate.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        candidate.password === password,
    )

    if (!user) {
      throw new Error('Invalid credentials')
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active. Contact the admin team.')
    }

    dispatch({ type: ACTIONS.LOGIN, payload: { userId: user.id } })
    return user
  }

  const logout = () => dispatch({ type: ACTIONS.LOGOUT })

  const registerUser = (userInput) => {
    const alreadyExists = state.users.some(
      (user) =>
        user.email.trim().toLowerCase() ===
        userInput.email.trim().toLowerCase(),
    )

    if (alreadyExists) {
      throw new Error('Email already registered')
    }

    const user = {
      id: randomId(userInput.role),
      createdAt: Date.now(),
      status: 'active',
      ...userInput,
    }

    dispatch({ type: ACTIONS.REGISTER_USER, payload: { user } })
    dispatch({ type: ACTIONS.LOGIN, payload: { userId: user.id } })
    return user
  }

  const toggleUserStatus = (userId) =>
    dispatch({ type: ACTIONS.TOGGLE_USER_STATUS, payload: { userId } })

  const addProduct = (farmerId, productInput) => {
    const product = {
      id: randomId('product'),
      farmerId,
      lastUpdated: Date.now(),
      status: 'pending',
      images: productInput.images?.length
        ? productInput.images
        : [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
          ],
      valueAdd: productInput.valueAdd ?? [],
      ...productInput,
    }

    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: { product } })
    return product
  }

  const updateProduct = (productId, updates) =>
    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: { productId, updates } })

  const deleteProduct = (productId) =>
    dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: { productId } })

  const approveProduct = (productId, status) =>
    dispatch({ type: ACTIONS.APPROVE_PRODUCT, payload: { productId, status } })

  const placeOrder = (buyerId, orderInput) => {
    const product = state.products.find(
      (item) => item.id === orderInput.productId,
    )
    if (!product) {
      throw new Error('Product not found')
    }

    if (orderInput.quantity > product.stock) {
      throw new Error('Requested quantity exceeds available stock')
    }

    const order = {
      id: randomId('order'),
      buyerId,
      productId: orderInput.productId,
      farmerId: product.farmerId,
      quantity: orderInput.quantity,
      totalPrice: Number((orderInput.quantity * product.price).toFixed(2)),
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notes: orderInput.notes ?? '',
    }

    dispatch({ type: ACTIONS.PLACE_ORDER, payload: { order } })
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT,
      payload: {
        productId: product.id,
        updates: { stock: product.stock - order.quantity, lastUpdated: Date.now() },
      },
    })
    return order
  }

  const updateOrderStatus = (orderId, status) =>
    dispatch({ type: ACTIONS.UPDATE_ORDER_STATUS, payload: { orderId, status } })

  const addFeedback = (feedbackInput) => {
    const feedback = {
      id: randomId('feedback'),
      createdAt: Date.now(),
      ...feedbackInput,
    }
    dispatch({ type: ACTIONS.ADD_FEEDBACK, payload: { feedback } })
    return feedback
  }

  const value = useMemo(
    () => ({
      state,
      currentUser,
      login,
      logout,
      registerUser,
      toggleUserStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      approveProduct,
      placeOrder,
      updateOrderStatus,
      addFeedback,
    }),
    [state, currentUser],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}


