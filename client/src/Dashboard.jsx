import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LayoutDashboard, ClipboardList, Clock, CheckCircle, PlusCircle, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '' });

  // Retrieve stored user info from localStorage
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Your Railway Production URL
  const API_URL = "https://team-task-manager-production-45c7.up.railway.app";

  useEffect(() => {
    fetchData();
    if (role === 'admin') fetchMembers();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/api/tasks`, { headers });
    setTasks(res.data);
  };

  const fetchMembers = async () => {
    const res = await axios.get(`${API_URL}/api/tasks/members`, { headers });
    setMembers(res.data);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/api/tasks`, newTask, { headers });
    setShowModal(false);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_URL}/api/tasks/${id}`, { status }, { headers });
    fetchData();
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date() && deadline;

  const formatFullDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      {/* Updated Header with Name and Role */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        padding: '1rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>
            <LayoutDashboard style={{ display: 'inline', marginRight: '10px', verticalAlign: 'bottom' }} /> 
            Team Workspace
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Welcome, <strong>{userName || 'User'}</strong> | <span style={roleBadgeStyle(role)}>{role}</span>
          </p>
        </div>
        <button onClick={() => {localStorage.clear(); window.location.href='/';}} style={logoutBtn}>
          <LogOut size={16}/> Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={cardStyle}><ClipboardList color="blue"/> Total: {tasks.length}</div>
        <div style={cardStyle}><CheckCircle color="green"/> Done: {tasks.filter(t => t.status === 'done').length}</div>
        <div style={cardStyle}><Clock color="red"/> Overdue: {tasks.filter(t => isOverdue(t.deadline) && t.status !== 'done').length}</div>
      </div>

      {role === 'admin' && (
        <button onClick={() => setShowModal(true)} style={primaryBtn}><PlusCircle size={18}/> New Task</button>
      )}

      <h3 style={{ textAlign: 'center', margin: '2rem 0', color: '#64748b' }}>Task List</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {tasks.map(task => (
          <div key={task._id} style={{ ...taskCard, borderLeft: isOverdue(task.deadline) ? '5px solid red' : '5px solid #007bff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{task.title}</h4>
                <span style={badgeStyle(task.status)}>{task.status.replace('-', ' ')}</span>
            </div>
            
            <p style={{ fontSize: '14px', color: '#64748b', margin: '15px 0' }}>{task.description}</p>
            
            <div style={infoBox}>
              <p><strong>Assigned to:</strong> {task.assignedTo?.name || 'Unassigned'}</p>
              
              <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                <strong>Assigned on:</strong> <br/> {formatFullDate(task.createdAt)}
              </p>

              <p style={{ fontSize: '11px', marginTop: '8px', color: isOverdue(task.deadline) ? '#ef4444' : '#475569' }}>
                <strong>Deadline:</strong> <br/> {formatFullDate(task.deadline)}
              </p>
            </div>

            <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Status Tracking:</label>
                <select 
                value={task.status} 
                onChange={(e) => updateStatus(task._id, e.target.value)}
                style={statusSelect}
                >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                </select>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={modalOverlay}>
          <form onSubmit={handleCreateTask} style={modalContent}>
            <h3>Create Task</h3>
            <input placeholder="Title" required onChange={e => setNewTask({...newTask, title: e.target.value})} style={inputStyle}/>
            <textarea placeholder="Description" onChange={e => setNewTask({...newTask, description: e.target.value})} style={inputStyle}/>
            <select required onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} style={inputStyle}>
              <option value="">Assign To...</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
            
            <label style={{fontSize: '12px', color: '#666'}}>Select Deadline Date & Time:</label>
            <input type="datetime-local" required onChange={e => setNewTask({...newTask, deadline: e.target.value})} style={inputStyle}/>
            
            <button type="submit" style={primaryBtn}>Save Task</button>
            <button onClick={() => setShowModal(false)} type="button" style={{background:'none', border:'none', color:'red', cursor:'pointer'}}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = { background: '#fff', padding: '1.5rem', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' };
const taskCard = { background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const infoBox = { background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' };
const statusSelect = { marginTop: '8px', width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' };
const primaryBtn = { background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto 20px auto' };
const logoutBtn = { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd' };

const badgeStyle = (status) => ({
    fontSize: '10px',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    background: status === 'done' ? '#dcfce7' : status === 'in-progress' ? '#fef9c3' : '#e2e8f0',
    color: status === 'done' ? '#166534' : status === 'in-progress' ? '#854d0e' : '#475569',
});

const roleBadgeStyle = (role) => ({
  textTransform: 'capitalize',
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '2px 8px',
  borderRadius: '4px',
  background: role === 'admin' ? '#fee2e2' : '#dbeafe',
  color: role === 'admin' ? '#991b1b' : '#1e40af'
});

export default Dashboard;