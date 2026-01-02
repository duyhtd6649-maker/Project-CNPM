import { useState } from 'react';

const CVAnalyzer = () => {
  // --- STATE UPLOAD ---
  const [file, setFile] = useState(null);
  const [targetJob, setTargetJob] = useState('Senior Python Developer');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STATE LOGIN (Để lấy token mới) ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); // Lưu token ở đây
  const [loginMsg, setLoginMsg] = useState('');

  // 1. Hàm Đăng nhập để lấy Token
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg('Đang lấy token...');
    
    try {
        // Sửa URL này theo đúng endpoint login của bạn (thường là /api/token/ hoặc /api/login/)
        const LOGIN_URL = 'http://127.0.0.1:8000/api/token/'; 
        
        const res = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }) 
        });

        const data = await res.json();

        if (res.ok) {
            setToken(data.access); // SimpleJWT trả về key 'access'
            setLoginMsg('✅ Đã có Token mới! Bạn có thể test ngay.');
            setError(''); // Xóa lỗi cũ nếu có
        } else {
            setLoginMsg('❌ Đăng nhập thất bại: ' + (data.detail || 'Sai thông tin'));
        }
    } catch (err) {
        setLoginMsg('❌ Lỗi kết nối tới Server Login');
    }
  };

  // 2. Hàm Upload CV (Giữ nguyên logic cũ)
  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (!token) {
        setError('⚠️ Chưa có Token. Hãy đăng nhập ở form bên trên trước!');
        setLoading(false);
        return;
    }

    if (!file) {
      setError('⚠️ Chưa chọn file PDF!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetjob', targetJob);

    try {
      const API_URL = 'http://127.0.0.1:8000/api/analyzecv/'; 
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}` // Dùng token vừa login được
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401) {
          throw new Error("Token đã hết hạn ⏳. Vui lòng bấm 'Lấy Token' lại.");
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Lỗi server');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Không thể kết nối tới Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#242424', color: 'white', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* --- PHẦN 1: LOGIN NHANH --- */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#444', borderRadius: '8px', border: '1px dashed #666' }}>
        <h4 style={{marginTop: 0}}>🔐 Bước 1: Lấy Access Token</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input 
                type="text" placeholder="Username" 
                value={username} onChange={e => setUsername(e.target.value)}
                style={{padding: '5px', flex: 1}}
            />
            <input 
                type="password" placeholder="Password" 
                value={password} onChange={e => setPassword(e.target.value)}
                style={{padding: '5px', flex: 1}}
            />
            <button onClick={handleLogin} style={{cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', padding: '5px 15px'}}>
                Lấy Token
            </button>
        </div>
        <div style={{ fontSize: '13px', color: loginMsg.startsWith('✅') ? '#4caf50' : '#ff6b6b' }}>
            {loginMsg || "Nhập user/pass của Admin hoặc User test để lấy token."}
        </div>
        {token && <div style={{fontSize: '10px', color: '#888', marginTop: '5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>Current Token: {token}</div>}
      </div>

      {/* --- PHẦN 2: TEST API --- */}
      <h3 style={{borderTop: '1px solid #555', paddingTop: '15px'}}>🤖 Bước 2: Test AI CV Analyzer</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Job Input */}
        <div>
            <label style={{display: 'block', fontSize: '12px', marginBottom: '5px'}}>Target Job:</label>
            <input 
              type="text" 
              value={targetJob} 
              onChange={(e) => setTargetJob(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
            />
        </div>

        {/* File Input */}
        <div>
            <label style={{display: 'block', fontSize: '12px', marginBottom: '5px'}}>Upload PDF:</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              style={{ color: 'white' }}
            />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer', background: token ? '#28a745' : '#555', color: 'white', border: 'none', fontSize: '16px' }}>
          {loading ? 'Đang phân tích...' : 'Gửi tới AI'}
        </button>
      </form>

      {/* Hiển thị lỗi */}
      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>{error}</div>}

      {/* Hiển thị kết quả */}
      {result && (
        <div style={{ marginTop: '20px', background: '#333', padding: '10px', borderRadius: '5px' }}>
          <h4 style={{margin: '0 0 10px 0', color: '#4caf50'}}>Kết quả:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', fontFamily: 'monospace' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CVAnalyzer;