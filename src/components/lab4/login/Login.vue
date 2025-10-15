<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Đăng nhập</h1>
        <p class="login-subtitle">Chào mừng bạn quay trở lại</p>
      </div>

      <form @submit.prevent="dangNhap" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="fas fa-user"></i> Tên đăng nhập
          </label>
          <input
            v-model="username"
            id="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i> Mật khẩu
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i class="fas fa-sign-in-alt me-2"></i>
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>
      </form>

      <div class="login-footer">
        <p class="mb-0">
          Chưa có tài khoản?
          <router-link to="/dangky" class="register-link">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loading: false
    };
  },
  methods: {
    async dangNhap() {
      if (this.loading) return;
      if (!this.username || !this.password) {
        this.$toast.error('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get('/users');
        const user = response.data.find(u => u.username === this.username && u.password === this.password);

        if (user) {
          this.$store.dispatch('setUser', user);
          this.$toast.success('Đăng nhập thành công!');
          
          const redirectPath = localStorage.getItem('redirectPath');
          if (redirectPath) {
            localStorage.removeItem('redirectPath');
            this.$router.push(redirectPath);
          } else {
            this.$router.push('/');
          }

        } else {
          this.$toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
      } catch (error) {
        this.$toast.error('Lỗi hệ thống!');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-label i {
  margin-right: 8px;
  color: #667eea;
  width: 16px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-login:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>
