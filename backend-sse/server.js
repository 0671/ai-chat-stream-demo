const http = require('http');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> ${pathname}`);
  
  if (pathname === '/api') {
    // 普通HTTP响应
    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(JSON.stringify({ msg: '普通HTTP接口响应' }));
  } else if (pathname === '/sse') {
    // SSE 事件流
    res.writeHead(200, {
      'Content-Type': 'text/event-stream;charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    let count = 0;
    const interval = setInterval(() => {
      count++;
      res.write(`data: 事件消息${count}\n\n`);
      if (count >= 10) {
        clearInterval(interval);
        res.end();
      }
    }, 1000);

    // 客户端关闭连接时清理定时器
    req.on('close', () => {
      clearInterval(interval);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8001, () => {
  console.log('Server started on http://localhost:8001');
});