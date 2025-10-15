<template>
  <div class="admin-quan-ly-don-hang">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-shopping-cart"></i> Quản lý đơn hàng
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-content">
              <h3>{{ orders.length }}</h3>
              <p>Tổng đơn hàng</p>
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
              <p>Chờ xử lý</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="fas fa-truck"></i>
            </div>
            <div class="stat-content">
              <h3>{{ shippedOrders }}</h3>
              <p>Đã giao</p>
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
              <p>Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng...">
            </div>
            <div class="col-md-3">
              <select v-model="statusFilter" class="form-control">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao</option>
                <option value="delivered">Đã nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" @change="sortOrders" class="form-control">
                <option value="date-desc">Mới nhất</option>
                <option value="date-asc">Cũ nhất</option>
                <option value="total-desc">Tổng tiền cao</option>
                <option value="total-asc">Tổng tiền thấp</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="resetFilters" class="btn btn-secondary w-100">
                <i class="fas fa-undo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Danh sách đơn hàng</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>
                    <strong>#{{ order.id }}</strong>
                  </td>
                  <td>
                    <div>
                      <div class="fw-bold">{{ order.customer.name }}</div>
                      <small class="text-muted">{{ order.customer.email }}</small>
                    </div>
                  </td>
                  <td>
                    <div v-for="item in order.items.slice(0, 2)" :key="item.id" class="mb-1">
                      <small>{{ item.title }} (x{{ item.quantity }})</small>
                    </div>
                    <small v-if="order.items.length > 2" class="text-muted">
                      và {{ order.items.length - 2 }} sản phẩm khác...
                    </small>
                  </td>
                  <td>
                    <span class="fw-bold text-primary">${{ order.total.toFixed(2) }}</span>
                  </td>
                  <td>
                    <span :class="getPaymentBadgeClass(order.paymentMethod)">
                      {{ getPaymentText(order.paymentMethod) }}
                    </span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="viewOrder(order)" class="btn btn-sm btn-outline-info" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="updateOrderStatus(order, 'processing')" v-if="order.status === 'pending'"
                              class="btn btn-sm btn-outline-primary" title="Bắt đầu xử lý">
                        <i class="fas fa-play"></i>
                      </button>
                      <button @click="updateOrderStatus(order, 'shipped')" v-if="order.status === 'processing'"
                              class="btn btn-sm btn-outline-warning" title="Đã giao">
                        <i class="fas fa-truck"></i>
                      </button>
                      <button @click="updateOrderStatus(order, 'delivered')" v-if="order.status === 'shipped'"
                              class="btn btn-sm btn-outline-success" title="Hoàn thành">
                        <i class="fas fa-check"></i>
                      </button>
                      <button @click="updateOrderStatus(order, 'cancelled')" v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                              class="btn btn-sm btn-outline-danger" title="Hủy đơn">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredOrders.length === 0" class="text-center py-5">
            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h4>Không tìm thấy đơn hàng nào</h4>
            <p class="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        </div>
      </div>

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
                  <h6>Thông tin khách hàng</h6>
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
              <div v-for="item in selectedOrder.items" :key="item.id" class="order-item mb-2 p-2 border rounded">
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
            <div class="modal-footer">
              <button @click="closeOrderModal" class="btn btn-secondary">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js';

export default {
  name: 'AdminQuanLyDonHang',
  data() {
    return {
      orders: [],
      filteredOrders: [],
      searchQuery: '',
      statusFilter: '',
      sortBy: 'date-desc',
      showOrderModal: false,
      selectedOrder: null
    };
  },
  computed: {
    pendingOrders() {
      return this.orders.filter(order => order.status === 'pending').length;
    },
    shippedOrders() {
      return this.orders.filter(order => order.status === 'shipped').length;
    },
    deliveredOrders() {
      return this.orders.filter(order => order.status === 'delivered').length;
    }
  },
  mounted() {
    this.loadOrders();
  },
  watch: {
    searchQuery() {
      this.filterOrders();
    },
    statusFilter() {
      this.filterOrders();
    }
  },
  methods: {
    loadOrders() {
      axios.get('/orders')
        .then(response => {
          this.orders = response.data;
          this.filteredOrders = [...this.orders];
          this.sortOrders();
        })
        .catch(error => {
          console.error('Error loading orders:', error);
          this.$router.push('/login');
        });
    },
    filterOrders() {
      let filtered = [...this.orders];

      if (this.searchQuery) {
        filtered = filtered.filter(order =>
          order.id.toString().includes(this.searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }

      this.filteredOrders = filtered;
      this.sortOrders();
    },
    sortOrders() {
      this.filteredOrders.sort((a, b) => {
        switch (this.sortBy) {
          case 'date-asc':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'date-desc':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'total-asc':
            return a.total - b.total;
          case 'total-desc':
            return b.total - a.total;
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    },
    resetFilters() {
      this.searchQuery = '';
      this.statusFilter = '';
      this.sortBy = 'date-desc';
      this.filteredOrders = [...this.orders];
      this.sortOrders();
    },
    viewOrder(order) {
      this.selectedOrder = order;
      this.showOrderModal = true;
    },
    closeOrderModal() {
      this.showOrderModal = false;
      this.selectedOrder = null;
    },
    updateOrderStatus(order, newStatus) {
      const statusText = this.getStatusText(newStatus);
      if (confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng #${order.id} thành "${statusText}"?`)) {
        // SỬA Ở ĐÂY: Dùng PATCH và chỉ gửi status
        axios.patch(`/orders/${order.id}`, { status: newStatus })
          .then(() => {
            this.loadOrders();
            this.$toast.success(`Đã cập nhật trạng thái đơn hàng thành "${statusText}"`);
          })
          .catch(error => {
            console.error('Error updating order status:', error);
            this.$toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
          });
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
    getPaymentBadgeClass(method) {
      const classes = {
        'cod': 'badge bg-success',
        'bank': 'badge bg-info',
        'card': 'badge bg-primary'
      };
      return classes[method] || 'badge bg-secondary';
    },
    getPaymentText(method) {
      const paymentMap = {
        'cod': 'COD',
        'bank': 'Chuyển khoản',
        'card': 'Thẻ tín dụng'
      };
      return paymentMap[method] || method;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
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

.table th {
  border-top: none;
  font-weight: 600;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal {
  z-index: 1050;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none;
}

.order-item {
  background: #f8f9fa;
}

.order-item img {
  max-width: 60px;
  height: 60px;
  object-fit: cover;
}
</style>