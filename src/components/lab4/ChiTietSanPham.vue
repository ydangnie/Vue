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
        <!-- Product Images -->
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

        <!-- Product Info -->
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
                <span :class="sanPham.stock > 0 ? 'text-success' : 'text-danger'">
                  {{ sanPham.stock > 0 ? sanPham.stock + ' sản phẩm' : 'Hết hàng' }}
                </span>
              </p>
              <p v-if="sanPham.featured" class="text-warning"><i class="fas fa-star"></i> Sản phẩm nổi bật</p>
            </div>

            <div class="product-description mb-4">
              <h5>Mô tả sản phẩm</h5>
              <p>{{ sanPham.description }}</p>
            </div>

            <div class="action-buttons">
              <button @click="addToCart" class="btn btn-primary btn-lg me-3" :disabled="addingToCart || sanPham.stock <= 0">
                <span v-if="addingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i class="fas fa-cart-plus"></i> {{ addingToCart ? 'Đang thêm...' : (sanPham.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng') }}
              </button>
              <button class="btn btn-outline-secondary btn-lg">
                <i class="fas fa-heart"></i> Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <SanPhamLienQuan
        :current-product-id="sanPham.id"
        :category="sanPham.category"
      />

      <div class="text-center mt-5">
        <router-link to="/san-pham" class="btn btn-outline-primary">
          <i class="fas fa-arrow-left"></i> Quay lại danh sách sản phẩm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js';
import { mapActions } from 'vuex';
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
      addingToCart: false
    };
  },
  mounted() {
    this.layChiTietSanPham();
  },
  methods: {
    ...mapActions({
      addToCartAction: 'addToCart'
    }),
    layChiTietSanPham() {
      const id = this.$route.params.id;
      axios.get(`/products/${id}`)
        .then(response => {
          this.sanPham = response.data;
          // Set the first image as selected, or fallback to single image or placeholder
          if (this.sanPham.images && this.sanPham.images.length > 0) {
            this.selectedImage = this.sanPham.images[0];
          } else if (this.sanPham.image) {
            this.selectedImage = this.sanPham.image;
          } else {
            this.selectedImage = 'https://via.placeholder.com/400x400?text=No+Image';
          }
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    async addToCart() {
      if (this.addingToCart) return;

      this.addingToCart = true;
      try {
        // Add stock property for cart validation
        const productWithStock = {
          ...this.sanPham,
          stock: this.sanPham.quantity
        };
        await this.addToCartAction(productWithStock);
        this.$toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        this.$toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      } finally {
        this.addingToCart = false;
      }
    }
  },
};
</script>

<style scoped>
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

.price-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.original-price {
  text-decoration: line-through;
  color: #6c757d;
  margin: 0;
}

.final-price {
  color: #dc3545;
  font-weight: 700;
  margin: 0;
}

.discount-badge {
  background: #dc3545;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.product-meta p {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.product-description {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.product-description h5 {
  color: #495057;
  margin-bottom: 1rem;
}

.product-description p {
  color: #6c757d;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 2rem;
}

.btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
}

.btn-outline-secondary:hover {
  transform: translateY(-2px);
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 2rem;
}

.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumb-item.active {
  color: #6c757d;
}
</style>
