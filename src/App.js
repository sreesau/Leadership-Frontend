// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { FaCrown, FaUserCircle, FaTrophy } from 'react-icons/fa';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pointsClaimed, setPointsClaimed] = useState(null);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
  };

  const claimPoints = async () => {
    if (!selectedUser) return alert('Please select a user');
    const res = await axios.post('http://localhost:5000/api/claim', { userId: selectedUser });
    setPointsClaimed(res.data.points);
    fetchUsers();
  };

  const addUser = async () => {
    if (!newUser) return;
    await axios.post('http://localhost:5000/api/users', { name: newUser });
    setNewUser('');
    fetchUsers();
  };

  return (
    <div className="App">
      <div className="header">
        <h1><FaTrophy style={{ color: '#ff9800' }} /> Weekly Contribution Ranking</h1>
      </div>

      <div className="controls">
        <input
          type="text"
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          placeholder="Enter user name"
        />
        <button onClick={addUser}>Add</button>

        <select onChange={e => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value=''>Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        <button onClick={claimPoints}>Claim</button>
      </div>

      {pointsClaimed && <p className="claimed-msg">{pointsClaimed} points claimed!</p>}

      <div className="user-list">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Avatar</th>

              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className={idx < 3 ? `top-${idx + 1}` : ''}>
                <td><FaUserCircle /></td>
                <td>#{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.totalPoints.toLocaleString()} <FaTrophy style={{ color: '#ff9800' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
