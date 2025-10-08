import { createRouter, createWebHistory } from 'vue-router';
import Home from './Home.vue';
import SanPham from './SanPham.vue';
import ChiTietSanPham from './ChiTietSanPham.vue';
import AdminSanPham from './admin/AdminSanPham.vue';
import AdminCategory from './admin/AdminCategory.vue';
import QuanLyDanhMuc from './admin/QuanLyDanhMuc.vue';
import AdminQuanLyUsers from './admin/AdminQuanLyUsers.vue';
import Login from './login/Login.vue';
import DangKy from './login/DangKy.vue';
import Logout from './login/logout.vue';
import UserAdmin from './user/UserAdmin.vue';
import CapNhatUser from './user/CapNhatUser.vue';

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/san-pham', component: SanPham, name: 'SanPham' },
    { path: '/chi-tiet-san-pham/:id', component: ChiTietSanPham, name: 'ChiTietSanPham' },
    { path: '/admin/san-pham', component: AdminSanPham, name: 'AdminSanPham' },
    { path: '/admin/category', component: AdminCategory, name: 'AdminCategory' },
    { path: '/admin/quan-ly-danh-muc', component: QuanLyDanhMuc, name: 'QuanLyDanhMuc' },
    { path: '/admin/users', component: AdminQuanLyUsers, name: 'AdminQuanLyUsers' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/dangky', component: DangKy, name: 'DangKy' },
    { path: '/logout', component: Logout, name: 'Logout' },
    { path: '/user/admin', component: UserAdmin, name: 'UserAdmin' },
    { path: '/cap-nhat-user', component: CapNhatUser, name: 'CapNhatUser' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (to.path.startsWith('/admin') || to.path.startsWith('/user')) {
        if (!user || user.role !== 'admin') {
            alert('Bạn cần đăng nhập với quyền admin!');
            next('/login');
        } else {
            next();
        }
    } else if (to.path === '/logout') {
        // Allow access to logout page if logged in
        if (!user) {
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;