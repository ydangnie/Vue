<template>
  <div class="quan-ly-danh-muc container">
    <h1>Quản lý danh mục sản phẩm</h1>
    <button @click="hienThiFormThemSua = true" class="btn btn-primary mb-3">
      <i class="fas fa-plus me-2"></i>Thêm danh mục
    </button>

    <div v-if="hienThiFormThemSua" class="modal">
      <div class="modal-content">
        <span class="close" @click="hienThiFormThemSua = false">&times;</span>
        <h2>{{ danhMucDangSua ? 'Sửa danh mục' : 'Thêm danh mục' }}</h2>
        <form @submit.prevent="luuDanhMuc">
          <div class="form-group">
            <label>Tên danh mục:</label>
            <input v-model="formDanhMuc.name" required class="form-control" placeholder="Nhập tên danh mục...">
          </div>
          <button type="submit" class="btn btn-success">
             <i :class="danhMucDangSua ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
             {{ danhMucDangSua ? 'Cập nhật' : 'Thêm' }}
          </button>
        </form>
      </div>
    </div>

    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="danhMuc in danhSachDanhMuc" :key="danhMuc.id">
          <td>{{ danhMuc.id }}</td>
          <td>{{ danhMuc.name }}</td>
          <td>
             <button @click="suaDanhMuc(danhMuc)" class="btn btn-warning btn-sm me-1" title="Sửa">
              <i class="fas fa-edit"></i>
            </button>
             <button @click="xoaDanhMuc(danhMuc.id)" class="btn btn-danger btn-sm" title="Xóa">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
         <tr v-if="danhSachDanhMuc.length === 0">
            <td colspan="3" class="text-center text-muted">Chưa có danh mục nào.</td>
         </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// Import axios để gọi API
import axios from '../../../../axios.js';

export default {
  name: 'QuanLyDanhMuc', // Tên component
  data() {
    return {
      danhSachDanhMuc: [], // Mảng chứa danh sách các danh mục lấy từ API
      hienThiFormThemSua: false, // Biến cờ để điều khiển việc hiển thị modal thêm/sửa
      danhMucDangSua: null, // Lưu trữ thông tin danh mục đang được sửa (null nếu đang thêm mới)
      idTiepTheo: 1, // ID tự động tăng cho danh mục mới
      formDanhMuc: { // Dữ liệu của form thêm/sửa
        name: ''
      }
    };
  },
  // Hàm được gọi sau khi component được tạo và gắn vào DOM
  mounted() {
    this.taiDanhSachDanhMuc(); // Tải danh sách danh mục khi component được hiển thị
  },
  // Theo dõi sự thay đổi của danhSachDanhMuc để tính toán ID tiếp theo
  watch: {
    danhSachDanhMuc: {
      handler(danhSachMoi) {
        // Tính toán ID tiếp theo dựa trên ID lớn nhất hiện có
        if (danhSachMoi.length > 0) {
          // Tìm ID lớn nhất trong mảng, chuyển đổi id sang số nguyên (để phòng trường hợp ID là chuỗi số)
          // || 0 để xử lý trường hợp ID không hợp lệ hoặc thiếu
          const maxId = Math.max(...danhSachMoi.map(c => parseInt(c.id) || 0));
          this.idTiepTheo = maxId + 1; // ID tiếp theo là ID lớn nhất + 1
        } else {
          this.idTiepTheo = 1; // Nếu danh sách rỗng, bắt đầu từ ID 1
        }
      },
      immediate: true // Chạy handler ngay lần đầu tiên khi component được tạo
    }
  },
  methods: {
    // Hàm tải danh sách danh mục từ API
    taiDanhSachDanhMuc() {
      axios.get('/categories') // Gửi yêu cầu GET đến API /categories
        .then(response => {
          this.danhSachDanhMuc = response.data; // Cập nhật danh sách từ dữ liệu trả về
        })
        .catch(error => {
          console.error('Lỗi khi tải danh mục:', error); // Ghi lỗi ra console nếu có
          this.$toast.error('Lỗi tải danh mục!', 'Không thể tải danh sách danh mục.');
        });
    },
    // Hàm xử lý việc lưu (thêm mới hoặc cập nhật) danh mục
    luuDanhMuc() {
      // Kiểm tra xem tên danh mục có rỗng không (đã có required nhưng kiểm tra thêm)
      if (!this.formDanhMuc.name || !this.formDanhMuc.name.trim()) {
        this.$toast.error('Lỗi', 'Tên danh mục không được để trống!');
        return; // Dừng hàm nếu tên rỗng
      }

      if (this.danhMucDangSua) { // --- TRƯỜNG HỢP: CẬP NHẬT ---
        axios.put(`/categories/${this.danhMucDangSua.id}`, this.formDanhMuc) // Gửi yêu cầu PUT để cập nhật
          .then(() => {
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi cập nhật
            this.datLaiForm(); // Đặt lại form và đóng modal
            this.$toast.success('Cập nhật thành công', `Danh mục "${this.formDanhMuc.name}" đã được cập nhật!`);
          })
          .catch(error => {
            console.error('Lỗi cập nhật danh mục:', error);
            this.$toast.error('Cập nhật thất bại', 'Có lỗi xảy ra khi cập nhật danh mục!');
          });
      } else { // --- TRƯỜNG HỢP: THÊM MỚI ---
        // Chuẩn bị dữ liệu danh mục mới, bao gồm ID tự tăng
        const danhMucMoi = {
          ...this.formDanhMuc, // Lấy tên từ form
          id: this.idTiepTheo.toString() // Gán ID tiếp theo (chuyển thành chuỗi nếu API yêu cầu)
        };
        // Gửi yêu cầu POST để thêm mới
        axios.post('/categories', danhMucMoi)
          .then(() => {
            // this.idTiepTheo++; // Không cần tăng ở đây vì watch đã xử lý
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi thêm
            this.datLaiForm(); // Đặt lại form và đóng modal
            this.$toast.success('Thêm danh mục thành công', `Danh mục "${danhMucMoi.name}" đã được thêm!`);
          })
          .catch(error => {
            console.error('Lỗi thêm danh mục:', error);
            this.$toast.error('Thêm danh mục thất bại', 'Có lỗi xảy ra khi thêm danh mục!');
          });
      }
    },
    // Hàm chuẩn bị form để sửa danh mục được chọn
    suaDanhMuc(danhMuc) {
      this.danhMucDangSua = danhMuc; // Lưu lại thông tin danh mục cần sửa
      // Sao chép (copy) dữ liệu của danh mục vào form để hiển thị
      // Dùng spread operator (...) để tạo object mới, tránh sửa trực tiếp danhMuc gốc
      this.formDanhMuc = { ...danhMuc };
      this.hienThiFormThemSua = true; // Hiển thị modal sửa
    },
    // Hàm xóa danh mục theo ID
    xoaDanhMuc(id) {
      // Hiển thị hộp thoại xác nhận
      if (confirm('Bạn có chắc muốn xóa danh mục này? Sản phẩm thuộc danh mục này có thể bị ảnh hưởng.')) {
        axios.delete(`/categories/${id}`) // Gửi yêu cầu DELETE đến API
          .then(() => {
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi xóa
            this.$toast.success('Xóa danh mục thành công', 'Danh mục đã được xóa.');
          })
          .catch(error => {
            console.error('Lỗi xóa danh mục:', error);
            // Có thể kiểm tra lỗi cụ thể, ví dụ lỗi liên quan đến khóa ngoại
            this.$toast.error('Xóa danh mục thất bại', 'Có lỗi xảy ra hoặc danh mục đang được sử dụng.');
          });
      }
    },
    // Hàm đặt lại trạng thái form về rỗng và đóng modal
    datLaiForm() {
      this.formDanhMuc = { name: '' }; // Xóa tên trong form
      this.danhMucDangSua = null; // Đặt lại trạng thái đang sửa về null
      this.hienThiFormThemSua = false; // Ẩn modal
    }
  },
};
</script>

<style scoped>
/* CSS cho Modal (cửa sổ nổi) */
.modal {
  display: block; /* Hiển thị modal khi v-if=true */
  position: fixed; /* Cố định trên màn hình */
  z-index: 1050; /* Nằm trên các phần tử khác */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Cho phép cuộn nếu nội dung modal dài */
  background-color: rgba(0, 0, 0, 0.4); /* Lớp nền đen mờ */
}

/* Nội dung bên trong modal */
.modal-content {
  background-color: #fefefe; /* Nền trắng */
  margin: 10% auto; /* Canh giữa (khoảng 10% từ trên xuống) */
  padding: 25px; /* Tăng padding */
  border: 1px solid #ddd; /* Viền mờ hơn */
  width: 90%; /* Rộng hơn trên màn hình nhỏ */
  max-width: 500px; /* Giới hạn chiều rộng tối đa */
  border-radius: 8px; /* Bo góc */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Đổ bóng nhẹ */
}

/* Nút đóng (dấu X) */
.close {
  color: #aaa;
  float: right; /* Đẩy sang phải */
  font-size: 28px;
  font-weight: bold;
  line-height: 1; /* Căn chỉnh chiều cao */
}

.close:hover,
.close:focus {
  color: #333; /* Đổi màu khi hover/focus */
  text-decoration: none;
  cursor: pointer;
}

/* Khoảng cách giữa các dòng trong form */
.form-group {
  margin-bottom: 20px; /* Tăng khoảng cách */
}

/* Căn chỉnh label và input */
.form-group label {
  display: block; /* Label chiếm 1 dòng */
  margin-bottom: 5px; /* Khoảng cách với input */
  font-weight: 500;
}

/* Nút Sửa/Xóa trong bảng */
.btn-sm {
  margin-right: 5px; /* Khoảng cách giữa 2 nút */
}
.btn-sm:last-child {
  margin-right: 0; /* Nút cuối không cần cách phải */
}

/* Nút thêm/cập nhật trong modal */
.modal-content .btn-success {
  padding: 10px 20px; /* Tăng kích thước nút */
}
</style>