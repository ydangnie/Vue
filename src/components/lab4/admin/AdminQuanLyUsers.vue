<template>
  <div class="admin-quan-ly-users">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-users-cog"></i> Quản lý người dùng
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon"><i class="fas fa-users"></i></div>
            <div class="stat-content">
              <h3>{{ danhSachNguoiDung.length }}</h3>
              <p>Tổng người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon"><i class="fas fa-user-shield"></i></div>
            <div class="stat-content">
              <h3>{{ soLuongAdmin }}</h3>
              <p>Quản trị viên</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon"><i class="fas fa-user"></i></div>
            <div class="stat-content">
              <h3>{{ soLuongNguoiDung }}</h3>
              <p>Người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon"><i class="fas fa-user-plus"></i></div>
            <div class="stat-content">
              <h3>{{ nguoiDungMoiThangNay }}</h3>
              <p>Thành viên mới (tháng)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input v-model="tuKhoaTimKiem" type="text" class="form-control" placeholder="Tìm kiếm theo tên hoặc email...">
            </div>
            <div class="col-md-3">
              <select v-model="locTheoVaiTro" class="form-control">
                <option value="">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sapXepTheo" @change="sapXepNguoiDung" class="form-control">
                <option value="username">Sắp xếp theo tên</option>
                <option value="email">Sắp xếp theo email</option>
                <option value="totalSpent">Sắp xếp theo chi tiêu</option>
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
          <h5 class="mb-0">Danh sách người dùng</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Tổng chi tiêu</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="nguoiDung in danhSachNguoiDungDaLoc" :key="nguoiDung.id">
                  <td>{{ nguoiDung.id }}</td>
                  <td>{{ nguoiDung.username }}</td>
                  <td>{{ nguoiDung.email }}</td>
                  <td>
                    <span :class="layClassBadgeVaiTro(nguoiDung.role)">
                      {{ nguoiDung.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                    </span>
                  </td>
                  <td>
                    <span class="fw-bold text-success">${{ nguoiDung.tongChiTieu ? nguoiDung.tongChiTieu.toFixed(2) : '0.00' }}</span>
                  </td>
                  <td>{{ dinhDangNgay(nguoiDung.id) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="suaNguoiDung(nguoiDung)" class="btn btn-sm btn-outline-primary" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                      <button @click="doiVaiTroNguoiDung(nguoiDung)" class="btn btn-sm btn-outline-warning" title="Đổi vai trò" :disabled="nguoiDung.username === nguoiDungHienTai?.username"><i class="fas fa-exchange-alt"></i></button>
                      <button @click="xoaNguoiDung(nguoiDung.id)" class="btn btn-sm btn-outline-danger" title="Xóa" :disabled="nguoiDung.username === nguoiDungHienTai?.username"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="hienThiModalChinhSua" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa người dùng</h5>
              <button @click="dongModalChinhSua" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="luuThayDoiNguoiDung">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model="formChinhSuaNguoiDung.username" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="formChinhSuaNguoiDung.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Vai trò</label>
                  <select v-model="formChinhSuaNguoiDung.role" class="form-control" required>
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                  <button @click="dongModalChinhSua" type="button" class="btn btn-secondary">Hủy</button>
                </div>
              </form>
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
  name: 'AdminQuanLyUsers', // Tên component
  data() {
    return {
      danhSachNguoiDung: [], // Mảng chứa toàn bộ người dùng từ API (kèm chi tiêu)
      danhSachNguoiDungDaLoc: [], // Mảng chứa người dùng sau khi lọc và sắp xếp
      tuKhoaTimKiem: '', // Từ khóa tìm kiếm (liên kết với input)
      locTheoVaiTro: '', // Vai trò được chọn để lọc (liên kết với select)
      sapXepTheo: 'username', // Tiêu chí sắp xếp (mặc định theo tên)
      hienThiModalChinhSua: false, // Biến cờ điều khiển modal chỉnh sửa
      formChinhSuaNguoiDung: {}, // Đối tượng lưu thông tin người dùng khi chỉnh sửa
      nguoiDungHienTai: null // Lưu thông tin admin đang đăng nhập (từ localStorage)
    };
  },
  // Các thuộc tính tính toán (computed properties)
  computed: {
    // Đếm số lượng admin
    soLuongAdmin() {
      return this.danhSachNguoiDung.filter(user => user.role === 'admin').length;
    },
    // Đếm số lượng user
    soLuongNguoiDung() {
      return this.danhSachNguoiDung.filter(user => user.role === 'user').length;
    },
    // Đếm người dùng mới trong tháng này
    nguoiDungMoiThangNay() {
      const batDauCuaThang = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      // Giả sử ID của người dùng là timestamp (thời gian tạo)
      // Nếu ID không phải timestamp, logic này cần được sửa lại (ví dụ: dựa vào trường createdAt nếu có)
      return this.danhSachNguoiDung.filter(user => {
        try {
          return new Date(parseInt(user.id)) >= batDauCuaThang;
        } catch (e) {
          return false; // Bỏ qua nếu ID không phải số
        }
      }).length;
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào DOM
  mounted() {
    // Lấy thông tin người dùng đang đăng nhập từ localStorage
    try {
      this.nguoiDungHienTai = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.error("Không thể đọc thông tin người dùng từ localStorage", e);
      this.nguoiDungHienTai = null;
    }
    // Tải dữ liệu người dùng và đơn hàng
    this.taiNguoiDungVaDonHang();
  },
  // Theo dõi sự thay đổi của các biến data
  watch: {
    // Khi từ khóa tìm kiếm thay đổi, lọc lại danh sách
    tuKhoaTimKiem() {
      this.locNguoiDung();
    },
    // Khi vai trò lọc thay đổi, lọc lại danh sách
    locTheoVaiTro() {
      this.locNguoiDung();
    }
  },
  methods: {
    // Hàm tải đồng thời cả danh sách người dùng và danh sách đơn hàng
    async taiNguoiDungVaDonHang() {
      try {
        // Sử dụng Promise.all để gọi 2 API cùng lúc cho nhanh
        const [phanHoiNguoiDung, phanHoiDonHang] = await Promise.all([
          axios.get('/users'), // Lấy danh sách users
          axios.get('/orders') // Lấy danh sách orders
        ]);

        const danhSachUsers = phanHoiNguoiDung.data;
        const danhSachOrders = phanHoiDonHang.data;

        // --- Đây là phần logic quan trọng ---
        // 1. Tạo một đối tượng để lưu tổng chi tiêu của mỗi email
        const chiTieuCuaNguoiDung = {}; // Ví dụ: { 'email@gmail.com': 500, 'khac@gmail.com': 1200 }

        // 2. Lặp qua tất cả đơn hàng
        danhSachOrders.forEach(donHang => {
          // Chỉ tính các đơn hàng đã giao thành công ('delivered')
          if (donHang.status === 'delivered') {
            const email = donHang.customer.email; // Lấy email của khách hàng
            // Cộng dồn tổng tiền vào email tương ứng
            chiTieuCuaNguoiDung[email] = (chiTieuCuaNguoiDung[email] || 0) + donHang.total;
          }
        });

        // 3. Gắn thông tin tổng chi tiêu vào danh sách người dùng
        this.danhSachNguoiDung = danhSachUsers.map(nguoiDung => ({
          ...nguoiDung, // Giữ lại thông tin cũ của người dùng
          // Thêm thuộc tính 'tongChiTieu'
          tongChiTieu: chiTieuCuaNguoiDung[nguoiDung.email] || 0 // Lấy chi tiêu theo email, nếu không có thì là 0
        }));
        // --- Kết thúc logic tính chi tiêu ---

        this.danhSachNguoiDungDaLoc = [...this.danhSachNguoiDung]; // Cập nhật danh sách hiển thị
        this.sapXepNguoiDung(); // Sắp xếp lại danh sách

      } catch (error) {
        console.error('Lỗi tải dữ liệu người dùng và đơn hàng:', error);
        this.$toast.error('Lỗi tải dữ liệu!');
      }
    },

    // Hàm lọc danh sách người dùng
    locNguoiDung() {
      let danhSachTam = this.danhSachNguoiDung.filter(nguoiDung =>
        // Lọc theo từ khóa (tên hoặc email)
        (nguoiDung.username.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase()) ||
         nguoiDung.email.toLowerCase().includes(this.tuKhoaTimKiem.toLowerCase())) &&
        // Lọc theo vai trò (nếu có chọn)
        (this.locTheoVaiTro ? nguoiDung.role === this.locTheoVaiTro : true)
      );
      this.danhSachNguoiDungDaLoc = danhSachTam;
      this.sapXepNguoiDung(); // Sắp xếp lại sau khi lọc
    },

    // Hàm sắp xếp danh sách người dùng đã lọc
    sapXepNguoiDung() {
      this.danhSachNguoiDungDaLoc.sort((a, b) => {
        switch (this.sapXepTheo) {
          case 'email':
            return a.email.localeCompare(b.email); // Sắp xếp A-Z theo email
          case 'totalSpent':
            return b.tongChiTieu - a.tongChiTieu; // Sắp xếp giảm dần theo chi tiêu (cao nhất trước)
          default: // Mặc định là 'username'
            return a.username.localeCompare(b.username); // Sắp xếp A-Z theo tên
        }
      });
    },

    // Hàm đặt lại các bộ lọc
    datLaiBoLoc() {
      this.tuKhoaTimKiem = '';
      this.locTheoVaiTro = '';
      this.sapXepTheo = 'username'; // Reset về sắp xếp theo tên
      this.danhSachNguoiDungDaLoc = [...this.danhSachNguoiDung];
      this.sapXepNguoiDung(); // Sắp xếp lại
    },

    // Hàm mở modal và gán dữ liệu cho form
    suaNguoiDung(nguoiDung) {
      // Bỏ thuộc tính 'tongChiTieu' ra khỏi form chỉnh sửa
      // Vì chúng ta không muốn gửi ngược 'tongChiTieu' lên server
      const { tongChiTieu, ...nguoiDungCoTheSua } = nguoiDung;
      this.formChinhSuaNguoiDung = { ...nguoiDungCoTheSua }; // Sao chép thông tin vào form
      this.hienThiModalChinhSua = true; // Mở modal
    },

    // Hàm đóng modal
    dongModalChinhSua() {
      this.hienThiModalChinhSua = false;
    },

    // Hàm lưu thay đổi sau khi chỉnh sửa
    async luuThayDoiNguoiDung() {
      try {
        // Gửi yêu cầu PUT để cập nhật toàn bộ đối tượng người dùng
        await axios.put(`/users/${this.formChinhSuaNguoiDung.id}`, this.formChinhSuaNguoiDung);
        this.taiNguoiDungVaDonHang(); // Tải lại toàn bộ dữ liệu (để đảm bảo tính nhất quán)
        this.dongModalChinhSua(); // Đóng modal
        this.$toast.success('Cập nhật người dùng thành công!');
      } catch (error) {
        console.error('Lỗi cập nhật người dùng:', error);
        this.$toast.error('Lỗi cập nhật người dùng!');
      }
    },

    // Hàm thay đổi vai trò (admin <-> user)
    async doiVaiTroNguoiDung(nguoiDung) {
      const vaiTroMoi = nguoiDung.role === 'admin' ? 'user' : 'admin';
      const tenVaiTroMoi = vaiTroMoi === 'admin' ? 'Quản trị viên' : 'Người dùng';
      if (confirm(`Bạn có chắc muốn đổi vai trò của "${nguoiDung.username}" thành "${tenVaiTroMoi}"?`)) {
        try {
          // Gửi yêu cầu PATCH chỉ để cập nhật trường 'role'
          await axios.patch(`/users/${nguoiDung.id}`, { role: vaiTroMoi });
          this.taiNguoiDungVaDonHang(); // Tải lại dữ liệu
          this.$toast.success('Đổi vai trò thành công!');
        } catch (error) {
          console.error('Lỗi đổi vai trò:', error);
          this.$toast.error('Lỗi đổi vai trò!');
        }
      }
    },

    // Hàm xóa người dùng
    async xoaNguoiDung(idNguoiDung) {
      if (confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) {
        try {
          await axios.delete(`/users/${idNguoiDung}`);
          this.taiNguoiDungVaDonHang(); // Tải lại dữ liệu
          this.$toast.success('Xóa người dùng thành công!');
        } catch (error) {
          console.error('Lỗi xóa người dùng:', error);
          this.$toast.error('Lỗi xóa người dùng!');
        }
      }
    },

    // Hàm helper: Lấy class CSS cho badge vai trò
    layClassBadgeVaiTro(vaiTro) {
      return vaiTro === 'admin' ? 'badge bg-danger' : 'badge bg-primary'; // Admin màu đỏ, User màu xanh
    },

    // Hàm helper: Định dạng ngày (giả sử ID là timestamp)
    dinhDangNgay(timestamp) {
      try {
        // Chuyển đổi timestamp (dạng chuỗi hoặc số) thành số nguyên
        const timestampSo = parseInt(timestamp);
        // Kiểm tra xem có phải là số hợp lệ không
        if (isNaN(timestampSo)) {
          return 'N/A'; // Trả về 'Không xác định' nếu ID không phải số
        }
        // Tạo đối tượng Date từ timestamp
        const ngay = new Date(timestampSo);
        // Định dạng sang kiểu ngày/tháng/năm của Việt Nam
        return ngay.toLocaleDateString('vi-VN');
      } catch (e) {
        return 'N/A'; // Trả về 'Không xác định' nếu có lỗi
      }
    }
  }
};
</script>

<style scoped>
/* Các thẻ thống kê */
.stat-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Icon trong thẻ thống kê */
.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
}

/* Nội dung (số liệu) trong thẻ thống kê */
.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

/* Thẻ card chung (cho bộ lọc và bảng) */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề của card (header) */
.card-header {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  /* Quan trọng: ghi đè bo góc mặc định của Bootstrap */
}

/* Style cho nút bị vô hiệu hóa (disabled) */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>