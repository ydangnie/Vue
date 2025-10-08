<template>
  <div class="user-admin">
    <h1>Quản lý tài khoản người dùng</h1>
    <router-link to="/cap-nhat-user" class="btn btn-primary mb-3">Cập nhật thông tin cá nhân</router-link>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(user)" class="btn btn-warning btn-sm">Sửa</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showEditForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditForm = false">&times;</span>
        <h2>Sửa người dùng</h2>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Username:</label>
            <input v-model="userForm.username" required class="form-control">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="userForm.email" type="email" required class="form-control">
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="userForm.role" required class="form-control">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">Cập nhật</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserAdmin',
  data() {
    return {
      users: [],
      showEditForm: false,
      editingUser: null,
      userForm: {
        username: '',
        email: '',
        role: 'user'
      }
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      axios.get('http://localhost:3001/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    editUser(user) {
      this.editingUser = user;
      this.userForm = { ...user };
      this.showEditForm = true;
    },
    saveUser() {
      axios.put(`http://localhost:3001/users/${this.editingUser.id}`, this.userForm)
        .then(() => {
          this.loadUsers();
          this.showEditForm = false;
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    },
    deleteUser(id) {
      if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        axios.delete(`http://localhost:3001/users/${id}`)
          .then(() => {
            this.loadUsers();
          })
          .catch(error => {
            console.error('Lỗi:', error);
          });
      }
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
