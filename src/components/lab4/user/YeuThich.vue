<template>
  <div class="wishlist-page">
    <div class="container">
      <h1 class="mb-4">Sản phẩm yêu thích</h1>
      <div v-if="wishlistItems.length > 0" class="row">
        <div v-for="product in wishlistItems" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="card-img-top" :alt="product.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="product.title">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text text-muted">{{ product.category }}</p>
              <div class="price-section mb-3">
                <span v-if="product.discount > 0" class="original-price">${{ product.price }}</span>
                <span class="final-price">${{ (product.price * (1 - product.discount / 100)).toFixed(2) }}</span>
              </div>
              <div class="mt-auto">
                <router-link :to="'/chi-tiet-san-pham/' + product.id" class="btn btn-primary btn-sm w-100 mb-2">Xem chi tiết</router-link>
                <button @click="removeFromWishlist(product)" class="btn btn-danger btn-sm w-100">
                  <i class="fas fa-trash-alt me-1"></i> Bỏ yêu thích
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <i class="fas fa-heart-broken fa-4x text-muted mb-4"></i>
        <h4>Danh sách yêu thích trống</h4>
        <p class="text-muted">Hãy thêm sản phẩm bạn quan tâm vào đây nhé.</p>
        <router-link to="/san-pham" class="btn btn-primary">Khám phá sản phẩm</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'YeuThich',
  computed: {
    ...mapGetters(['wishlistItems'])
  },
  methods: {
    ...mapActions(['toggleWishlist']),
    // Thêm hàm này để xử lý việc xóa và hiển thị thông báo
    removeFromWishlist(product) {
      this.toggleWishlist(product);
      this.$toast.info("Thông báo", `Đã bỏ "${product.title}" khỏi danh sách yêu thích.`);
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên style */
.product-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  border-radius: 10px;
  overflow: hidden;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
.card-img-container {
  height: 200px;
}
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
}
</style>