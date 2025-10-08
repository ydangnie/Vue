<script setup>
import { ref } from 'vue'
import anh from './img/photo_2024-09-28_22-34-28.jpg'
const profile = ref({
    ten: 'Y Đăng Niê',
    vitri: 'FullStack Development',
})
const thongtinlienhe = ref({
    email: 'nieydpk04105@gmail.com',
    sdt: '0868482615',
    thanhpho: 'Buôn Ma Thuột',
    quocgia: 'Việt Nam',
})
const kynang = ref({
    skill1: 'HTML',
    skill2: 'CSS',
    skill3: 'JavaScript',
    skill4: 'Bootstrap',
    skill5: 'Node.js',
    skill6: 'SQL',
    skill7: 'PHP',
    skill8: 'Angular',

})
const ngonngu = ref({
    ngonngu1: 'Tiếng Việt',
    ngonngu2: 'Tiếng Anh',
    ngonngu3: 'Tiếng Pháp',

})
const thanhthao = ref({
    banngu: 'Bản ngữ',
    coban: 'Cơ bản',
    thanhthao: 'Thành thạo'
})
const sua = ref({
    ten: false,
    vitri: false,
    email: false,
    sdt: false,
    thanhpho: false


})
</script>

<template>
   <div class="container mt-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-lg-4 col-md-12 bg-light p-4">
        <div class="text-center mb-4">
          <!-- Profile Image -->
          <img :src="anh" alt="Ảnh đại diện" class="img-fluid rounded-circle mb-3">
          <!-- Name -->
          <h2 v-if="!sua.ten">{{ profile.ten }}</h2>
          <input v-else v-model="profile.ten" class="form-control mb-2" placeholder="Nhập tên">
          <i class="fas fa-pen edit-icon" @click="sua.ten = !sua.ten"></i>
          <!-- Position -->
          <p class="text-muted" v-if="!sua.vitri">{{ profile.vitri }}</p>
          <input v-else v-model="profile.vitri" class="form-control mb-2" placeholder="Nhập vị trí">
          <i class="fas fa-pen edit-icon" @click="sua.vitri = !sua.vitri"></i>
        </div>
        <hr>
        <!-- Contact Information -->
        <div class="mb-4">
          <h3><i class="fas fa-address-card me-2"></i>Thông tin liên hệ</h3>
          <ul class="list-unstyled">
            <li>
              <i class="fas fa-envelope me-2" v-if="!sua.email"></i>
              <b>Email:</b>
              <span v-if="!sua.email">{{ thongtinlienhe.email }}</span>
              <input v-else v-model="thongtinlienhe.email" class="form-control mb-2" placeholder="Nhập email">
              <i class="fas fa-pen edit-icon" @click="sua.email = !sua.email"></i>
            </li>
            <li>
              <i class="fas fa-phone me-2" v-if="!sua.sdt"></i>
              <b>(84+):</b>
              <span v-if="!sua.sdt">{{ thongtinlienhe.sdt }}</span>
              <input v-else v-model="thongtinlienhe.sdt" class="form-control mb-2" placeholder="Nhập số điện thoại">
              <i class="fas fa-pen edit-icon" @click="sua.sdt = !sua.sdt"></i>
            </li>
            <li>
              <i class="fas fa-map-marker-alt me-2" v-if="!sua.thanhpho"></i>
              <b>Thành phố:</b>
              <span v-if="!sua.thanhpho" >{{ thongtinlienhe.thanhpho }}, {{ thongtinlienhe.quocgia }}</span>
              <input v-else v-model="thongtinlienhe.thanhpho" class="form-control mb-2" placeholder="Nhập thành phố">
             <i class="fas fa-pen edit-icon" @click="sua.thanhpho = !sua.thanhpho"></i>
            </li>
            <li><i class="fab fa-linkedin me-2"></i><a href="https://www.linkedin.com" target="_blank">LinkedIn của bạn</a></li>
            <li><i class="fab fa-github me-2"></i><a href="https://github.com" target="_blank">GitHub của bạn</a></li>
          </ul>
        </div>
        <hr>
        <!-- Skills -->
        <div class="mb-4">
          <h3><i class="fas fa-lightbulb me-2"></i>Kỹ năng</h3>
          <ul class="list-unstyled">
            <li>{{ kynang.skill1 }}, {{ kynang.skill2 }}, {{ kynang.skill3 }}</li>
            <li>{{ kynang.skill4 }}, {{ kynang.skill5 }}, {{ kynang.skill6 }}</li>
            <li>{{ kynang.skill7 }}, {{ kynang.skill8 }}</li>
          </ul>
        </div>
        <hr>
        <!-- Languages -->
        <div class="mb-4">
          <h3><i class="fas fa-language me-2"></i>Ngôn ngữ</h3>
          <ul class="list-unstyled">
            <li>{{ ngonngu.ngonngu1 }} ({{ thanhthao.banngu }})</li>
            <li>{{ ngonngu.ngonngu2 }} ({{ thanhthao.thanhthao }})</li>
            <li>{{ ngonngu.ngonngu3 }} ({{ thanhthao.coban }})</li>
          </ul>
        </div>
      </div>
      <!-- Main Content -->
      <div class="col-lg-8 col-md-12 p-4">
        <section class="mb-5">
          <h3><i class="fas fa-user-tie me-2"></i>Giới thiệu bản thân</h3>
          <p>
            Tôi là một lập trình viên FullStack đam mê xây dựng các ứng dụng web hiệu quả và thân thiện với người dùng. Với kinh nghiệm trong cả front-end và back-end, tôi mong muốn đóng góp vào các dự án sáng tạo và mang lại giá trị thực tiễn cho doanh nghiệp.
          </p>
        </section>
        <section class="mb-5">
          <h3><i class="fas fa-briefcase me-2"></i>Kinh nghiệm làm việc</h3>
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Lập trình viên FullStack - Công ty ABC</h5>
              <h6 class="card-subtitle mb-2 text-muted">Tháng 06, 2022 - Hiện tại</h6>
              <p class="card-text">
                Phát triển và duy trì các ứng dụng web sử dụng Vue.js, Node.js và SQL.
              </p>
              <ul>
                <li>Xây dựng giao diện người dùng với Vue.js và Bootstrap.</li>
                <li>Tối ưu hóa hiệu suất API với Node.js, giảm thời gian phản hồi 20%.</li>
                <li>Quản lý cơ sở dữ liệu SQL, đảm bảo tính toàn vẹn dữ liệu.</li>
              </ul>
            </div>
          </div>
        </section>
        <section class="mb-5">
          <h3><i class="fas fa-graduation-cap me-2"></i>Học vấn</h3>
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Cử nhân Công nghệ Thông tin</h5>
              <h6 class="card-subtitle mb-2 text-muted">FPT Polytechnic</h6>
              <p class="card-text">Năm tốt nghiệp: 2026</p>
              <ul>
                <li>Điểm trung bình: 8.5/10</li>
                <li>Hoàn thành khóa học chuyên sâu về lập trình web và cơ sở dữ liệu.</li>
              </ul>
            </div>
          </div>
        </section>
        <section class="mb-5">
          <h3><i class="fas fa-laptop-code me-2"></i>Dự án</h3>
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Hệ thống quản lý công việc</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                <a href="#" target="_blank">Link dự án</a> | 
                <a href="#" target="_blank">Link GitHub</a>
              </h6>
              <p class="card-text">
                Phát triển hệ thống quản lý công việc cho nhóm làm việc từ xa.
              </p>
              <ul>
                <li>Công nghệ sử dụng: Vue.js, Node.js, MongoDB</li>
                <li>Các tính năng chính: Quản lý nhiệm vụ, thông báo thời gian thực</li>
              </ul>
            </div>
          </div>
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Website thương mại điện tử</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                <a href="#" target="_blank">Link dự án</a> | 
                <a href="#" target="_blank">Link GitHub</a>
              </h6>
              <p class="card-text">
                Xây dựng nền tảng thương mại điện tử với giao diện thân thiện.
              </p>
              <ul>
                <li>Công nghệ sử dụng: Angular, PHP, MySQL</li>
                <li>Các tính năng chính: Giỏ hàng, thanh toán trực tuyến</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
    

</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}
.container {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.img-fluid.rounded-circle {
  border: 3px solid #007bff;
  width: 150px;
  height: 150px;
  object-fit: cover;
}
h3 {
  color: #007bff;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.card {
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.card-title {
  color: #343a40;
}
.card-subtitle {
  font-size: 0.9em;
}
.fas, .fab {
  color: #007bff;
}
.bg-light {
  background-color: #f1f3f5 !important;
}
.edit-icon {
  cursor: pointer;
  font-size: 0.8rem; /* Kích thước nhỏ cho icon */
  color: #007bff; /* Màu xanh giống các icon khác */
  margin-left: 8px; /* Khoảng cách bên trái */
  vertical-align: middle; /* Căn chỉnh icon ngang với chữ */
  transition: all 0.3s ease; /* Hiệu ứng chuyển đổi mượt mà */
}
.edit-icon:hover {
  color: #0056b3; /* Đậm hơn khi hover */
  transform: translateY(-1px); /* Nhẹ nhàng nâng icon lên */
}
</style>