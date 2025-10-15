<template>
  <div class="thanh-toan">
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/gio-hang">Giỏ hàng</router-link></li>
          <li class="breadcrumb-item active">Thanh toán</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header">
              <h4 class="mb-0">Thông tin đơn hàng</h4>
            </div>
            <div class="card-body">
              <div v-for="item in cart" :key="item.id" class="order-item mb-3 pb-3 border-bottom">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80x80?text=No+Image'"
                         :alt="item.title" class="img-fluid rounded">
                  </div>
                  <div class="col-md-4">
                    <h6 class="mb-1">{{ item.title }}</h6>
                    <small class="text-muted">{{ item.category }}</small>
                  </div>
                  <div class="col-md-2">
                    <span class="fw-bold">${{ (item.price * (1 - item.discount / 100)).toFixed(2) }}</span>
                  </div>
                  <div class="col-md-2">
                    <span class="badge bg-secondary">x{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2">
                    <span class="fw-bold text-primary">${{ ((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h4 class="mb-0">Thông tin khách hàng</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="placeOrder">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ tên *</label>
                    <input v-model="orderInfo.customerName" type="text" class="form-control" required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="orderInfo.customerEmail" type="email" class="form-control" required readonly>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Số điện thoại *</label>
                  <input v-model="orderInfo.customerPhone" type="tel" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Địa chỉ giao hàng *</label>
                  <textarea v-model="orderInfo.shippingAddress" class="form-control" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Ghi chú</label>
                  <textarea v-model="orderInfo.notes" class="form-control" rows="2" placeholder="Ghi chú thêm về đơn hàng..."></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4" id="clol">
          <div class="card sticky-top">
            <div class="card-header">
              <h5 class="mb-0">Tóm tắt đơn hàng</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Tổng sản phẩm:</span>
                <span>{{ cartItemCount }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tổng tiền:</span>
                <span class="fw-bold text-primary">${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div v-if="promoDiscount > 0" class="d-flex justify-content-between mb-2">
                <span>Mã giảm giá:</span>
                <span class="fw-bold text-success">-${{ promoDiscount.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold">Tổng thanh toán:</span>
                <span class="fw-bold text-danger fs-5">${{ finalTotal.toFixed(2) }}</span>
              </div>

              <div class="mb-3">
                <label class="form-label">Mã khuyến mãi</label>
                <div class="input-group">
                  <input v-model="orderInfo.promoCode" type="text" class="form-control" placeholder="Nhập mã khuyến mãi (nếu có)">
                  <button @click="applyPromoCode" class="btn btn-outline-primary" type="button" :disabled="!orderInfo.promoCode">
                    Áp dụng
                  </button>
                </div>
                <small class="text-muted">Để trống nếu không có mã khuyến mãi</small>
                <div v-if="promoDiscount > 0" class="mt-2 alert alert-success">
                  <small>Giảm giá: -${{ promoDiscount.toFixed(2) }} ({{ promoCodeInfo.discount }}%)</small>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Phương thức thanh toán</label>
                <select v-model="orderInfo.paymentMethod" class="form-control">
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="vnpay">Ví điện tử VNPay</option>
                  <option value="bank">Chuyển khoản ngân hàng</option>
                  <option value="card">Thẻ tín dụng</option>
                </select>
              </div>

              <button @click="placeOrder" class="btn btn-success w-100" :disabled="placingOrder || cart.length === 0">
                <span v-if="placingOrder" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i class="fas fa-credit-card me-2"></i>
                {{ placingOrder ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>

              <div class="mt-3 text-center">
                <router-link to="/gio-hang" class="btn btn-outline-secondary btn-sm">
                  <i class="fas fa-arrow-left me-1"></i> Quay lại giỏ hàng
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import axios from '../../../axios.js'

export default {
  name: 'ThanhToan',
  data() {
    return {
      placingOrder: false,
      orderInfo: {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        notes: '',
        paymentMethod: 'cod',
        promoCode: ''
      },
      promoDiscount: 0,
      promoCodeInfo: null
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal', 'cartItemCount']),
    finalTotal() {
      return this.cartTotal - this.promoDiscount;
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        this.orderInfo.customerName = user.username;
        this.orderInfo.customerEmail = user.email;
    }
  },
  methods: {
    ...mapActions(['clearCart']),
    applyPromoCode() {
        // ... logic giữ nguyên
    },
    async placeOrder() {
      if (this.cart.length === 0) {
        this.$toast.error('Giỏ hàng trống!')
        return
      }
      if (!this.orderInfo.customerName || !this.orderInfo.customerEmail || !this.orderInfo.customerPhone || !this.orderInfo.shippingAddress) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin!')
        return
      }
      this.placingOrder = true
      try {
        const orderData = {
          customer: {
            name: this.orderInfo.customerName,
            email: this.orderInfo.customerEmail,
            phone: this.orderInfo.customerPhone,
            address: this.orderInfo.shippingAddress
          },
          items: [...this.cart],
          total: this.finalTotal,
          originalTotal: this.cartTotal,
          promoCode: this.orderInfo.promoCode || null,
          promoDiscount: this.promoDiscount,
          paymentMethod: this.orderInfo.paymentMethod,
          notes: this.orderInfo.notes,
          status: 'pending',
          createdAt: new Date().toISOString()
        }

        const response = await axios.post('/orders', orderData)
        const savedOrder = response.data;

        this.clearCart()
        this.$toast.success('Đặt hàng thành công!')

        this.$router.push({
          name: 'DonHangThanhCong',
          params: { orderId: savedOrder.id }
        })

      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi đặt hàng!');
      } finally {
        this.placingOrder = false
      }
    }
  }
}
</script>

<style scoped>
.thanh-toan {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.order-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.order-item img {
  max-width: 80px;
  height: 80px;
  object-fit: cover;
}

.sticky-top {
  top: 20px;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
  transform: translateY(-2px);
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 2rem;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}
#clol{
  z-index: 1;
}
</style>