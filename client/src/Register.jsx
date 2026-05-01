import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const navigate = useNavigate();

  // Your live Railway Backend URL
  const API_URL = "https://team-task-manager-production-45c7.up.railway.app";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Updated to use the live API URL instead of localhost
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("Registration Successful! Now please login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={{textAlign: 'center', color: '#333'}}>Join Team</h2>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
        <input type="email" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} required />
        
        <label style={{fontSize: '12px', color: '#666'}}>Select Your Role:</label>
        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>
          <option value="member">Member (View & Update Tasks)</option>
          <option value="admin">Admin (Create & Assign Tasks)</option>
        </select>

        <button type="submit" style={regBtnStyle}>Create Account</button>
        <p onClick={() => navigate('/')} style={{textAlign: 'center', cursor:'pointer', color:'#007bff', marginTop: '10px'}}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

// Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#e9ecef' };
const formStyle = { background: '#fff', padding: '2.5rem', borderRadius: '12px', width: '380px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const regBtnStyle = { width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };

export default Register;