<template>
  <div class="home">
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h3 class="display-4 fw-bold mb-4">
              <span>AZALMAN STORE</span> <br><span id="chao"></span></h3>
            <p class="lead mb-4">Khám phá ngay bộ sưu tập sản phẩm chất lượng cao</p>
            <router-link to="/san-pham" class="btn btn-light btn-lg">
              <i class="fas fa-shopping-bag"></i> Mua sắm ngay
            </router-link>
          </div>
          <div class="col-lg-6">
            <img src="https://picsum.photos/seed/hero/600/400" alt="Hero Image" class="img-fluid rounded">
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products py-5">
      <div class="container">
        <h2 class="text-center mb-5">Sản phẩm nổi bật</h2>
        <div class="row">
          <div v-for="product in featuredProducts" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 product-card">
              <div class="card-img-container">
                <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="card-img-top" :alt="product.title">
                <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="product.title">
                <div v-if="product.discount > 0" class="discount-badge">-${{ product.discount }}%</div>
                <div class="featured-badge">Nổi bật</div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ product.title }}</h5>
                <p class="card-text text-muted">{{ product.category }}</p>
                <div class="price-section mb-3">
                  <span v-if="product.discount > 0" class="original-price">${{ product.price }}</span>
                  <span class="final-price">${{ (product.price * (1 - product.discount / 100)).toFixed(2) }}</span>
                </div>
                <div class="mt-auto">
                  <router-link :to="'/chi-tiet-san-pham/' + product.id" class="btn btn-primary w-100">Xem chi tiết</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/san-pham" class="btn btn-outline-primary btn-lg">
            <i class="fas fa-eye"></i> Xem tất cả sản phẩm
          </router-link>
        </div>
      </div>
    </section>

    <section class="categories py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Danh mục sản phẩm</h2>
        <div class="row">
          <div v-for="category in categories" :key="category.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="category-card text-center p-4 bg-white rounded shadow-sm">
              <i class="fas fa-tag fa-3x text-primary mb-3"></i>
              <h5>{{ category.name }}</h5>
              <router-link :to="'/san-pham?category=' + category.name" class="btn btn-outline-primary">
                Xem san pham
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <GoiYSanPhamAI />

    <section class="stats py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <i class="fas fa-box fa-3x text-primary mb-3"></i>
              <h3>{{ products.length }}</h3>
              <p>Sản phẩm</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <i class="fas fa-tags fa-3x text-success mb-3"></i>
              <h3>{{ categories.length }}</h3>
              <p>Danh mục</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <i class="fas fa-star fa-3x text-warning mb-3"></i>
              <h3>{{ featuredProducts.length }}</h3>
              <p>Sản phẩm nổi bật</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <i class="fas fa-users fa-3x text-info mb-3"></i>
              <h3>1000+</h3>
              <p>Khách hàng hài lòng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from '../../../axios.js';
import GoiYSanPhamAI from './GoiYSanPham.vue'; // Đổi tên component gợi ý

export default {
  name: 'Home',
  components: {
    GoiYSanPhamAI // Sử dụng tên component đã đổi
  },
  data() {
    return {
      products: [],
      categories: [],
      featuredProducts: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      // Load products
      axios.get('/products')
        .then(response => {
          this.products = response.data;
          // Lọc sản phẩm nổi bật
          this.featuredProducts = this.products.filter(product => product.featured);
        })
        .catch(error => {
          console.error('Loi tai san pham:', error);
        });

      // Load categories
      axios.get('/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Loi tai danh muc:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên CSS */
.hero-section {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.featured-products {
  background: #f8f9fa;
}

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
  background: linear-gradient(135deg, #000000 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #313131 0%, #3e3e3e 100%);
  transform: translateY(-2px);
}

.category-card {
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.stat-item {
  padding: 2rem 0;
}

.stat-item h3 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-item p {
  color: #6c757d;
  font-weight: 500;
}
</style>