<template>
  <div class="lich-su-don-hang">
    <div class="container">
      <h1 class="mb-4"><i class="fas fa-history me-2"></i>Lịch sử đơn hàng</h1>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
            <div class="stat-content">
              <h3>{{ danhSachDonHangNguoiDung.length }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
            <div class="stat-content">
              <h3>{{ soDonHangDaGiao }}</h3>
              <p>Đã hoàn thành</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-content">
              <h3>{{ soDonHangDangXuLy }}</h3>
              <p>Đang xử lý</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
            <div class="stat-content">
              <h3>${{ tongChiTieu.toFixed(2) }}</h3>
              <p>Tổng chi tiêu</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Danh sách đơn hàng của bạn</h5>
        </div>
        <div class="card-body">
          <div v-if="danhSachDonHangNguoiDung.length > 0" class="orders-list">
            <div v-for="donHang in danhSachDonHangNguoiDung" :key="donHang.id" class="order-card mb-3">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Đơn hàng #{{ donHang.id }}</h6>
                    <small class="text-muted">{{ dinhDangNgay(donHang.createdAt) }}</small>
                  </div>
                  <div class="text-end">
                    <span :class="layClassBadgeTrangThai(donHang.status)">
                      {{ layChuTrangThai(donHang.status) }}
                    </span>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-8">
                      <div class="order-items">
                        <div v-for="item in donHang.items.slice(0, 3)" :key="item.id" class="order-item mb-2">
                          <div class="d-flex align-items-center">
                            <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'"
                                 :alt="item.title" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                            <div>
                              <h6 class="mb-1">{{ item.title }}</h6>
                              <small class="text-muted">{{ item.category }} • x{{ item.quantity }}</small>
                            </div>
                          </div>
                        </div>
                        <div v-if="donHang.items.length > 3" class="text-muted mt-2">
                          <small>và {{ donHang.items.length - 3 }} sản phẩm khác...</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 text-end">
                      <div class="order-summary">
                        <p class="mb-1"><strong>Thanh toán:</strong> {{ layChuThanhToan(donHang.paymentMethod) }}</p>
                        <p class="mb-1"><strong>Tổng tiền:</strong></p>
                        <h5 class="text-primary mb-0">${{ donHang.total.toFixed(2) }}</h5>
                        <button @click="xemChiTietDonHang(donHang)" class="btn btn-outline-primary btn-sm mt-2">
                          <i class="fas fa-eye"></i> Xem chi tiết
                        </button>
                        <button @click="huyDonHang(donHang)" v-if="donHang.status === 'pending' || donHang.status === 'processing'" class="btn btn-outline-danger btn-sm mt-2 ms-2">
                            <i class="fas fa-times"></i> Hủy đơn
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5">
            <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h4>Bạn chưa có đơn hàng nào</h4>
            <p class="text-muted">Hãy bắt đầu mua sắm để xem lịch sử đơn hàng của bạn</p>
            <router-link to="/san-pham" class="btn btn-primary">
              <i class="fas fa-shopping-bag me-2"></i> Mua sắm ngay
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="hienThiModalChiTiet" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-scrollable"> <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết đơn hàng #{{ donHangDuocChon?.id }}</h5>
              <button @click="dongModalChiTiet" class="btn-close"></button>
            </div>
            <div class="modal-body" v-if="donHangDuocChon">
              <div class="row">
                <div class="col-md-6">
                  <h6>Thông tin giao hàng</h6>
                  <p><strong>Họ tên:</strong> {{ donHangDuocChon.customer.name }}</p>
                  <p><strong>Email:</strong> {{ donHangDuocChon.customer.email }}</p>
                  <p><strong>Số điện thoại:</strong> {{ donHangDuocChon.customer.phone }}</p>
                  <p><strong>Địa chỉ:</strong> {{ donHangDuocChon.customer.address }}</p>
                  <p v-if="donHangDuocChon.notes"><strong>Ghi chú:</strong> {{ donHangDuocChon.notes }}</p>
                </div>
                <div class="col-md-6">
                  <h6>Thông tin đơn hàng</h6>
                  <p><strong>Mã đơn hàng:</strong> #{{ donHangDuocChon.id }}</p>
                  <p><strong>Ngày đặt:</strong> {{ dinhDangNgay(donHangDuocChon.createdAt) }}</p>
                  <p><strong>Trạng thái:</strong>
                    <span :class="layClassBadgeTrangThai(donHangDuocChon.status)">
                      {{ layChuTrangThai(donHangDuocChon.status) }}
                    </span>
                  </p>
                  <p><strong>Thanh toán:</strong> {{ layChuThanhToan(donHangDuocChon.paymentMethod) }}</p>
                  <p><strong>Tổng tiền:</strong> <span class="text-danger fw-bold">${{ donHangDuocChon.total.toFixed(2) }}</span></p>
                </div>
              </div>
              <hr>
              <h6>Sản phẩm đã đặt</h6>
              <div v-for="item in donHangDuocChon.items" :key="item.id" class="order-item-detail mb-3 p-3 border rounded">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80x80?text=No+Image'"
                         :alt="item.title" class="img-fluid rounded">
                  </div>
                  <div class="col-md-6">
                    <h6 class="mb-1">{{ item.title }}</h6>
                    <p class="mb-1 text-muted">{{ item.category }}</p>
                    <small v-if="item.description" class="text-muted d-block text-truncate">{{ item.description }}</small>
                  </div>
                  <div class="col-md-2">
                    <span class="badge bg-secondary">x{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2 text-end">
                    <div>
                      <span v-if="item.discount > 0" class="text-decoration-line-through text-muted d-block"><small>${{ item.price.toFixed(2) }}</small></span>
                      <div class="fw-bold">${{ (item.price * (1 - item.discount / 100)).toFixed(2) }}</div>
                      <small class="text-muted">x{{ item.quantity }}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-end mt-3">
                <h5>Tổng cộng: <span class="text-danger">${{ donHangDuocChon.total.toFixed(2) }}</span></h5>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="dongModalChiTiet" class="btn btn-secondary">Đóng</button>
              <button v-if="donHangDuocChon && donHangDuocChon.status === 'delivered'" @click="datLaiDonHang" class="btn btn-primary">
                <i class="fas fa-redo me-2"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../../axios.js';
// Import mapActions từ Vuex để gọi action 'addToCart'
import { mapActions } from 'vuex';

export default {
  name: 'LichSuDonHang', // Tên component
  data() {
    return {
      // Mảng lưu trữ các đơn hàng của người dùng hiện tại
      danhSachDonHangNguoiDung: [],
      // Biến cờ kiểm soát việc hiển thị modal chi tiết
      hienThiModalChiTiet: false,
      // Biến lưu trữ đơn hàng đang được chọn để xem chi tiết
      donHangDuocChon: null
    };
  },
  // Các thuộc tính tính toán (computed properties) - giá trị được tự động cập nhật khi data thay đổi
  computed: {
    // Đếm số đơn hàng đã giao thành công ('delivered')
    soDonHangDaGiao() {
      return this.danhSachDonHangNguoiDung.filter(donHang => donHang.status === 'delivered').length;
    },
    // Đếm số đơn hàng đang chờ hoặc đang xử lý (không phải 'delivered' và 'cancelled')
    soDonHangDangXuLy() {
      return this.danhSachDonHangNguoiDung.filter(donHang => donHang.status !== 'delivered' && donHang.status !== 'cancelled').length;
    },
    // Tính tổng số tiền đã chi tiêu cho các đơn hàng đã giao thành công
    tongChiTieu() {
      return this.danhSachDonHangNguoiDung
        .filter(donHang => donHang.status === 'delivered') // Chỉ lọc đơn đã giao
        .reduce((tong, donHang) => tong + donHang.total, 0); // Cộng dồn giá trị 'total'
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiDonHangNguoiDung(); // Tải danh sách đơn hàng của người dùng
  },
  methods: {
    // Sử dụng mapActions để lấy action 'addToCart' từ Vuex store
    ...mapActions(['addToCart']), // Hàm này sẽ có tên là 'addToCart' trong methods

    // Hàm tải danh sách đơn hàng của người dùng hiện tại
    async taiDonHangNguoiDung() {
      try {
        // 1. Lấy thông tin người dùng từ localStorage
        const nguoiDung = JSON.parse(localStorage.getItem('user'));
        // Nếu không có thông tin người dùng (chưa đăng nhập), chuyển về trang login
        if (!nguoiDung) {
          this.$toast.warning('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
          this.$router.push('/login');
          return; // Dừng hàm
        }

        // 2. Gọi API để lấy TẤT CẢ đơn hàng
        const phanHoi = await axios.get('/orders');

        // 3. Lọc ra các đơn hàng thuộc về người dùng hiện tại (dựa trên email)
        // và sắp xếp theo ngày tạo giảm dần (mới nhất trước)
        this.danhSachDonHangNguoiDung = phanHoi.data
          .filter(donHang => donHang.customer.email === nguoiDung.email)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      } catch (error) {
        console.error('Lỗi tải lịch sử đơn hàng:', error);
        this.$toast.error('Không thể tải lịch sử đơn hàng', 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    },
    // Hàm hiển thị modal chi tiết khi nhấn nút "Xem chi tiết"
    xemChiTietDonHang(donHang) {
      this.donHangDuocChon = donHang; // Lưu đơn hàng được chọn
      this.hienThiModalChiTiet = true; // Mở modal
    },
    // Hàm đóng modal chi tiết
    dongModalChiTiet() {
      this.hienThiModalChiTiet = false; // Đóng modal
      this.donHangDuocChon = null; // Xóa đơn hàng đang chọn
    },
    // Hàm hủy đơn hàng (chỉ cho phép khi trạng thái là 'pending' hoặc 'processing')
    async huyDonHang(donHang) {
      // Hiển thị hộp thoại xác nhận
      if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${donHang.id}?`)) {
        try {
          // Gửi yêu cầu PATCH đến API để cập nhật trạng thái thành 'cancelled'
          await axios.patch(`/orders/${donHang.id}`, { status: 'cancelled' });
          this.$toast.success('Hủy đơn hàng thành công!');
          this.taiDonHangNguoiDung(); // Tải lại danh sách đơn hàng để cập nhật giao diện
        } catch (error) {
          console.error('Lỗi khi hủy đơn hàng:', error);
          this.$toast.error('Có lỗi xảy ra khi hủy đơn hàng.');
        }
      }
    },
    // Hàm "Đặt lại" đơn hàng (Thêm tất cả sản phẩm trong đơn đã chọn vào giỏ hàng)
    async datLaiDonHang() {
      // Kiểm tra xem có đơn hàng nào đang được chọn không
      if (!this.donHangDuocChon) return;

      try {
        // Lặp qua từng sản phẩm (item) trong đơn hàng đang được chọn
        for (const item of this.donHangDuocChon.items) {
          // Tạo một đối tượng sản phẩm để thêm vào giỏ hàng
          // Cần đảm bảo các thuộc tính khớp với yêu cầu của action 'addToCart'
          const sanPhamDeThemVaoGio = {
             id: item.id,
             title: item.title,
             price: item.price,
             discount: item.discount,
             images: item.images,
             category: item.category,
             description: item.description,
             // Thêm số lượng từ item
             quantity: item.quantity
          };
          // Gọi action 'addToCart' từ Vuex store cho từng sản phẩm
          // Lưu ý: Action addToCart cần được điều chỉnh để xử lý đúng số lượng khi thêm lại
          await this.addToCart(sanPhamDeThemVaoGio);
        }
        // Đóng modal chi tiết
        this.dongModalChiTiet();
        // Thông báo thành công
        this.$toast.success('Đã thêm các sản phẩm vào giỏ hàng!');
        // Chuyển hướng người dùng đến trang giỏ hàng
        this.$router.push('/gio-hang');
      } catch (error) {
        console.error('Lỗi khi đặt lại đơn hàng:', error);
        this.$toast.error('Có lỗi xảy ra khi đặt lại đơn hàng');
      }
    },

    // --- CÁC HÀM TIỆN ÍCH (HELPER FUNCTIONS) ---
    // (Giống các component khác)

    layClassBadgeTrangThai(status) {
      const classes = {
        'pending': 'badge bg-warning text-dark', // Thêm text-dark cho dễ đọc
        'processing': 'badge bg-info text-dark', // Thêm text-dark
        'shipped': 'badge bg-primary',
        'delivered': 'badge bg-success',
        'cancelled': 'badge bg-danger'
      };
      return classes[status] || 'badge bg-secondary';
    },
    layChuTrangThai(status) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Đã nhận',
        'cancelled': 'Đã hủy'
      };
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1); // Viết hoa chữ cái đầu nếu không có map
    },
    layChuThanhToan(phuongThuc) {
      const paymentMap = {
        'cod': 'Khi nhận hàng (COD)',
        'bank': 'Chuyển khoản',
        'card': 'Thẻ tín dụng',
        'vnpay': 'VNPay' // Thêm VNPay nếu có
      };
      return paymentMap[phuongThuc] || phuongThuc;
    },
    // Định dạng ngày giờ chi tiết hơn
    dinhDangNgay(dateString) {
      if (!dateString) return ''; // Trả về rỗng nếu không có ngày
      try {
         return new Date(dateString).toLocaleString('vi-VN', { // dùng toLocaleString
            year: 'numeric',
            month: 'long', // 'long' cho tháng đầy đủ (tháng 10)
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit' // Bỏ giây cho gọn
         });
      } catch (e) {
         return dateString; // Trả về chuỗi gốc nếu lỗi
      }
    }
  }
};
</script>

<style scoped>
/* Container chính */
.lich-su-don-hang {
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: 100vh;
  padding: 40px 0; /* Tăng padding */
}

/* Thẻ thống kê */
.stat-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Bóng đổ nhẹ hơn */
  margin-bottom: 15px; /* Thêm khoảng cách dưới */
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem; /* Giảm kích thước chữ */
}

/* Thẻ đơn hàng (order-card) */
.order-card .card {
  border: 1px solid #e9ecef; /* Thêm viền nhẹ */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.3s ease; /* Hiệu ứng khi hover */
}
.order-card .card:hover {
   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}


/* Header của thẻ đơn hàng */
.order-card .card-header {
  background: #ffffff; /* Nền trắng */
  color: #333; /* Chữ đen */
  border-radius: 10px 10px 0 0 !important;
  border-bottom: 1px solid #e9ecef; /* Viền dưới nhẹ */
  padding: 1rem 1.25rem; /* Tăng padding */
}
.order-card .card-header h6 {
   font-weight: 600;
}


/* Danh sách sản phẩm tóm tắt */
.order-items {
  max-height: 180px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Thêm thanh cuộn nếu cần */
  padding-right: 10px; /* Tạo khoảng trống cho thanh cuộn */
}
.order-item h6 {
   font-size: 0.95rem; /* Giảm kích thước tên sản phẩm */
}


/* Chi tiết sản phẩm trong modal */
.order-item-detail {
  background: #f8f9fa; /* Nền xám nhạt */
}
.order-item-detail h6 {
   font-size: 1rem;
}
.order-item-detail .text-truncate { /* Đảm bảo mô tả không quá dài */
   max-width: 90%;
   display: inline-block; /* Cần thiết cho text-truncate */
}


/* Nút Mua sắm ngay */
.btn-primary {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
  padding: 10px 20px; /* Kích thước nút */
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6a78 0%, #333333 100%); /* Đậm hơn khi hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Đảm bảo modal nằm trên cùng */
.modal {
  z-index: 1050;
}

/* Căn chỉnh các nút trong modal footer */
.modal-footer {
   justify-content: space-between; /* Đẩy nút Đóng sang trái, Đặt lại sang phải */
}

</style>