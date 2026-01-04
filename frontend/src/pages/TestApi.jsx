import React, { useState } from 'react';
import axiosClient from '../api/axiosClient'; // Import file axiosClient bạn đã tạo

const TestApi = () => {
    // --- STATE CHO CÁC API ---
    const [users, setUsers] = useState([]); // Chứa danh sách user
    const [searchUsername, setSearchUsername] = useState(''); // Chứa username cần tìm
    const [foundUser, setFoundUser] = useState(null); // Chứa kết quả tìm kiếm
    const [registerData, setRegisterData] = useState({ // Form đăng ký
        email: '',
        username: '',
        password: ''
    });
    const [logs, setLogs] = useState(''); 

    const addLog = (msg) => setLogs(prev => `${new Date().toLocaleTimeString()} - ${msg}\n${prev}`);

    const handleGetAllUsers = async () => {
        try {
            const res = await axiosClient.get('/api/user/'); 
            setUsers(res.data);
            addLog(`Đã tải ${res.data.length} user.`);
        } catch (err) {
            addLog(`Lỗi lấy list: ${err.message}`);
        }
    };

    const handleFindUser = async () => {
        if (!searchUsername) return alert("Chưa nhập username!");
        try {
            const res = await axiosClient.get(`/api/user/${searchUsername}/`);
            setFoundUser(res.data);
            addLog(`Tìm thấy user: ${res.data.username}`);
        } catch (err) {
            setFoundUser(null);
            if (err.response && err.response.status === 404) {
                addLog(`Không tìm thấy user "${searchUsername}"`);
            } else {
                addLog(`Lỗi tìm user: ${err.message}`);
            }
        }
    };

    const handleRegister = async () => {
        try {
            const res = await axiosClient.post('/api/user/register/', registerData);
            
            if (res.data.detail) {
                addLog(`Kết quả Server: ${res.data.detail}`);
            } else {
                addLog(`Đăng ký thành công User ID: ${res.data.id || 'OK'}`);
            }
        } catch (err) {
            addLog(`Lỗi đăng ký: ${err.response?.data?.detail || err.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>API Tester Dashboard</h1>
            
            {}
            <div style={{ background: '#333', color: '#0f0', padding: '10px', height: '100px', overflowY: 'scroll', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>
                {logs || "Ready..."}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                
                {}
                <div>
                    <h3>1. Get All Users</h3>
                    <button onClick={handleGetAllUsers}>Load Users</button>
                    <ul>
                        {users.map(u => (
                            <li key={u.id}>{u.username} - {u.email}</li>
                        ))}
                    </ul>

                    <hr />

                    <h3>2. Find User</h3>
                    <input 
                        placeholder="Nhập username..." 
                        value={searchUsername}
                        onChange={e => setSearchUsername(e.target.value)}
                    />
                    <button onClick={handleFindUser}>Tìm</button>
                    {foundUser && (
                        <div style={{ border: '1px solid green', padding: '5px', marginTop: '5px' }}>
                            <p>ID: {foundUser.id}</p>
                            <p>Email: {foundUser.email}</p>
                        </div>
                    )}
                </div>

                {}
                <div>
                    <h3>3. Register Form</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input 
                            placeholder="Email" 
                            value={registerData.email}
                            onChange={e => setRegisterData({...registerData, email: e.target.value})}
                        />
                        <input 
                            placeholder="Username" 
                            value={registerData.username}
                            onChange={e => setRegisterData({...registerData, username: e.target.value})}
                        />
                        <input 
                            type="password"
                            placeholder="Password" 
                            value={registerData.password}
                            onChange={e => setRegisterData({...registerData, password: e.target.value})}
                        />
                        <button onClick={handleRegister} style={{ background: 'blue', color: 'white' }}>
                            Gửi Đăng Ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestApi;