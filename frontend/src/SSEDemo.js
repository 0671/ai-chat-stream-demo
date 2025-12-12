import React, { useEffect, useState } from 'react';

export default function SSEDemo() {
  const [messages, setMessages] = useState([]);
  const [normalData, setNormalData] = useState(null);

  useEffect(() => {
    // 普通 HTTP 请求获取数据
    fetch('/server-sse/api')
      .then((res) => res.json())
      .then(setNormalData)
      .catch(console.error);

    // SSE 连接
    const es = new EventSource('/server-sse/sse'); // 这里请确保后端有 /sse 接口支持SSE

    es.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  return (
    <div>
      <h1>SSE 示例</h1>
      <h3>普通HTTP接口返回的数据：</h3>
      <pre>{normalData ? JSON.stringify(normalData, null, 2) : '加载中...'}</pre>
      <h3>SSE消息接收：</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}