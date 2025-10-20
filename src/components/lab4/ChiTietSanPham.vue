<template>
  <div class="chi-tiet-san-pham">
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/san-pham">Sản phẩm</router-link></li>
          <li class="breadcrumb-item active">{{ sanPham.title }}</li>
        </ol>
      </nav>

      <div class="row">
        <div class="col-md-6">
          <div class="product-images">
            <div class="main-image mb-3">
              <img :src="selectedImage" alt="Main Product Image" class="img-fluid rounded">
            </div>
            <div v-if="sanPham.images && sanPham.images.length > 1" class="thumbnail-images d-flex gap-2 flex-wrap">
              <img v-for="(image, index) in sanPham.images" :key="index"
                   :src="image" alt="Thumbnail" class="thumbnail-img"
                   :class="{ active: selectedImage === image }"
                   @click="selectedImage = image">
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="product-info">
            <h1 class="product-title mb-3">{{ sanPham.title }}</h1>

            <div class="price-section mb-4">
              <span v-if="sanPham.discount > 0" class="original-price h4 text-muted me-3">
                ${{ sanPham.price }}
              </span>
              <span class="final-price h2 text-danger">
                ${{ (sanPham.price * (1 - sanPham.discount / 100)).toFixed(2) }}
              </span>
              <span v-if="sanPham.discount > 0" class="discount-badge ms-3">
                -{{ sanPham.discount }}%
              </span>
            </div>

            <div class="product-meta mb-4">
              <p><strong>Danh mục:</strong> <span class="badge bg-primary">{{ sanPham.category }}</span></p>
              <p><strong>Số lượng còn:</strong>
                <span :class="sanPham.quantity > 0 ? 'text-success' : 'text-danger'">
                  {{ sanPham.quantity > 0 ? sanPham.quantity + ' sản phẩm' : 'Hết hàng' }}
                </span>
              </p>
              <p v-if="sanPham.featured" class="text-warning"><i class="fas fa-star"></i> Sản phẩm nổi bật</p>
            </div>

            <div class="product-description mb-4">
              <h5>Mô tả sản phẩm</h5>
              <p>{{ sanPham.description }}</p>
            </div>
            
            <div class="mb-4" v-if="sanPham.quantity > 0">
                <label class="form-label fw-bold">Số lượng:</label>
                <div class="quantity-controls d-flex align-items-center">
                  <button @click="decreaseQuantity" class="btn btn-outline-secondary btn-sm">-</button>
                  <input type="number" v-model.number="quantityToAdd" class="form-control form-control-sm quantity-input mx-2" min="1" :max="sanPham.quantity">
                  <button @click="increaseQuantity" class="btn btn-outline-secondary btn-sm">+</button>
                </div>
            </div>

            <div class="action-buttons">
              <button @click="addToCart" class="btn btn-primary btn-lg me-3" :disabled="addingToCart || sanPham.quantity <= 0">
                <span v-if="addingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i class="fas fa-cart-plus"></i> {{ addingToCart ? 'Đang thêm...' : (sanPham.quantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng') }}
              </button>
              <button @click="toggleWishlistHandler" :class="['btn btn-lg', isProductInWishlist ? 'btn-danger' : 'btn-outline-danger']" :disabled="!isLoggedIn">
                <i :class="['fas fa-heart me-2', isProductInWishlist ? 'text-white' : '']"></i> 
                {{ isProductInWishlist ? 'Đã yêu thích' : 'Yêu thích' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="product-reviews mt-5 card">
        <div class="card-header">
            <h3 class="mb-0">Đánh giá sản phẩm</h3>
        </div>
        <div class="card-body">
            <div class="mb-4" v-if="isLoggedIn">
                <h5 class="card-title">Viết đánh giá của bạn</h5>
                <form @submit.prevent="submitReview">
                <div class="mb-3">
                    <label class="form-label">Xếp hạng</label>
                    <div>
                    <i v-for="n in 5" :key="n" 
                        :class="['fas fa-star', n <= newReview.rating ? 'text-warning' : 'text-muted']"
                        @click="newReview.rating = n"
                        style="cursor: pointer; font-size: 1.5rem;"></i>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="reviewComment" class="form-label">Bình luận</label>
                    <textarea v-model="newReview.comment" id="reviewComment" class="form-control" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
                </form>
            </div>
            <div v-else class="alert alert-info">
                Vui lòng <router-link to="/login">đăng nhập</router-link> để viết đánh giá.
            </div>

            <hr v-if="isLoggedIn">
            <div v-if="sanPham.reviews && sanPham.reviews.length > 0">
                <div v-for="(review, index) in sanPham.reviews.slice().reverse()" :key="index" class="review-item border-bottom pb-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong><i class="fas fa-user me-2"></i>{{ review.author }}</strong>
                        <div class="rating">
                        <i v-for="n in 5" :key="n" :class="['fas fa-star', n <= review.rating ? 'text-warning' : 'text-muted']"></i>
                        </div>
                    </div>
                    <p class="mb-1 mt-2">{{ review.comment }}</p>
                    <small class="text-muted">{{ new Date(review.date).toLocaleString('vi-VN') }}</small>
                </div>
            </div>
            <div v-else class="text-center py-4">
                <p class="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
        </div>
      </div>

      <SanPhamLienQuan :current-product-id="sanPham.id" :category="sanPham.category" />

    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import SanPhamLienQuan from './SanPhamLienQuan.vue';

export default {
  name: 'ChiTietSanPham',
  components: {
    SanPhamLienQuan
  },
  data() {
    return {
      sanPham: {},
      selectedImage: '',
      addingToCart: false,
      quantityToAdd: 1,
      newReview: {
        rating: 5,
        comment: ''
      }
    };
  },
  computed: {
    ...mapGetters(['isInWishlist']),
    ...mapState(['user']),
    isLoggedIn() {
      return !!this.user;
    },
    isProductInWishlist() {
        return this.isInWishlist(this.sanPham.id);
    }
  },
  mounted() {
    this.layChiTietSanPham();
  },
  methods: {
    ...mapActions({
      addToCartAction: 'addToCart',
      toggleWishlist: 'toggleWishlist'
    }),
    layChiTietSanPham() {
      const id = this.$route.params.id;
      axios.get(`/products/${id}`)
        .then(response => {
          this.sanPham = response.data;
          this.selectedImage = (this.sanPham.images && this.sanPham.images.length > 0) ? this.sanPham.images[0] : 'https://via.placeholder.com/400x400?text=No+Image';
        })
        .catch(error => console.error('Lỗi:', error));
    },
    increaseQuantity() {
        if (this.quantityToAdd < this.sanPham.quantity) this.quantityToAdd++;
    },
    decreaseQuantity() {
        if (this.quantityToAdd > 1) this.quantityToAdd--;
    },
    async addToCart() {
      if (this.addingToCart || this.sanPham.quantity <= 0) return;
      this.addingToCart = true;
      try {
        await this.addToCartAction({ product: { ...this.sanPham, stock: this.sanPham.quantity }, quantity: this.quantityToAdd });
        this.$toast.success('Thành công!', `${this.quantityToAdd} sản phẩm đã được thêm vào giỏ.`);
      } catch (error) {
        this.$toast.error('Thêm thất bại!', error.message || 'Có lỗi xảy ra.');
      } finally {
        this.addingToCart = false;
      }
    },
    toggleWishlistHandler() {
        if(!this.isLoggedIn) {
            this.$toast.warning("Vui lòng đăng nhập để sử dụng chức năng này!");
            return;
        }
        this.toggleWishlist(this.sanPham);
        if (this.isProductInWishlist) {
            this.$toast.info("Đã bỏ sản phẩm khỏi danh sách yêu thích.");
        } else {
            this.$toast.success("Đã thêm sản phẩm vào danh sách yêu thích!");
        }
    },
    async submitReview() {
      if (!this.newReview.comment.trim()) {
        this.$toast.error('Vui lòng nhập bình luận!');
        return;
      }
      
      const reviewData = {
        author: this.user.username,
        rating: this.newReview.rating,
        comment: this.newReview.comment,
        date: new Date().toISOString()
      };

      const updatedReviews = this.sanPham.reviews ? [...this.sanPham.reviews, reviewData] : [reviewData];

      try {
        await axios.patch(`/products/${this.sanPham.id}`, { reviews: updatedReviews });
        this.sanPham.reviews = updatedReviews;
        this.newReview.rating = 5;
        this.newReview.comment = '';
        this.$toast.success('Gửi đánh giá thành công!');
      } catch (error) {
        this.$toast.error('Có lỗi xảy ra khi gửi đánh giá.');
        console.error("Lỗi review:", error);
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.layChiTietSanPham();
      this.quantityToAdd = 1;
    },
    quantityToAdd(newValue) {
        if (newValue > this.sanPham.quantity) this.quantityToAdd = this.sanPham.quantity;
        if (newValue < 1) this.quantityToAdd = 1;
    }
  }
};
</script>

<style scoped>
.quantity-controls { max-width: 150px; }
.quantity-input { text-align: center; }
.product-reviews {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.chi-tiet-san-pham {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}
.product-images {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}
.thumbnail-images {
  justify-content: center;
}
.thumbnail-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}
.thumbnail-img:hover {
  border-color: #007bff;
  transform: scale(1.05);
}
.thumbnail-img.active {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0,123,255,0.3);
}
.product-info {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.product-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>