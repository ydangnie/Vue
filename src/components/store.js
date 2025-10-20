// src/components/store.js
import { createStore } from 'vuex'
import axios from '../../axios.js'

// Hàm trợ giúp localStorage cho Cart
const loadCartFromLocalStorage = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) { console.error('Lỗi khi tải giỏ hàng:', error); return []; }
};

const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) { console.error('Lỗi khi lưu giỏ hàng:', error); }
};

// Hàm trợ giúp localStorage cho Wishlist
const loadWishlistFromLocalStorage = () => {
    try {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (e) { console.error('Lỗi tải wishlist:', e); return []; }
};

const saveWishlistToLocalStorage = (wishlist) => {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) { console.error('Lỗi lưu wishlist:', e); }
};

const store = createStore({
    state() {
        return {
            cart: loadCartFromLocalStorage(),
            user: JSON.parse(localStorage.getItem('user') || 'null'),
            wishlist: loadWishlistFromLocalStorage() // Thêm wishlist state
        }
    },
    mutations: {
        // --- Mutations cho giỏ hàng ---
        ADD_TO_CART(state, { product, quantity }) {
            if (product.stock <= 0) throw new Error('Sản phẩm đã hết hàng.');

            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity + quantity > product.stock) {
                    throw new Error('Số lượng trong giỏ hàng vượt quá tồn kho.');
                }
                existingItem.quantity += quantity;
            } else {
                if (quantity > product.stock) {
                    throw new Error('Số lượng chọn vượt quá tồn kho.');
                }
                state.cart.push({...product, quantity: quantity });
            }
            saveCartToLocalStorage(state.cart);
        },
        REMOVE_FROM_CART(state, productId) {
            state.cart = state.cart.filter(item => item.id !== productId)
            saveCartToLocalStorage(state.cart);
        },
        UPDATE_CART_ITEM_QUANTITY(state, { productId, quantity }) {
            const item = state.cart.find(item => item.id === productId)
            if (item) item.quantity = quantity;
            saveCartToLocalStorage(state.cart);
        },
        CLEAR_CART(state) {
            state.cart = [];
            localStorage.removeItem('cart');
        },
        SET_CART(state, cart) {
            state.cart = cart;
            saveCartToLocalStorage(state.cart);
        },

        // --- Mutations cho người dùng ---
        SET_USER(state, user) {
            state.user = user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        },

        // --- Mutations cho wishlist ---
        ADD_TO_WISHLIST(state, product) {
            if (!state.wishlist.find(item => item.id === product.id)) {
                state.wishlist.push(product);
                saveWishlistToLocalStorage(state.wishlist);
            }
        },
        REMOVE_FROM_WISHLIST(state, productId) {
            state.wishlist = state.wishlist.filter(item => item.id !== productId);
            saveWishlistToLocalStorage(state.wishlist);
        },
        SET_WISHLIST(state, wishlist) {
            state.wishlist = wishlist;
            saveWishlistToLocalStorage(state.wishlist);
        }
    },
    actions: {
        // --- Actions cho giỏ hàng ---
        async addToCart({ commit, state }, { product, quantity }) {
            const itemInCart = state.cart.find(item => item.id === product.id);
            if (itemInCart && itemInCart.quantity + quantity > product.stock) {
                throw new Error('Số lượng sản phẩm trong giỏ hàng đã đạt tối đa.');
            }
            if (!itemInCart && quantity > product.stock) {
                throw new Error('Số lượng tồn kho không đủ.');
            }
            commit('ADD_TO_CART', { product, quantity });
        },
        async removeFromCart({ commit }, productId) {
            commit('REMOVE_FROM_CART', productId);
        },
        async updateCartItemQuantity({ commit }, payload) {
            commit('UPDATE_CART_ITEM_QUANTITY', payload);
        },
        async clearCart({ commit }) {
            commit('CLEAR_CART');
        },
        loadCart({ commit }) {
            const cart = loadCartFromLocalStorage();
            commit('SET_CART', cart);
        },

        // --- Actions cho người dùng ---
        setUser({ commit }, user) {
            commit('SET_USER', user);
        },
        logout({ commit }) {
            commit('SET_USER', null);
            commit('CLEAR_CART');
            commit('SET_WISHLIST', []); // Xóa wishlist khi logout
        },

        // --- Actions cho wishlist ---
        toggleWishlist({ commit, state }, product) {
            const isInWishlist = state.wishlist.some(item => item.id === product.id);
            if (isInWishlist) {
                commit('REMOVE_FROM_WISHLIST', product.id);
            } else {
                commit('ADD_TO_WISHLIST', product);
            }
        },
        loadWishlist({ commit }) {
            const wishlist = loadWishlistFromLocalStorage();
            commit('SET_WISHLIST', wishlist);
        },
    },
    getters: {
        // --- Getters cho giỏ hàng ---
        cartTotal: state => state.cart.reduce((total, item) => total + (item.price * (1 - (item.discount || 0) / 100) * item.quantity), 0),
        cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),

        // --- Getters cho người dùng ---
        isLoggedIn: state => !!state.user,
        currentUser: state => state.user,

        // --- Getters cho wishlist ---
        wishlistItems: state => state.wishlist,
        isInWishlist: (state) => (productId) => {
            return state.wishlist.some(item => item.id === productId);
        }
    }
})
export default store;