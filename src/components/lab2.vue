<script setup>
import { ref } from 'vue';
const tinnhan = ref('');
const mautinnhan = ref('');
const form = ref({
    email: '',
    password: '',
    remember: false,


});
const dangnhap = () => {
    if (form.value.email === 'admin' && form.value.password === '123456') {
        tinnhan.value = 'Đăng nhập thành công';
        mautinnhan.value = 'green';
    } else if (form.value.email === '' || form.value.password === '') {
        tinnhan.value = 'Vui lòng nhập đầy đủ thông tin';
        mautinnhan.value = 'orange';
    } else {
        tinnhan.value = 'Đăng nhập thất bại';
        mautinnhan.value = 'red';
    }
};
const dtb = ref([0])

</script>
<template>
    <div class="login-container">
        <div class="login-box">
            <h2 class="text-center mb-4">Đăng nhập</h2>
            <div v-if="tinnhan" class="text-center mb-4" :style="{ color: mautinnhan }">
                {{ tinnhan }}
            </div>
            <form @submit.prevent="dangnhap()">
                <div class="mb-3">
                    <label for="email" class="form-label">Email hoặc Username</label>
                    <input type="text" class="form-control form-control-lg" id="email" v-model="form.email"
                        placeholder="Nhập email hoặc username" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control form-control-lg" id="password" v-model="form.password"
                        placeholder="Nhập mật khẩu" required />
                </div>
                <!-- <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="remember" v-model="form.remember" />
                    <label class="form-check-label" for="remember">Ghi nhớ tôi</label>
                </div> -->
                <button type="submit" class="btn btn-primary w-100 mb-3 login-btn">Đăng nhập</button>
                <div class="text-center">
                    <a href="#" class="forgot-password">Quên mật khẩu?</a>
                </div>
            </form>
        </div>
        <div>
            <input type="text" v-model.number="dtb"  placeholder="tính điểm trung bình">
            <button @click="dtb">Nhập</button>
            <p v-if="dtb === null">Vui lòng nhập điểm trung bình</p>
            <p v-else-if="dtb < 0 || dtb > 10" class="invalid">Điểm không hợp lệ (0-10)</p>
            <p v-else-if="dtb < 5" class="weak">Xếp loại: <strong>Yếu</strong></p>
            <p v-else-if="dtb < 6.5" class="average">Xếp loại: <strong>Trung bình</strong></p>
            <p v-else-if="dtb < 8" class="good">Xếp loại: <strong>Khá</strong></p>
            <p v-else-if="dtb < 9" class="very-good">Xếp loại: <strong>Giỏi</strong></p>
            <p v-else class="excellent">Xếp loại: <strong>Xuất sắc</strong></p>
        </div>

    </div>

</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column; /* Stack login box and score section vertically */
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f7fa, #f0f4f8);
    padding: 2rem;
}

.login-box {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
    margin-bottom: 2rem; /* Space between login box and score section */
}

.login-box h2 {
    color: #1e90ff;
    font-weight: 700;
    margin-bottom: 1.5rem;
}

.form-control-lg {
    border-radius: 8px;
    border: 2px solid #dee2e6;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control-lg:focus {
    border-color: #1e90ff;
    box-shadow: 0 0 8px rgba(30, 144, 255, 0.4);
    outline: none;
}

.login-btn {
    background-color: #1e90ff;
    border: none;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 8px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
    background-color: #187bcd;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
}

.forgot-password {
    color: #1e90ff;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
}

.forgot-password:hover {
    text-decoration: underline;
    color: #187bcd;
}

.form-check-input:checked {
    background-color: #1e90ff;
    border-color: #1e90ff;
}

/* Styles for the average score section */
.score-container {
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.score-container input[type="text"] {
    border-radius: 8px;
    border: 2px solid #dee2e6;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    width: calc(100% - 90px); /* Adjust width to align with button */
    display: inline-block;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.score-container input[type="text"]:focus {
    border-color: #1e90ff;
    box-shadow: 0 0 8px rgba(30, 144, 255, 0.4);
    outline: none;
}

.score-container button {
    background-color: #1e90ff;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    color: #ffffff;
    margin-left: 10px;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.score-container button:hover {
    background-color: #187bcd;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
}

.score-container p {
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 500;
}

.score-container .invalid {
    color: #dc3545; /* Red for invalid input */
}

.score-container .weak {
    color: #ff6f61; /* Coral for weak */
}

.score-container .average {
    color: #ffca28; /* Yellow for average */
}

.score-container .good {
    color: #28a745; /* Green for good */
}

.score-container .very-good {
    color: #1e90ff; /* Blue for very good */
}

.score-container .excellent {
    color: #6f42c1; /* Purple for excellent */
}
</style>