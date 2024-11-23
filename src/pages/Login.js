import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password && walletAddress) {
      navigate('/landing');
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <img src="/logo512.png" alt="Zodeck Logo" style={{ width: '200px' }} />
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;