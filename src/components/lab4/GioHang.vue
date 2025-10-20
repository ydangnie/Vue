<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'GioHang',
 
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal', 'cartItemCount'])
  },
  methods: {
    ...mapActions({
      removeFromCartAction: 'removeFromCart', 
      updateCartItemQuantity: 'updateCartItemQuantity',
      clearCartAction: 'clearCart' 
    }),

  

    async removeFromCart(productId) {
      const item = this.cart.find(item => item.id === productId);
      if (item) {
        // Gọi action gốc để xóa sản phẩm
        await this.removeFromCartAction(productId);
        // Hiển thị thông báo thành công
        this.$toast.success('Đã xóa!', `Đã xóa "${item.title}" khỏi giỏ hàng.`);
      }
    },

    
    async clearCart() {
      if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
        // Gọi action gốc để xóa giỏ hàng
        await this.clearCartAction();
        // Hiển thị thông báo
        this.$toast.info('Thông báo', 'Giỏ hàng của bạn đã được dọn sạch.');
      }
    },

    // --- KẾT THÚC THAY ĐỔI ---

    increaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);
      if (item && item.quantity < item.stock) {
        this.updateCartItemQuantity({ productId, quantity: item.quantity + 1 });
      } else {
        this.$toast.warning('Số lượng đã đạt giới hạn tồn kho!');
      }
    },
    decreaseQuantity(productId) {
      const item = this.cart.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        this.updateCartItemQuantity({ productId, quantity: item.quantity - 1 });
      }
    },
    updateQuantity(productId, newQuantity) {
      const quantity = parseInt(newQuantity);
      const item = this.cart.find(item => item.id === productId);
      if (!item) return;

      if (quantity > 0 && quantity <= item.stock) {
        this.updateCartItemQuantity({ productId, quantity });
      } else if (quantity > item.stock) {
          this.updateCartItemQuantity({ productId, quantity: item.stock });
          this.$toast.error('Không thể vượt quá số lượng tồn kho!');
      } else {
        this.removeFromCart(productId); // Gọi phương thức đã ghi đè
      }
    },
  }
}
</script>


<template>
  <div class="gio-hang">
    <div class="container">
      <h1 class="mb-4">Giỏ hàng của bạn</h1>

      <div v-if="cart.length > 0" class="cart-items">
        <div v-for="item in cart" :key="item.id" class="cart-item card mb-3">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-2">
                <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'"
                     :alt="item.title" class="img-fluid rounded">
              </div>
              <div class="col-md-4">
                <h5 class="card-title">{{ item.title }}</h5>
                <p class="card-text text-muted">{{ item.category }}</p>
              </div>
              <div class="col-md-2">
                <div class="price-section">
                  <span class="final-price">${{ (item.price * (1 - (item.discount || 0) / 100)).toFixed(2) }}</span>
                  <span v-if="(item.discount || 0) > 0" class="original-price">${{ item.price }}</span>
                </div>
              </div>
              <div class="col-md-2">
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(item.id)" class="btn btn-outline-secondary btn-sm">-</button>
                  <input type="number" :value="item.quantity" @input="updateQuantity(item.id, $event.target.value)" class="form-control form-control-sm quantity-input mx-2" min="1" :max="item.stock">
                  <button @click="increaseQuantity(item.id)" class="btn btn-outline-secondary btn-sm">+</button>
                </div>
              </div>
              <div class="col-md-1">
                <span class="item-total">${{ ((item.price * (1 - (item.discount || 0) / 100)) * item.quantity).toFixed(2) }}</span>
              </div>
              <div class="col-md-1">
                <button @click="removeFromCart(item.id)" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary card mt-4">
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h4>Tổng cộng</h4>
                <p class="mb-0">Số lượng sản phẩm: {{ cartItemCount }}</p>
              </div>
              <div class="col-md-4 text-end">
                <h3 class="text-primary">${{ cartTotal.toFixed(2) }}</h3>
                <button @click="clearCart" class="btn btn-outline-danger me-2">Xóa tất cả</button>
                <router-link to="/thanh-toan" class="btn btn-success">Thanh toán</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-cart text-center py-5">
        <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
        <h3>Giỏ hàng trống</h3>
        <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <router-link to="/san-pham" class="btn btn-primary">Tiếp tục mua sắm</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gio-hang {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.cart-item {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.cart-item img {
  max-width: 100px;
  height: 100px;
  object-fit: cover;
}

.price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.final-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #000000;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-input {
  width: 60px;
  text-align: center;
  font-weight: bold;
}

.item-total {
  font-weight: bold;
  color: #464747;
}

.cart-summary {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  background: linear-gradient(135deg, #747578 0%, #2d2d2d 100%);
  color: rgb(255, 255, 255);
}

.cart-summary .card-body {
  padding: 30px;
}

.empty-cart {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin: 50px auto;
  max-width: 500px;
}

.btn-primary {
  background: linear-gradient(135deg, #747578 0%, #f1f1f1 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #747578 0%, #ffffff 100%);
  transform: translateY(-2px);
}

.btn-success {
  background: linear-gradient(135deg, #000000 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
  color: rgb(255, 255, 255);
  border: solid rgb(0, 0, 0);
}

.btn-success:hover {
  border: solid rgb(255, 255, 255);
  transform: translateY(-2px);
}

.btn-danger {
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
}
</style>