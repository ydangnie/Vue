<template>
  <div class="quan-ly-danh-muc">
    <h1>Quản lý danh mục</h1>
    <button @click="hienThiFormThemSua = true" class="btn btn-primary mb-3">Thêm danh mục</button>

    <div v-if="hienThiFormThemSua" class="modal">
      <div class="modal-content">
        <span class="close" @click="hienThiFormThemSua = false">&times;</span>
        <h2>{{ dangSuaDanhMuc ? 'Sửa danh mục' : 'Thêm danh mục' }}</h2>
        <form @submit.prevent="luuDanhMuc">
          <div class="form-group">
            <label>Tên danh mục:</label>
            <input v-model="formDanhMuc.name" required class="form-control">
          </div>
          <button type="submit" class="btn btn-success">{{ dangSuaDanhMuc ? 'Cập nhật' : 'Thêm' }}</button>
        </form>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
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
            <button @click="suaDanhMuc(danhMuc)" class="btn btn-warning btn-sm">Sửa</button>
            <button @click="xoaDanhMuc(danhMuc.id)" class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// Import axios để gọi API
import axios from '../../../../axios.js'

export default {
  name: 'AdminCategory', // Tên component
  data() {
    return {
      danhSachDanhMuc: [], // Mảng chứa danh sách các danh mục lấy từ API
      hienThiFormThemSua: false, // Biến cờ để điều khiển việc hiển thị modal thêm/sửa
      dangSuaDanhMuc: null, // Lưu trữ thông tin danh mục đang được sửa (null nếu đang thêm mới)
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
          // Tìm ID lớn nhất trong mảng categories, chuyển đổi id sang số nguyên
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
      axios.get('/categories') // Gửi yêu cầu GET đến API
        .then(response => {
          this.danhSachDanhMuc = response.data; // Cập nhật danh sách danh mục từ dữ liệu trả về
        })
        .catch(error => {
          console.error('Lỗi khi tải danh mục:', error); // Ghi lỗi ra console nếu có
          // Có thể thêm thông báo lỗi cho người dùng ở đây
          // this.$toast.error('Lỗi tải danh mục!', 'Không thể tải danh sách danh mục.');
        });
    },
    // Hàm xử lý việc lưu (thêm mới hoặc cập nhật) danh mục
    luuDanhMuc() {
      if (this.dangSuaDanhMuc) { // Nếu đang sửa danh mục
        axios.put(`/categories/${this.dangSuaDanhMuc.id}`, this.formDanhMuc) // Gửi yêu cầu PUT để cập nhật
          .then(() => {
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi cập nhật
            this.resetForm(); // Đặt lại form
            // Hiển thị thông báo thành công (cần có component Toast hoặc thay bằng alert)
            this.$toast.success('Cập nhật thành công', `Danh mục "${this.formDanhMuc.name}" đã được cập nhật!`);
          })
          .catch(error => {
            console.error('Lỗi cập nhật:', error);
            // Hiển thị thông báo lỗi
            this.$toast.error('Cập nhật thất bại', 'Có lỗi xảy ra khi cập nhật danh mục!');
          });
      } else { // Nếu đang thêm mới danh mục
        // Gửi yêu cầu POST để thêm mới, bao gồm cả ID tự tăng
        axios.post('/categories', { ...this.formDanhMuc, id: this.idTiepTheo.toString() }) // Chuyển idTiepTheo thành chuỗi nếu API yêu cầu
          .then(() => {
            // this.idTiepTheo++; // Tăng ID tiếp theo (đã được xử lý trong watch)
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi thêm
            this.resetForm(); // Đặt lại form
            // Hiển thị thông báo thành công
            this.$toast.success('Thêm danh mục thành công', `Danh mục "${this.formDanhMuc.name}" đã được thêm!`);
          })
          .catch(error => {
            console.error('Lỗi thêm:', error);
            // Hiển thị thông báo lỗi
            this.$toast.error('Thêm danh mục thất bại', 'Có lỗi xảy ra khi thêm danh mục!');
          });
      }
    },
    // Hàm chuẩn bị form để sửa danh mục
    suaDanhMuc(danhMuc) {
      this.dangSuaDanhMuc = danhMuc; // Lưu thông tin danh mục cần sửa
      this.formDanhMuc = { ...danhMuc }; // Sao chép dữ liệu vào form
      this.hienThiFormThemSua = true; // Hiển thị modal
    },
    // Hàm xóa danh mục
    xoaDanhMuc(id) {
      // Xác nhận trước khi xóa
      if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
        axios.delete(`/categories/${id}`) // Gửi yêu cầu DELETE đến API
          .then(() => {
            this.taiDanhSachDanhMuc(); // Tải lại danh sách sau khi xóa
            // Hiển thị thông báo thành công
            this.$toast.success('Xóa danh mục thành công', 'Danh mục đã được xóa khỏi hệ thống!');
          })
          .catch(error => {
            console.error('Lỗi xóa:', error);
            // Hiển thị thông báo lỗi
            this.$toast.error('Xóa danh mục thất bại', 'Có lỗi xảy ra khi xóa danh mục!');
          });
      }
    },
    // Hàm đặt lại trạng thái form và đóng modal
    resetForm() {
      this.formDanhMuc = { name: '' }; // Xóa dữ liệu trong form
      this.dangSuaDanhMuc = null; // Đặt lại trạng thái đang sửa
      this.hienThiFormThemSua = false; // Ẩn modal
    }
  },
};
</script>

<style scoped>
/* Giữ nguyên các style CSS của modal và form */
.modal {
  display: block; /* Hiển thị modal */
  position: fixed; /* Giữ cố định trên màn hình */
  z-index: 1; /* Nằm trên các phần tử khác */
  left: 0;
  top: 0;
  width: 100%; /* Chiều rộng toàn màn hình */
  height: 100%; /* Chiều cao toàn màn hình */
  overflow: auto; /* Cho phép cuộn nếu nội dung dài */
  background-color: rgb(0,0,0); /* Màu nền đen */
  background-color: rgba(0,0,0,0.4); /* Màu nền đen mờ */
}

.modal-content {
  background-color: #fefefe; /* Màu nền trắng cho nội dung modal */
  margin: 15% auto; /* Canh giữa theo chiều dọc và ngang */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Chiều rộng của nội dung modal */
  max-width: 500px; /* Chiều rộng tối đa */
  border-radius: 8px; /* Bo góc */
}

.close {
  color: #aaa;
  float: right; /* Đưa nút đóng về bên phải */
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer; /* Đổi con trỏ thành bàn tay khi di chuột */
}

.form-group {
  margin-bottom: 15px; /* Khoảng cách dưới mỗi group trong form */
}

/* Thêm một chút khoảng cách giữa các nút Sửa/Xóa */
.btn-sm {
  margin-right: 5px;
}
.btn-sm:last-child {
  margin-right: 0;
}
</style>