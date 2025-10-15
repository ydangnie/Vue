import { createStore } from 'vuex'
import axios from '../../axios.js'

// Hàm trợ giúp để tải giỏ hàng từ localStorage
const loadCartFromLocalStorage = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error('Lỗi khi tải giỏ hàng từ LocalStorage:', error);
        return [];
    }
};

// Hàm trợ giúp để lưu giỏ hàng vào localStorage
const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Lỗi khi lưu giỏ hàng vào LocalStorage:', error);
    }
};

// Create a new store instance.
const store = createStore({
    state() {
        return {
            count: 0,
            cart: loadCartFromLocalStorage(), // Tải giỏ hàng khi khởi tạo
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
            // Kiểm tra tồn kho
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
            saveCartToLocalStorage(state.cart); // Lưu vào localStorage
        },
        REMOVE_FROM_CART(state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId)
            saveCartToLocalStorage(state.cart); // Lưu vào localStorage
        },
        UPDATE_CART_ITEM_QUANTITY(state, { productId, quantity }) {
            const item = state.cart.find(item => item.id === productId)
            if (item) {
                item.quantity = quantity
            }
            saveCartToLocalStorage(state.cart); // Lưu vào localStorage
        },
        CLEAR_CART(state) {
            state.cart = []
            saveCartToLocalStorage(state.cart); // Lưu vào localStorage
        },
        SET_CART(state, cart) {
            state.cart = cart;
            saveCartToLocalStorage(state.cart);
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
        async addToCart({ commit, state }, product) {
            const itemInCart = state.cart.find(item => item.id === product.id);
            if (itemInCart && itemInCart.quantity >= product.stock) {
                throw new Error('Số lượng sản phẩm trong giỏ hàng đã đạt tối đa.');
            }
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
        loadCart({ commit }) {
            const cart = loadCartFromLocalStorage();
            commit('SET_CART', cart);
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