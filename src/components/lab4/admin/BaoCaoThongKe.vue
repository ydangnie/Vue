<template>
  <div class="bao-cao-thong-ke">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-chart-bar"></i> Báo cáo thống kê
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label class="form-label">Từ ngày</label>
              <input v-model="ngayBatDau" type="date" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Đến ngày</label>
              <input v-model="ngayKetThuc" type="date" class="form-control">
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button @click="taiDuLieuBaoCao" class="btn btn-primary me-2">
                <i class="fas fa-search"></i> Lọc
              </button>
              <button @click="datLaiBoLoc" class="btn btn-secondary">
                <i class="fas fa-undo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="metric-card bg-success text-white">
            <div class="metric-icon"><i class="fas fa-dollar-sign"></i></div>
            <div class="metric-content">
              <h3>${{ tongDoanhThu.toFixed(2) }}</h3>
              <p>Tổng doanh thu</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-primary text-white">
            <div class="metric-icon"><i class="fas fa-shopping-cart"></i></div>
            <div class="metric-content">
              <h3>{{ tongSoDonHang }}</h3>
              <p>Tổng đơn hàng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-info text-white">
            <div class="metric-icon"><i class="fas fa-box"></i></div>
            <div class="metric-content">
              <h3>{{ tongSanPhamBanDuoc }}</h3>
              <p>Sản phẩm đã bán</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="metric-card bg-warning text-white">
            <div class="metric-icon"><i class="fas fa-users"></i></div>
            <div class="metric-content">
              <h3>{{ tongSoKhachHang }}</h3>
              <p>Khách hàng</p>
            </div>
            
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Doanh thu theo tháng</h5>
            </div>
            <div class="card-body">
              <canvas ref="bieuDoDoanhThuRef"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Trạng thái đơn hàng</h5>
            </div>
            <div class="card-body">
              <canvas ref="bieuDoTrangThaiDonHangRef"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Sản phẩm bán chạy nhất (Top 5)</h5>
            </div>
            <div class="card-body">
              <div v-for="(sanPham, index) in topSanPhamBanChay" :key="sanPham.id" class="d-flex align-items-center mb-3">
                <div class="rank-badge me-3">{{ index + 1 }}</div>
                <img :src="sanPham.image" :alt="sanPham.title" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ sanPham.title }}</h6>
                  <small class="text-muted">Đã bán: {{ sanPham.sold }} • Doanh thu: ${{ sanPham.revenue.toFixed(2) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Danh mục bán chạy (Top 5)</h5>
            </div>
            <div class="card-body">
              <div v-for="(danhMuc, index) in topDanhMucBanChay" :key="danhMuc.name" class="d-flex align-items-center mb-3">
                <div class="rank-badge me-3">{{ index + 1 }}</div>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ danhMuc.name }}</h6>
                  <small class="text-muted">Đã bán: {{ danhMuc.sold }} • Doanh thu: ${{ danhMuc.revenue.toFixed(2) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Đơn hàng gần đây (Top 10)</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donHang in donHangGanDay" :key="donHang.id">
                  <td>#{{ donHang.id }}</td>
                  <td>{{ donHang.customer.name }}</td>
                  <td>${{ donHang.total.toFixed(2) }}</td>
                  <td>
                    <span :class="layClassBadgeTrangThai(donHang.status)">
                      {{ layChuTrangThai(donHang.status) }}
                    </span>
                  </td>
                  <td>{{ dinhDangNgay(donHang.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js';
// Import thư viện Chart.js để vẽ biểu đồ
import Chart from 'chart.js/auto';

export default {
  name: 'BaoCaoThongKe',
  data() {
    return {
      ngayBatDau: '', // Liên kết với input "Từ ngày"
      ngayKetThuc: '', // Liên kết với input "Đến ngày"
      danhSachDonHangGoc: [], // Lưu trữ TẤT CẢ đơn hàng từ API
      danhSachSanPhamGoc: [], // Lưu trữ TẤT CẢ sản phẩm từ API
      danhSachDonHangDaLoc: [], // Chỉ lưu đơn hàng trong khoảng ngày đã chọn
      
      // Các số liệu thống kê
      tongDoanhThu: 0,
      tongSoDonHang: 0,
      tongSanPhamBanDuoc: 0,
      tongSoKhachHang: 0,

      // Các danh sách hiển thị
      topSanPhamBanChay: [],
      topDanhMucBanChay: [],
      donHangGanDay: [],

      // Biến để lưu trữ đối tượng biểu đồ (để có thể xóa đi khi cập nhật)
      bieuDoDoanhThu: null, 
      bieuDoTrangThaiDonHang: null
    };
  },
  // Hàm chạy khi component được tạo xong
  mounted() {
    this.thietLapNgayMacDinh(); // Đặt ngày mặc định (30 ngày gần nhất)
    this.taiDuLieuBaoCao(); // Tải dữ liệu lần đầu
  },
  // Hàm chạy ngay trước khi component bị hủy
  beforeUnmount() {
    // Phải hủy các biểu đồ cũ để tránh rò rỉ bộ nhớ
    if (this.bieuDoDoanhThu) {
      this.bieuDoDoanhThu.destroy();
    }
    if (this.bieuDoTrangThaiDonHang) {
      this.bieuDoTrangThaiDonHang.destroy();
    }
  },
  methods: {
    // Đặt khoảng ngày mặc định là 30 ngày gần nhất
    thietLapNgayMacDinh() {
      const homNay = new Date();
      const baMuoiNgayTruoc = new Date(homNay.getTime() - (30 * 24 * 60 * 60 * 1000));
      // Định dạng lại thành 'YYYY-MM-DD'
      this.ngayBatDau = baMuoiNgayTruoc.toISOString().split('T')[0];
      this.ngayKetThuc = homNay.toISOString().split('T')[0];
    },
    // Hàm chính: Tải và xử lý tất cả dữ liệu
    async taiDuLieuBaoCao() {
      try {
        // Gọi 2 API cùng lúc
        const [phanHoiDonHang, phanHoiSanPham] = await Promise.all([
          axios.get('/orders'),
          axios.get('/products')
        ]);

        this.danhSachDonHangGoc = phanHoiDonHang.data;
        this.danhSachSanPhamGoc = phanHoiSanPham.data;

        // Bắt đầu chuỗi xử lý
        this.locDuLieuTheoNgay();
        this.tinhToanCacSoLieu();
        this.taoTopSanPham();
        this.taoTopDanhMuc();
        this.taoDonHangGanDay();
        this.taoCacBieuDo(); // Vẽ biểu đồ

      } catch (error) {
        console.error('Lỗi tải báo cáo:', error);
        this.$toast.error('Không thể tải dữ liệu báo cáo');
      }
    },
    // Lọc danh sách đơn hàng theo khoảng ngày đã chọn
    locDuLieuTheoNgay() {
      if (!this.ngayBatDau || !this.ngayKetThuc) return;

      const batDau = new Date(this.ngayBatDau);
      const ketThuc = new Date(this.ngayKetThuc);
      ketThuc.setHours(23, 59, 59, 999); // Tính đến cuối ngày

      this.danhSachDonHangDaLoc = this.danhSachDonHangGoc.filter(donHang => {
        const ngayDatHang = new Date(donHang.createdAt);
        return ngayDatHang >= batDau && ngayDatHang <= ketThuc;
      });
    },
    // Tính 4 số liệu thống kê chính
    tinhToanCacSoLieu() {
      this.tongSoDonHang = this.danhSachDonHangDaLoc.length;

      // Chỉ tính doanh thu và sản phẩm từ các đơn 'delivered' (đã nhận)
      const donHangThanhCong = this.danhSachDonHangDaLoc.filter(
        donHang => donHang.status === 'delivered'
      );

      // Tính tổng doanh thu
      this.tongDoanhThu = donHangThanhCong.reduce(
        (tong, donHang) => tong + donHang.total, 0
      );

      // Tính tổng sản phẩm đã bán (lặp qua từng sản phẩm trong từng đơn hàng)
      this.tongSanPhamBanDuoc = donHangThanhCong.reduce(
        (tongDonHang, donHang) => 
          tongDonHang + donHang.items.reduce((tongItem, item) => tongItem + item.quantity, 0), 0
      );

      // Tính số khách hàng duy nhất (dựa trên email)
      const danhSachEmailKhachHang = new Set(
        this.danhSachDonHangDaLoc.map(donHang => donHang.customer.email)
      );
      this.tongSoKhachHang = danhSachEmailKhachHang.size;
    },
    // Tạo danh sách 5 sản phẩm bán chạy nhất
    taoTopSanPham() {
      const thongKeSanPham = {}; // Dùng để đếm

      this.danhSachDonHangDaLoc
        .filter(order => order.status === 'delivered') // Chỉ tính đơn đã giao
        .forEach(order => {
          order.items.forEach(item => {
            // Nếu chưa có sản phẩm này trong thống kê, hãy tạo
            if (!thongKeSanPham[item.id]) {
              thongKeSanPham[item.id] = {
                id: item.id,
                title: item.title,
                sold: 0,
                revenue: 0,
                image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'
              };
            }
            // Cộng dồn số lượng và doanh thu
            thongKeSanPham[item.id].sold += item.quantity;
            thongKeSanPham[item.id].revenue += (item.price * (1 - item.discount / 100)) * item.quantity;
          });
        });

      // Chuyển đối tượng thống kê thành mảng, sắp xếp giảm dần theo doanh thu, và lấy 5
      this.topSanPhamBanChay = Object.values(thongKeSanPham)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    },
    // Tạo danh sách 5 danh mục bán chạy nhất (tương tự như top sản phẩm)
    taoTopDanhMuc() {
      const thongKeDanhMuc = {}; // Dùng để đếm

      this.danhSachDonHangDaLoc
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          order.items.forEach(item => {
            const tenDanhMuc = item.category || 'Không có danh mục'; // Tên danh mục
            if (!thongKeDanhMuc[tenDanhMuc]) {
              thongKeDanhMuc[tenDanhMuc] = {
                name: tenDanhMuc,
                sold: 0,
                revenue: 0
              };
            }
            thongKeDanhMuc[tenDanhMuc].sold += item.quantity;
            thongKeDanhMuc[tenDanhMuc].revenue += (item.price * (1 - item.discount / 100)) * item.quantity;
          });
        });

      this.topDanhMucBanChay = Object.values(thongKeDanhMuc)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    },
    // Lấy 10 đơn hàng gần đây nhất
    taoDonHangGanDay() {
      this.donHangGanDay = this.danhSachDonHangDaLoc
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp giảm dần (mới nhất trước)
        .slice(0, 10);
    },
    // Hàm gọi vẽ 2 biểu đồ
    taoCacBieuDo() {
      this.taoBieuDoDoanhThu();
      this.taoBieuDoTrangThaiDonHang();
    },
    // Vẽ biểu đồ doanh thu (dạng đường)
    taoBieuDoDoanhThu() {
      // Lấy thẻ <canvas> từ template bằng 'ref'
      const ctx = this.$refs.bieuDoDoanhThuRef;
      if (!ctx) return; // Nếu không tìm thấy thẻ

      // 1. Nhóm doanh thu theo tháng
      const doanhThuTheoThang = {};
      this.danhSachDonHangDaLoc
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          const date = new Date(order.createdAt);
          const khoaThang = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Ví dụ: '2025-10'
          doanhThuTheoThang[khoaThang] = (doanhThuTheoThang[khoaThang] || 0) + order.total;
        });

      // 2. Chuẩn bị nhãn (labels) và dữ liệu (data)
      const labels = Object.keys(doanhThuTheoThang).sort(); // Sắp xếp các tháng
      const data = labels.map(thang => doanhThuTheoThang[thang]);

      // 3. Hủy biểu đồ cũ (nếu có) trước khi vẽ cái mới
      if (this.bieuDoDoanhThu) {
        this.bieuDoDoanhThu.destroy();
      }

      // 4. Tạo biểu đồ mới
      this.bieuDoDoanhThu = new Chart(ctx, {
        type: 'line', // Kiểu biểu đồ đường
        data: {
          labels: labels.map(label => { // Định dạng lại nhãn tháng/năm
            const [year, month] = label.split('-');
            return `${month}/${year}`;
          }),
          datasets: [{
            label: 'Doanh thu ($)',
            data: data,
            borderColor: '#667eea', // Màu đường
            backgroundColor: 'rgba(102, 126, 234, 0.1)', // Màu nền
            tension: 0.4 // Độ cong của đường
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } }
        }
      });
    },
    // Vẽ biểu đồ trạng thái đơn hàng (dạng tròn)
    taoBieuDoTrangThaiDonHang() {
      const ctx = this.$refs.bieuDoTrangThaiDonHangRef;
      if (!ctx) return;

      // 1. Đếm số lượng của từng trạng thái
      const soLuongTrangThai = {
        pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0
      };
      this.danhSachDonHangDaLoc.forEach(order => {
        soLuongTrangThai[order.status] = (soLuongTrangThai[order.status] || 0) + 1;
      });

      // 2. Hủy biểu đồ cũ (nếu có)
      if (this.bieuDoTrangThaiDonHang) {
        this.bieuDoTrangThaiDonHang.destroy();
      }

      // 3. Tạo biểu đồ mới
      this.bieuDoTrangThaiDonHang = new Chart(ctx, {
        type: 'doughnut', // Kiểu biểu đồ tròn (bánh donut)
        data: {
          labels: ['Chờ xử lý', 'Đang xử lý', 'Đã giao', 'Đã nhận', 'Đã hủy'],
          datasets: [{
            data: [
              soLuongTrangThai.pending,
              soLuongTrangThai.processing,
              soLuongTrangThai.shipped,
              soLuongTrangThai.delivered,
              soLuongTrangThai.cancelled
            ],
            backgroundColor: [
              '#ffc107', // Vàng
              '#17a2b8', // Xanh info
              '#007bff', // Xanh dương
              '#28a745', // Xanh lá
              '#dc3545'  // Đỏ
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    },
    // Đặt lại bộ lọc (quay về mặc định 30 ngày)
    datLaiBoLoc() {
      this.thietLapNgayMacDinh();
      this.taiDuLieuBaoCao();
    },

    // --- CÁC HÀM TIỆN ÍCH (HELPER FUNCTIONS) ---
    // (Giống như component Quản lý đơn hàng)

    layClassBadgeTrangThai(status) {
      const classes = {
        'pending': 'badge bg-warning',
        'processing': 'badge bg-info',
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
      return statusMap[status] || status;
    },
    dinhDangNgay(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
/* CSS cho toàn bộ trang */
.bao-cao-thong-ke {
  background-color: #f8f9fa; /* Màu nền xám nhạt */
  min-height: 100vh;
  padding: 20px 0;
}

/* CSS cho các thẻ số liệu (Doanh thu, Đơn hàng, ...) */
.metric-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.metric-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.metric-content p {
  margin: 0;
  opacity: 0.8;
}

/* CSS cho huy hiệu xếp hạng (Top 1, 2, 3...) */
.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%; /* Hình tròn */
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* CSS cho các thẻ Card (chứa biểu đồ, danh sách) */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề của Card */
.card-header {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none;
}
</style>