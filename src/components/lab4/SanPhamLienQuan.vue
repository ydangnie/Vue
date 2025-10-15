<template>
  <div class="san-pham-lien-quan">
    <h3 class="section-title mb-4">Sản phẩm liên quan</h3>
    <div class="row">
      <div v-for="product in relatedProducts" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 product-card">
          <div class="card-img-container">
            <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="card-img-top" :alt="product.title">
            <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="product.title">
            <div v-if="product.discount > 0" class="discount-badge">-${{ product.discount }}%</div>
            <div v-if="product.featured" class="featured-badge">Nổi bật</div>
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
    <div v-if="relatedProducts.length === 0" class="text-center py-4">
      <p class="text-muted">Không có sản phẩm liên quan</p>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js';

export default {
  name: 'SanPhamLienQuan',
  props: {
    currentProductId: {
      type: [String, Number],
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      relatedProducts: []
    };
  },
  mounted() {
    this.loadRelatedProducts();
  },
  watch: {
    category() {
      this.loadRelatedProducts();
    },
    currentProductId() {
      this.loadRelatedProducts();
    }
  },
  methods: {
    async loadRelatedProducts() {
      try {
        const response = await axios.get('/products');
        const allProducts = response.data;

        // Filter products by category and exclude current product
        this.relatedProducts = allProducts
          .filter(product =>
            product.category === this.category &&
            product.id !== this.currentProductId
          )
          .slice(0, 4); // Limit to 4 related products
      } catch (error) {
        console.error('Error loading related products:', error);
        this.relatedProducts = [];
      }
    }
  }
};
</script>

<style scoped>
.san-pham-lien-quan {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 30px;
}

.section-title {
  color: #495057;
  font-weight: 700;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
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
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  transform: translateY(-2px);
}
</style>