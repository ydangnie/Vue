<template>
  <div class="login">
    <h1>Đăng nhập</h1>
    <input v-model="username" placeholder="Tên đăng nhập" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />
    <button @click="dangNhap">Đăng nhập</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    dangNhap() {
      axios.get('http://localhost:3001/users')
        .then(response => {
          const user = response.data.find(u => u.username === this.username && u.password === this.password);
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.$toast.success('Đăng nhập thành công', `Chào mừng ${user.username}!`);
            this.$router.push('/');
          } else {
            this.$toast.error('Đăng nhập thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng!');
          }
        })
        .catch(error => {
          console.error('Lỗi:', error);
          this.$toast.error('Lỗi hệ thống', 'Không thể kết nối đến máy chủ!');
        });
    },
  },
};
</script>
