<template>
  <div class="trang-chu">
    <section class="hero-section text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h3 class="display-4 fw-bold mb-4">
              <span>AZALMAN STORE</span> <br><span id="chao">Chào mừng!</span> </h3>
            <p class="lead mb-4">Khám phá ngay bộ sưu tập sản phẩm chất lượng cao, đa dạng mẫu mã.</p>
            <router-link to="/san-pham" class="btn btn-light btn-lg btn-hero"> <i class="fas fa-shopping-bag me-2"></i> Mua sắm ngay
            </router-link>
          </div>
          <div class="col-lg-6 d-none d-lg-block"> <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Sản phẩm nổi bật" class="img-fluid rounded shadow-lg hero-image"> </div>
        </div>
      </div>
    </section>

    <section class="san-pham-noi-bat py-5">
      <div class="container">
        <h2 class="text-center mb-5 section-title">Sản phẩm nổi bật</h2>
        <div class="row">
          <div v-for="sanPham in sanPhamNoiBat" :key="sanPham.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 product-card">
              <div class="card-img-container">
                <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" class="card-img-top" :alt="sanPham.title">
                <img v-else src="https://via.placeholder.com/300x200/cccccc/ffffff?text=No+Image" class="card-img-top" :alt="sanPham.title"> <div v-if="sanPham.discount > 0" class="discount-badge">-{{ sanPham.discount }}%</div>
                <div class="featured-badge"><i class="fas fa-star me-1"></i>Nổi bật</div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ sanPham.title }}</h5>
                <p class="card-text text-muted small">{{ sanPham.category }}</p> <div class="price-section mb-3">
                  <span v-if="sanPham.discount > 0" class="original-price">${{ sanPham.price.toFixed(2) }}</span> <span class="final-price">${{ (sanPham.price * (1 - sanPham.discount / 100)).toFixed(2) }}</span>
                </div>
                <div class="mt-auto">
                  <router-link :to="'/chi-tiet-san-pham/' + sanPham.id" class="btn btn-dark w-100 btn-sm"> <i class="fas fa-eye me-1"></i>Xem chi tiết
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/san-pham" class="btn btn-outline-dark btn-lg"> <i class="fas fa-th-list me-2"></i> Xem tất cả sản phẩm </router-link>
        </div>
      </div>
    </section>

    <section class="danh-muc py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5 section-title">Danh mục sản phẩm</h2>
        <div class="row">
          <div v-for="danhMuc in danhSachDanhMuc" :key="danhMuc.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="category-card text-center p-4 bg-white rounded shadow-sm">
              <i class="fas fa-tag fa-3x text-secondary mb-3"></i> <h5>{{ danhMuc.name }}</h5>
              <router-link :to="'/san-pham?category=' + encodeURIComponent(danhMuc.name)" class="btn btn-outline-dark mt-2"> <i class="fas fa-search me-1"></i>Xem sản phẩm </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
       <GoiYSanPhamAI />
    </div>


    <section class="thong-ke py-5">
      <div class="container">
        <h2 class="text-center mb-5 section-title">Thông tin cửa hàng</h2> <div class="row text-center">
          <div class="col-md-3 col-6 mb-4"> <div class="stat-item">
              <i class="fas fa-box-open fa-3x text-dark mb-3"></i> <h3>{{ tongSoSanPham }}</h3> <p>Sản phẩm</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-4"> <div class="stat-item">
              <i class="fas fa-stream fa-3x text-dark mb-3"></i> <h3>{{ tongSoDanhMuc }}</h3> <p>Danh mục</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-4"> <div class="stat-item">
              <i class="fas fa-award fa-3x text-dark mb-3"></i> <h3>{{ tongSanPhamNoiBat }}</h3> <p>Sản phẩm nổi bật</p>
            </div>
          </div>
          <div class="col-md-3 col-6 mb-4"> <div class="stat-item">
              <i class="fas fa-users fa-3x text-dark mb-3"></i> <h3>1000+</h3>
              <p>Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../axios.js';
// Import component GoiYSanPhamAI (đã đổi tên)
import GoiYSanPhamAI from './GoiYSanPham.vue';

export default {
  name: 'Home', // Tên component
  components: {
    GoiYSanPhamAI // Đăng ký component con
  },
  data() {
    return {
      // Mảng lưu trữ tất cả sản phẩm
      danhSachSanPham: [],
      // Mảng lưu trữ tất cả danh mục
      danhSachDanhMuc: [],
      // Mảng lưu trữ sản phẩm nổi bật (được lọc từ danhSachSanPham)
      // sanPhamNoiBat: [] // Không cần thiết vì sẽ dùng computed
    };
  },
  computed: {
     // Computed property để lọc ra sản phẩm nổi bật
     sanPhamNoiBat() {
        // Lọc từ danhSachSanPham những sản phẩm có thuộc tính featured = true
        // Slice(0, 8) để giới hạn chỉ hiển thị tối đa 8 sản phẩm nổi bật
        return this.danhSachSanPham.filter(sanPham => sanPham.featured).slice(0, 8);
     },
     // Computed property để lấy tổng số sản phẩm
     tongSoSanPham() {
        return this.danhSachSanPham.length;
     },
      // Computed property để lấy tổng số danh mục
     tongSoDanhMuc() {
        return this.danhSachDanhMuc.length;
     },
      // Computed property để lấy tổng số sản phẩm nổi bật
     tongSanPhamNoiBat() {
        // Có thể dùng trực tiếp computed sanPhamNoiBat đã có
        return this.sanPhamNoiBat.length;
     }
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiDuLieu(); // Gọi hàm tải dữ liệu
  },
  methods: {
    // Hàm tải đồng thời danh sách sản phẩm và danh mục
    async taiDuLieu() { // Chuyển sang async/await cho gọn
      try {
          // Sử dụng Promise.all để gọi 2 API cùng lúc
          const [phanHoiSanPham, phanHoiDanhMuc] = await Promise.all([
             axios.get('/products'),
             axios.get('/categories')
          ]);

          // Lưu dữ liệu vào data properties
          this.danhSachSanPham = phanHoiSanPham.data;
          this.danhSachDanhMuc = phanHoiDanhMuc.data;

          // Không cần lọc sản phẩm nổi bật ở đây nữa vì đã có computed property

      } catch (error) {
          console.error('Lỗi tải dữ liệu trang chủ:', error);
          // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
          this.$toast.error('Không thể tải dữ liệu trang chủ.');
      }
    }
    // Hàm loadData cũ (ít hiệu quả hơn vì gọi API tuần tự)
    /*
    loadData() {
      // Tải sản phẩm
      axios.get('/products')
        .then(response => {
          this.danhSachSanPham = response.data;
          // Lọc sản phẩm nổi bật
          // this.sanPhamNoiBat = this.danhSachSanPham.filter(product => product.featured); // Dùng computed thay thế
        })
        .catch(error => {
          console.error('Lỗi tải sản phẩm:', error);
        });

      // Tải danh mục
      axios.get('/categories')
        .then(response => {
          this.danhSachDanhMuc = response.data;
        })
        .catch(error => {
          console.error('Lỗi tải danh mục:', error);
        });
    }
    */
  }
};
</script>

<style scoped>
/* --- TỔNG QUAN --- */
.trang-chu { /* Đổi tên class gốc */
  color: #333; /* Màu chữ mặc định tối hơn */
}
a {
   text-decoration: none; /* Bỏ gạch chân link */
}
.section-title {
   font-weight: 700;
   color: #212529; /* Màu đen đậm */
   position: relative;
   padding-bottom: 15px;
   margin-bottom: 30px !important; /* Tăng khoảng cách dưới */
}
/* Gạch chân cách điệu cho tiêu đề */
.section-title::after {
   content: '';
   display: block;
   width: 60px;
   height: 4px;
   background-color: #343a40; /* Màu gạch chân đen */
   position: absolute;
   bottom: 0;
   left: 50%;
   transform: translateX(-50%);
   border-radius: 2px;
}


/* --- HERO SECTION --- */
.hero-section {
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%); /* Gradient đen xám đậm */
  min-height: 65vh; /* Tăng chiều cao */
  display: flex;
  align-items: center;
  color: #f8f9fa; /* Màu chữ trắng nhạt */
}
.hero-section .display-4 {
   line-height: 1.2; /* Giảm khoảng cách dòng */
}
.hero-section .lead {
   color: #ced4da; /* Màu chữ phụ xám nhạt */
   font-size: 1.1rem;
}
.btn-hero { /* Nút Mua sắm ngay */
   background-color: #f8f9fa; /* Nền trắng */
   color: #212529; /* Chữ đen */
   font-weight: 600;
   padding: 0.8rem 2rem; /* Tăng kích thước nút */
   border-radius: 50px; /* Bo tròn nhiều hơn */
   transition: all 0.3s ease;
   box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}
.btn-hero:hover {
   background-color: #e2e6ea; /* Màu nền khi hover */
   transform: translateY(-3px);
   box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}
.hero-image {
   border-radius: 15px !important; /* Bo góc ảnh */
}

/* --- SẢN PHẨM NỔI BẬT --- */
.san-pham-noi-bat {
  background: #ffffff; /* Nền trắng */
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Hiệu ứng nhanh hơn */
  border: 1px solid #dee2e6; /* Viền xám nhạt */
  border-radius: 8px; /* Giảm bo góc */
  overflow: hidden;
  background-color: #fff;
}

.product-card:hover {
  transform: translateY(-4px); /* Nhấc lên ít hơn */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ hơn */
}

.card-img-container {
  position: relative;
  height: 220px; /* Tăng chiều cao ảnh */
  overflow: hidden;
  background-color: #f8f9fa; /* Màu nền cho ảnh */
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giữ cover */
  transition: transform 0.3s ease, filter 0.3s ease; /* Thêm filter */
}

.product-card:hover .card-img-top {
  transform: scale(1.03); /* Zoom ít hơn */
  filter: brightness(1.05); /* Sáng hơn chút khi hover */
}

/* Huy hiệu */
.discount-badge, .featured-badge {
  position: absolute;
  top: 12px;
  padding: 4px 12px; /* Điều chỉnh padding */
  border-radius: 4px; /* Bo góc ít hơn */
  font-size: 0.75rem; /* Font nhỏ hơn */
  font-weight: 700; /* Chữ đậm */
  color: white;
  text-transform: uppercase;
}

.discount-badge {
  left: 12px;
  background: #dc3545; /* Đỏ */
}

.featured-badge {
  right: 12px;
  background: #ffc107; /* Vàng */
  color: #333; /* Chữ đen cho dễ đọc */
}
.featured-badge i {
   font-size: 0.7rem;
}


/* Nội dung thẻ sản phẩm */
.card-body {
   padding: 1rem; /* Giảm padding */
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
  color: #212529; /* Màu đen */
}

.card-text { /* Danh mục */
  font-size: 0.8rem; /* Nhỏ hơn */
  margin-bottom: 0.8rem;
  color: #6c757d; /* Xám */
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-height: 1.5em;
}

.original-price {
  text-decoration: line-through;
  color: #adb5bd; /* Xám nhạt hơn */
  font-size: 0.85rem;
}

.final-price {
  font-size: 1.15rem; /* Kích thước giá */
  font-weight: 700; /* Đậm hơn */
  color: #343a40; /* Màu đen */
}

/* Nút trong thẻ sản phẩm */
.product-card .btn-dark {
   background-color: #343a40; /* Nền đen */
   border-color: #343a40;
   color: #fff; /* Chữ trắng */
   font-weight: 500;
   transition: background-color 0.2s ease, border-color 0.2s ease;
}
.product-card .btn-dark:hover {
   background-color: #212529; /* Đen đậm hơn khi hover */
   border-color: #212529;
}
.product-card .btn-sm {
   font-size: 0.8rem;
   padding: 0.4rem 0.8rem;
}


/* Nút Xem tất cả */
.btn-outline-dark {
   color: #343a40;
   border-color: #343a40;
   font-weight: 600;
   transition: all 0.3s ease;
   border-width: 2px; /* Viền dày hơn */
}
.btn-outline-dark:hover {
   background-color: #343a40;
   color: #fff;
   transform: translateY(-2px);
}
.btn-outline-dark i {
   transition: transform 0.3s ease;
}
.btn-outline-dark:hover i {
    transform: translateX(3px); /* Icon dịch chuyển khi hover */
}


/* --- DANH MỤC SẢN PHẨM --- */
.danh-muc {
  background: #f8f9fa; /* Nền xám nhạt */
}
.danh-muc .section-title::after {
   background-color: #6c757d; /* Gạch chân xám */
}


.category-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e9ecef; /* Viền nhẹ */
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}
.category-card i {
   color: #6c757d !important; /* Màu icon xám */
   transition: color 0.3s ease;
}
.category-card h5 {
   font-weight: 600;
   margin-bottom: 1rem;
   color: #343a40;
}
.category-card:hover i {
    color: #343a40 !important; /* Đổi màu icon khi hover */
}


/* --- THỐNG KÊ --- */
.thong-ke {
   background-color: #e9ecef; /* Nền xám đậm hơn */
   color: #495057; /* Màu chữ tối hơn */
}
.thong-ke .section-title::after {
   background-color: #495057; /* Gạch chân tối hơn */
}

.stat-item {
  padding: 1.5rem 0; /* Giảm padding */
}
.stat-item i {
   color: #343a40 !important; /* Màu icon đen */
}

.stat-item h3 {
  font-size: 2.2rem; /* Giảm kích thước số */
  font-weight: 700; /* Đậm hơn */
  margin-bottom: 0.3rem;
  color: #212529; /* Màu đen */
}

.stat-item p {
  color: #6c757d; /* Màu xám */
  font-weight: 500;
  text-transform: uppercase; /* Viết hoa */
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

</style>