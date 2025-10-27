<template>
  <div class="trang-yeu-thich"> <div class="container">
      <h1 class="mb-4"><i class="fas fa-heart me-2 text-danger"></i>Sản phẩm yêu thích</h1>

      <div v-if="danhSachYeuThich && danhSachYeuThich.length > 0" class="row">
        <div v-for="sanPham in danhSachYeuThich" :key="sanPham.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" class="card-img-top" :alt="sanPham.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="sanPham.title"> </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ sanPham.title }}</h5>
              <p class="card-text text-muted small">{{ sanPham.category }}</p> <div class="price-section mb-3">
                <span v-if="sanPham.discount > 0" class="original-price text-decoration-line-through text-muted me-2">${{ sanPham.price.toFixed(2) }}</span>
                <span class="final-price fw-bold text-danger">${{ (sanPham.price * (1 - sanPham.discount / 100)).toFixed(2) }}</span>
              </div>
              <div class="mt-auto">
                <router-link :to="'/chi-tiet-san-pham/' + sanPham.id" class="btn btn-primary btn-sm w-100 mb-2">
                  <i class="fas fa-eye me-1"></i>Xem chi tiết
                </router-link>
                <button @click="xuLyXoaKhoiYeuThich(sanPham)" class="btn btn-outline-danger btn-sm w-100"> <i class="fas fa-heart-broken me-1"></i> Bỏ yêu thích </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="fas fa-heart-broken fa-4x text-muted mb-4"></i>
        <h4>Danh sách yêu thích trống</h4>
        <p class="text-muted">Hãy <i class="fas fa-heart text-danger"></i> những sản phẩm bạn quan tâm vào đây nhé.</p>
        <router-link to="/san-pham" class="btn btn-primary">
          <i class="fas fa-store me-2"></i>Khám phá sản phẩm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// Import các helper từ Vuex để lấy getters và actions
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'YeuThich', // Tên component
  computed: {
    // Sử dụng mapGetters để lấy 'wishlistItems' từ store và đặt tên là 'danhSachYeuThich'
    // This makes `this.danhSachYeuThich` available in the component, referencing `store.getters.wishlistItems`
    ...mapGetters({
      danhSachYeuThich: 'wishlistItems' // Lấy getter 'wishlistItems' từ store
    })
  },
  methods: {
    // Sử dụng mapActions để lấy action 'toggleWishlist' từ store và đặt tên là 'thayDoiYeuThich'
    // This makes `this.thayDoiYeuThich(product)` available, calling `store.dispatch('toggleWishlist', product)`
    ...mapActions({
      thayDoiYeuThich: 'toggleWishlist' // Lấy action 'toggleWishlist' từ store
    }),

    // Hàm xử lý khi nhấn nút "Bỏ yêu thích"
    xuLyXoaKhoiYeuThich(sanPham) {
      // Gọi action Vuex đã map (thayDoiYeuThich) để thực hiện việc xóa/thêm vào store và localStorage
      this.thayDoiYeuThich(sanPham);
      // Hiển thị thông báo cho người dùng biết sản phẩm đã được bỏ yêu thích
      this.$toast.info(`Đã bỏ "${sanPham.title}" khỏi danh sách yêu thích.`); // Sửa lại thông báo
    }
  }
};
</script>

<style scoped>
/* Container chính */
.trang-yeu-thich { /* Đổi tên class */
  padding: 40px 0; /* Tăng padding */
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: calc(100vh - 56px); /* Chiều cao tối thiểu (trừ đi chiều cao navbar nếu có) */
}

/* Thẻ sản phẩm */
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng chuyển đổi */
  border: 1px solid #e9ecef; /* Thêm viền nhẹ */
  border-radius: 10px;
  overflow: hidden; /* Đảm bảo bo góc */
  background-color: #fff; /* Nền trắng */
}

.product-card:hover {
  transform: translateY(-5px); /* Nhấc thẻ lên khi hover */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Tăng bóng đổ khi hover */
}

/* Container chứa ảnh */
.card-img-container {
  height: 200px; /* Chiều cao cố định cho ảnh */
  overflow: hidden; /* Ẩn phần ảnh thừa */
}

/* Ảnh sản phẩm */
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giữ tỷ lệ ảnh, cắt bớt phần thừa */
  transition: transform 0.3s ease; /* Hiệu ứng zoom nhẹ */
}
.product-card:hover .card-img-top {
   transform: scale(1.05); /* Zoom ảnh khi hover thẻ */
}


/* Tên sản phẩm */
.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem; /* Giảm khoảng cách dưới */
  /* Giới hạn 2 dòng chữ */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.4em; /* Chiều cao tối thiểu cho 2 dòng */
}
.card-text {
   font-size: 0.85rem; /* Giảm kích thước chữ danh mục */
   margin-bottom: 0.75rem;
}

/* Khu vực giá */
.price-section {
   min-height: 1.5em; /* Đảm bảo chiều cao ổn định dù có giá gốc hay không */
}
.original-price {
  font-size: 0.9rem;
}
.final-price {
   font-size: 1.1rem; /* Tăng kích thước giá cuối */
}

/* Nút bấm */
.btn {
   font-size: 0.85rem; /* Giảm kích thước chữ nút */
   padding: 0.4rem 0.8rem; /* Điều chỉnh padding nút */
}
.btn-primary {
   background: linear-gradient(135deg, #747578 0%, #000000 100%);
   border: none;
}
.btn-primary:hover {
    background: linear-gradient(135deg, #5a6a78 0%, #333333 100%);
}


/* Căn giữa thông báo khi danh sách trống */
.text-center i {
  color: #adb5bd; /* Màu icon xám hơn */
}
.text-center h4 {
  color: #6c757d; /* Màu tiêu đề xám */
}
</style>