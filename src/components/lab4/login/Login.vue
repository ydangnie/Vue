<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Đăng nhập</h1>
      <p class="login-subtitle">Chào mừng bạn quay trở lại</p>

      <form @submit.prevent="xuLyDangNhap" class="login-form">
        <div class="form-group mb-3">
          <label for="username" class="form-label">Tên đăng nhập</label>
          <input
            v-model="tenDangNhap" id="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="form-group mb-4">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            v-model="matKhau" id="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 btn-lg" :disabled="dangXuLy"> <span v-if="dangXuLy" class="spinner-border spinner-border-sm me-2"></span>
          {{ dangXuLy ? 'Đang xử lý...' : 'Đăng nhập' }}
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
// Import axios đã cấu hình
import axios from '../../../../axios.js';

export default {
  name: 'Login', // Tên component
  data() {
    return {
      tenDangNhap: '', // Biến lưu tên đăng nhập nhập từ input
      matKhau: '',     // Biến lưu mật khẩu nhập từ input
      dangXuLy: false  // Biến cờ cho biết đang gửi yêu cầu đăng nhập hay không
    };
  },
  methods: {
    // Hàm xử lý khi người dùng submit form đăng nhập
    async xuLyDangNhap() {
      // Nếu đang xử lý rồi thì không làm gì cả
      if (this.dangXuLy) return;

      // --- KIỂM TRA DỮ LIỆU NHẬP ---
      if (!this.tenDangNhap || !this.matKhau) {
        this.$toast.error('Vui lòng nhập đầy đủ thông tin!');
        return; // Dừng hàm nếu thiếu thông tin
      }

      // --- BẮT ĐẦU GỬI YÊU CẦU ĐĂNG NHẬP ---
      this.dangXuLy = true; // Bật cờ đang xử lý

      try {
        // 1. Lấy danh sách tất cả người dùng từ API
        const phanHoi = await axios.get('/users'); // Gửi yêu cầu GET
        const danhSachNguoiDung = phanHoi.data;

        // 2. Tìm người dùng trong danh sách có username VÀ password khớp với người dùng nhập
        // Lưu ý: Đây là cách kiểm tra mật khẩu RẤT KHÔNG AN TOÀN, chỉ dùng cho mục đích demo/học tập.
        // Trong thực tế, mật khẩu phải được mã hóa và kiểm tra ở phía server.
        const nguoiDung = danhSachNguoiDung.find(u => u.username === this.tenDangNhap && u.password === this.matKhau);

        // 3. Xử lý kết quả tìm kiếm
        if (nguoiDung) {
          // --- ĐĂNG NHẬP THÀNH CÔNG ---
          // a. Lưu thông tin người dùng vào Vuex store (và localStorage thông qua mutation)
          this.$store.dispatch('setUser', nguoiDung);

          // b. Hiển thị thông báo thành công
          this.$toast.success('Đăng nhập thành công!');

          // c. Kiểm tra xem có cần chuyển hướng đến trang trước đó không
          // (Ví dụ: người dùng vào trang cần đăng nhập, bị chuyển về login, sau khi login thành công sẽ quay lại trang đó)
          const duongDanChuyenHuong = localStorage.getItem('redirectPath');
          if (duongDanChuyenHuong) {
            localStorage.removeItem('redirectPath'); // Xóa đường dẫn đã lưu
            this.$router.push(duongDanChuyenHuong); // Chuyển đến trang trước đó
          } else {
            this.$router.push('/'); // Nếu không có, chuyển về trang chủ
          }

        } else {
          // --- ĐĂNG NHẬP THẤT BẠI ---
          this.$toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
      } catch (error) {
        // --- LỖI KHI GỌI API ---
        console.error("Lỗi đăng nhập:", error);
        this.$toast.error('Lỗi hệ thống!', 'Không thể kết nối đến server.');
      } finally {
        // --- LUÔN LUÔN THỰC HIỆN ---
        this.dangXuLy = false; // Tắt cờ đang xử lý (cho phép nhấn nút lại)
      }
    },
  },
};
</script>


<style scoped>
/* Giữ nguyên CSS styles */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
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

.login-header { /* Không được sử dụng trong template này */
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* Cần thuộc tính này cho trình duyệt khác */
}

.login-subtitle {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  margin-bottom: 1.5rem; /* Thêm khoảng cách dưới subtitle */
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

.form-label i { /* Không được sử dụng trong template này */
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

/* Đổi tên class nút cho nhất quán với style */
.btn-primary { /* Sử dụng class Bootstrap thay vì .btn-login */
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

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6a78 0%, #333333 100%); /* Làm tối màu khi hover */
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); /* Giữ lại bóng đổ */
}

.btn-primary:disabled { /* Style cho nút bị vô hiệu hóa */
  opacity: 0.7;
  cursor: not-allowed;
  transform: none; /* Bỏ hiệu ứng transform */
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
  color: #5a6fd8; /* Sửa lại màu hover */
  text-decoration: underline;
}

/* Responsive */
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