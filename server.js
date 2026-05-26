const WebSocket = require('ws');
const net = require('net');

// ==========================================
// ĐÃ ĐIỀN CHUẨN IP VÀ PORT CỦA BẠN:
const VPS_IP = '103.178.234.24'; 
const VPS_PORT = 14445;        
// ==========================================

const port = process.env.PORT || 8000; 
const wss = new WebSocket.Server({ port: port }, () => {
    console.log(`Gateway đang chạy thành công ở port ${port}`);
});

wss.on('connection', (ws) => {
    console.log('[+] Có Client WebGL vừa kết nối!');
    const tcp = new net.Socket();

    // Kết nối đến con VPS 103.178.234.24
    tcp.connect(VPS_PORT, VPS_IP, () => {
        console.log(`[+] Đã thông luồng tới VPS: ${VPS_IP}:${VPS_PORT}`);
    });

    // Truyền dữ liệu 2 chiều
    ws.on('message', (msg) => { tcp.write(msg); });
    tcp.on('data', (data) => { ws.send(data); });

    // Xử lý khi ngắt kết nối
    ws.on('close', () => { tcp.destroy(); });
    tcp.on('close', () => { ws.close(); });
    
    ws.on('error', () => {});
    tcp.on('error', () => {});
});
