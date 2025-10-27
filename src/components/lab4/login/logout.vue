<template>
  <div class="trang-dang-xuat"> <div class="container">
      <div class="row justify-content-center"> <div class="col-md-6">
          <div class="the-dang-xuat card shadow">
            <div class="card-body text-center p-5">
              <div class="icon-dang-xuat mb-4">
                <i class="fas fa-sign-out-alt fa-4x text-primary"></i>
              </div>

              <h2 class="card-title mb-3">Đăng xuất</h2>

              <p class="card-text text-muted mb-4">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
              </p>

              <div class="thong-tin-nguoi-dung mb-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="vong-avatar me-3">
                    {{ nguoiDungHienTai?.username?.charAt(0).toUpperCase() }}
                  </div>
                  <div class="text-start">
                    <h6 class="mb-1">{{ nguoiDungHienTai?.username }}</h6>
                    <small class="text-muted">{{ nguoiDungHienTai?.email }}</small>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button @click="xacNhanDangXuat" class="btn btn-danger btn-lg">
                  <i class="fas fa-sign-out-alt me-2"></i>
                  Xác nhận đăng xuất
                </button>
                <button @click="huyBoDangXuat" class="btn btn-outline-secondary btn-lg">
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

    <div v-if="hienThiModalThanhCong" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <div class="icon-thanh-cong mb-3">
              <i class="fas fa-check-circle fa-3x text-success"></i>
            </div>
            <h5 class="mb-3">Đăng xuất thành công!</h5>
            <p class="text-muted mb-3">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            <button @click="chuyenHuongTrangChu" class="btn btn-primary">Về trang chủ</button>
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
      // Biến lưu thông tin người dùng đang đăng nhập (lấy từ localStorage)
      nguoiDungHienTai: null,
      // Biến cờ (true/false) để kiểm soát việc hiển thị modal thông báo thành công
      hienThiModalThanhCong: false
    };
  },
  // Hàm này sẽ chạy một lần sau khi component được tạo và gắn vào trang web
  mounted() {
    // Cố gắng đọc thông tin người dùng đã lưu trong localStorage
    try {
      this.nguoiDungHienTai = JSON.parse(localStorage.getItem('user'));
    } catch(e) {
      // Nếu có lỗi khi đọc (ví dụ: dữ liệu không đúng định dạng), đặt là null
      console.error("Lỗi khi đọc thông tin người dùng từ localStorage:", e);
      this.nguoiDungHienTai = null;
    }
    // Kiểm tra xem có lấy được thông tin người dùng không
    if (!this.nguoiDungHienTai) {
      // Nếu không có (người dùng chưa đăng nhập hoặc localStorage bị xóa),
      // thì chuyển hướng họ về trang đăng nhập
      this.chuyenHuongTrangDangNhap();
    }
  },
  methods: {
    // Hàm được gọi khi nhấn nút "Xác nhận đăng xuất"
    xacNhanDangXuat() {
      // Gọi action 'logout' trong Vuex store (được định nghĩa trong store.js)
      // Action này sẽ xóa thông tin user khỏi state, localStorage,
      // và cũng xóa luôn giỏ hàng, danh sách yêu thích.
      this.$store.dispatch('logout'); //

      // Đặt lại thông tin người dùng trong component này thành null
      this.nguoiDungHienTai = null;

      // Hiển thị modal thông báo thành công
      this.hienThiModalThanhCong = true;

      // Đặt một bộ đếm thời gian (3000 mili giây = 3 giây)
      // Sau 3 giây, tự động gọi hàm chuyển hướng về trang chủ
      setTimeout(() => this.chuyenHuongTrangChu(), 3000);
    },
    // Hàm được gọi khi nhấn nút "Hủy bỏ"
    huyBoDangXuat() {
      // Sử dụng router để quay lại trang trước đó trong lịch sử trình duyệt
      this.$router.go(-1);
    },
    // Hàm tiện ích để chuyển hướng về trang chủ ('/')
    chuyenHuongTrangChu() {
      this.$router.push('/');
    },
    // Hàm tiện ích để chuyển hướng về trang đăng nhập ('/login')
    chuyenHuongTrangDangNhap() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* Container chính của trang */
.trang-dang-xuat { /* Đổi tên class cho nhất quán */
  min-height: 100vh; /* Chiều cao tối thiểu bằng màn hình */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); /* Nền gradient */
  display: flex; /* Dùng flexbox để căn giữa */
  align-items: center; /* Căn giữa theo chiều dọc */
  padding: 20px 0; /* Padding trên dưới */
}

/* Thẻ card đăng xuất */
.the-dang-xuat { /* Đổi tên class */
  border: none;
  border-radius: 15px; /* Bo góc */
  overflow: hidden; /* Đảm bảo bo góc áp dụng đúng */
}

/* Icon đăng xuất với hiệu ứng nảy */
.icon-dang-xuat { /* Đổi tên class */
  animation: hieuUngNay 2s infinite; /* Áp dụng animation 'hieuUngNay' */
}

/* Định nghĩa animation 'hieuUngNay' */
@keyframes hieuUngNay { /* Đổi tên animation */
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0); /* Vị trí gốc */
  }
  40% {
    transform: translateY(-10px); /* Nảy lên */
  }
  60% {
    transform: translateY(-5px); /* Nảy xuống chút */
  }
}

/* Vòng tròn avatar */
.vong-avatar { /* Đổi tên class */
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Bo tròn */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Nền gradient */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Nút bấm chung */
.btn {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease; /* Hiệu ứng chuyển đổi mượt */
}

/* Nút Xác nhận (màu đỏ) */
.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); /* Nền gradient đỏ */
  border: none;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #dc4545 100%); /* Đổi màu khi hover */
  transform: translateY(-2px); /* Nhấc nút lên chút */
  box-shadow: 0 5px 15px rgba(238, 90, 82, 0.4); /* Đổ bóng */
}

/* Nút Hủy bỏ (viền xám) */
.btn-outline-secondary:hover {
  transform: translateY(-2px); /* Chỉ nhấc nút lên */
}

/* Khu vực thông tin người dùng */
.thong-tin-nguoi-dung { /* Đổi tên class */
  border-radius: 10px;
}

/* Icon thành công trong modal */
.icon-thanh-cong { /* Đổi tên class */
  animation: hieuUngNhayThanhCong 0.6s ease-out; /* Animation 'hieuUngNhayThanhCong' */
}

/* Định nghĩa animation 'hieuUngNhayThanhCong' */
@keyframes hieuUngNhayThanhCong { /* Đổi tên animation */
  0% {
    transform: scale(0); /* Bắt đầu nhỏ */
    opacity: 0;
  }
  50% {
    transform: scale(1.2); /* Phóng to hơn bình thường */
    opacity: 0.8;
  }
  100% {
    transform: scale(1); /* Về kích thước gốc */
    opacity: 1;
  }
}

/* Đảm bảo modal nằm trên cùng */
.modal {
  z-index: 1050;
}

/* Nội dung modal thông báo */
.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3); /* Bóng đổ đậm hơn */
}
</style>