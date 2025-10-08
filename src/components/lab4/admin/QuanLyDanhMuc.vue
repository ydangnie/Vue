<template>
  <div class="quan-ly-danh-muc">
    <h1>Quản lý danh mục sản phẩm</h1>
    <button @click="showAddForm = true" class="btn btn-primary mb-3">Thêm danh mục</button>

    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddForm = false">&times;</span>
        <h2>{{ editingCategory ? 'Sửa danh mục' : 'Thêm danh mục' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Name:</label>
            <input v-model="categoryForm.name" required class="form-control">
          </div>
          <button type="submit" class="btn btn-success">{{ editingCategory ? 'Cập nhật' : 'Thêm' }}</button>
        </form>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)" class="btn btn-warning btn-sm">Sửa</button>
            <button @click="deleteCategory(category.id)" class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'QuanLyDanhMuc',
  data() {
    return {
      categories: [],
      showAddForm: false,
      editingCategory: null,
      nextId: 1,
      categoryForm: {
        name: ''
      }
    };
  },
  mounted() {
    this.loadCategories();
  },
  watch: {
    categories: {
      handler(newCategories) {
        // Calculate next ID based on existing categories
        if (newCategories.length > 0) {
          const maxId = Math.max(...newCategories.map(c => parseInt(c.id) || 0));
          this.nextId = maxId + 1;
        } else {
          this.nextId = 1;
        }
      },
      immediate: true
    }
  },
  methods: {
    loadCategories() {
      axios.get('http://localhost:3001/categories')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    saveCategory() {
      if (this.editingCategory) {
        axios.put(`http://localhost:3001/categories/${this.editingCategory.id}`, this.categoryForm)
          .then(() => {
            this.loadCategories();
            this.resetForm();
            this.$toast.success('Cập nhật thành công', `Danh mục "${this.categoryForm.name}" đã được cập nhật!`);
          })
          .catch(error => {
            console.error('Lỗi:', error);
            this.$toast.error('Cập nhật thất bại', 'Có lỗi xảy ra khi cập nhật danh mục!');
          });
      } else {
        axios.post('http://localhost:3001/categories', { ...this.categoryForm, id: this.nextId })
          .then(() => {
            this.nextId++;
            this.loadCategories();
            this.resetForm();
            this.$toast.success('Thêm danh mục thành công', `Danh mục "${this.categoryForm.name}" đã được thêm!`);
          })
          .catch(error => {
            console.error('Lỗi:', error);
            this.$toast.error('Thêm danh mục thất bại', 'Có lỗi xảy ra khi thêm danh mục!');
          });
      }
    },
    editCategory(category) {
      this.editingCategory = category;
      this.categoryForm = { ...category };
      this.showAddForm = true;
    },
    deleteCategory(id) {
      if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
        axios.delete(`http://localhost:3001/categories/${id}`)
          .then(() => {
            this.loadCategories();
            this.$toast.success('Xóa danh mục thành công', 'Danh mục đã được xóa khỏi hệ thống!');
          })
          .catch(error => {
            console.error('Lỗi:', error);
            this.$toast.error('Xóa danh mục thất bại', 'Có lỗi xảy ra khi xóa danh mục!');
          });
      }
    },
    resetForm() {
      this.categoryForm = {
        name: ''
      };
      this.editingCategory = null;
      this.showAddForm = false;
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
</style>
