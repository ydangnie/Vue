<template>
  <div class="trang-thanh-toan"> <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/gio-hang">Giỏ hàng</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">Thanh toán</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-lg-8">
          <div class="card mb-4 shadow-sm">
            <div class="card-header">
              <h4 class="mb-0"><i class="fas fa-receipt me-2"></i>Thông tin đơn hàng</h4>
            </div>
            <div class="card-body">
              <div v-for="item in gioHang" :key="item.id" class="order-item mb-3 pb-3 border-bottom">
                <div class="row align-items-center gy-2 gy-md-0">
                  <div class="col-md-2 col-3">
                    <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80x80/6c757d/ffffff?text=N/A'"
                         :alt="item.title" class="img-fluid rounded">
                  </div>
                  <div class="col-md-4 col-9">
                    <h6 class="mb-1 text-truncate">{{ item.title }}</h6>
                    <small class="text-muted">{{ item.category }}</small>
                  </div>
                  <div class="col-md-2 col-4 text-md-start">
                    <span class="fw-bold d-block">${{ (item.price * (1 - (item.discount || 0) / 100)).toFixed(2) }}</span>
                    <small v-if="(item.discount || 0) > 0" class="text-muted text-decoration-line-through">${{ item.price.toFixed(2) }}</small>
                  </div>
                  <div class="col-md-2 col-3 text-center text-md-start">
                    <span class="badge bg-secondary">x{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2 col-5 text-end">
                    <span class="fw-bold item-subtotal">${{ ((item.price * (1 - (item.discount || 0) / 100)) * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
               <div v-if="!gioHang || gioHang.length === 0" class="text-center text-muted py-3">
                  Giỏ hàng của bạn đang trống.
               </div>
            </div>
          </div>

          <div class="card mb-4 shadow-sm">
            <div class="card-header">
              <h4 class="mb-0"><i class="fas fa-user-circle me-2"></i>Thông tin khách hàng</h4>
            </div>
            <div class="card-body">
              <form id="checkoutForm" @submit.prevent="xuLyDatHang">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ tên *</label>
                    <input v-model="thongTinDatHang.tenKhachHang" type="text" class="form-control" required placeholder="Nhập họ và tên">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email *</label>
                    <input v-model="thongTinDatHang.emailKhachHang" type="email" class="form-control" required readonly disabled>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Số điện thoại *</label>
                  <input v-model="thongTinDatHang.soDienThoai" type="tel" class="form-control" required placeholder="Nhập số điện thoại">
                </div>
                <div class="mb-3">
                  <label class="form-label">Địa chỉ giao hàng *</label>
                  <textarea v-model="thongTinDatHang.diaChiGiaoHang" class="form-control" rows="3" required placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Ghi chú</label>
                  <textarea v-model="thongTinDatHang.ghiChu" class="form-control" rows="2" placeholder="Ghi chú thêm về đơn hàng (tùy chọn)..."></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4" id="cot-phai">
          <div class="card sticky-top shadow-sm">
            <div class="card-header">
              <h5 class="mb-0">Tóm tắt đơn hàng</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-2">
                <span>Tổng sản phẩm:</span>
                <span>{{ soLuongSanPhamTrongGio }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tổng tiền hàng:</span>
                <span class="fw-bold sum-text">${{ tongTienGioHang.toFixed(2) }}</span> </div>
              <div v-if="giamGiaPromo > 0" class="d-flex justify-content-between mb-2">
                <span>Mã giảm giá:</span>
                <span class="fw-bold text-success">-${{ giamGiaPromo.toFixed(2) }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <span class="text-success">Miễn phí</span>
              </div>
              <hr class="hr-dark">
              <div class="d-flex justify-content-between mb-4">
                <span class="fw-bold fs-5">Tổng thanh toán:</span> <span class="fw-bold text-danger fs-5">${{ tongTienCuoiCung.toFixed(2) }}</span>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Phương thức thanh toán</label>
                <select v-model="thongTinDatHang.phuongThucThanhToan" class="form-select">
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="vnpay">Ví điện tử VNPay</option>
                  </select>
              </div>

              <button type="submit" form="checkoutForm" class="btn btn-dark w-100 btn-lg" :disabled="dangXuLyDatHang || !gioHang || gioHang.length === 0">
                <span v-if="dangXuLyDatHang" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i class="fas fa-check-circle me-2"></i>
                {{ dangXuLyDatHang ? 'Đang xử lý...' : 'Hoàn tất Đặt hàng' }} </button>

              <div class="mt-3 text-center">
                <router-link to="/gio-hang" class="btn btn-outline-secondary btn-sm">
                  <i class="fas fa-arrow-left me-1"></i> Quay lại giỏ hàng
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import helpers từ Vuex
import { mapState, mapGetters, mapActions } from 'vuex';
// Import axios đã cấu hình (cho API chính)
import axios from '../../../axios.js';
// Import module vnpay
import { vnpay } from '../modules/models.js';

// *** KÍCH HOẠT LẠI CHỨC NĂNG EMAIL ***
// Tạo một instance axios riêng để gọi server email (chạy trên port 3004)
const emailAxios = axios.create({
  baseURL: 'http://localhost:3004',
  timeout: 10000 // Tăng thời gian chờ cho việc gửi mail
});
// *** KẾT THÚC KÍCH HOẠT EMAIL ***

export default {
  name: 'ThanhToan', // Tên component
  data() {
    return {
      dangXuLyDatHang: false, // Cờ báo đang xử lý
      // Đối tượng lưu thông tin nhập từ form
      thongTinDatHang: {
        tenKhachHang: '',
        emailKhachHang: '',
        soDienThoai: '',
        diaChiGiaoHang: '',
        ghiChu: '',
        phuongThucThanhToan: 'cod', // Mặc định
        maGiamGia: '' // Tạm thời chưa dùng
      },
      giamGiaPromo: 0, // Tạm thời chưa dùng
      thongTinMaGiamGia: null // Tạm thời chưa dùng
    };
  },
  computed: {
    // Lấy state 'cart' từ Vuex và đặt tên là 'gioHang'
    ...mapState({
        gioHang: 'cart'
    }),
    // Lấy getters từ Vuex
    ...mapGetters({
        tongTienGioHang: 'cartTotal',
        soLuongSanPhamTrongGio: 'cartItemCount'
    }),
    // Tính tổng tiền cuối cùng
    tongTienCuoiCung() {
      return this.tongTienGioHang - this.giamGiaPromo;
    }
  },
  // Hàm chạy sau khi component được tạo
  mounted() {
     // Kiểm tra nếu giỏ hàng trống thì chuyển về
     if (!this.gioHang || this.gioHang.length === 0) {
        this.$toast.warning("Giỏ hàng trống!", "Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.");
        this.$router.push('/gio-hang');
        return;
     }

    // Lấy thông tin người dùng từ localStorage để điền sẵn form
    try {
        const nguoiDung = JSON.parse(localStorage.getItem('user'));
        if (nguoiDung) {
            this.thongTinDatHang.tenKhachHang = nguoiDung.username;
            this.thongTinDatHang.emailKhachHang = nguoiDung.email;
        } else {
            // Nếu không có user, bắt buộc đăng nhập
            this.$toast.warning("Vui lòng đăng nhập để thanh toán.");
            localStorage.setItem('redirectPath', this.$route.fullPath); // Lưu lại trang này
            this.$router.push('/login'); // Chuyển về trang login
        }
    } catch(e) {
        console.error("Lỗi đọc thông tin user:", e);
        this.$toast.error("Có lỗi xảy ra, vui lòng đăng nhập lại.");
        this.$router.push('/login');
    }
  },
  methods: {
    // Lấy action 'clearCart' từ Vuex
    ...mapActions({
        xoaSachGioHangAction: 'clearCart'
    }),

    // Hàm xử lý chính khi nhấn nút "Đặt hàng"
    async xuLyDatHang() {
      // Kiểm tra nếu đang xử lý hoặc giỏ hàng trống
      if (this.dangXuLyDatHang || !this.gioHang || this.gioHang.length === 0) {
        return;
      }
      
      // Kiểm tra các trường bắt buộc
      if (!this.thongTinDatHang.tenKhachHang || !this.thongTinDatHang.emailKhachHang || !this.thongTinDatHang.soDienThoai || !this.thongTinDatHang.diaChiGiaoHang) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin khách hàng bắt buộc (*)!');
        return;
      }
      
      // Bật cờ đang xử lý
      this.dangXuLyDatHang = true;
      
      // Chuẩn bị dữ liệu đơn hàng
      const duLieuDonHang = {
        id: Date.now().toString(),
        customer: {
          name: this.thongTinDatHang.tenKhachHang,
          email: this.thongTinDatHang.emailKhachHang,
          phone: this.thongTinDatHang.soDienThoai,
          address: this.thongTinDatHang.diaChiGiaoHang
        },
        items: this.gioHang.map(item => ({ ...item })), // Sao chép giỏ hàng
        total: this.tongTienCuoiCung,
        paymentMethod: this.thongTinDatHang.phuongThucThanhToan,
        status: 'pending', // Trạng thái ban đầu
        createdAt: new Date().toISOString(),
        notes: this.thongTinDatHang.ghiChu,
        originalTotal: this.tongTienGioHang,
        promoCode: this.thongTinDatHang.maGiamGia || null,
        promoDiscount: this.giamGiaPromo,
      };

      // Xử lý tùy theo phương thức thanh toán
      if (this.thongTinDatHang.phuongThucThanhToan === 'vnpay') {
        // --- XỬ LÝ THANH TOÁN VNPay ---
        try {
          const tiGia = 23500; // Tỷ giá (nên đặt ở file config)
          const soTienVND = Math.round(this.tongTienCuoiCung * tiGia);
          
          // Tạo URL thanh toán
          const urlThanhToan = vnpay.buildPaymentUrl({
              vnp_Amount: soTienVND * 100, // Đơn vị: đồng xu
              vnp_TxnRef: duLieuDonHang.id,
              vnp_OrderInfo: `Thanh toan don hang #${duLieuDonHang.id}`,
              vnp_OrderType: 'other',
              vnp_ReturnUrl: `http://localhost:5173/vnpay_return`, // URL trả về
              vnp_Locale: 'vn',
          });
          
          // Lưu tạm đơn hàng vào localStorage
          localStorage.setItem('donHangChoXuLy', JSON.stringify(duLieuDonHang));
          
          // Chuyển hướng người dùng sang cổng VNPay
          window.location.href = urlThanhToan;
          // Không cần set dangXuLyDatHang = false vì trang sẽ bị chuyển đi

        } catch (error) {
          console.error('Lỗi tạo URL VNPay:', error);
          this.$toast.error('Có lỗi khi tạo yêu cầu thanh toán VNPay!');
          this.dangXuLyDatHang = false; // Tắt cờ nếu có lỗi
        }
      } else {
        // --- XỬ LÝ THANH TOÁN KHÁC (COD, ...) ---
        try {
          // 1. Lưu đơn hàng vào db.json
          const phanHoi = await axios.post('/orders', duLieuDonHang);
          const donHangDaLuu = phanHoi.data;

          // 2. *** KÍCH HOẠT LẠI: Gửi email xác nhận ***
          try {
            // Gọi đến server email (chạy trên port 3004)
            await emailAxios.post('/send-order-email', { order: donHangDaLuu }); //
             console.log("Đã gửi yêu cầu email xác nhận.");
          } catch (emailError) {
             // Nếu gửi mail lỗi, chỉ log ra console chứ không dừng lại
            console.error("Lỗi gửi email xác nhận (Server email có thể chưa chạy):", emailError.message);
            // Có thể thông báo cho người dùng
            // this.$toast.warning("Đặt hàng thành công nhưng chưa gửi được email xác nhận.");
          }
          // *** KẾT THÚC PHẦN EMAIL ***

          // 3. Xóa giỏ hàng
          await this.xoaSachGioHangAction();
          
          // 4. Thông báo thành công
          this.$toast.success('Đặt hàng thành công!');
          
          // 5. Chuyển hướng đến trang thành công
          this.$router.push({
            name: 'DonHangThanhCong',
            params: { orderId: donHangDaLuu.id }
          });
          
        } catch (error) {
          // Xử lý lỗi khi lưu đơn hàng
          console.error("Lỗi khi đặt hàng:", error);
          this.$toast.error('Có lỗi xảy ra khi đặt hàng!');
        } finally {
          // Dù thành công hay thất bại (trừ VNPay) đều tắt cờ xử lý
          this.dangXuLyDatHang = false;
        }
      }
    }
  }
}
</script>

<style scoped>
/* Container chính */
.trang-thanh-toan {
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: calc(100vh - 56px); /* Chiều cao tối thiểu trừ navbar */
  padding: 30px 0;
}

/* Breadcrumb */
.breadcrumb {
  background-color: transparent;
  padding: 0 0 1rem 0;
}
.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
}
.breadcrumb-item a:hover {
  color: #000;
}
.breadcrumb-item.active {
  color: #212529;
  font-weight: 500;
}

/* Card chung */
.card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

/* Header của card */
.card-header {
  background: #343a40; /* Nền đen */
  color: white;
  border-radius: 8px 8px 0 0 !important;
  padding: 1rem 1.25rem;
  border-bottom: none;
}
.card-header h4, .card-header h5 {
   font-weight: 600;
}

/* Sản phẩm trong đơn hàng */
.order-item {
  padding-bottom: 1rem !important;
}
.order-item:last-child {
   border-bottom: none !important;
   margin-bottom: 0 !important;
   padding-bottom: 0 !important;
}
.order-item img {
  max-width: 80px;
  height: 80px;
  object-fit: cover;
}
.order-item h6 {
   font-size: 0.95rem;
   font-weight: 500;
}
.order-item .item-subtotal {
   color: #343a40;
}

/* Form */
.form-label {
   font-weight: 500;
   color: #495057;
   margin-bottom: 0.5rem;
}
.form-control, .form-select {
   border-radius: 6px;
   border: 1px solid #ced4da;
   padding: 0.6rem 0.9rem;
}
.form-control:focus, .form-select:focus {
   border-color: #555;
   box-shadow: 0 0 0 0.2rem rgba(85, 85, 85, 0.25);
}
.form-control:disabled, .form-control[readonly] {
    background-color: #e9ecef;
    opacity: 1;
}

/* Cột tóm tắt (cột phải) */
#cot-phai .card {
  position: sticky;
  top: 20px;
}
#cot-phai .card-body span:first-child {
   color: #6c757d;
}
#cot-phai .card-body span:last-child {
   font-weight: 500;
   color: #343a40;
}
#cot-phai .card-body .sum-text { /* Class cho tổng tiền hàng */
    color: #343a40 !important;
    font-weight: 600;
}
#cot-phai .card-body .text-danger { /* Tổng thanh toán */
   color: #dc3545 !important;
    font-weight: 700;
}
.hr-dark {
   border-top: 1px solid #adb5bd;
}

/* Nút Đặt hàng */
.btn-dark {
  background: #212529;
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 8px; /* Thêm bo góc */
}

.btn-dark:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.btn-dark:disabled {
   opacity: 0.65;
   cursor: not-allowed;
}

/* Nút quay lại */
.btn-outline-secondary {
   color: #6c757d;
   border-color: #6c757d;
   border-radius: 8px; /* Thêm bo góc */
}
.btn-outline-secondary:hover {
   background-color: #6c757d;
   color: white;
}

/* Responsive */
@media (max-width: 991px) { /* Cho tablet và nhỏ hơn */
   #cot-phai .card {
      position: static; /* Bỏ sticky */
      margin-top: 1.5rem;
   }
}
@media (max-width: 768px) { /* Cho mobile */
   .order-item .col-md-2,
   .order-item .col-md-4 {
      text-align: left;
   }
   .order-item .col-4.text-md-start {
       text-align: left !important;
   }
   .order-item .col-3.text-center {
       text-align: left !important;
   }
    .order-item .col-5.text-end {
       padding-top: 0.5rem; /* Thêm chút padding cho giá tiền */
   }
}
</style>