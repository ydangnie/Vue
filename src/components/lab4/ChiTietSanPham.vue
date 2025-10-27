<template>
  <div class="chi-tiet-san-pham">
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/san-pham">Sản phẩm</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ chiTietSanPham?.title || 'Đang tải...' }}</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-md-6">
          <div class="product-images">
            <div class="main-image mb-3">
              <img :src="hinhAnhDuocChon" alt="Ảnh sản phẩm chính" class="img-fluid rounded shadow-sm">
            </div>
            <div v-if="chiTietSanPham.images && chiTietSanPham.images.length > 1" class="thumbnail-images d-flex gap-2 flex-wrap">
              <img v-for="(hinh, index) in chiTietSanPham.images" :key="index"
                   :src="hinh" alt="Ảnh thumbnail" class="thumbnail-img"
                   :class="{ active: hinhAnhDuocChon === hinh }" @click="hinhAnhDuocChon = hinh"> </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="product-info">
            <h1 class="product-title mb-3">{{ chiTietSanPham.title }}</h1>

            <div class="price-section mb-4">
              <span v-if="chiTietSanPham.discount > 0" class="original-price h4 text-muted text-decoration-line-through me-3">
                ${{ chiTietSanPham.price?.toFixed(2) }} </span>
              <span class="final-price h2 text-danger">
                ${{ (chiTietSanPham.price * (1 - chiTietSanPham.discount / 100))?.toFixed(2) }} </span>
              <span v-if="chiTietSanPham.discount > 0" class="discount-badge ms-3">
                -{{ chiTietSanPham.discount }}%
              </span>
            </div>

            <div class="product-meta mb-4">
              <p><strong>Danh mục:</strong> <span class="badge bg-primary">{{ chiTietSanPham.category }}</span></p>
              <p><strong>Số lượng còn:</strong>
                <span :class="chiTietSanPham.quantity > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'"> {{ chiTietSanPham.quantity > 0 ? chiTietSanPham.quantity + ' sản phẩm' : 'Hết hàng' }}
                </span>
              </p>
              <p v-if="chiTietSanPham.featured" class="text-warning"><i class="fas fa-star me-1"></i> Sản phẩm nổi bật</p>
            </div>

            <div class="product-description mb-4">
              <h5>Mô tả sản phẩm</h5>
              <p>{{ chiTietSanPham.description }}</p>
            </div>

            <div class="mb-4" v-if="chiTietSanPham.quantity > 0">
                <label class="form-label fw-bold">Số lượng:</label>
                <div class="quantity-controls d-flex align-items-center">
                  <button @click="giamSoLuong" class="btn btn-outline-secondary btn-sm" :disabled="soLuongThem <= 1">-</button>
                  <input type="number" v-model.number="soLuongThem" class="form-control form-control-sm quantity-input mx-2"
                         min="1" :max="chiTietSanPham.quantity">
                  <button @click="tangSoLuong" class="btn btn-outline-secondary btn-sm" :disabled="soLuongThem >= chiTietSanPham.quantity">+</button>
                </div>
            </div>

            <div class="action-buttons d-flex flex-wrap gap-2"> <button @click="xuLyThemVaoGioHang" class="btn btn-primary btn-lg flex-grow-1" :disabled="dangThemVaoGio || chiTietSanPham.quantity <= 0">
                <span v-if="dangThemVaoGio" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i class="fas fa-cart-plus me-2"></i>
                {{ dangThemVaoGio ? 'Đang thêm...' : (chiTietSanPham.quantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng') }}
              </button>
              <button @click="xuLyToggleYeuThich" :class="['btn btn-lg', daCoTrongYeuThich ? 'btn-danger' : 'btn-outline-danger']" :disabled="!daDangNhap" title="Yêu thích"> <i :class="['fas fa-heart', daCoTrongYeuThich ? '' : 'far fa-heart']"></i> </button>
            </div>
             <small v-if="!daDangNhap" class="text-muted d-block mt-2">
                Vui lòng <router-link to="/login">đăng nhập</router-link> để thêm vào yêu thích.
             </small>

          </div>
        </div>
      </div>

      <div class="product-reviews mt-5 card">
        <div class="card-header">
            <h3 class="mb-0">Đánh giá sản phẩm</h3>
        </div>
        <div class="card-body">
            <div class="mb-4" v-if="daDangNhap">
              <h5 class="card-title">Viết đánh giá của bạn</h5>
              <form @submit.prevent="guiDanhGia">
                <div class="mb-3">
                    <label class="form-label d-block">Xếp hạng</label> <div>
                      <i v-for="n in 5" :key="'star-' + n"
                         :class="['fas fa-star', n <= danhGiaMoi.xepHang ? 'text-warning' : 'text-muted']"
                         @click="danhGiaMoi.xepHang = n"
                         style="cursor: pointer; font-size: 1.5rem; margin-right: 5px;"></i> </div>
                </div>
                <div class="mb-3">
                    <label for="reviewComment" class="form-label">Bình luận</label>
                    <textarea v-model="danhGiaMoi.binhLuan" id="reviewComment" class="form-control" rows="3" required placeholder="Chia sẻ cảm nhận của bạn..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-paper-plane me-2"></i>Gửi đánh giá
                </button>
              </form>
            </div>
            <div v-else class="alert alert-info">
                Vui lòng <router-link to="/login">đăng nhập</router-link> để viết đánh giá.
            </div>

            <hr v-if="daDangNhap && chiTietSanPham.reviews && chiTietSanPham.reviews.length > 0"> <div v-if="chiTietSanPham.reviews && chiTietSanPham.reviews.length > 0">
              <h5 class="mb-3">Các đánh giá hiện có ({{ chiTietSanPham.reviews.length }})</h5>
              <div v-for="(danhGia, index) in danhSachDanhGiaDaSapXep" :key="'review-' + index" class="review-item border-bottom pb-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2"> <strong><i class="fas fa-user-circle me-2"></i>{{ danhGia.author }}</strong>
                    <div class="rating">
                      <i v-for="n in 5" :key="'rated-' + n" :class="['fas fa-star', n <= danhGia.rating ? 'text-warning' : 'text-muted']" style="font-size: 0.9rem;"></i> </div>
                  </div>
                  <p class="mb-1">{{ danhGia.comment }}</p>
                  <small class="text-muted">{{ dinhDangNgayGio(danhGia.date) }}</small> </div>
            </div>
            <div v-else class="text-center py-4">
                <p class="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
        </div>
      </div>


      <SanPhamLienQuan :current-product-id="chiTietSanPham.id" :category="chiTietSanPham.category" />

    </div>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../axios.js';
// Import các helpers từ Vuex
import { mapActions, mapGetters, mapState } from 'vuex';
// Import component SanPhamLienQuan
import SanPhamLienQuan from './SanPhamLienQuan.vue';

export default {
  name: 'ChiTietSanPham', // Tên component
  components: {
    SanPhamLienQuan // Đăng ký component con
  },
  data() {
    return {
      // Object lưu trữ thông tin chi tiết sản phẩm lấy từ API
      chiTietSanPham: {},
      // URL của hình ảnh đang được hiển thị lớn
      hinhAnhDuocChon: '',
      // Cờ báo hiệu đang xử lý thêm vào giỏ hàng
      dangThemVaoGio: false,
      // Số lượng sản phẩm muốn thêm vào giỏ
      soLuongThem: 1,
      // Object lưu dữ liệu form đánh giá mới
      danhGiaMoi: {
        xepHang: 5, // Mặc định 5 sao
        binhLuan: ''
      }
    };
  },
  computed: {
    // Lấy getter 'isInWishlist' từ Vuex store
    ...mapGetters(['isInWishlist']),
    // Lấy state 'user' từ Vuex store
    ...mapState(['user']), // Tên state là 'user'

    // Computed property kiểm tra người dùng đã đăng nhập hay chưa
    daDangNhap() {
      // !!this.user chuyển đổi giá trị user (object hoặc null) thành boolean
      return !!this.user;
    },
    // Computed property kiểm tra sản phẩm hiện tại có trong danh sách yêu thích không
    daCoTrongYeuThich() {
        // Kiểm tra xem chiTietSanPham đã có dữ liệu và id chưa
        if (this.chiTietSanPham && this.chiTietSanPham.id) {
            // Gọi getter isInWishlist với id sản phẩm hiện tại
            return this.isInWishlist(this.chiTietSanPham.id);
        }
        return false; // Trả về false nếu chưa có dữ liệu sản phẩm
    },
    // Computed property để sắp xếp danh sách đánh giá (mới nhất lên đầu)
    danhSachDanhGiaDaSapXep() {
       if (this.chiTietSanPham.reviews && Array.isArray(this.chiTietSanPham.reviews)) {
          // Tạo bản sao và đảo ngược thứ tự
          return [...this.chiTietSanPham.reviews].reverse();
       }
       return []; // Trả về mảng rỗng nếu không có đánh giá
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiChiTietSanPham(); // Tải dữ liệu chi tiết sản phẩm
  },
  methods: {
    // Map các actions từ Vuex store vào methods của component
    ...mapActions({
      themVaoGioAction: 'addToCart', // Map 'addToCart' thành 'themVaoGioAction'
      toggleYeuThichAction: 'toggleWishlist' // Map 'toggleWishlist' thành 'toggleYeuThichAction'
    }),

    // Hàm tải chi tiết sản phẩm từ API dựa vào ID trên URL
    taiChiTietSanPham() {
      const idSanPham = this.$route.params.id; // Lấy ID từ route parameter
       if (!idSanPham) {
           console.error("Không tìm thấy ID sản phẩm trong URL.");
           // Có thể chuyển hướng về trang lỗi hoặc trang sản phẩm
           this.$router.push('/san-pham');
           return;
       }
      axios.get(`/products/${idSanPham}`)
        .then(response => {
          this.chiTietSanPham = response.data; // Lưu dữ liệu vào biến
          // Đặt ảnh hiển thị chính là ảnh đầu tiên (nếu có)
          this.hinhAnhDuocChon = (this.chiTietSanPham.images && this.chiTietSanPham.images.length > 0)
                                ? this.chiTietSanPham.images[0]
                                : 'https://via.placeholder.com/600x400?text=No+Image'; // Ảnh mặc định nếu không có
          // Reset số lượng về 1 khi tải sản phẩm mới
          this.soLuongThem = 1;
        })
        .catch(error => {
            console.error('Lỗi tải chi tiết sản phẩm:', error);
            this.$toast.error('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
            // Chuyển hướng về trang sản phẩm nếu lỗi
            this.$router.push('/san-pham');
        });
    },
    // Hàm tăng số lượng muốn thêm (không vượt quá số lượng tồn kho)
    tangSoLuong() {
        if (this.soLuongThem < this.chiTietSanPham.quantity) {
          this.soLuongThem++;
        }
    },
    // Hàm giảm số lượng muốn thêm (không nhỏ hơn 1)
    giamSoLuong() {
        if (this.soLuongThem > 1) {
          this.soLuongThem--;
        }
    },
    // Hàm xử lý khi nhấn nút "Thêm vào giỏ hàng"
    async xuLyThemVaoGioHang() {
      // Không làm gì nếu đang xử lý hoặc hết hàng
      if (this.dangThemVaoGio || this.chiTietSanPham.quantity <= 0) return;

      this.dangThemVaoGio = true; // Bật cờ đang xử lý
      try {
        // Chuẩn bị dữ liệu sản phẩm để gửi cho action Vuex
        const sanPhamDeThem = {
           ...this.chiTietSanPham,
           stock: this.chiTietSanPham.quantity // Đảm bảo có trường stock nếu action cần
        };
        // Gọi action 'addToCart' (đã map thành themVaoGioAction)
        // Truyền vào sản phẩm và số lượng muốn thêm
        await this.themVaoGioAction({ product: sanPhamDeThem, quantity: this.soLuongThem });
        // Thông báo thành công
        this.$toast.success(`${this.soLuongThem} "${this.chiTietSanPham.title}" đã được thêm vào giỏ.`);
      } catch (error) {
        // Thông báo lỗi nếu action thất bại
        console.error("Lỗi thêm vào giỏ:", error);
        this.$toast.error('Thêm thất bại!', error.message || 'Số lượng trong giỏ đã đạt tối đa hoặc có lỗi xảy ra.');
      } finally {
        this.dangThemVaoGio = false; // Tắt cờ đang xử lý
      }
    },
    // Hàm xử lý khi nhấn nút "Yêu thích" / "Bỏ thích"
    xuLyToggleYeuThich() {
        // Nếu chưa đăng nhập, yêu cầu đăng nhập
        if(!this.daDangNhap) {
            this.$toast.warning("Vui lòng đăng nhập để sử dụng chức năng này!");
            // Có thể chuyển hướng đến trang login
            // this.$router.push('/login');
            return;
        }
        // Lưu trạng thái *trước khi* nhấn nút
        const daYeuThichTruocDo = this.daCoTrongYeuThich;

        // Gọi action 'toggleWishlist' (đã map thành toggleYeuThichAction)
        this.toggleYeuThichAction(this.chiTietSanPham);

        // Hiển thị thông báo dựa trên trạng thái *trước khi* nhấn nút
        if (daYeuThichTruocDo) {
            this.$toast.info(`Đã bỏ "${this.chiTietSanPham.title}" khỏi danh sách yêu thích.`);
        } else {
            this.$toast.success(`Đã thêm "${this.chiTietSanPham.title}" vào danh sách yêu thích!`);
        }
    },
    // Hàm xử lý khi gửi form đánh giá
    async guiDanhGia() {
      // Kiểm tra xem đã nhập bình luận chưa
      if (!this.danhGiaMoi.binhLuan.trim()) {
        this.$toast.error('Vui lòng nhập bình luận!');
        return;
      }
       // Kiểm tra xem đã chọn sao chưa
      if (this.danhGiaMoi.xepHang < 1 || this.danhGiaMoi.xepHang > 5) {
        this.$toast.error('Vui lòng chọn số sao đánh giá!');
        return;
      }
       // Kiểm tra đăng nhập (đã có v-if nhưng kiểm tra lại cho chắc)
      if (!this.daDangNhap) {
          this.$toast.error('Vui lòng đăng nhập để gửi đánh giá.');
          return;
      }

      // Tạo đối tượng đánh giá mới
      const duLieuDanhGia = {
        author: this.user.username, // Lấy username từ Vuex state
        rating: this.danhGiaMoi.xepHang,
        comment: this.danhGiaMoi.binhLuan,
        date: new Date().toISOString() // Lấy thời gian hiện tại
      };

      // Tạo mảng đánh giá mới (kết hợp đánh giá cũ và mới)
      // Nếu chưa có đánh giá nào (this.chiTietSanPham.reviews là undefined/null), tạo mảng mới
      const danhGiaDaCapNhat = this.chiTietSanPham.reviews ? [...this.chiTietSanPham.reviews, duLieuDanhGia] : [duLieuDanhGia];

      try {
        // Gửi yêu cầu PATCH đến API để cập nhật trường 'reviews' của sản phẩm
        await axios.patch(`/products/${this.chiTietSanPham.id}`, { reviews: danhGiaDaCapNhat });

        // Cập nhật lại mảng reviews trong data của component để giao diện thay đổi ngay lập tức
        this.chiTietSanPham.reviews = danhGiaDaCapNhat;

        // Reset form đánh giá
        this.danhGiaMoi.xepHang = 5;
        this.danhGiaMoi.binhLuan = '';

        // Thông báo thành công
        this.$toast.success('Gửi đánh giá thành công! Cảm ơn bạn.');
      } catch (error) {
        console.error("Lỗi gửi đánh giá:", error);
        this.$toast.error('Có lỗi xảy ra khi gửi đánh giá.');
      }
    },
     // Hàm định dạng ngày giờ cho đánh giá
    dinhDangNgayGio(dateString) {
      if (!dateString) return '';
      try {
         return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
         });
      } catch (e) {
         return dateString;
      }
    }
  },
  // Theo dõi sự thay đổi của route parameter 'id'
  watch: {
    // Nếu ID trên URL thay đổi (ví dụ: người dùng click vào sản phẩm liên quan)
    '$route.params.id'(newId, oldId) {
      // Chỉ tải lại nếu ID thực sự thay đổi
      if (newId !== oldId) {
         this.taiChiTietSanPham(); // Gọi lại hàm tải dữ liệu
      }
    },
     // Theo dõi và giới hạn giá trị của soLuongThem
    soLuongThem(newValue) {
        // Đảm bảo không vượt quá số lượng tồn kho
        if (this.chiTietSanPham && newValue > this.chiTietSanPham.quantity) {
          this.soLuongThem = this.chiTietSanPham.quantity;
          this.$toast.info(`Chỉ còn ${this.chiTietSanPham.quantity} sản phẩm trong kho.`);
        }
        // Đảm bảo không nhỏ hơn 1
        if (newValue < 1) {
          this.soLuongThem = 1;
        }
    }
  }
};
</script>

<style scoped>
/* Container chính */
.chi-tiet-san-pham {
  padding: 30px 0;
  background-color: #f8f9fa; /* Nền xám nhạt */
}

/* Breadcrumb */
.breadcrumb {
  background-color: transparent; /* Nền trong suốt */
  padding: 0;
}
.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
}
.breadcrumb-item a:hover {
  color: #0d6efd;
}
.breadcrumb-item.active {
  color: #343a40; /* Màu đậm hơn cho trang hiện tại */
  font-weight: 500;
}

/* Ảnh chính */
.main-image img {
  width: 100%;
  max-height: 500px; /* Giới hạn chiều cao ảnh chính */
  object-fit: contain; /* Hiển thị toàn bộ ảnh, có thể có khoảng trắng */
  border: 1px solid #dee2e6; /* Viền nhẹ */
}

/* Ảnh thumbnail */
.thumbnail-img {
  width: 80px; /* Kích thước thumbnail */
  height: 80px;
  object-fit: cover; /* Cắt ảnh thumbnail cho vừa */
  border-radius: 5px; /* Bo góc */
  cursor: pointer;
  border: 2px solid transparent; /* Viền trong suốt ban đầu */
  transition: border-color 0.2s ease; /* Hiệu ứng chuyển viền */
}
.thumbnail-img:hover {
  border-color: #adb5bd; /* Viền xám khi hover */
}
.thumbnail-img.active {
  border-color: #0d6efd; /* Viền xanh khi được chọn */
}

/* Thông tin sản phẩm */
.product-info {
  background-color: #fff; /* Nền trắng */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Bóng đổ */
}

.product-title {
  font-weight: 600;
  color: #343a40;
}

/* Giá */
.original-price {
  text-decoration: line-through; /* Gạch ngang giá gốc */
}
.final-price {
   font-weight: 700;
}
.discount-badge {
  background-color: #dc3545; /* Nền đỏ */
  color: white;
  padding: 0.3em 0.6em;
  border-radius: 0.25rem;
  font-size: 0.9em;
  font-weight: 600;
}

/* Meta (danh mục, số lượng) */
.product-meta p {
  margin-bottom: 0.5rem;
  color: #495057;
}
.product-meta strong {
   margin-right: 5px;
}

/* Mô tả */
.product-description h5 {
  margin-bottom: 10px;
  font-weight: 600;
}
.product-description p {
  color: #6c757d;
  line-height: 1.6;
}

/* Điều khiển số lượng */
.quantity-controls .quantity-input {
  width: 60px; /* Chiều rộng input số lượng */
  text-align: center; /* Căn giữa số */
}
/* Loại bỏ mũi tên lên/xuống của input number */
.quantity-controls input[type=number]::-webkit-inner-spin-button,
.quantity-controls input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.quantity-controls input[type=number] {
  -moz-appearance: textfield; /* Firefox */
}


/* Nút hành động */
.btn-lg {
   padding: 0.75rem 1.25rem; /* Tăng kích thước nút lớn */
   font-size: 1rem;
}
.btn-primary {
   background: linear-gradient(135deg, #747578 0%, #000000 100%);
   border: none;
}
.btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a6a78 0%, #333333 100%);
    transform: translateY(-2px);
}
.btn-danger { /* Nút đã yêu thích */
   background-color: #dc3545;
   border-color: #dc3545;
   color: white; /* Đảm bảo icon màu trắng */
}
.btn-outline-danger { /* Nút chưa yêu thích */
    color: #dc3545;
    border-color: #dc3545;
}
.btn-outline-danger:hover {
    background-color: #dc3545;
    color: white; /* Đổi màu chữ khi hover */
}
.btn:disabled { /* Style chung cho nút bị vô hiệu hóa */
   cursor: not-allowed;
   opacity: 0.65;
}

/* Phần đánh giá */
.product-reviews {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* Đảm bảo bo góc cho header */
}
.product-reviews .card-header {
   background-color: #e9ecef; /* Nền header xám nhạt */
}
.review-item strong {
  color: #343a40;
}
.review-item p {
  color: #495057;
  margin-top: 5px; /* Thêm khoảng cách trên */
}
.review-item .rating {
   font-size: 0.9rem; /* Giảm kích thước sao trong đánh giá cũ */
}
.review-item small {
  font-size: 0.8rem; /* Giảm kích thước ngày tháng */
}

/* Responsive */
@media (max-width: 768px) {
  .product-info {
    margin-top: 30px; /* Thêm khoảng cách trên mobile */
  }
  .action-buttons {
     flex-direction: column; /* Xếp chồng nút trên mobile */
  }
  .action-buttons .btn {
     width: 100%; /* Nút chiếm toàn bộ chiều rộng */
     margin-bottom: 10px;
  }
   .action-buttons .btn:last-child {
     margin-bottom: 0;
  }
}
</style>