<template>
  <div class="lich-su-don-hang">
    <div class="container">
      <h1 class="mb-4">Lịch sử đơn hàng</h1>

      <!-- Order Statistics -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-content">
              <h3>{{ userOrders.length }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ deliveredOrders }}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <h3>{{ pendingOrders }}</h3>
              <p>Đang xử lý</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-content">
              <h3>${{ totalSpent.toFixed(2) }}</h3>
              <p>Tổng chi tiêu</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Danh sách đơn hàng của bạn</h5>
        </div>
        <div class="card-body">
          <div v-if="userOrders.length > 0" class="orders-list">
            <div v-for="order in userOrders" :key="order.id" class="order-card mb-3">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Đơn hàng #{{ order.id }}</h6>
                    <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
                  </div>
                  <div class="text-end">
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-8">
                      <div class="order-items">
                        <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="order-item mb-2">
                          <div class="d-flex align-items-center">
                            <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'"
                                 :alt="item.title" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                            <div>
                              <h6 class="mb-1">{{ item.title }}</h6>
                              <small class="text-muted">{{ item.category }} • x{{ item.quantity }}</small>
                            </div>
                          </div>
                        </div>
                        <div v-if="order.items.length > 3" class="text-muted">
                          và {{ order.items.length - 3 }} sản phẩm khác...
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 text-end">
                      <div class="order-summary">
                        <p class="mb-1"><strong>Thanh toán:</strong> {{ getPaymentText(order.paymentMethod) }}</p>
                        <p class="mb-1"><strong>Tổng tiền:</strong></p>
                        <h5 class="text-primary mb-0">${{ order.total.toFixed(2) }}</h5>
                        <button @click="viewOrderDetail(order)" class="btn btn-outline-primary btn-sm mt-2">
                          <i class="fas fa-eye"></i> Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-5">
            <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h4>Bạn chưa có đơn hàng nào</h4>
            <p class="text-muted">Hãy bắt đầu mua sắm để xem lịch sử đơn hàng của bạn</p>
            <router-link to="/san-pham" class="btn btn-primary">
              <i class="fas fa-shopping-bag"></i> Mua sắm ngay
            </router-link>
          </div>
        </div>
      </div>

      <!-- Order Detail Modal -->
      <div v-if="showOrderModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết đơn hàng #{{ selectedOrder?.id }}</h5>
              <button @click="closeOrderModal" class="btn-close"></button>
            </div>
            <div class="modal-body" v-if="selectedOrder">
              <div class="row">
                <div class="col-md-6">
                  <h6>Thông tin giao hàng</h6>
                  <p><strong>Họ tên:</strong> {{ selectedOrder.customer.name }}</p>
                  <p><strong>Email:</strong> {{ selectedOrder.customer.email }}</p>
                  <p><strong>Số điện thoại:</strong> {{ selectedOrder.customer.phone }}</p>
                  <p><strong>Địa chỉ:</strong> {{ selectedOrder.customer.address }}</p>
                  <p v-if="selectedOrder.notes"><strong>Ghi chú:</strong> {{ selectedOrder.notes }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Thông tin đơn hàng</h6>
                  <p><strong>Mã đơn hàng:</strong> #{{ selectedOrder.id }}</p>
                  <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
                  <p><strong>Trạng thái:</strong>
                    <span :class="getStatusBadgeClass(selectedOrder.status)">
                      {{ getStatusText(selectedOrder.status) }}
                    </span>
                  </p>
                  <p><strong>Thanh toán:</strong> {{ getPaymentText(selectedOrder.paymentMethod) }}</p>
                  <p><strong>Tổng tiền:</strong> <span class="text-danger fw-bold">${{ selectedOrder.total.toFixed(2) }}</span></p>
                </div>
              </div>
              <hr>
              <h6>Sản phẩm đã đặt</h6>
              <div v-for="item in selectedOrder.items" :key="item.id" class="order-item-detail mb-3 p-3 border rounded">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80x80?text=No+Image'"
                         :alt="item.title" class="img-fluid rounded">
                  </div>
                  <div class="col-md-6">
                    <h6 class="mb-1">{{ item.title }}</h6>
                    <p class="mb-1 text-muted">{{ item.category }}</p>
                    <small class="text-muted">{{ item.description }}</small>
                  </div>
                  <div class="col-md-2">
                    <span class="badge bg-secondary">x{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2 text-end">
                    <div>
                      <span v-if="item.discount > 0" class="text-decoration-line-through text-muted">${{ item.price }}</span>
                      <div class="fw-bold">${{ (item.price * (1 - item.discount / 100)).toFixed(2) }}</div>
                      <small class="text-muted">x{{ item.quantity }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-end">
                <h5>Tổng cộng: <span class="text-danger">${{ selectedOrder.total.toFixed(2) }}</span></h5>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closeOrderModal" class="btn btn-secondary">Đóng</button>
              <button v-if="selectedOrder && selectedOrder.status === 'delivered'" @click="reorder" class="btn btn-primary">
                <i class="fas fa-redo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js';
import { mapActions } from 'vuex';

export default {
  name: 'LichSuDonHang',
  data() {
    return {
      userOrders: [],
      showOrderModal: false,
      selectedOrder: null
    };
  },
  computed: {
    deliveredOrders() {
      return this.userOrders.filter(order => order.status === 'delivered').length;
    },
    pendingOrders() {
      return this.userOrders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled').length;
    },
    totalSpent() {
      return this.userOrders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + order.total, 0);
    }
  },
  mounted() {
    this.loadUserOrders();
  },
  methods: {
    ...mapActions(['addToCart']),
    async loadUserOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('/orders');
        // Filter orders by current user's email
        this.userOrders = response.data
          .filter(order => order.customer.email === user.email)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error('Error loading user orders:', error);
        this.$toast.error('Không thể tải lịch sử đơn hàng');
      }
    },
    viewOrderDetail(order) {
      this.selectedOrder = order;
      this.showOrderModal = true;
    },
    closeOrderModal() {
      this.showOrderModal = false;
      this.selectedOrder = null;
    },
    async reorder() {
      if (!this.selectedOrder) return;

      try {
        // Add all items from the order back to cart
        for (const item of this.selectedOrder.items) {
          await this.addToCart(item);
        }
        this.closeOrderModal();
        this.$toast.success('Đã thêm các sản phẩm vào giỏ hàng!');
        this.$router.push('/gio-hang');
      } catch (error) {
        console.error('Error reordering:', error);
        this.$toast.error('Có lỗi xảy ra khi đặt lại đơn hàng');
      }
    },
    getStatusBadgeClass(status) {
      const classes = {
        'pending': 'badge bg-warning',
        'processing': 'badge bg-info',
        'shipped': 'badge bg-primary',
        'delivered': 'badge bg-success',
        'cancelled': 'badge bg-danger'
      };
      return classes[status] || 'badge bg-secondary';
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Đã nhận',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status;
    },
    getPaymentText(method) {
      const paymentMap = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản ngân hàng',
        'card': 'Thẻ tín dụng'
      };
      return paymentMap[method] || method;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.lich-su-don-hang {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.stat-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-content p {
  margin: 0;
  opacity: 0.8;
}

.order-card .card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.order-card .card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none;
}

.order-items {
  max-height: 200px;
  overflow-y: auto;
}

.order-item-detail {
  background: #f8f9fa;
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

.modal {
  z-index: 1050;
}
</style>