<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">Đăng ký tài khoản</h1>
        <p class="register-subtitle">Tạo tài khoản để bắt đầu mua sắm</p>
      </div>

      <form @submit.prevent="dangKy" class="register-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="fas fa-user"></i> Tên đăng nhập
          </label>
          <input
            v-model="duLieuForm.username"
            id="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">
            <i class="fas fa-envelope"></i> Email
          </label>
          <input
            v-model="duLieuForm.email"
            id="email"
            type="email"
            class="form-control"
            placeholder="Nhập địa chỉ email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i> Mật khẩu
          </label>
          <input
            v-model="duLieuForm.password"
            id="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            <i class="fas fa-lock"></i> Xác nhận mật khẩu
          </label>
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <div class="form-group">
          <label for="role" class="form-label">
            <i class="fas fa-user-tag"></i> Vai trò
          </label>
          <select v-model="duLieuForm.role" id="role" class="form-control" required>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <button type="submit" class="btn-register" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i class="fas fa-user-plus me-2"></i>
          {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </form>

      <div class="register-footer">
        <p class="mb-0">
          Đã có tài khoản?
          <router-link to="/login" class="login-link">Đăng nhập ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js'

export default {
  name: 'DangKy',
  data() {
    return {
      duLieuForm: {
        username: '',
        email: '',
        password: '',
        role: 'user'
      },
      confirmPassword: '',
      loading: false
    };
  },
  methods: {
    async dangKy() {
      if (this.loading) return;

      // Validation
      if (!this.duLieuForm.username || !this.duLieuForm.email || !this.duLieuForm.password) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      if (this.duLieuForm.password !== this.confirmPassword) {
        this.$toast.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      if (this.duLieuForm.password.length < 6) {
        this.$toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
      }

      this.loading = true;

      try {
        const response = await axios.get('/users');
        const danhSachNguoiDung = response.data;

        if (danhSachNguoiDung.some(user => user.username === this.duLieuForm.username)) {
          this.$toast.warning('Tên đăng nhập đã tồn tại', 'Vui lòng chọn tên đăng nhập khác!');
          return;
        }

        if (danhSachNguoiDung.some(user => user.email === this.duLieuForm.email)) {
          this.$toast.warning('Email đã được sử dụng', 'Vui lòng sử dụng email khác!');
          return;
        }

        const moiNguoiDung = {
          id: Date.now(),
          ...this.duLieuForm,
          age: null,
          gender: '',
          desiredProducts: ''
        };

        await axios.post('/users', moiNguoiDung);
        this.$toast.success('Đăng ký thành công', 'Tài khoản của bạn đã được tạo!');
        this.$router.push('/login');

      } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        this.$toast.error('Đăng ký thất bại', 'Có lỗi xảy ra, vui lòng thử lại!');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
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

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.register-form {
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

.form-control select {
  cursor: pointer;
}

.btn-register {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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

.btn-register:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #5a6fd8;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .register-container {
    padding: 10px;
  }

  .register-card {
    padding: 30px 20px;
  }

  .register-title {
    font-size: 2rem;
  }
}
</style>
