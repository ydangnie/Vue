<template>
  <div class="vnpay-return-container">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Đang xử lý kết quả thanh toán...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <h4>Thanh toán thất bại!</h4>
      <p>{{ error }}</p>
      <router-link to="/thanh-toan" class="btn btn-primary">Thử lại</router-link>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios.js';
import { mapActions } from 'vuex';
import { vnpay } from '../modules/models.js';

export default {
  name: 'VnPayReturn',
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      const queryParams = this.$route.query;
      const isValid = vnpay.verifyReturnUrl(queryParams);

      if (isValid && queryParams.vnp_ResponseCode === '00') {
        // Thanh toán thành công
        const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
        if (pendingOrder) {
          // Lưu đơn hàng vào db.json
          const response = await axios.post('/orders', { ...pendingOrder, status: 'processing' });
          localStorage.removeItem('pendingOrder');
          
          // Dọn dẹp giỏ hàng và chuyển hướng
          this.clearCart();
          this.$toast.success('Thanh toán thành công!');
          this.$router.push({ name: 'DonHangThanhCong', params: { orderId: response.data.id } });
        } else {
          this.error = 'Không tìm thấy thông tin đơn hàng đang chờ xử lý.';
        }
      } else {
        // Thanh toán thất bại hoặc checksum không hợp lệ
        localStorage.removeItem('pendingOrder');
        this.error = 'Thanh toán không thành công hoặc chữ ký không hợp lệ. Vui lòng thử lại.';
        this.$toast.error('Thanh toán thất bại!');
      }
    } catch (e) {
      this.error = 'Đã xảy ra lỗi không mong muốn. Vui lòng liên hệ quản trị viên.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(['clearCart']),
  },
};
</script>

<style scoped>
.vnpay-return-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
</style>