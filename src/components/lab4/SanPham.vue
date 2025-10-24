<template>
  <div class="san-pham">
    <div class="container">
      <h1 class="mb-4">Danh sách sản phẩm</h1>

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

      <div class="row">
        <div v-for="sanPhamItem in filteredProducts" :key="sanPhamItem.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="card h-100 product-card">
            <div class="card-img-container">
              <img v-if="sanPhamItem.images && sanPhamItem.images.length > 0" :src="sanPhamItem.images[0]" class="card-img-top" :alt="sanPhamItem.title">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" class="card-img-top" :alt="sanPhamItem.title">
              <div v-if="sanPhamItem.discount > 0" class="discount-badge">-${{ sanPhamItem.discount }}%</div>
              <div v-if="sanPhamItem.featured" class="featured-badge">Nổi bật</div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ sanPhamItem.title }}</h5>
              <p class="card-text text-muted">{{ sanPhamItem.category }}</p>
              <div class="price-section mb-3">
                <span v-if="sanPhamItem.discount > 0" class="original-price">${{ sanPhamItem.price }}</span>
                <span class="final-price">${{ (sanPhamItem.price * (1 - sanPhamItem.discount / 100)).toFixed(2) }}</span>
              </div>
              <div class="quantity-info mb-2">
                <small class="text-muted">Còn lại: {{ sanPhamItem.quantity }} sản phẩm</small>
              </div>
              <div class="mt-auto">
                <div class="d-grid gap-2">
                   <button id="them" @click="addToCart(sanPhamItem)" class="btn btn-success btn-sm" :disabled="addingToCart[sanPhamItem.id] || sanPhamItem.quantity <= 0">
                    <span v-if="addingToCart[sanPhamItem.id]" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <i class="fas fa-cart-plus me-1"></i>{{ sanPhamItem.quantity <= 0 ? 'Hết hàng' : 'Thêm vào giỏ' }}
                  </button>
                  <router-link :to="'/chi-tiet-san-pham/' + sanPhamItem.id" class="btn btn-primary btn-sm">Xem chi tiết</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      danhSachSanPham: [], // Danh sách sản phẩm gốc
      filteredProducts: [], // Danh sách sản phẩm đã lọc/sắp xếp
      categories: [],
      searchQuery: '', // Từ khóa tìm kiếm
      selectedCategory: '', // Danh mục được chọn
      sortBy: 'title', // Tiêu chí sắp xếp
      addingToCart: {} // Trạng thái đang thêm vào giỏ hàng cho từng sản phẩm
    };
  },
  mounted() {
    this.layDuLieuSanPham();
    this.layCategories();
  },
  methods: {
    ...mapActions({
      addToCartAction: 'addToCart' // Map action 'addToCart' từ Vuex store
    }),
    layDuLieuSanPham() {
      axios.get('/products')
        .then(response => {
          this.danhSachSanPham = response.data;
          this.filteredProducts = [...this.danhSachSanPham]; // Sao chép danh sách gốc
          this.sortProducts(); // Sắp xếp lần đầu
        })
        .catch(error => {
          console.error('Loi tai san pham:', error);
        });
    },
    layCategories() {
      axios.get('/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Loi tai danh muc:', error);
        });
    },
    filterProducts() {
      let filtered = [...this.danhSachSanPham]; // Bắt đầu với danh sách gốc

      // Lọc theo từ khóa tìm kiếm
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }

      // Lọc theo danh mục
      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.category === this.selectedCategory);
      }

      this.filteredProducts = filtered; // Cập nhật danh sách đã lọc
      this.sortProducts(); // Sắp xếp lại danh sách đã lọc
    },
    sortProducts() {
      this.filteredProducts.sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return (a.price * (1 - a.discount / 100)) - (b.price * (1 - b.discount / 100)); // Sắp xếp theo giá cuối cùng
          case 'price-high':
            return (b.price * (1 - b.discount / 100)) - (a.price * (1 - a.discount / 100)); // Sắp xếp theo giá cuối cùng
          case 'discount':
            return b.discount - a.discount;
          default: // 'title'
            return a.title.localeCompare(b.title);
        }
      });
    },
    async addToCart(product) {
      if (this.addingToCart[product.id]) return; // Ngăn click nhiều lần

      this.addingToCart[product.id] = true; // Đặt trạng thái đang thêm
      try {
        const productWithStock = {
          ...product,
          stock: product.quantity // Chuyển 'quantity' thành 'stock' cho Vuex store
        };
        // Gọi action addToCart từ Vuex store với số lượng là 1
        await this.addToCartAction({ product: productWithStock, quantity: 1 });
        this.$toast.success('Thanh cong!', 'Da them san pham vao gio hang.'); // Thông báo thành công
      } catch (error) {
        console.error('Loi khi them vao gio hang:', error);
        this.$toast.error('Them that bai!', error.message || 'Co loi xay ra, vui long thu lai.'); // Thông báo lỗi
      } finally {
        this.addingToCart[product.id] = false; // Reset trạng thái
      }
    }
  },
  watch: {
    // Theo dõi thay đổi của sortBy để sắp xếp lại
    sortBy() {
      this.sortProducts();
    },
    // Theo dõi thay đổi của selectedCategory và searchQuery để lọc lại
    selectedCategory() {
        this.filterProducts();
    }
  }
};
</script>

<style scoped>
/* Giữ nguyên CSS */
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
#them{
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border: black solid 1px; /* Sửa lại border */
  transition: all 0.3s ease;
  color: black;
}
#them:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%); /* Hiệu ứng hover */
}
</style>