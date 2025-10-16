import { VNPay, ignoreLogger } from 'vnpay';

export const vnpay = new VNPay({ // <--- Thêm "export" ở đây
    // ⚡ Cấu hình bắt buộc
    tmnCode: '1X69NBBF',
    secureSecret: 'OFVWVEJGU4051E7V1DCZTQCJ11DK4D4A',
    vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',

    // 🔧 Cấu hình tùy chọn
    testMode: true, // Chế độ test
    hashAlgorithm: 'SHA512', // Thuật toán mã hóa
    enableLog: true, // Bật/tắt log
    loggerFn: ignoreLogger, // Custom logger

    // 🔧 Custom endpoints
    endpoints: {
        paymentEndpoint: 'paymentv2/vpcpay.html',
        queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
        getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
    },
});