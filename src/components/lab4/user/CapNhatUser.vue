<template>
  <div class="cap-nhat-user">
    <h1>Cập nhật thông tin cá nhân</h1>
    <form @submit.prevent="updateUser">
      <div class="form-group">
        <label for="username">Tên đăng nhập:</label>
        <input v-model="userForm.username" id="username" required class="form-control">
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="userForm.email" type="email" id="email" required class="form-control">
      </div>
      <div class="form-group">
        <label for="password">Mật khẩu mới:</label>
        <input v-model="userForm.password" type="password" id="password" class="form-control">
      </div>
      <button type="submit" class="btn btn-success">Cập nhật</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CapNhatUser',
  data() {
    return {
      userForm: {
        username: '',
        email: '',
        password: ''
      },
      currentUser: null
    };
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    if (this.currentUser) {
      this.userForm = { ...this.currentUser };
    }
  },
  methods: {
    updateUser() {
      axios.put(`http://localhost:3001/users/${this.currentUser.id}`, this.userForm)
        .then(() => {
          localStorage.setItem('user', JSON.stringify(this.userForm));
          alert('Cập nhật thành công!');
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    }
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
</style>
