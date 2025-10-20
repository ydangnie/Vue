<template>
  <div class="admin-san-pham">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Quản lý sản phẩm</h1>
      <router-link to="/logout" class="btn btn-outline-danger">
        <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
      </router-link>
    </div>
    
    <button @click="showAddForm = true" class="btn btn-primary mb-3">Thêm sản phẩm</button>

    <div class="alert alert-info d-flex align-items-center mb-3">
      <label for="lowStockThreshold" class="form-label mb-0 me-2 fw-bold">Ngưỡng cảnh báo hết hàng:</label>
      <input type="number" id="lowStockThreshold" v-model.number="lowStockThreshold" class="form-control" style="width: 100px;">
      <small class="ms-2 text-muted">Sản phẩm có số lượng bằng hoặc thấp hơn ngưỡng này sẽ được tô vàng.</small>
    </div>

    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddForm = false">&times;</span>
        <h2>{{ editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Title:</label>
            <input v-model="productForm.title" required class="form-control">
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input v-model.number="productForm.price" type="number" step="0.01" required class="form-control">
          </div>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="productForm.category" required class="form-control">
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Description:</label>
            <textarea v-model="productForm.description" required class="form-control"></textarea>
          </div>
          <div class="form-group">
            <label>Quantity:</label>
            <input v-model.number="productForm.quantity" type="number" required class="form-control">
          </div>
          <div class="form-group">
            <label>Discount (%):</label>
            <input v-model.number="productForm.discount" type="number" min="0" max="100" class="form-control">
          </div>
          <div class="form-group">
            <label>Images (multiple, max 5):</label>
            <input type="file" @change="handleImageUpload" accept="image/jpeg,image/png,image/gif" multiple class="form-control">
            <small v-if="imageError" class="text-danger">{{ imageError }}</small>
            <div class="image-preview mt-2">
              <img v-for="(image, index) in productForm.images" :key="index" :src="image" alt="Preview" style="max-width: 100px; margin: 5px;">
              <button v-if="productForm.images.length > 0" @click="clearImages" class="btn btn-sm btn-danger mt-2">Clear All Images</button>
            </div>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="productForm.featured" class="me-2">
              Featured Product
            </label>
          </div>
          <button type="submit" class="btn btn-success">{{ editingProduct ? 'Cập nhật' : 'Thêm' }}</button>
        </form>
      </div>
    </div>
    
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Images</th>
          <th>Title</th>
          <th>Price</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Discount</th>
          <th>Featured</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sanPham in danhSachSanPham" :key="sanPham.id" :class="{'table-warning': sanPham.quantity <= lowStockThreshold && sanPham.quantity > 0}">
          <td>{{ sanPham.id }}</td>
          <td>
            <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;">
          </td>
          <td>{{ sanPham.title }}</td>
          <td>${{ sanPham.price }}</td>
          <td>{{ sanPham.category }}</td>
          <td>
            {{ sanPham.quantity }}
            <span v-if="sanPham.quantity <= lowStockThreshold && sanPham.quantity > 0" class="badge bg-warning text-dark ms-2">Sắp hết</span>
            <span v-if="sanPham.quantity === 0" class="badge bg-danger ms-2">Hết hàng</span>
          </td>
          <td>{{ sanPham.discount }}%</td>
          <td>
            <span v-if="sanPham.featured" class="badge bg-success">Yes</span>
            <span v-else class="badge bg-secondary">No</span>
          </td>
          <td>
            <button @click="editProduct(sanPham)" class="btn btn-warning btn-sm me-1">Sửa</button>
            <button @click="xoaSanPham(sanPham.id)" class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from '../../../../axios.js'

export default {
  name: 'AdminSanPham',
  data() {
    return {
      danhSachSanPham: [],
      categories: [],
      showAddForm: false,
      editingProduct: null,
      nextId: 1,
      imageError: '',
      lowStockThreshold: 10, // Ngưỡng mặc định
      productForm: {
        title: '',
        price: 0,
        category: '',
        description: '',
        quantity: 0,
        discount: 0,
        images: [],
        featured: false
      }
    };
  },
  mounted() {
    this.layDuLieuSanPham();
    this.layCategories();
  },
  watch: {
    danhSachSanPham: {
      handler(newProducts) {
        if (newProducts.length > 0) {
          const maxId = Math.max(...newProducts.map(p => parseInt(p.id) || 0));
          this.nextId = maxId + 1;
        } else {
          this.nextId = 1;
        }
      },
      immediate: true
    }
  },
  methods: {
    layDuLieuSanPham() {
      axios.get('/products')
        .then(response => {
          this.danhSachSanPham = response.data;
        })
        .catch(error => {
          this.$toast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sản phẩm!');
        });
    },
    layCategories() {
      axios.get('/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          this.$toast.error('Lỗi tải danh mục', 'Không thể tải danh sách danh mục!');
        });
    },
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      if (this.productForm.images.length + files.length > 5) {
        this.imageError = `Bạn chỉ có thể tải lên tối đa 5 hình ảnh.`;
        return;
      }
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => this.productForm.images.push(e.target.result);
        reader.readAsDataURL(file);
      });
    },
    clearImages() {
      this.productForm.images = [];
    },
    async saveProduct() {
      const productData = { ...this.productForm, id: this.editingProduct ? this.editingProduct.id : this.nextId.toString() };
      try {
        if (this.editingProduct) {
          await axios.put(`/products/${this.editingProduct.id}`, productData);
          this.$toast.success('Cập nhật thành công!');
        } else {
          await axios.post('/products', productData);
          this.$toast.success('Thêm sản phẩm thành công!');
        }
        this.layDuLieuSanPham();
        this.resetForm();
      } catch (error) {
        this.$toast.error('Lỗi lưu sản phẩm!');
      }
    },
    editProduct(product) {
      this.editingProduct = product;
      this.productForm = { ...product, images: Array.isArray(product.images) ? [...product.images] : [] };
      this.showAddForm = true;
    },
    xoaSanPham(id) {
      if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        axios.delete(`/products/${id}`)
          .then(() => {
            this.layDuLieuSanPham();
            this.$toast.success('Xóa sản phẩm thành công!');
          })
          .catch(() => this.$toast.error('Xóa sản phẩm thất bại!'));
      }
    },
    resetForm() {
      this.productForm = { title: '', price: 0, category: '', description: '', quantity: 0, discount: 0, images: [], featured: false };
      this.editingProduct = null;
      this.showAddForm = false;
      this.imageError = '';
    }
  },
};
</script>

<style scoped>
.modal { display: block; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4); }
.modal-content { background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 700px; }
.close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
.form-group { margin-bottom: 15px; }
</style>