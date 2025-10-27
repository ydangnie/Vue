<template>
  <div class="don-hang-thanh-cong">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="success-card text-center">
            <div class="success-icon mb-4">
              <i class="fas fa-check-circle"></i>
            </div>
            <h1 class="mb-3">Đặt hàng thành công!</h1>
            <p class="lead mb-4">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.</p>

            <div v-if="chiTietDonHang" class="order-details mb-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Chi tiết đơn hàng #{{ chiTietDonHang.id }}</h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6 text-start"> <h6>Thông tin khách hàng</h6>
                      <p class="mb-1"><strong>Họ tên:</strong> {{ chiTietDonHang.customer.name }}</p>
                      <p class="mb-1"><strong>Email:</strong> {{ chiTietDonHang.customer.email }}</p>
                      <p class="mb-1"><strong>Số điện thoại:</strong> {{ chiTietDonHang.customer.phone }}</p>
                      <p class="mb-0"><strong>Địa chỉ:</strong> {{ chiTietDonHang.customer.address }}</p>
                    </div>
                    <div class="col-md-6 text-start"> <h6>Thông tin đơn hàng</h6>
                      <p class="mb-1"><strong>Mã đơn hàng:</strong> #{{ chiTietDonHang.id }}</p>
                      <p class="mb-1"><strong>Ngày đặt:</strong> {{ dinhDangNgay(chiTietDonHang.createdAt) }}</p>
                      <p class="mb-1"><strong>Trạng thái:</strong>
                        <span class="badge bg-warning text-dark">{{ layChuTrangThai(chiTietDonHang.status) }}</span> </p>
                      <p class="mb-1"><strong>Thanh toán:</strong> {{ layChuThanhToan(chiTietDonHang.paymentMethod) }}</p>
                      <p class="mb-0"><strong>Tổng tiền:</strong>
                        <span class="text-danger fw-bold">${{ chiTietDonHang.total.toFixed(2) }}</span>
                      </p>
                    </div>
                  </div>

                  <hr>

                  <h6>Sản phẩm đã đặt</h6>
                  <div v-for="item in chiTietDonHang.items" :key="item.id" class="order-item mb-2">
                    <div class="row align-items-center">
                      <div class="col-md-2 col-3"> <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'"
                             :alt="item.title" class="img-fluid rounded">
                      </div>
                      <div class="col-md-6 col-9 text-start"> <h6 class="mb-1 text-truncate">{{ item.title }}</h6> <small class="text-muted">{{ item.category }}</small>
                      </div>
                      <div class="col-md-2 col-6 text-md-start text-end"> <span>x{{ item.quantity }}</span>
                      </div>
                      <div class="col-md-2 col-6 text-end"> <span class="fw-bold">${{ ((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             <div v-else class="alert alert-warning">
                Đang tải chi tiết đơn hàng... Nếu chờ quá lâu, bạn có thể kiểm tra trong Lịch sử đơn hàng.
             </div>


            <div class="next-steps mb-4">
              <h5 class="mt-4">Tiếp theo bạn có thể:</h5>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-envelope text-primary mb-2"></i>
                    <h6>Kiểm tra email</h6>
                    <p class="small text-muted">Chúng tôi đã gửi xác nhận đơn hàng đến email của bạn.</p>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-history text-info mb-2"></i> <h6>Xem lịch sử</h6>
                     <p class="small text-muted">Kiểm tra trạng thái các đơn hàng đã đặt.</p>
                     <router-link to="/lich-su-don-hang" class="btn btn-sm btn-outline-info mt-2">Xem lịch sử</router-link>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="step-card">
                    <i class="fas fa-shopping-bag text-success mb-2"></i> <h6>Tiếp tục mua sắm</h6>
                    <p class="small text-muted">Khám phá thêm nhiều sản phẩm thú vị khác.</p>
                     <router-link to="/san-pham" class="btn btn-sm btn-outline-success mt-2">Mua sắm</router-link>
                  </div>
                </div>
              </div>
            </div>

            <div class="action-buttons mt-4"> <router-link to="/" class="btn btn-primary btn-lg me-md-3 mb-2 mb-md-0"> <i class="fas fa-home me-2"></i> Về trang chủ
              </router-link>
              <router-link to="/lich-su-don-hang" class="btn btn-outline-secondary btn-lg"> <i class="fas fa-list-alt me-2"></i> Xem lịch sử đơn hàng
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../axios.js';

export default {
  name: 'DonHangThanhCong', // Tên component
  data() {
    return {
      // Biến lưu trữ chi tiết đơn hàng lấy từ API
      chiTietDonHang: null
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiChiTietDonHang(); // Gọi hàm tải chi tiết đơn hàng
  },
  methods: {
    // Hàm tải chi tiết đơn hàng từ API dựa vào orderId trên URL
    async taiChiTietDonHang() {
      try {
        // Lấy orderId từ tham số route (được truyền từ trang ThanhToan hoặc VnPayReturn)
        const orderId = this.$route.params.orderId;
        // Kiểm tra xem có orderId không
        if (!orderId) {
            console.error('Không tìm thấy ID đơn hàng trong URL.');
            this.$toast.error('Không tìm thấy thông tin đơn hàng.');
            // Có thể chuyển về trang chủ hoặc lịch sử đơn hàng
            this.$router.push('/lich-su-don-hang');
            return;
        }

        // Gửi yêu cầu GET đến API để lấy chi tiết đơn hàng theo ID
        const phanHoi = await axios.get(`/orders/${orderId}`);
        // Lưu dữ liệu đơn hàng vào biến chiTietDonHang
        this.chiTietDonHang = phanHoi.data;

      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
        this.$toast.error('Không thể tải thông tin chi tiết đơn hàng.');
        // Không gán null cho chiTietDonHang để không hiển thị lỗi ngay lập tức
        // Người dùng vẫn thấy thông báo thành công chung
      }
    },

    // --- CÁC HÀM TIỆN ÍCH (HELPER FUNCTIONS) ---
    // (Giống các component khác)

    // Định dạng ngày giờ
    dinhDangNgay(dateString) {
      if (!dateString) return '';
      try {
         return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
         });
      } catch(e) { return dateString; }
    },
    // Lấy tên trạng thái tiếng Việt
    layChuTrangThai(status) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đang giao hàng', // Sửa lại cho phù hợp ngữ cảnh
        'delivered': 'Đã nhận',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
    },
    // Lấy tên phương thức thanh toán tiếng Việt
    layChuThanhToan(phuongThuc) {
      const paymentMap = {
        'cod': 'Khi nhận hàng (COD)',
        'bank': 'Chuyển khoản',
        'card': 'Thẻ tín dụng',
        'vnpay': 'VNPay'
      };
      return paymentMap[phuongThuc] || phuongThuc;
    }
  }
}
</script>

<style scoped>
/* Container chính */
.don-hang-thanh-cong {
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: 100vh;
  padding: 60px 0; /* Tăng padding */
  display: flex; /* Dùng flex để căn giữa */
  align-items: center; /* Căn giữa theo chiều dọc */
}

/* Thẻ thông báo thành công */
.success-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  /* margin: 40px 0; Bỏ margin vì đã căn giữa bằng flex */
}

/* Icon check thành công */
.success-icon {
  font-size: 5rem; /* Tăng kích thước icon */
  color: #198754; /* Màu xanh lá đậm hơn */
}

.success-icon i {
  animation: checkmark 0.8s ease-in-out; /* Animation */
}

/* Định nghĩa animation 'checkmark' */
@keyframes checkmark {
  0% {
    transform: scale(0.5) rotate(-45deg); /* Bắt đầu nhỏ và nghiêng */
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg); /* Phóng to và xoay nhẹ */
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg); /* Về kích thước và góc gốc */
    opacity: 1;
  }
}

/* Thẻ chi tiết đơn hàng */
.order-details .card {
  border: 1px solid #e9ecef; /* Thêm viền nhẹ */
  border-radius: 10px;
  box-shadow: none; /* Bỏ shadow bên trong */
  text-align: left; /* Căn trái nội dung bên trong card */
}
.order-details .card-header {
   background-color: #f8f9fa; /* Nền header xám */
   border-bottom: 1px solid #dee2e6;
}
.order-details h6 {
   font-weight: 600;
   margin-bottom: 1rem;
   color: #495057;
}
.order-details p {
   font-size: 0.95rem;
   color: #6c757d;
}


/* Mỗi dòng sản phẩm trong chi tiết đơn hàng */
.order-item {
  padding: 10px;
  background: #ffffff; /* Nền trắng */
  border-radius: 8px;
  border: 1px solid #eee; /* Viền rất nhẹ */
}

.order-item img {
  max-width: 60px;
  height: 60px;
  object-fit: cover; /* Cắt ảnh cho vừa */
}
.order-item h6 {
   font-size: 0.9rem; /* Giảm font tên sản phẩm */
   margin-bottom: 0 !important; /* Bỏ margin dưới */
}

/* Các thẻ bước tiếp theo */
.step-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  height: 100%; /* Đảm bảo các thẻ cao bằng nhau */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Thêm hiệu ứng */
  text-align: center; /* Căn giữa nội dung thẻ */
}

.step-card:hover {
  transform: translateY(-5px); /* Nhấc lên khi hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.step-card i {
  font-size: 2.5rem; /* Tăng kích thước icon */
  margin-bottom: 0.75rem !important; /* Tăng khoảng cách dưới icon */
  display: block; /* Đảm bảo icon chiếm 1 dòng */
}
.step-card h6 {
   font-weight: 600;
   margin-bottom: 0.5rem;
}
.step-card p {
   font-size: 0.85rem;
}


/* Nút bấm chính */
.btn-primary {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
  font-weight: 600; /* Thêm chữ đậm */
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6a78 0%, #333333 100%);
  transform: translateY(-2px); /* Nhấc nút */
  box-shadow: 0 4px 15px rgba(0,0,0,0.2); /* Đổ bóng */
}

.btn-outline-secondary { /* Sửa lại style cho nút phụ */
   font-weight: 600;
   border-width: 2px; /* Viền dày hơn */
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .success-card {
     padding: 30px 20px;
  }
  .success-icon {
     font-size: 4rem;
  }
  h1 {
     font-size: 1.8rem;
  }
  .lead {
     font-size: 1rem;
  }
  .order-details .col-md-6 {
     margin-bottom: 1.5rem; /* Thêm khoảng cách giữa 2 cột thông tin trên mobile */
  }
   .order-details .col-md-6:last-child {
     margin-bottom: 0;
  }
  .action-buttons .btn {
     width: 100%; /* Nút chiếm hết chiều rộng */
  }
   .action-buttons .btn.me-md-3 {
      margin-right: 0 !important; /* Bỏ margin phải trên mobile */
   }

}

</style>