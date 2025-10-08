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

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ users.length }}</h3>
              <p>Tổng người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="fas fa-user-shield"></i>
            </div>
            <div class="stat-content">
              <h3>{{ adminCount }}</h3>
              <p>Quản trị viên</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="stat-content">
              <h3>{{ userCount }}</h3>
              <p>Người dùng</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <div class="stat-content">
              <h3>{{ newUsersThisMonth }}</h3>
              <p>Thành viên mới (tháng)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Tìm kiếm theo tên đăng nhập hoặc email...">
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
                <option value="role">Sắp xếp theo vai trò</option>
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

      <!-- Users Table -->
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
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="avatar-circle me-2">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                      {{ user.username }}
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ user.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.id) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="editUser(user)" class="btn btn-sm btn-outline-primary" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="toggleUserRole(user)" class="btn btn-sm btn-outline-warning" title="Đổi vai trò"
                              :disabled="user.username === currentUser?.username">
                        <i class="fas fa-exchange-alt"></i>
                      </button>
                      <button @click="deleteUser(user.id)" class="btn btn-sm btn-outline-danger" title="Xóa"
                              :disabled="user.username === currentUser?.username">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No users message -->
          <div v-if="filteredUsers.length === 0" class="text-center py-5">
            <i class="fas fa-users fa-3x text-muted mb-3"></i>
            <h4>Không tìm thấy người dùng nào</h4>
            <p class="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        </div>
      </div>

      <!-- Edit User Modal -->
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
                <div class="mb-3">
                  <label class="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
                  <input v-model="editUserForm.password" type="password" class="form-control">
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
import axios from 'axios';

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
      editUserForm: {
        id: null,
        username: '',
        email: '',
        role: 'user',
        password: ''
      },
      currentUser: null
    };
  },
  computed: {
    adminCount() {
      return this.users.filter(user => user.role === 'admin').length;
    },
    userCount() {
      return this.users.filter(user => user.role === 'user').length;
    },
    newUsersThisMonth() {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return this.users.filter(user => {
        const userDate = new Date(parseInt(user.id));
        return userDate >= startOfMonth;
      }).length;
    }
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.loadUsers();
  },
  watch: {
    searchQuery() {
      this.filterUsers();
    },
    roleFilter() {
      this.filterUsers();
    }
  },
  methods: {
    loadUsers() {
      axios.get('http://localhost:3001/users')
        .then(response => {
          this.users = response.data;
          this.filteredUsers = [...this.users];
          this.sortUsers();
        })
        .catch(error => {
          console.error('Error loading users:', error);
          this.$router.push('/login');
        });
    },
    filterUsers() {
      let filtered = [...this.users];

      if (this.searchQuery) {
        filtered = filtered.filter(user =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.roleFilter) {
        filtered = filtered.filter(user => user.role === this.roleFilter);
      }

      this.filteredUsers = filtered;
      this.sortUsers();
    },
    sortUsers() {
      this.filteredUsers.sort((a, b) => {
        switch (this.sortBy) {
          case 'email':
            return a.email.localeCompare(b.email);
          case 'role':
            return a.role.localeCompare(b.role);
          default:
            return a.username.localeCompare(b.username);
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
      this.editUserForm = { ...user, password: '' };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editUserForm = {
        id: null,
        username: '',
        email: '',
        role: 'user',
        password: ''
      };
    },
    saveUserChanges() {
      const updateData = { ...this.editUserForm };
      if (!updateData.password) {
        delete updateData.password;
      }

      axios.put(`http://localhost:3001/users/${this.editUserForm.id}`, updateData)
        .then(() => {
          this.loadUsers();
          this.closeEditModal();
          // Update current user in localStorage if editing self
          if (this.editUserForm.id === this.currentUser?.id) {
            localStorage.setItem('user', JSON.stringify(updateData));
          }
        })
        .catch(error => {
          console.error('Error updating user:', error);
          alert('Có lỗi xảy ra khi cập nhật người dùng');
        });
    },
    toggleUserRole(user) {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      axios.put(`http://localhost:3001/users/${user.id}`, { ...user, role: newRole })
        .then(() => {
          this.loadUsers();
        })
        .catch(error => {
          console.error('Error updating user role:', error);
          alert('Có lỗi xảy ra khi đổi vai trò');
        });
    },
    deleteUser(userId) {
      if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        axios.delete(`http://localhost:3001/users/${userId}`)
          .then(() => {
            this.loadUsers();
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            alert('Có lỗi xảy ra khi xóa người dùng');
          });
      }
    },
    getRoleBadgeClass(role) {
      return role === 'admin' ? 'badge bg-danger' : 'badge bg-primary';
    },
    formatDate(timestamp) {
      try {
        const date = new Date(parseInt(timestamp));
        return date.toLocaleDateString('vi-VN');
      } catch (e) {
        return 'N/A';
      }
    }
  }
};
</script>

<style scoped>
.stat-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-content p {
  margin: 0;
  opacity: 0.8;
}

.avatar-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.btn-group .btn {
  margin-right: 5px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.modal {
  z-index: 1050;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: none;
}
</style>