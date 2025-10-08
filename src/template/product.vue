<script setup>
import { ref, computed } from 'vue';
import { products } from './product';

const productsRef = ref(products);

const formData = ref({
    id: null,
    title: '',
    price: 0,
    category: '',
    image: '',
    description: ''
});

const errors = ref({});

function validateForm() {
    errors.value = {};

    if (!formData.value.title.trim()) {
        errors.value.title = 'Tiêu đề không được để trống';
    }

    if (!formData.value.price || formData.value.price <= 0) {
        errors.value.price = 'Giá phải là một số lớn hơn 0';
    }

    if (!formData.value.category) {
        errors.value.category = 'Vui lòng chọn danh mục';
    }

    if (!formData.value.image.trim()) {
        errors.value.image = 'Đường dẫn hình ảnh không được để trống';
    }

    if (!formData.value.description.trim()) {
        errors.value.description = 'Mô tả không được để trống';
    }

    return Object.keys(errors.value).length === 0;
}

function resetForm() {
    formData.value = {
        id: null,
        title: '',
        price: 0,
        category: '',
        image: '',
        description: ''
    };
    errors.value = {};
}

function sua(id = null) {
    if (id) {
        const timkiem = productsRef.value.find(p => p.id === id);
        if (timkiem) {
            formData.value = { ...timkiem };
            const editForm = document.getElementById('editForm');
            if (editForm) {
                editForm.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else {
        resetForm();
    }
}

function luu() {
    if (!validateForm()) return;
    if (formData.value.id) {
        const index = productsRef.value.findIndex(p => p.id === formData.value.id);
        if (index !== -1) {
            productsRef.value[index] = { ...formData.value };
        }
    } else {
        const newId = productsRef.value.length > 0 ? Math.max(...productsRef.value.map(p => p.id)) + 1 : 1;
        productsRef.value.push({ ...formData.value, id: newId });
    }
    resetForm();
}

function xoa(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        productsRef.value = productsRef.value.filter(p => p.id !== id);
    }
}

const searchId = ref('');
const searchTitle = ref('');
const searchError = ref('');

const displayedProducts = computed(() => {
    const idStr = searchId.value.trim();
    const title = searchTitle.value.trim().toLowerCase();

    let filtered = productsRef.value;

    if (idStr) {
        const id = parseInt(idStr);
        if (!isNaN(id)) {
            filtered = filtered.filter(p => p.id === id);
        } else {
            searchError.value = 'ID phải là số';
            return [];
        }
    }

    if (title) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(title));
    }

    if ((idStr || title) && filtered.length === 0) {
        searchError.value = idStr ? `Không tìm thấy sản phẩm với ID ${idStr}` : `Không tìm thấy sản phẩm với tên "${searchTitle.value}"`;
    } else {
        searchError.value = '';
    }

    return filtered;
});

</script>

<template>

    <body>
        <header class="py-4 bg-white border-bottom mb-4">
            <div class="container d-flex align-items-center justify-content-between">
                <h1 class="h4 mb-0">MyShop</h1>
                <a class="btn btn-primary" href="#editForm" @click="sua()">Add / Edit Product</a>
            </div>
        </header>

        <main class="container pb-5">
            <div class="row g-4">
                <!-- Products list -->
                <section class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <div class="mb-2">
                                    <input v-model="searchId" placeholder="Nhập ID cần tìm" class="me-2 form-control" />
                                </div>
                                <div>
                                    <input v-model="searchTitle" placeholder="Nhập tên sản phẩm" class="form-control" />
                                </div>
                                <div v-if="searchError" class="mt-2">
                                    <p class="text-danger">❌ {{ searchError }}</p>
                                </div>
                                <div v-else-if="searchId || searchTitle" class="mt-2">
                                    <p>✅ Tìm thấy {{ displayedProducts.length }} sản phẩm</p>
                                </div>
                            </div>
                            <span class="fw-semibold">Products</span>
                            <small class="text-secondary">Dynamic product list</small>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th style="width:80px">Image</th>
                                            <th>Title</th>
                                            <th style="width:140px">Category</th>
                                            <th style="width:120px" class="text-end">Price</th>
                                            <th style="width:120px" class="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in displayedProducts" :key="item.id">
                                            <td><img class="product-thumb" :src="item.image" alt="Product image"></td>
                                            <td>{{ item.title }}</td>
                                            <td><span class="badge text-bg-dark">{{ item.category }}</span></td>
                                            <td class="text-end">${{ item.price }}</td>
                                            <td class="text-end">
                                                <button class="btn btn-sm btn-outline-primary me-2"
                                                    @click="sua(item.id)">Sửa</button>
                                                <button class="btn btn-sm btn-outline-danger"
                                                    @click="xoa(item.id)">Delete</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Edit form -->
                <aside class="col-lg-4">
                    <div class="card shadow-sm sticky-col" id="editForm">
                        <div class="card-header">Edit Product</div>
                        <div class="card-body">
                            <form action="#" method="post" @submit.prevent="luu">
                                <div class="mb-3">
                                    <label for="pTitle" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="pTitle" name="title"
                                        placeholder="Product title" required v-model="formData.title">
                                    <small v-if="errors.title" class="text-danger">{{ errors.title }}</small>
                                </div>
                                <div class="mb-3">
                                    <label for="pPrice" class="form-label">Price (USD)</label>
                                    <input type="number" class="form-control" id="pPrice" name="price" step="0.01"
                                        min="0" placeholder="0.00" required v-model="formData.price">
                                    <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
                                </div>
                                <div class="mb-3">
                                    <label for="pCategory" class="form-label">Category</label>
                                    <select id="pCategory" class="form-select" name="category" required
                                        v-model="formData.category">
                                        <option value="" selected>Choose...</option>
                                        <option>Electronics</option>
                                        <option>Home</option>
                                        <option>Fashion</option>
                                        <option>Sports</option>
                                    </select>
                                    <small v-if="errors.category" class="text-danger">{{ errors.category }}</small>
                                </div>
                                <div class="mb-3">
                                    <label for="pImage" class="form-label">Image URL</label>
                                    <input type="url" class="form-control" id="pImage" name="image"
                                        placeholder="https://example.com/image.jpg" required v-model="formData.image">
                                    <small v-if="errors.image" class="text-danger">{{ errors.image }}</small>
                                </div>
                                <div class="mb-3">
                                    <label for="pDesc" class="form-label">Description</label>
                                    <textarea id="pDesc" class="form-control" name="description" rows="3"
                                        placeholder="Short product description" required
                                        v-model="formData.description"></textarea>
                                    <small v-if="errors.description" class="text-danger">{{ errors.description
                                        }}</small>
                                </div>

                                <div class="d-flex gap-2">
                                    <button type="submit" class="btn btn-primary">Save</button>
                                    <button type="button" class="btn btn-outline-secondary"
                                        @click="resetForm">Reset</button>
                                </div>

                                <input type="hidden" name="id" v-model="formData.id">
                            </form>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <footer class="py-4 bg-dark text-white">
            <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
                <span>© <span id="year">2025</span> MyShop</span>
                <a class="btn btn-outline-light btn-sm" href="#top">Back to top</a>
            </div>
        </footer>
    </body>
</template>

<style>
.product-thumb {
    width: 60px;
    height: 60px;
    object-fit: cover;
}

.sticky-col {
    position: sticky;
    top: 1rem;
}

.text-danger {
    font-size: 0.875em;
}
</style>