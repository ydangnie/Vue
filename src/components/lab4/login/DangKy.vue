<template>
  <div class="dang-ky">
    <h1>Đăng ký tài khoản</h1>
    <form @submit.prevent="dangKy">
      <div>
        <label for="username">Tên đăng nhập:</label>
        <input v-model="duLieuForm.username" id="username" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="duLieuForm.email" type="email" id="email" required />
      </div>
      <div>
        <label for="password">Mật khẩu:</label>
        <input v-model="duLieuForm.password" type="password" id="password" required />
      </div>
      <div>
        <label for="role">Vai trò:</label>
        <select v-model="duLieuForm.role" id="role" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">Đăng ký</button>
    </form>
    <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DangKy',
  data() {
    return {
      duLieuForm: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  methods: {
    dangKy() {
      axios.get('http://localhost:3001/users')
        .then(response => {
          const danhSachNguoiDung = response.data;
          if (danhSachNguoiDung.some(user => user.username === this.duLieuForm.username)) {
            this.$toast.warning('Tên đăng nhập đã tồn tại', 'Vui lòng chọn tên đăng nhập khác!');
          } else {
            const moiNguoiDung = {
              id: Date.now(), // Tạo ID duy nhất dựa trên thời gian
              ...this.duLieuForm,
            };
            axios.post('http://localhost:3001/users', moiNguoiDung)
              .then(() => {
                this.$toast.success('Đăng ký thành công', 'Tài khoản của bạn đã được tạo!');
                this.$router.push('/login');
              })
              .catch(error => {
                console.error('Lỗi khi đăng ký:', error);
                this.$toast.error('Đăng ký thất bại', 'Có lỗi xảy ra, vui lòng thử lại!');
              });
          }
        })
        .catch(error => {
          console.error('Lỗi khi lấy danh sách người dùng:', error);
          this.$toast.error('Lỗi hệ thống', 'Không thể kết nối đến máy chủ!');
        });
    },
  },
};
</script>

<style scoped>
.dang-ky {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.dang-ky div {
  margin-bottom: 15px;
}
.dang-ky label {
  display: block;
  margin-bottom: 5px;
}
.dang-ky input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.dang-ky button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
.dang-ky button:hover {
  background-color: #45a049;
}
</style>
