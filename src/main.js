import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css' // Đã xóa bỏ
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- THÊM DÒNG NÀY
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './components/lab4/router.js'
import store from './components/store';

console.log('Starting Vue app...');
const app = createApp(App);

app.use(store);
console.log('Router:', router);
app.use(router);

// Global toast method
app.config.globalProperties.$toast = {
    show(type, title, message, duration = 3000) {
        if (app._instance && app._instance.proxy && app._instance.proxy.showToast) {
            app._instance.proxy.showToast(type, title, message, duration);
        }
    },
    success(title, message, duration) {
        this.show('success', title, message, duration);
    },
    error(title, message, duration) {
        this.show('error', title, message, duration);
    },
    warning(title, message, duration) {
        this.show('warning', title, message, duration);
    },
    info(title, message, duration) {
        this.show('info', title, message, duration);
    }
};

console.log('Mounting app...');
app.mount('#app');
console.log('App mounted successfully!');