import React, { useEffect, useState } from 'react';

export default function WSDemo() {
  const [messages, setMessages] = useState([]);
  const [normalData, setNormalData] = useState(null);

  useEffect(() => {
    // 普通 HTTP 请求获取数据
    fetch('/server-ws/api')
      .then((res) => res.json())
      .then(setNormalData)
      .catch(console.error);

    // WebSocket 连接
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/server-ws/myws`); // /ws 路径

    ws.onopen = () => {
      console.log('WebSocket 已连接');
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket 错误', error);
    };

    ws.onclose = () => {
      console.log('WebSocket 已关闭');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket 示例</h1>
      <h3>普通HTTP接口返回的数据：</h3>
      <pre>{normalData ? JSON.stringify(normalData, null, 2) : '加载中...'}</pre>
      <h3>WebSocket消息接收：</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}