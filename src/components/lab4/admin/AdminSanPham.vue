<template>
  <div class="admin-san-pham container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">
        <i class="fas fa-boxes"></i> Quản lý sản phẩm
      </h1>
      <router-link to="/logout" class="btn btn-outline-danger">
        <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
      </router-link>
    </div>
    
    <button @click="hienThiForm = true" class="btn btn-primary mb-3">
      <i class="fas fa-plus me-2"></i>Thêm sản phẩm
    </button>

    <div class="alert alert-info d-flex align-items-center mb-3">
      <label for="nguongSapHetHang" class="form-label mb-0 me-2 fw-bold">Ngưỡng cảnh báo:</label>
      <input type="number" id="nguongSapHetHang" v-model.number="nguongSapHetHang" class="form-control" style="width: 100px;">
      <small class="ms-2 text-muted">Sản phẩm có số lượng bằng hoặc thấp hơn ngưỡng này sẽ được tô vàng.</small>
    </div>

    <div v-if="hienThiForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="hienThiForm = false">&times;</span>
        <h2>{{ sanPhamDangSua ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h2>
        
        <form @submit.prevent="luuSanPham">
          <div class="form-group">
            <label>Tên sản phẩm (Title):</label>
            <input v-model="formSanPham.ten" required class="form-control">
          </div>
          <div class="form-group">
            <label>Giá (Price):</label>
            <input v-model.number="formSanPham.gia" type="number" step="0.01" required class="form-control">
          </div>
          <div class="form-group">
            <label>Danh mục (Category):</label>
            <select v-model="formSanPham.danhMuc" required class="form-control">
              <option value="" disabled>-- Chọn danh mục --</option>
              <option v-for="danhMuc in danhSachDanhMuc" :key="danhMuc.id" :value="danhMuc.name">{{ danhMuc.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Mô tả (Description):</label>
            <textarea v-model="formSanPham.moTa" required class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label>Số lượng (Quantity):</label>
            <input v-model.number="formSanPham.soLuong" type="number" required class="form-control">
          </div>
          <div class="form-group">
            <label>Giảm giá (Discount %):</label>
            <input v-model.number="formSanPham.giamGia" type="number" min="0" max="100" class="form-control">
          </div>
          <div class="form-group">
            <label>Hình ảnh (tối đa 5 hình):</label>
            <input type="file" @change="xuLyTaiHinhAnh" accept="image/jpeg,image/png,image/gif" multiple class="form-control">
            <small v-if="loiHinhAnh" class="text-danger">{{ loiHinhAnh }}</small>
            <div class="image-preview mt-2">
              <img v-for="(hinh, index) in formSanPham.hinhAnh" :key="index" :src="hinh" alt="Preview" style="max-width: 100px; margin: 5px;">
              <button v-if="formSanPham.hinhAnh.length > 0" @click="xoaTatCaHinhAnh" type="button" class="btn btn-sm btn-danger mt-2">Xóa tất cả hình</button>
            </div>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formSanPham.noiBat" class="me-2">
              Sản phẩm nổi bật (Featured)
            </label>
          </div>
          <button type="submit" class="btn btn-success">{{ sanPhamDangSua ? 'Cập nhật' : 'Thêm' }}</button>
        </form>
      </div>
    </div>
    
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Hình ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Danh mục</th>
          <th>Số lượng</th>
          <th>Giảm giá</th>
          <th>Nổi bật</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sanPham in danhSachSanPham" :key="sanPham.id" 
            :class="{'table-warning': sanPham.soLuong <= nguongSapHetHang && sanPham.soLuong > 0,
                      'table-danger': sanPham.soLuong === 0}">
          <td>{{ sanPham.id }}</td>
          <td>
            <img v-if="sanPham.hinhAnh && sanPham.hinhAnh.length > 0" :src="sanPham.hinhAnh[0]" alt="Ảnh sản phẩm" style="width: 50px; height: 50px; object-fit: cover;">
          </td>
          <td>{{ sanPham.ten }}</td>
          <td>${{ sanPham.gia }}</td>
          <td>{{ sanPham.danhMuc }}</td>
          <td>
            {{ sanPham.soLuong }}
            <span v-if="sanPham.soLuong <= nguongSapHetHang && sanPham.soLuong > 0" class="badge bg-warning text-dark ms-2">Sắp hết</span>
            <span v-if="sanPham.soLuong === 0" class="badge bg-danger ms-2">Hết hàng</span>
          </td>
          <td>{{ sanPham.giamGia }}%</td>
          <td>
            <span v-if="sanPham.noiBat" class="badge bg-success">Có</span>
            <span v-else class="badge bg-secondary">Không</span>
          </td>
          <td>
            <button @click="suaSanPham(sanPham)" class="btn btn-warning btn-sm me-1" title="Sửa"><i class="fas fa-edit"></i></button>
            <button @click="xoaSanPham(sanPham.id)" class="btn btn-danger btn-sm" title="Xóa"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../../../../axios.js'

export default {
  name: 'AdminQuanLySanPham', // Tên component
  data() {
    return {
      danhSachSanPham: [], // Mảng lưu danh sách sản phẩm từ API
      danhSachDanhMuc: [], // Mảng lưu danh sách danh mục từ API
      hienThiForm: false, // Biến cờ điều khiển modal (false là ẩn)
      sanPhamDangSua: null, // Lưu thông tin sản phẩm đang sửa (null nếu đang thêm mới)
      idTiepTheo: 1, // ID tự động tăng cho sản phẩm mới
      loiHinhAnh: '', // Chuỗi lưu thông báo lỗi khi tải hình
      nguongSapHetHang: 10, // Ngưỡng mặc định, có thể thay đổi bằng input
      formSanPham: { // Đối tượng lưu dữ liệu từ form thêm/sửa
        ten: '',
        gia: 0,
        danhMuc: '',
        moTa: '',
        soLuong: 0,
        giamGia: 0,
        hinhAnh: [], // Sẽ lưu các chuỗi Base64 của hình ảnh
        noiBat: false
      }
    };
  },
  // Hàm chạy khi component được tạo
  mounted() {
    this.taiDanhSachSanPham();
    this.taiDanhSachDanhMuc();
  },
  // Theo dõi sự thay đổi của danhSachSanPham
  watch: {
    danhSachSanPham: {
      // Hàm handler sẽ chạy mỗi khi danhSachSanPham thay đổi
      handler(danhSachMoi) {
        // Tính toán ID tiếp theo dựa trên ID lớn nhất hiện có
        if (danhSachMoi.length > 0) {
          const maxId = Math.max(...danhSachMoi.map(p => parseInt(p.id) || 0));
          this.idTiepTheo = maxId + 1;
        } else {
          this.idTiepTheo = 1;
        }
      },
      immediate: true // Chạy ngay lần đầu khi component được tải
    }
  },
  methods: {
    // Tải danh sách sản phẩm từ API
    taiDanhSachSanPham() {
      axios.get('/products')
        .then(response => {
          // Gán dữ liệu trả về vào biến trong data
          // Đổi tên các trường dữ liệu từ API (nếu cần) để khớp với template
          this.danhSachSanPham = response.data.map(sp => ({
            id: sp.id,
            ten: sp.title, // Đổi 'title' -> 'ten'
            gia: sp.price, // Đổi 'price' -> 'gia'
            danhMuc: sp.category, // Đổi 'category' -> 'danhMuc'
            moTa: sp.description, // Đổi 'description' -> 'moTa'
            soLuong: sp.quantity, // Đổi 'quantity' -> 'soLuong'
            giamGia: sp.discount, // Đổi 'discount' -> 'giamGia'
            hinhAnh: sp.images, // Đổi 'images' -> 'hinhAnh'
            noiBat: sp.featured // Đổi 'featured' -> 'noiBat'
          }));
        })
        .catch(error => {
          console.error("Lỗi tải sản phẩm:", error);
          this.$toast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sản phẩm!');
        });
    },
    // Tải danh sách danh mục từ API (để dùng trong dropdown)
    taiDanhSachDanhMuc() {
      axios.get('/categories')
        .then(response => {
          this.danhSachDanhMuc = response.data;
        })
        .catch(error => {
          console.error("Lỗi tải danh mục:", error);
          this.$toast.error('Lỗi tải danh mục', 'Không thể tải danh sách danh mục!');
        });
    },
    // Xử lý khi người dùng chọn tệp hình ảnh
    xuLyTaiHinhAnh(event) {
      this.loiHinhAnh = ''; // Xóa lỗi cũ
      const cacTepTin = Array.from(event.target.files); // Lấy danh sách tệp
      
      // Kiểm tra giới hạn 5 hình
      if (this.formSanPham.hinhAnh.length + cacTepTin.length > 5) {
        this.loiHinhAnh = `Bạn chỉ có thể tải lên tối đa 5 hình ảnh.`;
        // Xóa các tệp đã chọn trong input
        event.target.value = null;
        return;
      }

      // Đọc từng tệp và chuyển thành Base64 để hiển thị preview
      cacTepTin.forEach(tep => {
        const trinhDocFile = new FileReader();
        // Khi đọc xong...
        trinhDocFile.onload = (e) => {
          // Thêm chuỗi Base64 (e.target.result) vào mảng hinhAnh
          this.formSanPham.hinhAnh.push(e.target.result);
        };
        // Bắt đầu đọc tệp
        trinhDocFile.readAsDataURL(tep);
      });

      // Xóa các tệp đã chọn trong input để người dùng có thể chọn thêm
      event.target.value = null;
    },
    // Xóa tất cả hình ảnh đã xem trước trong form
    xoaTatCaHinhAnh() {
      this.formSanPham.hinhAnh = [];
    },
    // Lưu sản phẩm (thêm mới hoặc cập nhật)
    async luuSanPham() {
      // Chuẩn bị dữ liệu để gửi đi
      // Đổi tên lại các trường để khớp với API (db.json)
      const duLieuSanPham = {
        id: this.sanPhamDangSua ? this.sanPhamDangSua.id : this.idTiepTheo.toString(),
        title: this.formSanPham.ten,
        price: this.formSanPham.gia,
        category: this.formSanPham.danhMuc,
        description: this.formSanPham.moTa,
        quantity: this.formSanPham.soLuong,
        discount: this.formSanPham.giamGia,
        images: this.formSanPham.hinhAnh,
        featured: this.formSanPham.noiBat
      };

      try {
        if (this.sanPhamDangSua) {
          // Nếu đang SỬA -> dùng PUT
          await axios.put(`/products/${this.sanPhamDangSua.id}`, duLieuSanPham);
          this.$toast.success('Cập nhật thành công!');
        } else {
          // Nếu đang THÊM MỚI -> dùng POST
          await axios.post('/products', duLieuSanPham);
          this.$toast.success('Thêm sản phẩm thành công!');
        }
        this.taiDanhSachSanPham(); // Tải lại danh sách sản phẩm
        this.datLaiForm(); // Xóa form và đóng modal
      } catch (error) {
        console.error("Lỗi lưu sản phẩm:", error);
        this.$toast.error('Lỗi lưu sản phẩm!');
      }
    },
    // Mở modal SỬA và điền thông tin sản phẩm
    suaSanPham(sanPham) {
      this.sanPhamDangSua = sanPham; // Đánh dấu là đang sửa
      // Sao chép (copy) thông tin sản phẩm vào form
      // Quan trọng: Phải tạo bản sao của mảng hình ảnh [...sanPham.hinhAnh]
      // để tránh việc sửa mảng gốc
      this.formSanPham = { 
        ...sanPham, 
        hinhAnh: Array.isArray(sanPham.hinhAnh) ? [...sanPham.hinhAnh] : [] 
      };
      this.hienThiForm = true; // Hiển thị modal
    },
    // Xóa sản phẩm
    xoaSanPham(id) {
      if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        axios.delete(`/products/${id}`)
          .then(() => {
            this.taiDanhSachSanPham(); // Tải lại danh sách
            this.$toast.success('Xóa sản phẩm thành công!');
          })
          .catch(() => this.$toast.error('Xóa sản phẩm thất bại!'));
      }
    },
    // Đặt lại form về trạng thái ban đầu
    datLaiForm() {
      this.formSanPham = { ten: '', gia: 0, danhMuc: '', moTa: '', soLuong: 0, giamGia: 0, hinhAnh: [], noiBat: false };
      this.sanPhamDangSua = null; // Reset trạng thái đang sửa
      this.hienThiForm = false; // Đóng modal
      this.loiHinhAnh = ''; // Xóa thông báo lỗi hình
    }
  },
};
</script>

<style scoped>
/* CSS cho Modal (cửa sổ nổi) */
.modal {
  display: block; /* Luôn hiển thị khi v-if=true */
  position: fixed; /* Cố định trên màn hình */
  z-index: 1050; /* Nằm trên cùng */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto; /* Cho phép cuộn nếu nội dung dài */
  background-color: rgba(0, 0, 0, 0.4); /* Lớp nền mờ */
}

/* Nội dung bên trong modal */
.modal-content {
  background-color: #fefefe; /* Nền trắng */
  margin: 10% auto; /* Canh giữa (10% từ trên xuống) */
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 700px; /* Giới hạn chiều rộng tối đa */
  border-radius: 8px; /* Bo góc */
}

/* Nút đóng (dấu X) */
.close {
  color: #aaa;
  float: right; /* Nằm bên phải */
  font-size: 28px;
  font-weight: bold;
  cursor: pointer; /* Biểu tượng bàn tay khi di chuột */
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

/* Khoảng cách giữa các dòng trong form */
.form-group {
  margin-bottom: 15px;
}

/* Xem trước hình ảnh */
.image-preview img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  object-fit: cover;
  height: 100px;
  width: 100px;
}

/* Thêm style cho hàng bị cảnh báo */
/* (Bootstrap đã có .table-warning, .table-danger nhưng thêm !important để chắc chắn) */
tr.table-warning {
  background-color: #fff3cd !important;
}
tr.table-danger {
  background-color: #f8d7da !important;
}
</style>