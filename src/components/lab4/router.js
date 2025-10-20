// src/components/lab4/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './Home.vue';
import SanPham from './SanPham.vue';
import ChiTietSanPham from './ChiTietSanPham.vue';
import GioHang from './GioHang.vue';
import ThanhToan from './ThanhToan.vue';
import DonHangThanhCong from './DonHangThanhCong.vue';
import AdminSanPham from './admin/AdminSanPham.vue';
import AdminCategory from './admin/AdminCategory.vue';
import QuanLyDanhMuc from './admin/QuanLyDanhMuc.vue';
import AdminQuanLyUsers from './admin/AdminQuanLyUsers.vue';
import AdminQuanLyDonHang from './admin/AdminQuanLyDonHang.vue';
import BaoCaoThongKe from './admin/BaoCaoThongKe.vue';
import Login from './login/Login.vue';
import DangKy from './login/DangKy.vue';
import Logout from './login/logout.vue';
import UserAdmin from './user/UserAdmin.vue';
import CapNhatUser from './user/CapNhatUser.vue';
import LichSuDonHang from './user/LichSuDonHang.vue';
import YeuThich from './user/YeuThich.vue';
import VnPayReturn from './VnPayReturn.vue';

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/vnpay_return', component: VnPayReturn, name: 'VnPayReturn' },
    { path: '/san-pham', component: SanPham, name: 'SanPham' },
    { path: '/chi-tiet-san-pham/:id', component: ChiTietSanPham, name: 'ChiTietSanPham' },
    { path: '/gio-hang', component: GioHang, name: 'GioHang' },
    { path: '/thanh-toan', component: ThanhToan, name: 'ThanhToan', meta: { requiresAuth: true } },
    { path: '/don-hang-thanh-cong/:orderId', component: DonHangThanhCong, name: 'DonHangThanhCong', meta: { requiresAuth: true } },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/dangky', component: DangKy, name: 'DangKy' },
    { path: '/logout', component: Logout, name: 'Logout', meta: { requiresAuth: true } },

    // User routes
    { path: '/cap-nhat-user', component: CapNhatUser, name: 'CapNhatUser', meta: { requiresAuth: true } },
    { path: '/lich-su-don-hang', component: LichSuDonHang, name: 'LichSuDonHang', meta: { requiresAuth: true } },
    { path: '/yeu-thich', component: YeuThich, name: 'YeuThich', meta: { requiresAuth: true } },

    // Admin routes
    { path: '/admin/san-pham', component: AdminSanPham, name: 'AdminSanPham', meta: { requiresAdmin: true } },
    { path: '/admin/category', component: AdminCategory, name: 'AdminCategory', meta: { requiresAdmin: true } },
    { path: '/admin/quan-ly-danh-muc', component: QuanLyDanhMuc, name: 'QuanLyDanhMuc', meta: { requiresAdmin: true } },
    { path: '/admin/users', component: AdminQuanLyUsers, name: 'AdminQuanLyUsers', meta: { requiresAdmin: true } },
    { path: '/admin/orders', component: AdminQuanLyDonHang, name: 'AdminQuanLyDonHang', meta: { requiresAdmin: true } },
    { path: '/admin/reports', component: BaoCaoThongKe, name: 'BaoCaoThongKe', meta: { requiresAdmin: true } },
    { path: '/user/admin', component: UserAdmin, name: 'UserAdmin', meta: { requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (to.meta.requiresAdmin) {
        if (!user || user.role !== 'admin') {
            alert('Bạn cần đăng nhập với quyền admin!');
            next('/login');
        } else {
            next();
        }
    } else if (to.meta.requiresAuth) {
        if (!user) {
            alert('Bạn cần đăng nhập để truy cập trang này!');
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;