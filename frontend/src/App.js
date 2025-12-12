import React, { useState } from 'react';
import SSEDemo from './SSEDemo';
import WSDemo from './WSDemo';

function App() {
  const [mode, setMode] = useState('sse'); // sse 或 ws

  return (
    <div style={{ padding: 20 }}>
      <h1>流式数据示例演示</h1>
      <button onClick={() => setMode('sse')} disabled={mode === 'sse'}>
        使用 SSE
      </button>
      <button onClick={() => setMode('ws')} disabled={mode === 'ws'} style={{ marginLeft: 10 }}>
        使用 WebSocket
      </button>

      <hr />

      {mode === 'sse' ? <SSEDemo key="sse" /> : <WSDemo key="ws" />}
    </div>
  );
}

export default App;