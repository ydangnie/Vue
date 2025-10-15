<template>
  <div class="admin-san-pham">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Quản lý sản phẩm</h1>
      <router-link to="/logout" class="btn btn-outline-danger">
        <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
      </router-link>
    </div>
    <button @click="showAddForm = true" class="btn btn-primary mb-3">Thêm sản phẩm</button>

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

    <table class="table table-striped">
      <thead>
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
        <tr v-for="sanPham in danhSachSanPham" :key="sanPham.id">
          <td>{{ sanPham.id }}</td>
          <td>
            <div class="image-preview">
              <img v-if="sanPham.images && sanPham.images.length > 0" :src="sanPham.images[0]" alt="Product Image" style="max-width: 50px; margin: 2px;">
              <span v-else class="text-muted">No image</span>
            </div>
          </td>
          <td>{{ sanPham.title }}</td>
          <td>${{ sanPham.price }}</td>
          <td>{{ sanPham.category }}</td>
          <td>{{ sanPham.quantity }}</td>
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
          console.error('Lỗi:', error);
          this.$toast.error('Lỗi tải dữ liệu', 'Không thể tải danh sách sản phẩm!');
        });
    },
    layCategories() {
      axios.get('/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Lỗi:', error);
          this.$toast.error('Lỗi tải danh mục', 'Không thể tải danh sách danh mục!');
        });
    },
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      const maxImages = 5;
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

      this.imageError = '';

      if (this.productForm.images.length + files.length > maxImages) {
        this.imageError = `Bạn chỉ có thể tải lên tối đa ${maxImages} hình ảnh.`;
        return;
      }

      files.forEach(file => {
        if (!validTypes.includes(file.type)) {
          this.imageError = 'Chỉ chấp nhận các định dạng JPEG, PNG hoặc GIF.';
          return;
        }
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.productForm.images.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    },
    clearImages() {
      this.productForm.images = [];
      this.imageError = '';
    },
    async saveProduct() {
      const productData = {
        ...this.productForm,
        id: this.editingProduct ? this.editingProduct.id : this.nextId
      };

      try {
        if (this.editingProduct) {
          await axios.put(`/products/${this.editingProduct.id}`, productData);
          this.$toast.success('Cập nhật thành công', `Sản phẩm "${this.productForm.title}" đã được cập nhật!`);
        } else {
          await axios.post('/products', productData);
          this.nextId++;
          this.$toast.success('Thêm sản phẩm thành công', `Sản phẩm "${this.productForm.title}" đã được thêm!`);
        }
        this.layDuLieuSanPham();
        this.resetForm();
      } catch (error) {
        console.error('Lỗi:', error);
        this.$toast.error('Lỗi lưu sản phẩm', 'Có lỗi xảy ra khi lưu sản phẩm!');
      }
    },
    editProduct(product) {
      this.editingProduct = product;
      this.productForm = {
        title: product.title || '',
        price: product.price || 0,
        category: product.category || '',
        description: product.description || '',
        quantity: product.quantity || 0,
        discount: product.discount || 0,
        images: Array.isArray(product.images) ? [...product.images] : [],
        featured: product.featured || false
      };
      this.showAddForm = true;
    },
    xoaSanPham(id) {
      if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        axios.delete(`/products/${id}`)
          .then(() => {
            this.layDuLieuSanPham();
            this.$toast.success('Xóa sản phẩm thành công', 'Sản phẩm đã được xóa khỏi hệ thống!');
          })
          .catch(error => {
            console.error('Lỗi:', error);
            this.$toast.error('Xóa sản phẩm thất bại', 'Có lỗi xảy ra khi xóa sản phẩm!');
          });
      }
    },
    resetForm() {
      this.productForm = {
        title: '',
        price: 0,
        category: '',
        description: '',
        quantity: 0,
        discount: 0,
        images: [],
        featured: false
      };
      this.editingProduct = null;
      this.showAddForm = false;
      this.imageError = '';
    }
  },
};
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.text-danger {
  font-size: 0.875rem;
  margin-top: 5px;
}

.image-preview img {
  max-height: 50px;
  margin-right: 5px;
}

.text-muted {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>