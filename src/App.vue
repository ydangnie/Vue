<script>
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
    console.log('App component mounted!');
    this.checkAuthStatus();
    window.addEventListener('storage', this.checkAuthStatus);
    // Load cart on app mount
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
      
        <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
          
            <div class="container">
                <router-link to="/" class="navbar-brand fw-bold">🛍️ ShopVue</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <div class="navbar-nav me-auto">
                        <router-link to="/" class="nav-link">Trang chủ</router-link>
                        <router-link to="/san-pham" class="nav-link">Sản phẩm</router-link>
                        <router-link v-if="isLoggedIn" to="/gio-hang" class="nav-link">
                            <i class="fas fa-shopping-cart me-1"></i>Giỏ hàng
                            <span v-if="cartItemCount > 0" class="badge bg-danger ms-1">{{ cartItemCount }}</span>
                        </router-link>
                        <router-link v-if="isAdmin" to="/admin/san-pham" class="nav-link">Quản lý sản phẩm</router-link>
                        <router-link v-if="isAdmin" to="/admin/category" class="nav-link">Quản lý danh mục</router-link>
                        <router-link v-if="isAdmin" to="/admin/users" class="nav-link">Quản lý người dùng</router-link>
                        <router-link v-if="isAdmin" to="/admin/orders" class="nav-link">Quản lý đơn hàng</router-link>
                        <router-link v-if="isAdmin" to="/admin/reports" class="nav-link">Báo cáo thống kê</router-link>
                        <router-link v-if="isLoggedIn" to="/cap-nhat-user" class="nav-link">Hồ sơ</router-link>
                        <router-link v-if="isLoggedIn" to="/lich-su-don-hang" class="nav-link">Lịch sử đơn hàng</router-link>
                    </div>
                    <div class="navbar-nav">
                        <div v-if="!isLoggedIn" class="nav-item">
                            <router-link to="/login" class="nav-link">Đăng nhập</router-link>
                        </div>
                        <div v-if="!isLoggedIn" class="nav-item">
                            <router-link to="/dangky" class="nav-link">Đăng ký</router-link>
                        </div>
                        <div v-if="isLoggedIn" class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="user-avatar me-2">
                                    <i class="fas fa-user-circle fa-lg"></i>
                                </div>
                                <div class="user-info d-none d-md-block">
                                    <div class="username">{{ currentUser?.username }}</div>
                                    <small class="role-badge" :class="currentUser?.role === 'admin' ? 'admin' : 'user'">
                                        {{ currentUser?.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                                    </small>
                                </div>
                            </a>
                            <ul class="dropdown-menu">
                                <li><router-link to="/cap-nhat-user" class="dropdown-item">Cập nhật hồ sơ</router-link></li>
                                <li v-if="isAdmin"><router-link to="/user/admin" class="dropdown-item">Quản lý người dùng</router-link></li>
                                <li v-if="isAdmin"><router-link to="/admin/users" class="dropdown-item">Admin: Quản lý users</router-link></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a @click="logout" class="dropdown-item text-danger" style="cursor: pointer;">
                                    <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất nhanh
                                </a></li>
                                <li><router-link to="/logout" class="dropdown-item">
                                    <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất với xác nhận
                                </router-link></li>
                            </ul>
                        </div>
                        <div v-if="isLoggedIn" class="nav-item ms-2">
                            <button @click="logout" class="btn btn-outline-danger btn-sm" title="Đăng xuất nhanh">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container">
            <router-view>
           
            </router-view>
        </div>
<div>
  
</div>
        <!-- Global Toast Notifications -->
        <Toast
          v-for="(toast, index) in toasts"
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
