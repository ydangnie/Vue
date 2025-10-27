<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">Đăng ký tài khoản</h1>
        <p class="register-subtitle">Tạo tài khoản để bắt đầu mua sắm</p>
      </div>

      <!-- Form đăng ký, gọi hàm xuLyDangKy khi submit -->
      <form @submit.prevent="xuLyDangKy" class="register-form">
        <!-- Nhóm Tên đăng nhập -->
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="fas fa-user"></i> Tên đăng nhập
          </label>
          <input
            v-model="formDangKy.tenDangNhap" <!-- Liên kết với tenDangNhap -->
            id="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <!-- Nhóm Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            <i class="fas fa-envelope"></i> Email
          </label>
          <input
            v-model="formDangKy.email" <!-- Liên kết với email -->
            id="email"
            type="email"
            class="form-control"
            placeholder="Nhập địa chỉ email"
            required
          />
        </div>

        <!-- Nhóm Mật khẩu -->
        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i> Mật khẩu
          </label>
          <input
            v-model="formDangKy.matKhau" <!-- Liên kết với matKhau -->
            id="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <!-- Nhóm Xác nhận mật khẩu -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            <i class="fas fa-lock"></i> Xác nhận mật khẩu
          </label>
          <input
            v-model="xacNhanMatKhau" <!-- Liên kết với xacNhanMatKhau -->
            id="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <!-- Nút Đăng ký -->
        <button type="submit" class="btn-register" :disabled="dangXuLy"> <!-- :disabled vô hiệu hóa nút khi dangXuLy=true -->
          <!-- Hiển thị spinner khi đang xử lý -->
          <span v-if="dangXuLy" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i class="fas fa-user-plus me-2"></i>
          <!-- Thay đổi text nút tùy theo trạng thái dangXuLy -->
          {{ dangXuLy ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </form>

      <!-- Link đến trang Đăng nhập -->
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
// Import axios đã cấu hình
import axios from '../../../../axios.js';

export default {
  name: 'DangKy', // Tên component
  data() {
    return {
      // Đối tượng lưu trữ dữ liệu nhập từ form
      formDangKy: {
        tenDangNhap: '',
        email: '',
        matKhau: '',
        vaiTro: 'user' // Mặc định vai trò là 'user'
      },
      // Biến lưu trữ mật khẩu xác nhận
      xacNhanMatKhau: '',
      // Biến cờ để biết có đang gửi yêu cầu đăng ký hay không (dùng để vô hiệu hóa nút)
      dangXuLy: false
    };
  },
  methods: {
    // Hàm xử lý khi người dùng submit form đăng ký
    async xuLyDangKy() {
      // Nếu đang xử lý rồi thì không làm gì cả (tránh nhấn nút nhiều lần)
      if (this.dangXuLy) return;

      // --- KIỂM TRA DỮ LIỆU NHẬP (VALIDATION) ---
      // Kiểm tra xem có trường nào bị bỏ trống không
      if (!this.formDangKy.tenDangNhap || !this.formDangKy.email || !this.formDangKy.matKhau || !this.xacNhanMatKhau) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin!');
        return; // Dừng hàm
      }
      // Kiểm tra mật khẩu xác nhận có khớp không
      if (this.formDangKy.matKhau !== this.xacNhanMatKhau) {
        this.$toast.error('Mật khẩu xác nhận không khớp!');
        return; // Dừng hàm
      }
      // Kiểm tra độ dài mật khẩu
      if (this.formDangKy.matKhau.length < 6) {
        this.$toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
        return; // Dừng hàm
      }

      // --- BẮT ĐẦU GỬI YÊU CẦU ĐĂNG KÝ ---
      this.dangXuLy = true; // Đặt cờ đang xử lý thành true (để hiển thị spinner và vô hiệu hóa nút)

      try {
        // 1. Lấy danh sách người dùng hiện có để kiểm tra trùng lặp
        const phanHoi = await axios.get('/users'); // Gửi yêu cầu GET đến API
        const danhSachNguoiDung = phanHoi.data; // Lấy dữ liệu từ phản hồi

        // 2. Kiểm tra tên đăng nhập đã tồn tại chưa
        // .some() trả về true nếu có ít nhất 1 phần tử thỏa mãn điều kiện
        if (danhSachNguoiDung.some(user => user.username === this.formDangKy.tenDangNhap)) {
          this.$toast.warning('Tên đăng nhập đã tồn tại!');
          this.dangXuLy = false; // Đặt lại cờ
          return; // Dừng hàm
        }
        // 3. Kiểm tra email đã tồn tại chưa
        if (danhSachNguoiDung.some(user => user.email === this.formDangKy.email)) {
          this.$toast.warning('Email đã được sử dụng!');
          this.dangXuLy = false; // Đặt lại cờ
          return; // Dừng hàm
        }

        // 4. Tạo đối tượng người dùng mới
        const nguoiDungMoi = {
          id: Date.now().toString(), // Tạo ID duy nhất bằng timestamp (chuyển sang chuỗi)
          username: this.formDangKy.tenDangNhap, // Lấy từ form
          email: this.formDangKy.email, // Lấy từ form
          password: this.formDangKy.matKhau, // Lấy từ form (Lưu ý: nên mã hóa mật khẩu ở đây!)
          role: this.formDangKy.vaiTro, // Lấy vai trò mặc định
          // Thêm các trường thông tin cá nhân mặc định khác (nếu có trong db.json)
          age: null,
          gender: '',
          desiredProducts: ''
        };

        // 5. Gửi yêu cầu POST để tạo người dùng mới
        await axios.post('/users', nguoiDungMoi);

        // 6. Thông báo thành công và chuyển hướng đến trang đăng nhập
        this.$toast.success('Đăng ký thành công!');
        this.$router.push('/login'); // Chuyển trang

      } catch (error) {
        // Nếu có lỗi trong quá trình gọi API
        console.error("Lỗi đăng ký:", error); // Ghi lỗi ra console để debug
        this.$toast.error('Đăng ký thất bại!', 'Có lỗi xảy ra, vui lòng thử lại.'); // Thông báo lỗi
      } finally {
        // Khối finally luôn chạy dù thành công hay thất bại
        this.dangXuLy = false; // Đặt lại cờ đang xử lý
      }
    },
  },
};
</script>

<style scoped>
/* Giữ nguyên CSS styles */
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
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
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
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
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3); /* Giữ lại bóng đổ */
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

/* Responsive cho màn hình nhỏ */
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