import { createStore } from 'vuex'
import axios from '../../axios.js'

// Helper functions for API
const loadCartFromAPI = async() => {
    try {
        const response = await axios.get('/cart');
        return response.data || [];
    } catch (error) {
        console.error('Error loading cart from API:', error);
        return [];
    }
};

const saveCartToAPI = async(cart) => {
    try {
        // Temporarily disabled API save due to 404 error
        // await axios.put('/cart', cart);
        console.log('Cart saved to memory:', cart);
    } catch (error) {
        console.error('Error saving cart to API:', error);
    }
};

// Create a new store instance.
const store = createStore({
    state() {
        return {
            count: 0,
            cart: [],
            user: null
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },

        decrease(state) {
            state.count--
        },
        // Cart mutations
        ADD_TO_CART(state, product) {
            // Check if product has enough stock
            if (product.stock <= 0) {
                throw new Error('Sản phẩm đã hết hàng');
            }

            const existingItem = state.cart.find(item => item.id === product.id)
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    throw new Error('Không thể thêm nhiều hơn số lượng có sẵn');
                }
                existingItem.quantity++
            } else {
                state.cart.push({...product, quantity: 1 })
            }
            saveCartToAPI(state.cart)
        },
        REMOVE_FROM_CART(state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId)
            saveCartToAPI(state.cart)
        },
        UPDATE_CART_ITEM_QUANTITY(state, { productId, quantity }) {
            const item = state.cart.find(item => item.id === productId)
            if (item) {
                item.quantity = quantity
            }
            saveCartToAPI(state.cart)
        },
        CLEAR_CART(state) {
            state.cart = []
            saveCartToAPI(state.cart)
        },
        SET_CART(state, cart) {
            state.cart = cart
        },
        // User mutations
        SET_USER(state, user) {
            state.user = user
        },
        UPDATE_USER(state, userData) {
            if (state.user) {
                state.user = {...state.user, ...userData }
            }
        }
    },
    actions: {
        incrementAsync({ commit }) {
            setTimeout(() => {
                commit('increment')
            }, 1000)
        },
        // Cart actions
        async addToCart({ commit }, product) {
            commit('ADD_TO_CART', product)
        },
        async removeFromCart({ commit }, productId) {
            commit('REMOVE_FROM_CART', productId)
        },
        async updateCartItemQuantity({ commit }, payload) {
            commit('UPDATE_CART_ITEM_QUANTITY', payload)
        },
        async clearCart({ commit }) {
            commit('CLEAR_CART')
        },
        async loadCart({ commit }) {
            const cart = await loadCartFromAPI()
            commit('SET_CART', cart)
        },
        // User actions
        setUser({ commit }, user) {
            commit('SET_USER', user)
        },
        updateUser({ commit }, userData) {
            commit('UPDATE_USER', userData)
        }
    },
    getters: {
        cartTotal: state => {
            return state.cart.reduce((total, item) => {
                const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
                return total + (discountedPrice * item.quantity);
            }, 0)
        },
        cartItemCount: state => {
            return state.cart.reduce((total, item) => total + item.quantity, 0)
        },
        getCartItem: state => productId => {
            return state.cart.find(item => item.id === productId)
        }
    }
})
export default store