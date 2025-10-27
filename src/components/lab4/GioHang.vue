<template>
  <div class="gio-hang">
    <div class="container">
      <h1 class="mb-4"><i class="fas fa-shopping-cart me-2"></i>Giỏ hàng của bạn</h1>

      <div v-if="gioHang && gioHang.length > 0" class="cart-items">
        <div v-for="item in gioHang" :key="item.id" class="cart-item card mb-3">
          <div class="card-body">
            <div class="row align-items-center gy-3 gy-md-0"> <div class="col-md-2 col-4"> <img :src="item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'"
                     :alt="item.title" class="img-fluid rounded">
              </div>
              <div class="col-md-4 col-8"> <h5 class="card-title mb-1">{{ item.title }}</h5> <p class="card-text text-muted small mb-0">{{ item.category }}</p> </div>
              <div class="col-md-2 col-5"> <div class="price-section">
                  <span class="final-price">${{ (item.price * (1 - (item.discount || 0) / 100)).toFixed(2) }}</span>
                  <span v-if="(item.discount || 0) > 0" class="original-price d-block">${{ item.price.toFixed(2) }}</span> </div>
              </div>
              <div class="col-md-2 col-7"> <div class="quantity-controls">
                  <button @click="giamSoLuong(item.id)" class="btn btn-outline-secondary btn-sm" :disabled="item.quantity <= 1">-</button>
                  <input type="number" :value="item.quantity"
                         @input="capNhatSoLuongInput(item.id, $event.target.value)"
                         class="form-control form-control-sm quantity-input mx-2"
                         min="1" :max="item.stock"> <button @click="tangSoLuong(item.id)" class="btn btn-outline-secondary btn-sm" :disabled="item.quantity >= item.stock">+</button>
                </div>
                 <small class="text-muted d-block mt-1 text-center">Tồn kho: {{ item.stock }}</small> </div>
              <div class="col-md-2 col-12 text-md-end mt-2 mt-md-0"> <button @click="xuLyXoaKhoiGio(item.id)" class="btn btn-danger btn-sm" title="Xóa sản phẩm"> <i class="fas fa-trash"></i> <span class="d-md-none">Xóa</span> </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary card mt-4">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6 col-12 text-center text-md-start mb-3 mb-md-0"> <h4>Tổng cộng</h4>
                <p class="mb-0">Số lượng sản phẩm: {{ soLuongSanPhamTrongGio }}</p>
              </div>
              <div class="col-md-6 col-12 text-center text-md-end"> <h3 class="text-primary mb-3">${{ tongTienGioHang.toFixed(2) }}</h3>
                <button @click="xuLyXoaSachGioHang" class="btn btn-outline-danger me-2 mb-2 mb-md-0"> <i class="fas fa-times-circle me-1"></i>Xóa tất cả
                </button>
                <router-link to="/thanh-toan" class="btn btn-success mb-2 mb-md-0"> <i class="fas fa-credit-card me-1"></i>Thanh toán
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-cart text-center py-5">
        <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p class="text-muted">Hãy thêm những sản phẩm yêu thích vào giỏ hàng nhé.</p>
        <router-link to="/san-pham" class="btn btn-primary">
          <i class="fas fa-store me-2"></i>Tiếp tục mua sắm
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// Import các helpers từ Vuex
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'GioHang', // Tên component
  computed: {
    // Sử dụng mapState để lấy state 'cart' từ store và đặt tên là 'gioHang'
    ...mapState({
       gioHang: 'cart' // Lấy state 'cart' từ store
    }),
    // Sử dụng mapGetters để lấy các getters từ store
    ...mapGetters({
       tongTienGioHang: 'cartTotal', // Lấy getter 'cartTotal'
       soLuongSanPhamTrongGio: 'cartItemCount' // Lấy getter 'cartItemCount'
    })
  },
  methods: {
    // Sử dụng mapActions để lấy các actions từ store và đặt tên lại
    ...mapActions({
      xoaKhoiGioAction: 'removeFromCart',       // Map 'removeFromCart' thành 'xoaKhoiGioAction'
      capNhatSoLuongAction: 'updateCartItemQuantity', // Map 'updateCartItemQuantity' thành 'capNhatSoLuongAction'
      xoaSachGioHangAction: 'clearCart'          // Map 'clearCart' thành 'xoaSachGioHangAction'
    }),

    // Hàm xử lý khi nhấn nút xóa một sản phẩm
    async xuLyXoaKhoiGio(productId) {
      // Tìm sản phẩm trong giỏ hàng để lấy tên hiển thị thông báo
      const item = this.gioHang.find(item => item.id === productId);
      if (item) {
        try {
           // Gọi action Vuex đã map để thực hiện xóa
           await this.xoaKhoiGioAction(productId);
           // Hiển thị thông báo thành công
           this.$toast.success(`Đã xóa "${item.title}" khỏi giỏ hàng.`);
        } catch (error) {
           console.error("Lỗi xóa khỏi giỏ:", error);
           this.$toast.error('Xóa thất bại!', 'Có lỗi xảy ra.');
        }
      }
    },

    // Hàm xử lý khi nhấn nút "Xóa tất cả"
    async xuLyXoaSachGioHang() {
      // Hiển thị hộp thoại xác nhận
      if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
         try {
            // Gọi action Vuex đã map để xóa toàn bộ giỏ hàng
            await this.xoaSachGioHangAction();
            // Hiển thị thông báo
            this.$toast.info('Giỏ hàng của bạn đã được dọn sạch.');
         } catch(error) {
            console.error("Lỗi xóa sạch giỏ hàng:", error);
            this.$toast.error('Xóa thất bại!', 'Có lỗi xảy ra.');
         }
      }
    },

    // Hàm xử lý khi nhấn nút "+"
    tangSoLuong(productId) {
      const item = this.gioHang.find(item => item.id === productId);
      // Kiểm tra xem có sản phẩm và số lượng hiện tại < tồn kho không
      if (item && item.quantity < item.stock) {
        // Gọi action Vuex để cập nhật số lượng (+1)
        this.capNhatSoLuongAction({ productId, quantity: item.quantity + 1 });
      } else if (item) {
        // Thông báo nếu đã đạt giới hạn tồn kho
        this.$toast.warning('Số lượng đã đạt tối đa trong kho!');
      }
    },
    // Hàm xử lý khi nhấn nút "-"
    giamSoLuong(productId) {
      const item = this.gioHang.find(item => item.id === productId);
      // Kiểm tra xem có sản phẩm và số lượng hiện tại > 1 không
      if (item && item.quantity > 1) {
        // Gọi action Vuex để cập nhật số lượng (-1)
        this.capNhatSoLuongAction({ productId, quantity: item.quantity - 1 });
      }
      // Nếu số lượng là 1 thì không làm gì cả (không giảm về 0)
    },
    // Hàm xử lý khi người dùng nhập số lượng trực tiếp vào input
    capNhatSoLuongInput(productId, soLuongMoiInput) {
      const soLuongMoi = parseInt(soLuongMoiInput); // Chuyển giá trị input thành số nguyên
      const item = this.gioHang.find(item => item.id === productId);
      if (!item) return; // Thoát nếu không tìm thấy sản phẩm

      // Kiểm tra số lượng mới có hợp lệ không
      if (!isNaN(soLuongMoi) && soLuongMoi > 0 && soLuongMoi <= item.stock) {
        // Nếu hợp lệ, gọi action Vuex để cập nhật
        this.capNhatSoLuongAction({ productId, quantity: soLuongMoi });
      } else if (!isNaN(soLuongMoi) && soLuongMoi > item.stock) {
         // Nếu lớn hơn tồn kho, đặt lại bằng tồn kho và thông báo
         this.capNhatSoLuongAction({ productId, quantity: item.stock });
         this.$toast.warning(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
         // Cập nhật lại giá trị input để khớp với giá trị đã set (cần $nextTick để DOM cập nhật)
         this.$nextTick(() => {
             const inputElement = this.$el.querySelector(`input[value="${item.quantity}"]`); // Tìm input tương ứng (cách này có thể không ổn định)
             if (inputElement) inputElement.value = item.stock;
         });

      } else if (!isNaN(soLuongMoi) && soLuongMoi <= 0) {
         // Nếu nhập số <= 0, hỏi người dùng có muốn xóa không
         if (confirm(`Bạn muốn xóa "${item.title}" khỏi giỏ hàng?`)) {
            this.xuLyXoaKhoiGio(productId); // Gọi hàm xóa đã viết
         } else {
            // Nếu không xóa, đặt lại số lượng về 1
            this.capNhatSoLuongAction({ productId, quantity: 1 });
             this.$nextTick(() => {
                 const inputElement = this.$el.querySelector(`input[value="${item.quantity}"]`);
                 if (inputElement) inputElement.value = 1;
            });
         }
      }
      // Nếu nhập không phải số (isNaN là true), thì không làm gì cả, input sẽ tự động giữ giá trị cũ (do dùng :value)
    },
  }
}
</script>


<style scoped>
/* Container chính */
.gio-hang {
  background-color: #f8f9fa; /* Nền xám nhạt */
  min-height: calc(100vh - 56px); /* Chiều cao tối thiểu trừ navbar */
  padding: 40px 0; /* Tăng padding */
}

/* Thẻ của từng sản phẩm trong giỏ */
.cart-item.card {
  border: 1px solid #e9ecef; /* Viền nhẹ */
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* Bóng đổ nhẹ */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden; /* Đảm bảo bo góc */
}

.cart-item.card:hover {
  transform: translateY(-3px); /* Nhấc lên chút khi hover */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Ảnh sản phẩm */
.cart-item img {
  max-width: 100px; /* Giữ kích thước ảnh */
  height: 100px;
  object-fit: cover; /* Cắt ảnh */
}

/* Tên sản phẩm */
.cart-item .card-title {
   font-size: 1.1rem; /* Kích thước tên */
   font-weight: 600;
}

/* Khu vực giá */
.price-section {
  display: flex;
  flex-direction: column; /* Xếp giá chồng lên nhau */
  align-items: flex-start; /* Căn trái */
}

.final-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #dc3545; /* Màu đỏ cho giá cuối */
}

.original-price {
  text-decoration: line-through;
  color: #6c757d; /* Màu xám */
  font-size: 0.9rem;
}

/* Điều khiển số lượng */
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center; /* Căn giữa */
}

.quantity-input {
  width: 60px; /* Chiều rộng input */
  text-align: center; /* Căn giữa số */
  font-weight: bold;
  /* Loại bỏ mũi tên */
  -moz-appearance: textfield;
}
.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/* Thành tiền của từng sản phẩm (đã ẩn đi) */
.item-total {
  font-weight: bold;
  color: #464747;
  white-space: nowrap; /* Tránh xuống dòng */
}

/* Nút xóa sản phẩm */
.btn-danger {
  transition: all 0.2s ease; /* Hiệu ứng nhẹ */
}
/* .btn-danger:hover {
   transform: scale(1.1); /* Phóng to nhẹ khi hover * /
} */


/* Phần tóm tắt giỏ hàng */
.cart-summary.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1); /* Bóng đổ rõ hơn */
  background: #ffffff; /* Nền trắng */
  color: #333; /* Chữ đen */
}

.cart-summary .card-body {
  padding: 30px;
}
.cart-summary h4 {
   font-weight: 600;
   color: #495057;
}
.cart-summary h3 { /* Tổng tiền */
   font-weight: 700;
   color: #dc3545; /* Màu đỏ */
}


/* Thông báo giỏ hàng trống */
.empty-cart {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  margin: 50px auto;
  padding: 40px; /* Tăng padding */
  max-width: 500px;
}
.empty-cart i {
   color: #adb5bd; /* Màu icon xám */
}
.empty-cart h3 {
   color: #495057;
}


/* Nút bấm chung */
.btn {
   border-radius: 8px; /* Bo góc chung */
   font-weight: 500;
}

/* Nút Tiếp tục mua sắm / Thanh toán */
.btn-primary { /* Nút Tiếp tục mua sắm */
  background: linear-gradient(135deg, #747578 0%, #000000 100%);
  border: none;
  transition: all 0.3s ease;
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6a78 0%, #333333 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.btn-success { /* Nút Thanh toán */
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%); /* Gradient xanh lá */
  border: none;
  transition: all 0.3s ease;
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa085 100%); /* Đậm hơn khi hover */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
   .cart-item .col-md-2, .cart-item .col-md-4, .cart-item .col-md-1 {
      /* Reset căn chỉnh mặc định trên mobile nếu cần */
      text-align: left; /* Căn trái text */
   }
   .cart-item .price-section {
       align-items: flex-start; /* Đảm bảo giá căn trái */
   }
   .cart-item .quantity-controls {
      justify-content: flex-start; /* Căn trái bộ điều khiển số lượng */
   }
   .cart-summary .col-md-4, .cart-summary .col-md-8 {
      text-align: center; /* Căn giữa tóm tắt trên mobile */
   }
    .cart-summary .btn {
        width: auto; /* Cho phép nút thu nhỏ lại */
        margin-bottom: 10px; /* Khoảng cách nút */
    }
}


</style>