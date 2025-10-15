<template>
  <div class="san-pham">
    <div class="container">
      <h1 class="mb-4">Danh sách sản phẩm</h1>

      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-md-6">
          <input v-model="searchQuery" @input="filterProducts" type="text" class="form-control" placeholder="Tìm kiếm sản phẩm...">
        </div>
        <div class="col-md-3">
          <select v-model="selectedCategory" @change="filterProducts" class="form-control">
            <option value="">Tất cả danh mục</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="sortBy" @change="sortProducts" class="form-control">
            <option value="title">Sắp xếp theo tên</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="discount">Giảm giá</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="row">
        <div v-for="sanPham in filteredProducts" :key="sanPham.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" class="card-img-top" :alt="sanPham.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="sanPham.title">
              <div v-if="sanPham.discount > 0" class="discount-badge">-${{ sanPham.discount }}%</div>
              <div v-if="sanPham.featured" class="featured-badge">Nổi bật</div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ sanPham.title }}</h5>
              <p class="card-text text-muted">{{ sanPham.category }}</p>
              <div class="price-section mb-3">
                <span v-if="sanPham.discount > 0" class="original-price">${{ sanPham.price }}</span>
                <span class="final-price">${{ (sanPham.price * (1 - sanPham.discount / 100)).toFixed(2) }}</span>
              </div>
              <div class="quantity-info mb-2">
                <small class="text-muted">Còn lại: {{ sanPham.stock }} sản phẩm</small>
              </div>
              <div class="mt-auto">
                <div class="d-grid gap-2">
                  <button @click="addToCart(sanPham)" class="btn btn-success btn-sm" :disabled="addingToCart[sanPham.id] || sanPham.stock <= 0">
                    <span v-if="addingToCart[sanPham.id]" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <i class="fas fa-cart-plus me-1"></i>{{ sanPham.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ' }}
                  </button>
                  <router-link :to="'/chi-tiet-san-pham/' + sanPham.id" class="btn btn-primary btn-sm">Xem chi tiết</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No products message -->
      <div v-if="filteredProducts.length === 0" class="text-center mt-5">
        <h3>Không tìm thấy sản phẩm nào</h3>
        <p>Hãy thử tìm kiếm với từ khóa khác</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js'
import { mapActions } from 'vuex'

export default {
  name: 'SanPham',
  data() {
    return {
      danhSachSanPham: [],
      filteredProducts: [],
      categories: [],
      searchQuery: '',
      selectedCategory: '',
      sortBy: 'title',
      addingToCart: {}
    };
  },
  mounted() {
    this.layDuLieuSanPham();
    this.layCategories();
  },
  methods: {
    ...mapActions({
      addToCartAction: 'addToCart'
    }),
    layDuLieuSanPham() {
      axios.get('/products')
        .then(response => {
          this.danhSachSanPham = response.data;
          this.filteredProducts = [...this.danhSachSanPham];
          this.sortProducts();
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    layCategories() {
      axios.get('/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    filterProducts() {
      let filtered = [...this.danhSachSanPham];

      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.category === this.selectedCategory);
      }

      this.filteredProducts = filtered;
      this.sortProducts();
    },
    sortProducts() {
      this.filteredProducts.sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'discount':
            return b.discount - a.discount;
          default:
            return a.title.localeCompare(b.title);
        }
      });
    },
    async addToCart(product) {
      if (this.addingToCart[product.id]) return;

      this.addingToCart[product.id] = true;
      try {
        // Add stock property for cart validation
        const productWithStock = {
          ...product,
          stock: product.quantity
        };
        await this.addToCartAction(productWithStock);
        this.$toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        this.$toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      } finally {
        this.addingToCart[product.id] = false;
      }
    }
  },
  watch: {
    sortBy() {
      this.sortProducts();
    }
  }
};
</script>

<style scoped>
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

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e74c3c;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f39c12;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.final-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #e74c3c;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-text {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
}
</style>
