<script>
// Phần <script> giữ nguyên không thay đổi
import Toast from './components/lab4/Toast.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    Toast
  },
  data() {
    return {
      currentUser: null,
      toasts: []
    };
  },
  computed: {
    ...mapGetters(['cartItemCount']),
    isLoggedIn() {
      return !!this.currentUser;
    },
    isAdmin() {
      return this.currentUser && this.currentUser.role === 'admin';
    }
  },
  mounted() {
    this.checkAuthStatus();
    window.addEventListener('storage', this.checkAuthStatus);
    this.$store.dispatch('loadCart');
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuthStatus);
  },
  methods: {
    checkAuthStatus() {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          this.currentUser = JSON.parse(user);
        } catch (e) {
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
      }
    },
    logout() {
      localStorage.removeItem('user');
      this.currentUser = null;
      this.showToast('success', 'Đăng xuất thành công', 'Bạn đã đăng xuất khỏi tài khoản.');
      this.$router.push('/');
    },
    showToast(type, title, message, duration = 3000) {
      const toast = {
        id: Date.now(),
        type,
        title,
        message,
        duration
      };
      this.toasts.push(toast);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id);
    }
  }
};
</script>

<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 sticky-top">
            <div class="container">
                <router-link to="/" class="navbar-brand fw-bold">AZALMAN</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <div class="navbar-nav me-auto">
                        <router-link to="/" class="nav-link">Trang chủ</router-link>
                        <router-link to="/san-pham" class="nav-link">Sản phẩm</router-link>
                        
                        <div v-if="isAdmin" class="nav-item dropdown">
                          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Quản lý
                          </a>
                          <ul class="dropdown-menu">
                            <li><router-link to="/admin/san-pham" class="dropdown-item">Sản phẩm</router-link></li>
                            <li><router-link to="/admin/category" class="dropdown-item">Danh mục</router-link></li>
                            <li><router-link to="/admin/users" class="dropdown-item">Người dùng</router-link></li>
                            <li><router-link to="/admin/orders" class="dropdown-item">Đơn hàng</router-link></li>
                            <li><router-link to="/admin/reports" class="dropdown-item">Báo cáo</router-link></li>
                          </ul>
                        </div>
                        
                        <router-link v-if="isLoggedIn && !isAdmin" to="/lich-su-don-hang" class="nav-link">Lịch sử đơn hàng</router-link>
                    </div>

                    <div class="navbar-nav align-items-center">
                        <router-link v-if="isLoggedIn" to="/gio-hang" class="nav-link cart-icon">
                            <i class="fas fa-shopping-cart me-1"></i>
                            <span v-if="cartItemCount > 0" class="badge rounded-pill bg-danger cart-badge">{{ cartItemCount }}</span>
                        </router-link>
                        <div v-if="!isLoggedIn" class="d-flex">
                            <router-link to="/login" class="btn btn-outline-light btn-sm me-2">Đăng nhập</router-link>
                            <router-link to="/dangky" class="btn btn-light btn-sm">Đăng ký</router-link>
                        </div>
                        <div v-if="isLoggedIn" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="user-avatar me-2">
                                    {{ currentUser?.username?.charAt(0).toUpperCase() }}
                                </div>
                                <span class="d-none d-md-inline">{{ currentUser?.username }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><router-link to="/cap-nhat-user" class="dropdown-item">Hồ sơ của tôi</router-link></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a @click="logout" class="dropdown-item text-danger" style="cursor: pointer;">
                                    <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container my-4">
            <router-view></router-view>
        </div>
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :show="true"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          :duration="toast.duration"
          @close="removeToast(toast.id)"
        />
    </div>
</template>

<style scoped>
.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-info {
  line-height: 1.2;
}

.username {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.role-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.role-badge.admin {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.role-badge.user {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.dropdown-toggle::after {
  margin-left: 0.5rem;
}

@media (max-width: 767.98px) {
  .user-info {
    display: none !important;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }
}
</style>