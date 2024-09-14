import React, { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/usercontext';
import '../styles/LoginStyles.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            login(data.userProfile);
            alert('Login successful');
            navigate('/home');
        } else {
            alert('Invalid username or password');
        }
    }, [username, password, login, navigate]);

    return (
      <div className="login-container">
      <div className="login-background"></div> {/* This will be the background image on one side */}
      <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
              <div>
                  <label htmlFor="username">Username:</label>
                  <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                  />
              </div>
              <div>
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                  />
              </div>
              <div className="button-group">
                  <button type="submit">Login</button>
                  <button type="button" onClick={() => navigate('/')}>Sign Up</button>
              </div>
          </form>
      </div>
  </div>
  
    );
};

export default Login;
