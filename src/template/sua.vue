<script setup>
import { ref, watch } from 'vue';

// Nhận dữ liệu sản phẩm và ID từ props
const props = defineProps({
  product: {
    type: Object,
    default: () => ({
      id: null,
      title: '',
      price: 0,
      category: '',
      image: '',
      description: ''
    })
  }
});

// Phát sự kiện để lưu hoặc đặt lại biểu mẫu
const emit = defineEmits(['save', 'reset']);

// Dữ liệu biểu mẫu, đồng bộ với props.product
const formData = ref({ ...props.product });

// Theo dõi thay đổi của props.product để cập nhật formData
watch(() => props.product, (newProduct) => {
  formData.value = { ...newProduct };
}, { deep: true });

function handleSubmit() {
  emit('save', { ...formData.value });
}

function handleReset() {
  formData.value = {
    id: null,
    title: '',
    price: 0,
    category: '',
    image: '',
    description: ''
  };
  emit('reset');
}
</script>

<template>
  <div class="card shadow-sm sticky-col" id="editForm">
    <div class="card-header">Chỉnh sửa sản phẩm</div>
    <div class="card-body">
      <form action="#" method="post" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="pTitle" class="form-label">Tên sản phẩm</label>
          <input
            type="text"
            class="form-control"
            id="pTitle"
            name="title"
            placeholder="Tên sản phẩm"
            required
            v-model="formData.title"
          >
        </div>
        <div class="mb-3">
          <label for="pPrice" class="form-label">Giá (USD)</label>
          <input
            type="number"
            class="form-control"
            id="pPrice"
            name="price"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            v-model="formData.price"
          >
        </div>
        <div class="mb-3">
          <label for="pCategory" class="form-label">Danh mục</label>
          <select
            id="pCategory"
            class="form-select"
            name="category"
            required
            v-model="formData.category"
          >
            <option value="" selected>Chọn...</option>
            <option>Điện tử</option>
            <option>Nhà cửa</option>
            <option>Thời trang</option>
            <option>Thể thao</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="pImage" class="form-label">URL hình ảnh</label>
          <input
            type="url"
            class="form-control"
            id="pImage"
            name="image"
            placeholder="https://example.com/image.jpg"
            required
            v-model="formData.image"
          >
        </div>
        <div class="mb-3">
          <label for="pDesc" class="form-label">Mô tả</label>
          <textarea
            id="pDesc"
            class="form-control"
            name="description"
            rows="3"
            placeholder="Mô tả ngắn về sản phẩm"
            required
            v-model="formData.description"
          ></textarea>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">Lưu</button>
          <button type="button" class="btn btn-outline-secondary" @click="handleReset">Đặt lại</button>
        </div>

        <input type="hidden" name="id" v-model="formData.id">
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Đảm bảo style chỉ áp dụng cho component này */
.card {
  max-width: 100%;
}
</style>