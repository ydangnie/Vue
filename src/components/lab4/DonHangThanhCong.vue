<template>
  <div class="don-hang-thanh-cong">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="success-card text-center">
            <div class="success-icon mb-4">
              <i class="fas fa-check-circle"></i>
            </div>
            <h1 class="mb-3">Đặt hàng thành công!</h1>
            <p class="lead mb-4">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý thành công.</p>

            <div v-if="order" class="order-details mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Chi tiết đơn hàng #{{ order.id }}</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <h6>Thông tin khách hàng</h6>
                      <p class="mb-1"><strong>Họ tên:</strong> {{ order.customer.name }}</p>
                      <p class="mb-1"><strong>Email:</strong> {{ order.customer.email }}</p>
                      <p class="mb-1"><strong>Số điện thoại:</strong> {{ order.customer.phone }}</p>
                      <p class="mb-0"><strong>Địa chỉ:</strong> {{ order.customer.address }}</p>
                    </div>
                    <div class="col-md-6">
                      <h6>Thông tin đơn hàng</h6>
                      <p class="mb-1"><strong>Mã đơn hàng:</strong> #{{ order.id }}</p>
                      <p class="mb-1"><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
                      <p class="mb-1"><strong>Trạng thái:</strong>
                        <span class="badge bg-warning">{{ getStatusText(order.status) }}</span>
                      </p>
                      <p class="mb-1"><strong>Thanh toán:</strong> {{ getPaymentText(order.paymentMethod) }}</p>
                      <p class="mb-0"><strong>Tổng tiền:</strong>
                        <span class="text-danger fw-bold">${{ order.total.toFixed(2) }}</span>
                      </p>
                    </div>
                  </div>

                  <hr>

                  <h6>Sản phẩm đã đặt</h6>
                  <div v-for="item in order.items" :key="item.id" class="order-item mb-2">
                    <div class="row align-items-center">
                      <div class="col-md-2">
                        <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'"
                             :alt="item.title" class="img-fluid rounded">
                      </div>
                      <div class="col-md-6">
                        <h6 class="mb-1">{{ item.title }}</h6>
                        <small class="text-muted">{{ item.category }}</small>
                      </div>
                      <div class="col-md-2">
                        <span>x{{ item.quantity }}</span>
                      </div>
                      <div class="col-md-2">
                        <span class="fw-bold">${{ ((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="next-steps mb-4">
              <h5>Tiếp theo bạn có thể:</h5>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-envelope text-primary mb-2"></i>
                    <h6>Kiểm tra email</h6>
                    <p class="small">Chúng tôi đã gửi xác nhận đơn hàng đến email của bạn</p>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-truck text-success mb-2"></i>
                    <h6>Theo dõi đơn hàng</h6>
                    <p class="small">Chúng tôi sẽ liên hệ để giao hàng trong 1-2 ngày tới</p>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-shopping-bag text-info mb-2"></i>
                    <h6>Tiếp tục mua sắm</h6>
                    <p class="small">Khám phá thêm nhiều sản phẩm thú vị khác</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <router-link to="/" class="btn btn-primary btn-lg me-3">
                <i class="fas fa-home me-2"></i> Về trang chủ
              </router-link>
              <router-link to="/san-pham" class="btn btn-outline-primary btn-lg">
                <i class="fas fa-shopping-bag me-2"></i> Tiếp tục mua sắm
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js'

export default {
  name: 'DonHangThanhCong',
  data() {
    return {
      order: null
    }
  },
  mounted() {
    this.loadOrder()
  },
  methods: {
    async loadOrder() {
      try {
        const orderId = this.$route.params.orderId
        const response = await axios.get(`/orders/${orderId}`)
        this.order = response.data
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error)
        this.$toast.error('Không thể tải thông tin đơn hàng')
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Đã nhận',
        'cancelled': 'Đã hủy'
      }
      return statusMap[status] || status
    },
    getPaymentText(method) {
      const paymentMap = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản ngân hàng',
        'card': 'Thẻ tín dụng'
      }
      return paymentMap[method] || method
    }
  }
}
</script>

<style scoped>
.don-hang-thanh-cong {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 40px 0;
}

.success-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin: 40px 0;
}

.success-icon {
  font-size: 4rem;
  color: #28a745;
}

.success-icon i {
  animation: checkmark 0.8s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.order-details .card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.order-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.order-item img {
  max-width: 60px;
  height: 60px;
  object-fit: cover;
}

.step-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: 100%;
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-card i {
  font-size: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
}

.btn-outline-primary:hover {
  transform: translateY(-2px);
}
</style>