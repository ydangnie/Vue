<template>
  <div class="user-admin container"> <h1><i class="fas fa-users-cog me-2"></i>Quản lý tài khoản người dùng</h1>
    <router-link to="/cap-nhat-user" class="btn btn-primary mb-3">
      <i class="fas fa-user-edit me-2"></i>Cập nhật thông tin cá nhân
    </router-link>

    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nguoiDung in danhSachNguoiDung" :key="nguoiDung.id">
          <td>{{ nguoiDung.id }}</td>
          <td>{{ nguoiDung.username }}</td>
          <td>{{ nguoiDung.email }}</td>
          <td>
             <span :class="nguoiDung.role === 'admin' ? 'badge bg-danger' : 'badge bg-primary'">
                {{ nguoiDung.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
             </span>
          </td>
          <td>
            <button @click="suaNguoiDung(nguoiDung)" class="btn btn-warning btn-sm me-1" title="Sửa">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="xoaNguoiDung(nguoiDung.id)" class="btn btn-danger btn-sm" title="Xóa">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
         <tr v-if="danhSachNguoiDung.length === 0">
            <td colspan="5" class="text-center text-muted">Không có người dùng nào.</td>
         </tr>
      </tbody>
    </table>

    <div v-if="hienThiFormSua" class="modal">
      <div class="modal-content">
        <span class="close" @click="hienThiFormSua = false">&times;</span>
        <h2>Sửa thông tin người dùng</h2>
        <form @submit.prevent="luuNguoiDung">
          <div class="form-group">
            <label>Tên đăng nhập:</label>
            <input v-model="formNguoiDung.username" required class="form-control">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="formNguoiDung.email" type="email" required class="form-control">
          </div>
          <div class="form-group">
            <label>Vai trò:</label>
            <select v-model="formNguoiDung.role" required class="form-control">
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">
             <i class="fas fa-save me-2"></i>Cập nhật
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../../axios.js';

export default {
  name: 'UserAdmin', // Tên component (giữ tiếng Anh theo quy ước)
  data() {
    return {
      // Mảng lưu danh sách người dùng lấy từ API
      danhSachNguoiDung: [],
      // Biến cờ (true/false) kiểm soát hiển thị modal sửa
      hienThiFormSua: false,
      // Biến lưu thông tin người dùng đang được chọn để sửa (null nếu không sửa)
      nguoiDungDangSua: null,
      // Đối tượng lưu dữ liệu nhập từ form sửa
      formNguoiDung: {
        username: '',
        email: '',
        role: 'user' // Mặc định là 'user' khi form trống
      }
    };
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiDanhSachNguoiDung(); // Tải danh sách người dùng khi component hiển thị
  },
  methods: {
    // Hàm tải danh sách người dùng từ API
    taiDanhSachNguoiDung() {
      axios.get('/users') // Gửi yêu cầu GET đến /users
        .then(response => {
          this.danhSachNguoiDung = response.data; // Lưu dữ liệu vào biến
        })
        .catch(error => {
          console.error('Lỗi tải danh sách người dùng:', error);
          this.$toast.error('Lỗi!', 'Không thể tải danh sách người dùng.'); // Thông báo lỗi
        });
    },
    // Hàm được gọi khi nhấn nút "Sửa"
    suaNguoiDung(nguoiDung) {
      this.nguoiDungDangSua = nguoiDung; // Lưu lại người dùng đang được sửa
      // Sao chép (copy) thông tin của người dùng vào form để hiển thị
      // Dùng spread operator (...) để tạo object mới, tránh sửa trực tiếp object gốc
      this.formNguoiDung = { ...nguoiDung };
      this.hienThiFormSua = true; // Hiển thị modal sửa
    },
    // Hàm được gọi khi submit form sửa
    luuNguoiDung() {
      // Kiểm tra xem có người dùng nào đang được sửa không
      if (!this.nguoiDungDangSua) {
        this.$toast.error('Lỗi!', 'Không xác định được người dùng cần sửa.');
        return;
      }

      // Kiểm tra dữ liệu form cơ bản
       if (!this.formNguoiDung.username || !this.formNguoiDung.email) {
          this.$toast.error('Lỗi!', 'Tên đăng nhập và Email không được để trống.');
          return;
      }

      // Gửi yêu cầu PUT đến API để cập nhật người dùng theo ID
      axios.put(`/users/${this.nguoiDungDangSua.id}`, this.formNguoiDung)
        .then(() => {
          this.taiDanhSachNguoiDung(); // Tải lại danh sách sau khi cập nhật thành công
          this.hienThiFormSua = false; // Đóng modal
          this.nguoiDungDangSua = null; // Reset người dùng đang sửa
          this.$toast.success('Thành công!', `Đã cập nhật người dùng ${this.formNguoiDung.username}.`);
        })
        .catch(error => {
          console.error('Lỗi cập nhật người dùng:', error);
          // Có thể kiểm tra lỗi cụ thể (ví dụ: trùng email/username nếu API trả về)
          this.$toast.error('Lỗi!', 'Cập nhật người dùng thất bại.');
        });
    },
    // Hàm được gọi khi nhấn nút "Xóa"
    xoaNguoiDung(id) {
      // Hiển thị hộp thoại xác nhận
      if (confirm(`Bạn có chắc muốn xóa người dùng có ID ${id}? Thao tác này không thể hoàn tác.`)) {
        // Gửi yêu cầu DELETE đến API để xóa người dùng theo ID
        axios.delete(`/users/${id}`)
          .then(() => {
            this.taiDanhSachNguoiDung(); // Tải lại danh sách sau khi xóa thành công
            this.$toast.success('Thành công!', 'Đã xóa người dùng.');
          })
          .catch(error => {
            console.error('Lỗi xóa người dùng:', error);
            this.$toast.error('Lỗi!', 'Xóa người dùng thất bại.');
          });
      }
    }
  },
};
</script>

<style scoped>
/* CSS cho Modal (giống các component khác) */
.modal {
  display: block; /* Hiển thị khi v-if=true */
  position: fixed; /* Cố định */
  z-index: 1050; /* Nằm trên */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Cuộn nếu cần */
  background-color: rgba(0, 0, 0, 0.4); /* Nền mờ */
}

/* Nội dung modal */
.modal-content {
  background-color: #fefefe; /* Nền trắng */
  margin: 10% auto; /* Canh giữa */
  padding: 25px;
  border: 1px solid #ddd;
  width: 90%;
  max-width: 500px; /* Chiều rộng tối đa */
  border-radius: 8px; /* Bo góc */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Đổ bóng */
}

/* Nút đóng (X) */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}

.close:hover,
.close:focus {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

/* Khoảng cách nhóm form */
.form-group {
  margin-bottom: 20px;
}
.form-group label {
   display: block;
   margin-bottom: 5px;
   font-weight: 500;
}


/* Nút Sửa/Xóa trong bảng */
.btn-sm {
  margin-right: 5px; /* Khoảng cách giữa các nút */
}
.btn-sm:last-child {
   margin-right: 0;
}

/* Nút Cập nhật trong modal */
.modal-content .btn-success {
   padding: 10px 20px;
}

/* Thêm padding cho container chính */
.user-admin.container {
  padding-top: 20px;
  padding-bottom: 40px;
}

</style>