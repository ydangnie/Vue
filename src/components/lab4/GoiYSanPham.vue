<template>
  <div class="goi-y-san-pham-ai">
    <h3 class="section-title mb-4">Gợi ý sản phẩm cho bạn</h3>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang phân tích sở thích của bạn...</p>
    </div>

    <!-- AI Suggestions -->
    <div v-else-if="aiSuggestions.length > 0" class="ai-suggestions mb-4">
      <div class="suggestion-reason bg-light p-3 rounded mb-3">
        <h5><i class="fas fa-brain text-primary me-2"></i>Gợi ý AI</h5>
        <p class="mb-0">{{ suggestionReason }}</p>
      </div>

      <div class="row">
        <div v-for="product in aiSuggestions" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="card-img-top" :alt="product.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="product.title">
              <div v-if="product.discount > 0" class="discount-badge">-${{ product.discount }}%</div>
              <div class="ai-badge">AI Gợi ý</div>
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
    </div>

    <!-- No User Data -->
    <div v-else-if="!hasUserData" class="text-center py-4">
      <i class="fas fa-user-edit fa-3x text-muted mb-3"></i>
      <h5>Cập nhật thông tin cá nhân</h5>
      <p class="text-muted">Hãy cập nhật tuổi, giới tính và sở thích để nhận gợi ý sản phẩm phù hợp hơn</p>
      <router-link to="/cap-nhat-user" class="btn btn-primary">Cập nhật ngay</router-link>
    </div>

    <!-- No Suggestions -->
    <div v-else class="text-center py-4">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h5>Không có gợi ý</h5>
      <p class="text-muted">Chúng tôi đang tìm sản phẩm phù hợp với sở thích của bạn</p>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js';

export default {
  name: 'GoiYSanPhamAI',
  data() {
    return {
      aiSuggestions: [],
      suggestionReason: '',
      loading: false,
      user: null
    };
  },
  computed: {
    hasUserData() {
      return this.user && (this.user.age || this.user.gender || this.user.desiredProducts);
    }
  },
  mounted() {
    this.loadUserData();
    this.generateAISuggestions();
  },
  methods: {
    loadUserData() {
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    },
    async generateAISuggestions() {
      if (!this.hasUserData) return;

      this.loading = true;
      try {
        // Load all products
        const productsResponse = await axios.get('/products');
        const allProducts = productsResponse.data;

        // Simulate AI analysis based on user attributes
        const suggestions = this.analyzeUserPreferences(allProducts);

        // Limit to 4 suggestions
        this.aiSuggestions = suggestions.slice(0, 4);
        this.suggestionReason = this.generateSuggestionReason();

      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        this.aiSuggestions = [];
      } finally {
        this.loading = false;
      }
    },
    analyzeUserPreferences(products) {
      if (!this.user) return [];

      let scoredProducts = products.map(product => ({
        ...product,
        score: 0
      }));

      // Age-based scoring
      if (this.user.age) {
        const age = parseInt(this.user.age);
        scoredProducts.forEach(product => {
          // Example scoring logic based on age groups
          if (age < 25 && (product.category === 'Electronics' || product.category === 'Fashion')) {
            product.score += 2;
          } else if (age >= 25 && age < 40 && (product.category === 'Home' || product.category === 'Sports')) {
            product.score += 2;
          } else if (age >= 40 && (product.category === 'Home' || product.category === 'Fashion')) {
            product.score += 2;
          }
        });
      }

      // Gender-based scoring
      if (this.user.gender) {
        scoredProducts.forEach(product => {
          if (this.user.gender === 'male' && product.category === 'Electronics') {
            product.score += 1.5;
          } else if (this.user.gender === 'female' && (product.category === 'Fashion' || product.category === 'Home')) {
            product.score += 1.5;
          }
        });
      }

      // Desired products text analysis
      if (this.user.desiredProducts) {
        const desiredKeywords = this.user.desiredProducts.toLowerCase().split(' ');
        scoredProducts.forEach(product => {
          const titleMatch = desiredKeywords.some(keyword =>
            product.title.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
          );
          if (titleMatch) {
            product.score += 3;
          }
        });
      }

      // Sort by score and return top products
      return scoredProducts
        .sort((a, b) => b.score - a.score)
        .filter(product => product.score > 0);
    },
    generateSuggestionReason() {
      let reasons = [];

      if (this.user.age) {
        reasons.push(`dựa trên độ tuổi ${this.user.age}`);
      }

      if (this.user.gender) {
        const genderText = this.user.gender === 'male' ? 'nam' : this.user.gender === 'female' ? 'nữ' : 'khác';
        reasons.push(`phù hợp với giới tính ${genderText}`);
      }

      if (this.user.desiredProducts) {
        reasons.push('dựa trên sở thích đã khai báo');
      }

      return `Các sản phẩm này được gợi ý ${reasons.join(', ')}.`;
    }
  }
};
</script>

<style scoped>
.goi-y-san-pham-ai {
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

.suggestion-reason {
  border-left: 4px solid #667eea;
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

.ai-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #17a2b8;
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