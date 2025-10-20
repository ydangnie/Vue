<template>
  <div class="admin-quan-ly-users">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">
          <i class="fas fa-users-cog"></i> Quản lý người dùng
        </h1>
        <router-link to="/logout" class="btn btn-outline-danger">
          <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
        </router-link>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon"><i class="fas fa-users"></i></div>
            <div class="stat-content">
              <h3>{{ users.length }}</h3>
              <p>Tổng người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon"><i class="fas fa-user-shield"></i></div>
            <div class="stat-content">
              <h3>{{ adminCount }}</h3>
              <p>Quản trị viên</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon"><i class="fas fa-user"></i></div>
            <div class="stat-content">
              <h3>{{ userCount }}</h3>
              <p>Người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon"><i class="fas fa-user-plus"></i></div>
            <div class="stat-content">
              <h3>{{ newUsersThisMonth }}</h3>
              <p>Thành viên mới (tháng)</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm kiếm theo tên hoặc email...">
            </div>
            <div class="col-md-3">
              <select v-model="roleFilter" class="form-control">
                <option value="">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" @change="sortUsers" class="form-control">
                <option value="username">Sắp xếp theo tên</option>
                <option value="email">Sắp xếp theo email</option>
                <option value="totalSpent">Sắp xếp theo chi tiêu</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="resetFilters" class="btn btn-secondary w-100">
                <i class="fas fa-undo"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Danh sách người dùng</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Tổng chi tiêu</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ user.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                    </span>
                  </td>
                  <td>
                    <span class="fw-bold text-success">${{ user.totalSpent ? user.totalSpent.toFixed(2) : '0.00' }}</span>
                  </td>
                  <td>{{ formatDate(user.id) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="editUser(user)" class="btn btn-sm btn-outline-primary" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                      <button @click="toggleUserRole(user)" class="btn btn-sm btn-outline-warning" title="Đổi vai trò" :disabled="user.username === currentUser?.username"><i class="fas fa-exchange-alt"></i></button>
                      <button @click="deleteUser(user.id)" class="btn btn-sm btn-outline-danger" title="Xóa" :disabled="user.username === currentUser?.username"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showEditModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa người dùng</h5>
              <button @click="closeEditModal" class="btn-close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveUserChanges">
                <div class="mb-3">
                  <label class="form-label">Tên đăng nhập</label>
                  <input v-model="editUserForm.username" type="text" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="editUserForm.email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Vai trò</label>
                  <select v-model="editUserForm.role" class="form-control" required>
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">Lưu thay đổi</button>
                  <button @click="closeEditModal" type="button" class="btn btn-secondary">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../../../axios.js';

export default {
  name: 'AdminQuanLyUsers',
  data() {
    return {
      users: [],
      filteredUsers: [],
      searchQuery: '',
      roleFilter: '',
      sortBy: 'username',
      showEditModal: false,
      editUserForm: {},
      currentUser: null
    };
  },
  computed: {
    adminCount() { return this.users.filter(user => user.role === 'admin').length; },
    userCount() { return this.users.filter(user => user.role === 'user').length; },
    newUsersThisMonth() {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      return this.users.filter(user => new Date(parseInt(user.id)) >= startOfMonth).length;
    }
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.loadUsersAndOrders();
  },
  watch: {
    searchQuery() { this.filterUsers(); },
    roleFilter() { this.filterUsers(); }
  },
  methods: {
    async loadUsersAndOrders() {
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          axios.get('/users'),
          axios.get('/orders')
        ]);
        
        const users = usersResponse.data;
        const orders = ordersResponse.data;

        const userSpending = {};
        orders.forEach(order => {
          if (order.status === 'delivered') {
            const email = order.customer.email;
            userSpending[email] = (userSpending[email] || 0) + order.total;
          }
        });

        this.users = users.map(user => ({
          ...user,
          totalSpent: userSpending[user.email] || 0
        }));

        this.filteredUsers = [...this.users];
        this.sortUsers();
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      }
    },
    filterUsers() {
      let filtered = this.users.filter(user =>
        (user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
         user.email.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
        (this.roleFilter ? user.role === this.roleFilter : true)
      );
      this.filteredUsers = filtered;
      this.sortUsers();
    },
    sortUsers() {
      this.filteredUsers.sort((a, b) => {
        switch (this.sortBy) {
          case 'email': return a.email.localeCompare(b.email);
          case 'totalSpent': return b.totalSpent - a.totalSpent;
          default: return a.username.localeCompare(b.username);
        }
      });
    },
    resetFilters() {
      this.searchQuery = '';
      this.roleFilter = '';
      this.sortBy = 'username';
      this.filteredUsers = [...this.users];
      this.sortUsers();
    },
    editUser(user) {
      this.editUserForm = { ...user };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    saveUserChanges() {
      axios.put(`/users/${this.editUserForm.id}`, this.editUserForm)
        .then(() => {
          this.loadUsersAndOrders();
          this.closeEditModal();
        })
        .catch(error => console.error('Lỗi cập nhật user:', error));
    },
    toggleUserRole(user) {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      axios.patch(`/users/${user.id}`, { role: newRole })
        .then(() => this.loadUsersAndOrders())
        .catch(error => console.error('Lỗi đổi vai trò:', error));
    },
    deleteUser(userId) {
      if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        axios.delete(`/users/${userId}`)
          .then(() => this.loadUsersAndOrders())
          .catch(error => console.error('Lỗi xóa user:', error));
      }
    },
    getRoleBadgeClass(role) {
      return role === 'admin' ? 'badge bg-danger' : 'badge bg-primary';
    },
    formatDate(timestamp) {
      try {
        return new Date(parseInt(timestamp)).toLocaleDateString('vi-VN');
      } catch (e) { return 'N/A'; }
    }
  }
};
</script>

<style scoped>
.stat-card { border-radius: 10px; padding: 20px; display: flex; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.stat-icon { font-size: 2rem; margin-right: 15px; }
.stat-content h3 { margin: 0; font-size: 2rem; font-weight: bold; }
.card { border: none; border-radius: 10px; box-shadow: 0 2px 15px rgba(0,0,0,0.1); }
.card-header { background: linear-gradient(135deg, #747578 0%, #000000 100%); color: white; border-radius: 10px 10px 0 0 !important; }
</style>