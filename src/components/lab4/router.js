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
import VnPayReturn from './VnPayReturn.vue'; // Thêm import này

const routes = [{
        path: '/vnpay_return',
        component: VnPayReturn,
        name: 'VnPayReturn'
    },
    { path: '/', component: Home, name: 'Home' },
    { path: '/san-pham', component: SanPham, name: 'SanPham' },
    { path: '/chi-tiet-san-pham/:id', component: ChiTietSanPham, name: 'ChiTietSanPham' },
    { path: '/gio-hang', component: GioHang, name: 'GioHang' },
    { path: '/thanh-toan', component: ThanhToan, name: 'ThanhToan' },
    { path: '/don-hang-thanh-cong/:orderId', component: DonHangThanhCong, name: 'DonHangThanhCong' },
    { path: '/admin/san-pham', component: AdminSanPham, name: 'AdminSanPham' },
    { path: '/admin/category', component: AdminCategory, name: 'AdminCategory' },
    { path: '/admin/quan-ly-danh-muc', component: QuanLyDanhMuc, name: 'QuanLyDanhMuc' },
    { path: '/admin/users', component: AdminQuanLyUsers, name: 'AdminQuanLyUsers' },
    { path: '/admin/orders', component: AdminQuanLyDonHang, name: 'AdminQuanLyDonHang' },
    { path: '/admin/reports', component: BaoCaoThongKe, name: 'BaoCaoThongKe' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/dangky', component: DangKy, name: 'DangKy' },
    { path: '/logout', component: Logout, name: 'Logout' },
    { path: '/user/admin', component: UserAdmin, name: 'UserAdmin' },
    { path: '/cap-nhat-user', component: CapNhatUser, name: 'CapNhatUser' },
    { path: '/lich-su-don-hang', component: LichSuDonHang, name: 'LichSuDonHang' },
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
    } else if (to.path === '/thanh-toan') {
        // Require login for checkout
        if (!user) {
            alert('Bạn cần đăng nhập để thanh toán!');
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;