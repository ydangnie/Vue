<template>
  <div class="cap-nhat-user">
    <div class="container">
      <h1 class="mb-4"><i class="fas fa-user-edit me-2"></i>Cập nhật thông tin cá nhân</h1>
      <div class="row">
        <div class="col-md-8">
          <form @submit.prevent="xuLyCapNhat" class="profile-form">
            <div class="form-group mb-3">
              <label for="username">Tên đăng nhập:</label>
              <input v-model="formCapNhat.tenDangNhap" id="username" required class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="email">Email:</label>
              <input v-model="formCapNhat.email" type="email" id="email" required class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="age">Tuổi:</label>
              <input v-model.number="formCapNhat.tuoi" type="number" id="age" min="1" max="120" class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="gender">Giới tính:</label>
              <select v-model="formCapNhat.gioiTinh" id="gender" class="form-control">
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="desiredProducts">Sản phẩm mong muốn:</label>
              <textarea v-model="formCapNhat.sanPhamMongMuon" id="desiredProducts" class="form-control" rows="3" placeholder="Mô tả sản phẩm bạn quan tâm..."></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="password">Mật khẩu mới (để trống nếu không đổi):</label>
              <input v-model="formCapNhat.matKhauMoi" type="password" id="password" class="form-control" placeholder="Nhập mật khẩu mới...">
            </div>
            <button type="submit" class="btn btn-success btn-lg" :disabled="dangXuLy">
              <span v-if="dangXuLy" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i class="fas fa-save me-2"></i>
              {{ dangXuLy ? 'Đang cập nhật...' : 'Cập nhật' }}
            </button>
          </form>
        </div>

        <div class="col-md-4">
          <div class="profile-info">
            <h4>Thông tin hiện tại</h4>
            <div class="info-item">
              <strong>Tên đăng nhập:</strong> {{ nguoiDungHienTai?.username }}
            </div>
            <div class="info-item">
              <strong>Email:</strong> {{ nguoiDungHienTai?.email }}
            </div>
            <div class="info-item">
              <strong>Tuổi:</strong> {{ nguoiDungHienTai?.age || 'Chưa cập nhật' }}
            </div>
            <div class="info-item">
              <strong>Giới tính:</strong> {{ layChuGioiTinh(nguoiDungHienTai?.gender) }}
            </div>
            <div class="info-item">
              <strong>Sản phẩm mong muốn:</strong>
              <p class="mb-0">{{ nguoiDungHienTai?.desiredProducts || 'Chưa cập nhật' }}</p>
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
// Import mapActions từ Vuex để gọi action cập nhật user trong store
import { mapActions } from 'vuex';

export default {
  name: 'CapNhatUser', // Tên component
  data() {
    return {
      // Đối tượng lưu trữ dữ liệu từ form cập nhật
      formCapNhat: {
        tenDangNhap: '',
        email: '',
        matKhauMoi: '', // Đổi tên để rõ ràng hơn là mật khẩu *mới*
        tuoi: null, // Khởi tạo là null thay vì undefined
        gioiTinh: '',
        sanPhamMongMuon: ''
      },
      // Biến lưu thông tin người dùng hiện tại (lấy từ localStorage)
      nguoiDungHienTai: null,
      // Biến cờ cho biết đang gửi yêu cầu cập nhật hay không
      dangXuLy: false
    };
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    // Lấy thông tin người dùng từ localStorage
    try {
      this.nguoiDungHienTai = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.error("Lỗi đọc thông tin người dùng:", e);
      this.nguoiDungHienTai = null;
    }

    // Nếu lấy được thông tin người dùng...
    if (this.nguoiDungHienTai) {
      // ...thì sao chép thông tin đó vào form để hiển thị ban đầu
      // Dùng spread operator (...) để tạo bản sao, không sửa trực tiếp object gốc
      // Bỏ qua mật khẩu khi điền form ban đầu
      const { password, ...thongTinHienTai } = this.nguoiDungHienTai;
      this.formCapNhat = {
        ...thongTinHienTai, // Sao chép các trường khác
        tenDangNhap: thongTinHienTai.username, // Đổi tên key username -> tenDangNhap
        tuoi: thongTinHienTai.age, // Đổi tên key age -> tuoi
        gioiTinh: thongTinHienTai.gender, // Đổi tên key gender -> gioiTinh
        sanPhamMongMuon: thongTinHienTai.desiredProducts, // Đổi tên key desiredProducts -> sanPhamMongMuon
        matKhauMoi: '' // Mật khẩu mới luôn để trống ban đầu
      };
    } else {
        // Nếu không có người dùng, có thể chuyển hướng về trang đăng nhập
        this.$router.push('/login');
        this.$toast.warning('Vui lòng đăng nhập để cập nhật thông tin.');
    }
  },
  methods: {
    // Sử dụng mapActions để lấy action 'updateUser' từ Vuex store
    // Action này thường dùng để cập nhật state 'user' trong store
    ...mapActions(['updateUser']), // Hàm này sẽ có tên là 'updateUser' trong methods

    // Hàm xử lý khi người dùng submit form cập nhật
    async xuLyCapNhat() {
      // Nếu đang xử lý rồi thì không làm gì cả
      if (this.dangXuLy) return;
      // Kiểm tra xem có người dùng hiện tại không (phòng trường hợp localStorage bị xóa)
      if (!this.nguoiDungHienTai) {
        this.$toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

       // --- KIỂM TRA DỮ LIỆU NHẬP (VALIDATION cơ bản) ---
      if (!this.formCapNhat.tenDangNhap || !this.formCapNhat.email) {
          this.$toast.error('Tên đăng nhập và Email không được để trống!');
          return;
      }
      if (this.formCapNhat.matKhauMoi && this.formCapNhat.matKhauMoi.length < 6) {
          this.$toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
          return;
      }


      // --- BẮT ĐẦU GỬI YÊU CẦU CẬP NHẬT ---
      this.dangXuLy = true; // Bật cờ đang xử lý

      try {
        // 1. Chuẩn bị dữ liệu để gửi lên API (đổi tên key lại cho khớp db.json)
        const duLieuCapNhat = {
          // Lấy các trường cơ bản từ người dùng hiện tại (để giữ lại id, role...)
          ...this.nguoiDungHienTai,
          // Ghi đè bằng dữ liệu từ form (đã đổi tên key)
          username: this.formCapNhat.tenDangNhap,
          email: this.formCapNhat.email,
          age: this.formCapNhat.tuoi,
          gender: this.formCapNhat.gioiTinh,
          desiredProducts: this.formCapNhat.sanPhamMongMuon
        };

        // 2. Chỉ thêm trường 'password' vào dữ liệu gửi đi NẾU người dùng có nhập mật khẩu mới
        if (this.formCapNhat.matKhauMoi) {
          duLieuCapNhat.password = this.formCapNhat.matKhauMoi; // Thêm mật khẩu mới
        } else {
           // Nếu không nhập mật khẩu mới, xóa trường password cũ khỏi dữ liệu gửi đi
           // để tránh ghi đè mật khẩu cũ bằng undefined (nếu API không xử lý)
           // Hoặc đảm bảo API chỉ cập nhật các trường được gửi.
           // Trong trường hợp dùng json-server PUT, nó sẽ ghi đè toàn bộ,
           // nên cần giữ lại mật khẩu cũ nếu không đổi.
           // Tuy nhiên, vì đã lấy ...this.nguoiDungHienTai ở trên nên mật khẩu cũ đã có sẵn.
           // Nếu API dùng PATCH thì không cần dòng delete này.
           // Tạm thời bỏ qua delete để giữ mật khẩu cũ khi dùng PUT với json-server
           // delete duLieuCapNhat.password;
        }


        // 3. Gửi yêu cầu PUT để cập nhật người dùng (ghi đè toàn bộ)
        await axios.put(`/users/${this.nguoiDungHienTai.id}`, duLieuCapNhat);

        // --- CẬP NHẬT THÀNH CÔNG ---

        // 4. Cập nhật lại dữ liệu trong localStorage
        // Tạo object người dùng mới đã cập nhật (kết hợp cũ và mới)
        // Lưu ý: Không lưu mật khẩu mới vào localStorage vì lý do bảo mật
        const nguoiDungDaCapNhat = { ...duLieuCapNhat };
        // Xóa mật khẩu trước khi lưu vào localStorage và Vuex
        delete nguoiDungDaCapNhat.password;
        localStorage.setItem('user', JSON.stringify(nguoiDungDaCapNhat));

        // 5. Cập nhật lại dữ liệu trong Vuex store bằng action đã map
        this.updateUser(nguoiDungDaCapNhat); // Gọi action 'updateUser' từ Vuex

        // 6. Thông báo thành công
        this.$toast.success('Cập nhật thông tin thành công!');

        // 7. Cập nhật lại thông tin hiển thị ở cột bên phải
        this.nguoiDungHienTai = nguoiDungDaCapNhat;
        // Xóa mật khẩu trong form sau khi cập nhật thành công
        this.formCapNhat.matKhauMoi = '';

      } catch (error) {
        // --- XỬ LÝ LỖI ---
        console.error('Lỗi cập nhật thông tin:', error);
        // Có thể kiểm tra lỗi cụ thể (ví dụ: trùng email/username nếu API trả về lỗi)
        this.$toast.error('Có lỗi xảy ra khi cập nhật thông tin!', 'Vui lòng thử lại.');
      } finally {
        // --- LUÔN THỰC HIỆN ---
        this.dangXuLy = false; // Tắt cờ đang xử lý
      }
    },

    // Hàm tiện ích để chuyển đổi giá trị giới tính sang chữ
    layChuGioiTinh(gioiTinhValue) {
      const banDoGioiTinh = {
        'male': 'Nam',
        'female': 'Nữ',
        'other': 'Khác'
      };
      // Nếu có giá trị trong map thì trả về, nếu không thì trả về 'Chưa cập nhật'
      return banDoGioiTinh[gioiTinhValue] || 'Chưa cập nhật';
    }
  },
};
</script>

<style scoped>
/* Container chính */
.cap-nhat-user {
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: 100vh; /* Chiều cao tối thiểu bằng màn hình */
  padding: 40px 0; /* Tăng padding trên dưới */
}

/* Form cập nhật */
.profile-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Tăng bóng đổ */
}

/* Label trong form */
.form-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

/* Input, select, textarea trong form */
.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 10px 15px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Thêm transition */
}

/* Hiệu ứng khi focus vào input */
.form-control:focus {
  border-color: #667eea; /* Màu viền khi focus */
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); /* Bóng đổ khi focus */
}

/* Nút Cập nhật */
.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%); /* Nền gradient xanh lá */
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  transition: all 0.3s ease; /* Hiệu ứng chuyển đổi */
}

.btn-success:hover:not(:disabled) { /* Hiệu ứng khi hover (và không bị disabled) */
  background: linear-gradient(135deg, #218838 0%, #1aa085 100%); /* Màu đậm hơn khi hover */
  transform: translateY(-2px); /* Nhấc nút lên */
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3); /* Đổ bóng */
}

.btn-success:disabled { /* Style khi nút bị vô hiệu hóa */
  opacity: 0.7;
  transform: none; /* Bỏ hiệu ứng nhấc lên */
  cursor: not-allowed;
}

/* Khung thông tin hiện tại */
.profile-info {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: fit-content; /* Chiều cao tự động theo nội dung */
  position: sticky; /* Giữ cố định khi cuộn trang */
  top: 20px; /* Vị trí cố định từ trên xuống */
}

/* Tiêu đề "Thông tin hiện tại" */
.profile-info h4 {
  color: #495057;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea; /* Gạch chân màu tím */
  padding-bottom: 10px;
}

/* Mỗi dòng thông tin */
.info-item {
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef; /* Đường kẻ mờ phân cách */
}

/* Bỏ đường kẻ cho dòng cuối */
.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

/* Chữ đậm (label) */
.info-item strong {
  color: #495057;
  display: block; /* Chiếm 1 dòng */
  margin-bottom: 5px;
}

/* Nội dung thông tin */
.info-item p, .info-item span { /* Áp dụng cho cả <p> và text thường */
  color: #6c757d; /* Màu xám */
  margin: 0;
}
.info-item p {
  font-style: italic; /* In nghiêng cho mô tả dài */
}


/* Responsive cho màn hình nhỏ (tablets và nhỏ hơn) */
@media (max-width: 768px) {
  .container {
    padding: 0 15px; /* Giảm padding ngang */
  }

  /* Form và khung info sẽ nằm chồng lên nhau */
  .profile-form,
  .profile-info {
    margin-bottom: 30px; /* Khoảng cách giữa form và info */
  }
  .profile-info {
     position: static; /* Bỏ cố định khi màn hình nhỏ */
  }
}
</style>