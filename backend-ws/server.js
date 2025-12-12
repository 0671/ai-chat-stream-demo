const http = require('http');
const WebSocket = require('ws');


// 创建http服务器
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${pathname}`);

  if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(JSON.stringify({ msg: '普通HTTP接口响应' }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// 创建 WebSocket 服务器挂载在http服务器上
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('WebSocket客户端已连接');

  // 错误处理
  ws.on('error', (error) => {
    console.error('WebSocket 错误:', error.message);
  });

  let count = 0;
  const interval = setInterval(() => {
    count++;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`消息${count}`);
    }
    if (count >= 10) {
      clearInterval(interval);
      ws.close();
    }
  }, 1000);

  ws.on('close', () => {
    console.log('WebSocket客户端已断开');
    clearInterval(interval);
  });
});

// http server upgrade事件用于判断并路由 ws 连接请求
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  console.log(`[${new Date().toISOString()}] WebSocket UPGRADE ${request.url} -> ${pathname}`);

  if (pathname === '/myws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy(); // 非/myws 请求的升级连接直接断开
  }
});

server.listen(8002, () => {
  console.log('Server running at http://localhost:8002');
});