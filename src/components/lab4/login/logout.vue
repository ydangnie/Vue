<template>
  <div class="logout-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="logout-card card shadow">
            <div class="card-body text-center p-5">
              <div class="logout-icon mb-4">
                <i class="fas fa-sign-out-alt fa-4x text-primary"></i>
              </div>

              <h2 class="card-title mb-3">Đăng xuất</h2>

              <p class="card-text text-muted mb-4">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
              </p>

              <div class="user-info mb-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="avatar-circle me-3">
                    {{ currentUser?.username?.charAt(0).toUpperCase() }}
                  </div>
                  <div class="text-start">
                    <h6 class="mb-1">{{ currentUser?.username }}</h6>
                    <small class="text-muted">{{ currentUser?.email }}</small>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button @click="confirmLogout" class="btn btn-danger btn-lg">
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Xác nhận đăng xuất
                </button>

                <button @click="cancelLogout" class="btn btn-outline-secondary btn-lg">
                  <i class="fas fa-arrow-left me-2"></i>
                  Hủy bỏ
                </button>
              </div>

              <div class="mt-4">
                <small class="text-muted">
                  Bạn sẽ được chuyển hướng về trang chủ sau khi đăng xuất.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Success Modal -->
    <div v-if="showSuccessModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <div class="success-icon mb-3">
              <i class="fas fa-check-circle fa-3x text-success"></i>
            </div>
            <h5 class="mb-3">Đăng xuất thành công!</h5>
            <p class="text-muted mb-3">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            <button @click="redirectToHome" class="btn btn-primary">Về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logout',
  data() {
    return {
      currentUser: null,
      showSuccessModal: false
    };
  },
  mounted() {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.currentUser = JSON.parse(user);
      } catch (e) {
        this.redirectToLogin();
      }
    } else {
      this.redirectToLogin();
    }
  },
  methods: {
    confirmLogout() {
      // Clear user data
      localStorage.removeItem('user');
      this.currentUser = null;

      // Show success modal
      this.showSuccessModal = true;

      // Auto redirect after 3 seconds
      setTimeout(() => {
        this.redirectToHome();
      }, 3000);
    },
    cancelLogout() {
      // Go back to previous page or home
      this.$router.go(-1);
    },
    redirectToHome() {
      this.$router.push('/');
    },
    redirectToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.logout-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.logout-card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.logout-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.btn {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border: none;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #dc4545 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(238, 90, 82, 0.4);
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
}

.user-info {
  border-radius: 10px;
}

.success-icon {
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
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

.modal {
  z-index: 1050;
}

.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
</style>