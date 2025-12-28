import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// 1. Import Component TestApi (Chắc chắn đường dẫn file đúng với nơi bạn tạo)
import TestApi from './pages/TestApi' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* --- Phần mặc định của Vite (Giữ nguyên) --- */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* --- 2. THÊM PHẦN TEST API Ở ĐÂY --- */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #666', paddingTop: '20px' }}>
          <TestApi />
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App