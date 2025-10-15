<template>
  <div class="bao-cao-thong-ke">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-chart-bar"></i> Báo cáo thống kê
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <!-- Date Range Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">Từ ngày</label>
              <input v-model="startDate" type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Đến ngày</label>
              <input v-model="endDate" type="date" class="form-control">
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button @click="loadReports" class="btn btn-primary me-2">
                <i class="fas fa-search"></i> Lọc
              </button>
              <button @click="resetFilters" class="btn btn-secondary">
                <i class="fas fa-undo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="metric-card bg-success text-white">
            <div class="metric-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="metric-content">
              <h3>${{ totalRevenue.toFixed(2) }}</h3>
              <p>Tổng doanh thu</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-primary text-white">
            <div class="metric-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="metric-content">
              <h3>{{ totalOrders }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-info text-white">
            <div class="metric-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="metric-content">
              <h3>{{ totalProductsSold }}</h3>
              <p>Sản phẩm đã bán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-warning text-white">
            <div class="metric-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="metric-content">
              <h3>{{ totalCustomers }}</h3>
              <p>Khách hàng</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Doanh thu theo tháng</h5>
            </div>
            <div class="card-body">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Trạng thái đơn hàng</h5>
            </div>
            <div class="card-body">
              <canvas ref="orderStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Sản phẩm bán chạy nhất</h5>
            </div>
            <div class="card-body">
              <div v-for="(product, index) in topProducts" :key="product.id" class="d-flex align-items-center mb-3">
                <div class="rank-badge me-3">{{ index + 1 }}</div>
                <img :src="product.image" :alt="product.title" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ product.title }}</h6>
                  <small class="text-muted">Đã bán: {{ product.sold }} • Doanh thu: ${{ product.revenue.toFixed(2) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Danh mục bán chạy</h5>
            </div>
            <div class="card-body">
              <div v-for="(category, index) in topCategories" :key="category.name" class="d-flex align-items-center mb-3">
                <div class="rank-badge me-3">{{ index + 1 }}</div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ category.name }}</h6>
                  <small class="text-muted">Đã bán: {{ category.sold }} • Doanh thu: ${{ category.revenue.toFixed(2) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Đơn hàng gần đây</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.customer.name }}</td>
                  <td>${{ order.total.toFixed(2) }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js';
import Chart from 'chart.js/auto';

export default {
  name: 'BaoCaoThongKe',
  data() {
    return {
      startDate: '',
      endDate: '',
      orders: [],
      products: [],
      totalRevenue: 0,
      totalOrders: 0,
      totalProductsSold: 0,
      totalCustomers: 0,
      topProducts: [],
      topCategories: [],
      recentOrders: [],
      revenueChart: null,
      orderStatusChart: null
    };
  },
  mounted() {
    this.setDefaultDateRange();
    this.loadReports();
  },
  beforeUnmount() {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.orderStatusChart) {
      this.orderStatusChart.destroy();
    }
  },
  methods: {
    setDefaultDateRange() {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
      this.endDate = now.toISOString().split('T')[0];
    },
    async loadReports() {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get('/orders'),
          axios.get('/products')
        ]);

        this.orders = ordersResponse.data;
        this.products = productsResponse.data;

        this.filterDataByDate();
        this.calculateMetrics();
        this.generateTopProducts();
        this.generateTopCategories();
        this.generateRecentOrders();
        this.createCharts();
      } catch (error) {
        console.error('Error loading reports:', error);
        this.$toast.error('Không thể tải dữ liệu báo cáo');
      }
    },
    filterDataByDate() {
      if (!this.startDate || !this.endDate) return;

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999); // End of day

      this.filteredOrders = this.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    },
    calculateMetrics() {
      this.totalOrders = this.filteredOrders.length;
      this.totalRevenue = this.filteredOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);

      // Calculate total products sold
      this.totalProductsSold = this.filteredOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

      // Calculate unique customers
      const customerEmails = new Set(
        this.filteredOrders.map(order => order.customer.email)
      );
      this.totalCustomers = customerEmails.size;
    },
    generateTopProducts() {
      const productSales = {};

      this.filteredOrders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          order.items.forEach(item => {
            if (!productSales[item.id]) {
              productSales[item.id] = {
                id: item.id,
                title: item.title,
                sold: 0,
                revenue: 0,
                image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'
              };
            }
            productSales[item.id].sold += item.quantity;
            productSales[item.id].revenue += (item.price * (1 - item.discount / 100)) * item.quantity;
          });
        });

      this.topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    },
    generateTopCategories() {
      const categorySales = {};

      this.filteredOrders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          order.items.forEach(item => {
            if (!categorySales[item.category]) {
              categorySales[item.category] = {
                name: item.category,
                sold: 0,
                revenue: 0
              };
            }
            categorySales[item.category].sold += item.quantity;
            categorySales[item.category].revenue += (item.price * (1 - item.discount / 100)) * item.quantity;
          });
        });

      this.topCategories = Object.values(categorySales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    },
    generateRecentOrders() {
      this.recentOrders = this.filteredOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    },
    createCharts() {
      this.createRevenueChart();
      this.createOrderStatusChart();
    },
    createRevenueChart() {
      const ctx = this.$refs.revenueChart;
      if (!ctx) return;

      // Group orders by month
      const monthlyRevenue = {};
      this.filteredOrders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          const date = new Date(order.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.total;
        });

      const labels = Object.keys(monthlyRevenue).sort();
      const data = labels.map(month => monthlyRevenue[month]);

      if (this.revenueChart) {
        this.revenueChart.destroy();
      }

      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.map(label => {
            const [year, month] = label.split('-');
            return `${month}/${year}`;
          }),
          datasets: [{
            label: 'Doanh thu ($)',
            data: data,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      });
    },
    createOrderStatusChart() {
      const ctx = this.$refs.orderStatusChart;
      if (!ctx) return;

      const statusCounts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      this.filteredOrders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });

      if (this.orderStatusChart) {
        this.orderStatusChart.destroy();
      }

      this.orderStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Chờ xử lý', 'Đang xử lý', 'Đã giao', 'Đã nhận', 'Đã hủy'],
          datasets: [{
            data: [
              statusCounts.pending,
              statusCounts.processing,
              statusCounts.shipped,
              statusCounts.delivered,
              statusCounts.cancelled
            ],
            backgroundColor: [
              '#ffc107',
              '#17a2b8',
              '#007bff',
              '#28a745',
              '#dc3545'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            }
          }
        }
      });
    },
    resetFilters() {
      this.setDefaultDateRange();
      this.loadReports();
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
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.bao-cao-thong-ke {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.metric-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.metric-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.metric-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.metric-content p {
  margin: 0;
  opacity: 0.8;
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none;
}
</style>