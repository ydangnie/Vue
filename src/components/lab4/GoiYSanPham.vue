<template>
  <div class="goi-y-san-pham-ai">
    <h3 class="section-title mb-4"><i class="fas fa-magic me-2"></i>Gợi ý sản phẩm cho bạn</h3>

    <div v-if="dangTai" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang phân tích sở thích của bạn...</p>
    </div>

    <div v-else-if="goiYAI.length > 0" class="ai-suggestions mb-4">
      <div class="suggestion-reason bg-light p-3 rounded mb-3 shadow-sm"> <h5><i class="fas fa-brain text-primary me-2"></i>Vì sao chúng tôi gợi ý?</h5>
        <p class="mb-0 small text-muted">{{ lyDoGoiY }}</p> </div>

      <div class="row">
        <div v-for="sanPham in goiYAI" :key="sanPham.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" class="card-img-top" :alt="sanPham.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="sanPham.title">
              <div v-if="sanPham.discount > 0" class="discount-badge">-{{ sanPham.discount }}%</div>
              <div class="ai-badge"><i class="fas fa-star me-1"></i>AI Gợi ý</div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ sanPham.title }}</h5>
              <p class="card-text text-muted small">{{ sanPham.category }}</p> <div class="price-section mb-3">
                <span v-if="sanPham.discount > 0" class="original-price">${{ sanPham.price.toFixed(2) }}</span> <span class="final-price">${{ (sanPham.price * (1 - sanPham.discount / 100)).toFixed(2) }}</span>
              </div>
              <div class="mt-auto">
                <router-link :to="'/chi-tiet-san-pham/' + sanPham.id" class="btn btn-primary w-100 btn-sm"> <i class="fas fa-eye me-1"></i>Xem chi tiết
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!coDuLieuNguoiDung" class="text-center py-4 alert alert-info"> <i class="fas fa-user-edit fa-3x text-info mb-3"></i> <h5>Cập nhật thông tin cá nhân</h5>
      <p class="text-muted">Hãy cập nhật tuổi, giới tính và sở thích (trong phần Sản phẩm mong muốn) để nhận gợi ý sản phẩm phù hợp hơn nhé!</p>
      <router-link to="/cap-nhat-user" class="btn btn-info text-white"> <i class="fas fa-pen me-2"></i>Cập nhật ngay
      </router-link>
    </div>

    <div v-else class="text-center py-4 alert alert-secondary"> <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h5>Không tìm thấy gợi ý phù hợp</h5>
      <p class="text-muted">Chúng tôi chưa tìm được sản phẩm nào thực sự phù hợp với sở thích của bạn lúc này. Hãy thử cập nhật thông tin cá nhân hoặc khám phá thêm sản phẩm nhé.</p>
       <router-link to="/san-pham" class="btn btn-secondary mt-2"> <i class="fas fa-store me-2"></i>Khám phá sản phẩm
       </router-link>
    </div>
  </div>
</template>

<script>
// Import axios đã cấu hình
import axios from '../../../axios.js';

export default {
  name: 'GoiYSanPhamAI', // Tên component
  data() {
    return {
      // Mảng lưu trữ danh sách sản phẩm AI gợi ý
      goiYAI: [],
      // Chuỗi giải thích lý do gợi ý
      lyDoGoiY: '',
      // Cờ báo hiệu đang tải và phân tích dữ liệu
      dangTai: false,
      // Object lưu trữ thông tin người dùng lấy từ localStorage
      nguoiDung: null
    };
  },
  computed: {
    // Computed property kiểm tra xem người dùng đã cung cấp đủ thông tin để gợi ý chưa
    coDuLieuNguoiDung() {
      // Trả về true nếu có thông tin người dùng VÀ có ít nhất 1 trong 3 trường: tuổi, giới tính, sở thích
      return this.nguoiDung && (this.nguoiDung.age || this.nguoiDung.gender || this.nguoiDung.desiredProducts);
    }
  },
  // Hàm chạy sau khi component được tạo và gắn vào trang
  mounted() {
    this.taiDuLieuNguoiDung(); // Tải thông tin người dùng từ localStorage
    this.taoGoiYAI(); // Bắt đầu quá trình tạo gợi ý
  },
  methods: {
    // Hàm tải thông tin người dùng từ localStorage
    taiDuLieuNguoiDung() {
       try {
         // Đọc dữ liệu 'user' từ localStorage, nếu không có thì trả về 'null' (dạng chuỗi)
         const userDataString = localStorage.getItem('user') || 'null';
         // Chuyển chuỗi JSON thành object JavaScript
         this.nguoiDung = JSON.parse(userDataString);
       } catch (e) {
          console.error("Lỗi đọc dữ liệu người dùng:", e);
          this.nguoiDung = null; // Đặt là null nếu có lỗi
       }
    },
    // Hàm chính để tạo gợi ý (giả lập AI)
    async taoGoiYAI() {
      // Nếu không có đủ dữ liệu người dùng thì không làm gì cả
      if (!this.coDuLieuNguoiDung) {
         console.log("Không đủ dữ liệu người dùng để tạo gợi ý.");
         return;
      }

      this.dangTai = true; // Bắt đầu trạng thái tải
      this.goiYAI = []; // Xóa gợi ý cũ (nếu có)
      this.lyDoGoiY = ''; // Xóa lý do cũ

      try {
        // 1. Tải danh sách tất cả sản phẩm từ API
        const phanHoiSanPham = await axios.get('/products');
        const tatCaSanPham = phanHoiSanPham.data;

        // 2. Phân tích sở thích và chấm điểm sản phẩm (hàm giả lập AI)
        const goiYDaChamDiem = this.phanTichSoThichNguoiDung(tatCaSanPham);

        // 3. Lấy ra tối đa 4 sản phẩm có điểm cao nhất
        this.goiYAI = goiYDaChamDiem.slice(0, 4);

        // 4. Tạo câu giải thích lý do gợi ý
        this.lyDoGoiY = this.taoLyDoGoiY();

      } catch (error) {
        console.error('Lỗi khi tạo gợi ý AI:', error);
        this.goiYAI = []; // Đảm bảo mảng gợi ý rỗng nếu có lỗi
      } finally {
        this.dangTai = false; // Kết thúc trạng thái tải (dù thành công hay lỗi)
      }
    },

    // Hàm giả lập phân tích sở thích và chấm điểm sản phẩm
    phanTichSoThichNguoiDung(danhSachSanPham) {
      // Nếu không có thông tin người dùng, trả về mảng rỗng
      if (!this.nguoiDung) return [];

      // Tạo một mảng mới, mỗi sản phẩm có thêm thuộc tính 'diem' (score) ban đầu là 0
      let sanPhamDaChamDiem = danhSachSanPham.map(sanPham => ({
        ...sanPham,
        diem: 0
      }));

      // --- Logic chấm điểm đơn giản (Giả lập AI) ---

      // 1. Chấm điểm dựa trên Tuổi
      if (this.nguoiDung.age) {
        const tuoi = parseInt(this.nguoiDung.age);
        sanPhamDaChamDiem.forEach(sanPham => {
          // Logic ví dụ:
          if (tuoi < 25 && (sanPham.category === 'Electronics' || sanPham.category === 'Fashion')) {
            sanPham.diem += 2; // Giới trẻ thích Điện tử, Thời trang
          } else if (tuoi >= 25 && tuoi < 40 && (sanPham.category === 'Home' || sanPham.category === 'Sports' || sanPham.category === 'Electronics')) {
             sanPham.diem += 2; // Tuổi trung niên thích Nhà cửa, Thể thao, Điện tử
          } else if (tuoi >= 40 && (sanPham.category === 'Home' || sanPham.category === 'Fashion')) {
            sanPham.diem += 2; // Lớn tuổi thích Nhà cửa, Thời trang (khác?)
          }
        });
      }

      // 2. Chấm điểm dựa trên Giới tính
      if (this.nguoiDung.gender) {
        sanPhamDaChamDiem.forEach(sanPham => {
          if (this.nguoiDung.gender === 'male' && (sanPham.category === 'Electronics' || sanPham.category === 'Sports')) {
            sanPham.diem += 1.5; // Nam thích Điện tử, Thể thao
          } else if (this.nguoiDung.gender === 'female' && (sanPham.category === 'Fashion' || sanPham.category === 'Home' || sanPham.category === 'Beauty')) { // Thêm Beauty nếu có
            sanPham.diem += 1.5; // Nữ thích Thời trang, Nhà cửa, Làm đẹp
          }
        });
      }

      // 3. Chấm điểm dựa trên "Sản phẩm mong muốn" (phân tích từ khóa đơn giản)
      if (this.nguoiDung.desiredProducts) {
        // Tách các từ khóa, chuyển thành chữ thường
        const tuKhoaSothich = this.nguoiDung.desiredProducts.toLowerCase().split(/[\s,]+/); // Tách bằng khoảng trắng hoặc dấu phẩy
        sanPhamDaChamDiem.forEach(sanPham => {
          // Kiểm tra xem có từ khóa nào xuất hiện trong tên, mô tả, hoặc danh mục không
          const coTrungKhop = tuKhoaSothich.some(keyword =>
             keyword && ( // Bỏ qua từ khóa rỗng
                (sanPham.title && sanPham.title.toLowerCase().includes(keyword)) ||
                (sanPham.description && sanPham.description.toLowerCase().includes(keyword)) ||
                (sanPham.category && sanPham.category.toLowerCase().includes(keyword))
             )
          );
          if (coTrungKhop) {
            sanPham.diem += 3; // Cộng nhiều điểm nếu khớp sở thích
          }
        });
      }

      // Sắp xếp sản phẩm theo điểm giảm dần và lọc ra những sản phẩm có điểm > 0
      return sanPhamDaChamDiem
        .sort((a, b) => b.diem - a.diem) // Sắp xếp điểm cao lên đầu
        .filter(sanPham => sanPham.diem > 0); // Chỉ giữ lại sản phẩm có điểm
    },

    // Hàm tạo câu giải thích lý do gợi ý
    taoLyDoGoiY() {
      let cacLyDo = []; // Mảng chứa các phần của câu giải thích

      if (this.nguoiDung.age) {
        cacLyDo.push(`dựa trên độ tuổi (${this.nguoiDung.age})`);
      }

      if (this.nguoiDung.gender) {
        // Chuyển giá trị 'male'/'female'/'other' thành chữ tiếng Việt
        const chuGioiTinh = this.nguoiDung.gender === 'male' ? 'nam' : this.nguoiDung.gender === 'female' ? 'nữ' : 'khác';
        cacLyDo.push(`phù hợp với giới tính (${chuGioiTinh})`);
      }

      if (this.nguoiDung.desiredProducts) {
        cacLyDo.push('và sở thích bạn đã mô tả'); // Rút gọn
      }

      // Ghép các lý do lại thành câu hoàn chỉnh
       if (cacLyDo.length > 0) {
          return `Chúng tôi gợi ý các sản phẩm này ${cacLyDo.join(', ')}.`;
       } else {
          // Trường hợp hiếm gặp nếu người dùng chỉ có tên/email
          return 'Chúng tôi nghĩ rằng bạn có thể thích các sản phẩm này.';
       }

    }
  }
};
</script>

<style scoped>
/* Container chính */
.goi-y-san-pham-ai {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Tăng bóng đổ */
  margin-top: 30px;
  border: 1px solid #e9ecef; /* Thêm viền nhẹ */
}

/* Tiêu đề khu vực */
.section-title {
  color: #343a40; /* Màu chữ đậm hơn */
  font-weight: 700;
  border-bottom: 3px solid #667eea; /* Gạch chân */
  padding-bottom: 10px;
  display: inline-block; /* Chỉ gạch chân dưới chữ */
}

/* Khung giải thích lý do */
.suggestion-reason {
  border-left: 4px solid #667eea; /* Viền trái */
  background-color: #f8f9fa !important; /* Màu nền nhạt hơn */
}
.suggestion-reason h5 {
   font-weight: 600;
}

/* Thẻ sản phẩm (giống trang YeuThich) */
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Giảm bóng đổ chút */
}

.card-img-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.05);
}

/* Huy hiệu giảm giá */
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #dc3545; /* Đổi màu đỏ */
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Huy hiệu AI */
.ai-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #667eea; /* Đổi màu tím */
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}
.ai-badge i {
   font-size: 0.7rem; /* Giảm kích thước sao */
}


/* Giá */
.price-section {
  display: flex;
  align-items: baseline; /* Căn baseline cho đẹp */
  gap: 8px; /* Khoảng cách giữa các giá */
  min-height: 1.5em;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d; /* Xám hơn */
  font-size: 0.9rem;
}

.final-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #dc3545; /* Màu đỏ */
}

/* Tên sản phẩm */
.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;
}

/* Danh mục */
.card-text {
  font-size: 0.85rem; /* Nhỏ hơn */
  margin-bottom: 1rem;
}

/* Nút bấm */
.btn-primary {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
  font-size: 0.9rem; /* Giảm kích thước chữ nút */
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6a78 0%, #333333 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Style cho các thông báo */
.alert {
   border-radius: 10px;
}
.alert i {
   font-size: 2.5rem; /* Giảm kích thước icon trong alert */
}
.alert h5 {
   font-weight: 600;
}
</style>