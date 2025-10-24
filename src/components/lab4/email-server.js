// email-server.js
// email-server.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nieydpk04105@gmail.com', // Email của bạn để gửi
        pass: 'irxq xspa fgpa xnud' // Mật khẩu ứng dụng bạn đã cung cấp
    }
});

app.post('/send-order-email', (req, res) => {
            const { order } = req.body;

            if (!order) {
                return res.status(400).send('Thiếu thông tin đơn hàng.');
            }

            // Email gửi cho khách hàng
            const mailToCustomer = {
                    from: '"Azalman Store" <nieydpk04105@gmail.com>',
                    to: order.customer.email,
                    subject: `Xác nhận đơn hàng #${order.id}`,
                    html: `
            <h1>Cảm ơn bạn đã đặt hàng tại Azalman Store!</h1>
            <p>Chào ${order.customer.name},</p>
            <p>Đơn hàng #${order.id} của bạn đã được nhận và đang chờ xử lý.</p>
            <h3>Chi tiết đơn hàng:</h3>
            <ul>
                ${order.items.map(item => `<li>${item.title} x ${item.quantity} - <b>$${(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}</b></li>`).join('')}
            </ul>
            <p><b>Tổng cộng: $${order.total.toFixed(2)}</b></p>
            <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được vận chuyển.</p>
            <p>Trân trọng,<br/>Đội ngũ Azalman Store</p>
        `
    };

    // Email gửi cho quản trị viên
    const mailToAdmin = {
        from: '"Azalman Store" <nieydpk04105@gmail.com>',
        to: 'dangnie.1982006@gmail.com', // Email của quản trị
        subject: `Có đơn hàng mới #${order.id}`,
        html: `
            <h1>Có một đơn hàng mới!</h1>
            <p><b>Mã đơn hàng:</b> #${order.id}</p>
            <p><b>Khách hàng:</b> ${order.customer.name} (${order.customer.email})</p>
            <p><b>Tổng tiền:</b> $${order.total.toFixed(2)}</p>
            <p>Vui lòng vào trang quản trị để xử lý đơn hàng.</p>
        `
    };

    // Gửi cả hai email
    Promise.all([
        transporter.sendMail(mailToCustomer),
        transporter.sendMail(mailToAdmin)
    ]).then(() => {
        res.status(200).send('Email đã được gửi thành công.');
    }).catch(error => {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).send('Có lỗi xảy ra khi gửi email.');
    });
});

const PORT = 3004; // Sử dụng một cổng khác để tránh xung đột
app.listen(PORT, () => {
    console.log(`Email server đang chạy tại http://localhost:${PORT}`);
});