const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {

  // 代理 /server-sse/ 前缀的请求到 http://localhost:8001（去掉 /server-sse 前缀）
  app.use(
    createProxyMiddleware({  
      pathFilter: '/server-sse',  
      pathRewrite: { '^/server-sse': '' }, 
      target: 'http://localhost:8001',
      changeOrigin: true,
      secure: false
    })
  );

  // 代理 /server-ws/ 前缀的请求到 http://localhost:8002（去掉 /server-ws 前缀）
  app.use(
    createProxyMiddleware({
      pathFilter: '/server-ws',  
      pathRewrite: { '^/server-ws': '' }, 
      target: 'http://localhost:8002',
      changeOrigin: true,
      ws: true,
      secure: false,
    })
  );
};