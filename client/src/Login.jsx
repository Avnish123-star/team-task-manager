import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Your Railway Backend URL
  const API_URL = "https://team-task-manager-production-45c7.up.railway.app";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Added https:// prefix here
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);

      alert(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard'); 
    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{textAlign: 'center', color: '#333'}}>Team Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
        <button type="submit" style={loginBtnStyle}>Sign In</button>
        <p onClick={() => navigate('/register')} style={{textAlign: 'center', cursor:'pointer', color:'#007bff', marginTop: '10px'}}>
          New here? Create an account
        </p>
      </form>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' };
const formStyle = { background: '#fad0d0', padding: '2.5rem', borderRadius: '12px', width: '350px', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const loginBtnStyle = { width: '100%', padding: '12px', background: '#007bff', color: '#f5f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;