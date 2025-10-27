<template>
  <div class="quan-ly-don-hang-admin">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-shopping-cart"></i> Quản lý đơn hàng
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="the-thong-ke bg-primary text-white">
            <div class="icon-thong-ke">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="noi-dung-thong-ke">
              <h3>{{ danhSachDonHang.length }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="the-thong-ke bg-warning text-white">
            <div class="icon-thong-ke">
              <i class="fas fa-clock"></i>
            </div>
            <div class="noi-dung-thong-ke">
              <h3>{{ soDonHangChoXuLy }}</h3>
              <p>Chờ xử lý</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="the-thong-ke bg-info text-white">
            <div class="icon-thong-ke">
              <i class="fas fa-truck"></i>
            </div>
            <div class="noi-dung-thong-ke">
              <h3>{{ soDonHangDaGiao }}</h3>
              <p>Đã giao</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="the-thong-ke bg-success text-white">
            <div class="icon-thong-ke">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="noi-dung-thong-ke">
              <h3>{{ soDonHangHoanThanh }}</h3>
              <p>Hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input v-model="tuKhoaTimKiem" type="text" class="form-control" placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng...">
            </div>
            <div class="col-md-3">
              <select v-model="trangThaiLoc" class="form-control">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao</option>
                <option value="delivered">Đã nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sapXepTheo" @change="sapXepDonHang" class="form-control">
                <option value="date-desc">Mới nhất</option>
                <option value="date-asc">Cũ nhất</option>
                <option value="total-desc">Tổng tiền cao</option>
                <option value="total-asc">Tổng tiền thấp</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="datLaiBoLoc" class="btn btn-secondary w-100">
                <i class="fas fa-undo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Danh sách đơn hàng</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm (tóm tắt)</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donHang in danhSachDonHangDaLoc" :key="donHang.id">
                  <td>
                    <strong>#{{ donHang.id }}</strong>
                  </td>
                  <td>
                    <div>
                      <div class="fw-bold">{{ donHang.customer.name }}</div>
                      <small class="text-muted">{{ donHang.customer.email }}</small>
                    </div>
                  </td>
                  <td>
                    <div v-for="item in donHang.items.slice(0, 2)" :key="item.id" class="mb-1">
                      <small>{{ item.title }} (x{{ item.quantity }})</small>
                    </div>
                    <small v-if="donHang.items.length > 2" class="text-muted">
                      và {{ donHang.items.length - 2 }} sản phẩm khác...
                    </small>
                  </td>
                  <td>
                    <span class="fw-bold text-primary">${{ donHang.total.toFixed(2) }}</span>
                  </td>
                  <td>
                    <span :class="layClassBadgeThanhToan(donHang.paymentMethod)">
                      {{ layChuThanhToan(donHang.paymentMethod) }}
                    </span>
                  </td>
                  <td>
                    <span :class="layClassBadgeTrangThai(donHang.status)">
                      {{ layChuTrangThai(donHang.status) }}
                    </span>
                  </td>
                  <td>{{ dinhDangNgay(donHang.createdAt) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="xemDonHang(donHang)" class="btn btn-sm btn-outline-info" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="capNhatTrangThaiDonHang(donHang, 'processing')" v-if="donHang.status === 'pending'"
                              class="btn btn-sm btn-outline-primary" title="Bắt đầu xử lý">
                        <i class="fas fa-play"></i>
                      </button>
                      <button @click="capNhatTrangThaiDonHang(donHang, 'shipped')" v-if="donHang.status === 'processing'"
                              class="btn btn-sm btn-outline-warning" title="Đã giao">
                        <i class="fas fa-truck"></i>
                      </button>
                      <button @click="capNhatTrangThaiDonHang(donHang, 'delivered')" v-if="donHang.status === 'shipped'"
                              class="btn btn-sm btn-outline-success" title="Hoàn thành">
                        <i class="fas fa-check"></i>
                      </button>
                      <button @click="capNhatTrangThaiDonHang(donHang, 'cancelled')" v-if="donHang.status !== 'delivered' && donHang.status !== 'cancelled'"
                              class="btn btn-sm btn-outline-danger" title="Hủy đơn">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="danhSachDonHangDaLoc.length === 0" class="text-center py-5">
            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h4>Không tìm thấy đơn hàng nào</h4>
            <p class="text-muted">Hãy thử tìm kiếm hoặc lọc với tiêu chí khác</p>
          </div>
        </div>
      </div>

      <div v-if="hienThiModalChiTiet" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chi tiết đơn hàng #{{ donHangDuocChon?.id }}</h5>
              <button @click="dongModalChiTiet" class="btn-close"></button>
            </div>
            <div class="modal-body" v-if="donHangDuocChon">
              <div class="row">
                <div class="col-md-6">
                  <h6>Thông tin khách hàng</h6>
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
              <div v-for="item in donHangDuocChon.items" :key="item.id" class="item-don-hang mb-2 p-2 border rounded">
                <div class="row align-items-center">
                  <div class="col-md-2">
                    <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'"
                         :alt="item.title" class="img-fluid rounded">
                  </div>
                  <div class="col-md-6">
                    <h6 class="mb-1">{{ item.title }}</h6>
                    <small class="text-muted">{{ item.category }}</small>
                  </div>
                  <div class="col-md-2">
                    <span>x{{ item.quantity }}</span>
                  </div>
                  <div class="col-md-2">
                    <span class="fw-bold">${{ ((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="dongModalChiTiet" class="btn btn-secondary">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js'; // Import cấu hình axios

export default {
  name: 'AdminQuanLyDonHang', // Tên component
  data() {
    return {
      danhSachDonHang: [], // Mảng chứa toàn bộ đơn hàng từ API
      danhSachDonHangDaLoc: [], // Mảng chứa đơn hàng sau khi lọc và sắp xếp
      tuKhoaTimKiem: '', // Từ khóa tìm kiếm (liên kết với input)
      trangThaiLoc: '', // Trạng thái được chọn để lọc (liên kết với select)
      sapXepTheo: 'date-desc', // Tiêu chí sắp xếp (liên kết với select)
      hienThiModalChiTiet: false, // Biến cờ điều khiển modal chi tiết
      donHangDuocChon: null // Lưu đơn hàng đang được xem chi tiết
    };
  },
  // Các thuộc tính tính toán (computed properties)
  computed: {
    // Đếm số đơn hàng chờ xử lý
    soDonHangChoXuLy() {
      return this.danhSachDonHang.filter(donHang => donHang.status === 'pending').length;
    },
    // Đếm số đơn hàng đã giao
    soDonHangDaGiao() {
      return this.danhSachDonHang.filter(donHang => donHang.status === 'shipped').length;
    },
    // Đếm số đơn hàng đã hoàn thành
    soDonHangHoanThanh() {
      return this.danhSachDonHang.filter(donHang => donHang.status === 'delivered').length;
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào DOM
  mounted() {
    this.taiDanhSachDonHang(); // Tải danh sách đơn hàng ban đầu
  },
  // Theo dõi sự thay đổi của các biến data
  watch: {
    // Khi từ khóa tìm kiếm thay đổi, lọc lại danh sách
    tuKhoaTimKiem() {
      this.locDonHang();
    },
    // Khi trạng thái lọc thay đổi, lọc lại danh sách
    trangThaiLoc() {
      this.locDonHang();
    }
    // Không cần watch `sapXepTheo` vì đã có @change trên select
  },
  methods: {
    // Hàm tải danh sách đơn hàng từ API
    taiDanhSachDonHang() {
      axios.get('/orders')
        .then(response => {
          this.danhSachDonHang = response.data; // Lưu danh sách gốc
          this.danhSachDonHangDaLoc = [...this.danhSachDonHang]; // Sao chép để hiển thị và lọc
          this.sapXepDonHang(); // Sắp xếp danh sách ban đầu
        })
        .catch(error => {
          console.error('Lỗi khi tải danh sách đơn hàng:', error);
          this.$toast.error('Không thể tải danh sách đơn hàng!'); // Thông báo lỗi
          // Có thể chuyển hướng về trang login nếu lỗi xác thực
          // this.$router.push('/login');
        });
    },
    // Hàm lọc danh sách đơn hàng dựa trên từ khóa và trạng thái
    locDonHang() {
      let danhSachTam = [...this.danhSachDonHang]; // Bắt đầu với danh sách gốc

      // Lọc theo từ khóa tìm kiếm (không phân biệt hoa thường)
      if (this.tuKhoaTimKiem) {
        const tuKhoa = this.tuKhoaTimKiem.toLowerCase();
        danhSachTam = danhSachTam.filter(donHang =>
          donHang.id.toString().toLowerCase().includes(tuKhoa) || // Tìm theo ID
          donHang.customer.name.toLowerCase().includes(tuKhoa) || // Tìm theo tên khách hàng
          donHang.customer.email.toLowerCase().includes(tuKhoa) // Tìm theo email khách hàng
        );
      }

      // Lọc theo trạng thái đã chọn
      if (this.trangThaiLoc) {
        danhSachTam = danhSachTam.filter(donHang => donHang.status === this.trangThaiLoc);
      }

      this.danhSachDonHangDaLoc = danhSachTam; // Cập nhật danh sách hiển thị
      this.sapXepDonHang(); // Sắp xếp lại sau khi lọc
    },
    // Hàm sắp xếp danh sách đơn hàng đã lọc
    sapXepDonHang() {
      this.danhSachDonHangDaLoc.sort((a, b) => {
        switch (this.sapXepTheo) {
          case 'date-asc': // Cũ nhất trước
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'date-desc': // Mới nhất trước (mặc định)
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'total-asc': // Tổng tiền thấp trước
            return a.total - b.total;
          case 'total-desc': // Tổng tiền cao trước
            return b.total - a.total;
          default: // Mặc định là mới nhất trước
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    },
    // Hàm đặt lại các bộ lọc về giá trị mặc định
    datLaiBoLoc() {
      this.tuKhoaTimKiem = '';
      this.trangThaiLoc = '';
      this.sapXepTheo = 'date-desc'; // Đặt lại sắp xếp mặc định
      this.danhSachDonHangDaLoc = [...this.danhSachDonHang]; // Hiển thị lại danh sách gốc
      this.sapXepDonHang(); // Sắp xếp lại
    },
    // Hàm hiển thị modal chi tiết đơn hàng
    xemDonHang(donHang) {
      this.donHangDuocChon = donHang; // Lưu đơn hàng được chọn
      this.hienThiModalChiTiet = true; // Mở modal
    },
    // Hàm đóng modal chi tiết đơn hàng
    dongModalChiTiet() {
      this.hienThiModalChiTiet = false; // Đóng modal
      this.donHangDuocChon = null; // Xóa đơn hàng đang chọn
    },
    // Hàm cập nhật trạng thái đơn hàng
    capNhatTrangThaiDonHang(donHang, trangThaiMoi) {
      const chuTrangThai = this.layChuTrangThai(trangThaiMoi); // Lấy tên trạng thái tiếng Việt
      // Xác nhận trước khi cập nhật
      if (confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng #${donHang.id} thành "${chuTrangThai}"?`)) {
        // Gửi yêu cầu PATCH đến API chỉ với trường status cần cập nhật
        axios.patch(`/orders/${donHang.id}`, { status: trangThaiMoi })
          .then(() => {
            this.taiDanhSachDonHang(); // Tải lại danh sách để cập nhật giao diện
            this.$toast.success(`Đã cập nhật trạng thái đơn hàng thành "${chuTrangThai}"`); // Thông báo thành công
          })
          .catch(error => {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            this.$toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng'); // Thông báo lỗi
          });
      }
    },
    // Hàm lấy class CSS cho badge trạng thái
    layClassBadgeTrangThai(trangThai) {
      const classes = {
        'pending': 'badge bg-warning',
        'processing': 'badge bg-info',
        'shipped': 'badge bg-primary',
        'delivered': 'badge bg-success',
        'cancelled': 'badge bg-danger'
      };
      return classes[trangThai] || 'badge bg-secondary'; // Trả về class mặc định nếu không khớp
    },
    // Hàm lấy tên trạng thái tiếng Việt
    layChuTrangThai(trangThai) {
      const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Đã nhận',
        'cancelled': 'Đã hủy'
      };
      return statusMap[trangThai] || trangThai; // Trả về tên gốc nếu không có trong map
    },
    // Hàm lấy class CSS cho badge thanh toán
    layClassBadgeThanhToan(phuongThuc) {
      const classes = {
        'cod': 'badge bg-success',
        'bank': 'badge bg-info',
        'card': 'badge bg-primary',
        'vnpay': 'badge bg-warning text-dark' // Thêm VNPay nếu có
      };
      return classes[phuongThuc] || 'badge bg-secondary';
    },
    // Hàm lấy tên phương thức thanh toán tiếng Việt
    layChuThanhToan(phuongThuc) {
      const paymentMap = {
        'cod': 'COD',
        'bank': 'Chuyển khoản',
        'card': 'Thẻ tín dụng',
        'vnpay': 'VNPay' // Thêm VNPay nếu có
      };
      return paymentMap[phuongThuc] || phuongThuc;
    },
    // Hàm định dạng ngày tháng
    dinhDangNgay(chuoiNgay) {
      // Chuyển đổi chuỗi ISO thành đối tượng Date
      const date = new Date(chuoiNgay);
      // Định dạng theo kiểu Việt Nam (ngày/tháng/năm giờ:phút)
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'short', // 'short' cho tháng dạng chữ ngắn (Thg 10)
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // timeZone: 'Asia/Ho_Chi_Minh' // Đảm bảo đúng múi giờ nếu cần
      });
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên các style CSS */
.the-thong-ke { /* Đổi tên class cho nhất quán */
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.icon-thong-ke { /* Đổi tên class */
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.noi-dung-thong-ke h3 { /* Đổi tên class */
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.noi-dung-thong-ke p { /* Đổi tên class */
  margin: 0;
  opacity: 0.8;
}

.table th {
  border-top: none; /* Bỏ đường viền trên cùng của header bảng */
  font-weight: 600; /* Chữ đậm hơn */
}

.btn-group .btn {
  margin-right: 5px; /* Khoảng cách giữa các nút trong nhóm */
}

.btn-group .btn:last-child {
  margin-right: 0; /* Nút cuối cùng không cần cách phải */
}

.modal {
  z-index: 1050; /* Đảm bảo modal nằm trên các phần tử khác */
}

.card {
  border: none; /* Bỏ đường viền mặc định của card */
  border-radius: 10px; /* Bo góc card */
  box-shadow: 0 2px 15px rgba(0,0,0,0.1); /* Đổ bóng nhẹ */
}

.card-header {
  background: linear-gradient(135deg, #747578 0%, #000000 100%); /* Nền gradient cho header */
  color: white; /* Chữ trắng */
  border-radius: 10px 10px 0 0 !important; /* Bo góc trên của header */
  border-bottom: none; /* Bỏ đường viền dưới của header */
}

.item-don-hang { /* Đổi tên class */
  background: #f8f9fa; /* Nền xám nhạt cho item trong modal */
}

.item-don-hang img { /* Đổi tên class */
  max-width: 60px;
  height: 60px;
  object-fit: cover; /* Giữ tỷ lệ ảnh */
}
</style>