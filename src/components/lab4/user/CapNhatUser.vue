<template>
  <div class="cap-nhat-user">
    <div class="container">
      <h1 class="mb-4">Cập nhật thông tin cá nhân</h1>
      <div class="row">
        <div class="col-md-8">
          <form @submit.prevent="updateUser" class="profile-form">
            <div class="form-group mb-3">
              <label for="username">Tên đăng nhập:</label>
              <input v-model="userForm.username" id="username" required class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="email">Email:</label>
              <input v-model="userForm.email" type="email" id="email" required class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="age">Tuổi:</label>
              <input v-model.number="userForm.age" type="number" id="age" min="1" max="120" class="form-control">
            </div>
            <div class="form-group mb-3">
              <label for="gender">Giới tính:</label>
              <select v-model="userForm.gender" id="gender" class="form-control">
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="desiredProducts">Sản phẩm mong muốn:</label>
              <textarea v-model="userForm.desiredProducts" id="desiredProducts" class="form-control" rows="3" placeholder="Mô tả sản phẩm bạn quan tâm..."></textarea>
            </div>
            <div class="form-group mb-3">
              <label for="password">Mật khẩu mới (để trống nếu không đổi):</label>
              <input v-model="userForm.password" type="password" id="password" class="form-control">
            </div>
            <button type="submit" class="btn btn-success btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}
            </button>
          </form>
        </div>
        <div class="col-md-4">
          <div class="profile-info">
            <h4>Thông tin hiện tại</h4>
            <div class="info-item">
              <strong>Tên đăng nhập:</strong> {{ currentUser?.username }}
            </div>
            <div class="info-item">
              <strong>Email:</strong> {{ currentUser?.email }}
            </div>
            <div class="info-item">
              <strong>Tuổi:</strong> {{ currentUser?.age || 'Chưa cập nhật' }}
            </div>
            <div class="info-item">
              <strong>Giới tính:</strong> {{ getGenderText(currentUser?.gender) }}
            </div>
            <div class="info-item">
              <strong>Sản phẩm mong muốn:</strong>
              <p class="mb-0">{{ currentUser?.desiredProducts || 'Chưa cập nhật' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js'
import { mapActions } from 'vuex'

export default {
  name: 'CapNhatUser',
  data() {
    return {
      userForm: {
        username: '',
        email: '',
        password: '',
        age: null,
        gender: '',
        desiredProducts: ''
      },
      currentUser: null,
      loading: false
    };
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    if (this.currentUser) {
      this.userForm = { ...this.currentUser };
    }
  },
  methods: {
    ...mapActions(['updateUser']),
    async updateUser() {
      if (this.loading) return;

      this.loading = true;
      try {
        const updateData = { ...this.userForm };
        // Remove password if empty
        if (!updateData.password) {
          delete updateData.password;
        }

        await axios.put(`/users/${this.currentUser.id}`, updateData);

        // Update localStorage
        const updatedUser = { ...this.currentUser, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update Vuex store
        this.updateUser(updatedUser);

        this.$toast.success('Cập nhật thông tin thành công!');
        this.currentUser = updatedUser;
      } catch (error) {
        console.error('Lỗi:', error);
        this.$toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
      } finally {
        this.loading = false;
      }
    },
    getGenderText(gender) {
      const genderMap = {
        'male': 'Nam',
        'female': 'Nữ',
        'other': 'Khác'
      };
      return genderMap[gender] || 'Chưa cập nhật';
    }
  },
};
</script>

<style scoped>
.cap-nhat-user {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.profile-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 10px 15px;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa085 100%);
  transform: translateY(-2px);
}

.btn-success:disabled {
  opacity: 0.7;
  transform: none;
}

.profile-info {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
}

.profile-info h4 {
  color: #495057;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.info-item {
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-item strong {
  color: #495057;
  display: block;
  margin-bottom: 5px;
}

.info-item p {
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .profile-form,
  .profile-info {
    margin-bottom: 20px;
  }
}
</style>
