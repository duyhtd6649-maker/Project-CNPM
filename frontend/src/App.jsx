import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TestApi from './pages/TestApi' 
import GoogleCallback from './pages/GoogleCallback'
// 1. Import Component mới
import CVAnalyzer from './pages/CVAnalyzers' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
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

            {/* Khu vực Test API cũ */}
            <div style={{ marginTop: '40px', borderTop: '1px solid #666', paddingTop: '20px' }}>
                <p style={{color: '#888'}}>--- Old Test API ---</p>
                <TestApi />
            </div>

            {/* 2. Thêm Component Test CV vào đây */}
            <div style={{ marginTop: '40px', borderTop: '1px solid #666', paddingTop: '20px' }}>
                <p style={{color: '#888'}}>--- CV Analyzer ---</p>
                <CVAnalyzer />
            </div>
            
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </>
        } />
        <Route path="/google-callback" element={<GoogleCallback />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App