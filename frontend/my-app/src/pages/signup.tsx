import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupStyles.css';

// Custom hook for form state management
const useFormInput = (initialValue: string) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};

// Custom hook for handling the submit event
const useSignupSubmit = (username: string, password: string, confirmPassword: string, cash: string, itemsOwned: string, onSuccess: () => void) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   alert("Passwords don't match");
    //   return;
    // }

    const response = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        cash: Number(cash),
        itemsOwned: Number(itemsOwned),
      }),
    });

    if (response.ok) {
      alert('Registration successful');
      onSuccess();
    } else {
      const errorMsg = await response.text();
      alert(`Registration failed: ${errorMsg}`);
    }
  };

  return handleSubmit;
};

const Signup: React.FC = () => {
  const username = useFormInput('');
  const password = useFormInput('');
  const confirmPassword = useFormInput('');
  const cash = useFormInput('');
  const itemsOwned = useFormInput('');
  const navigate = useNavigate();

  const handleSubmit = useSignupSubmit(
    username.value,
    password.value,
    confirmPassword.value,
    cash.value,
    itemsOwned.value,
    () => navigate('/')
  );

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...username} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...password} required />
        </div>
        {/* <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" {...confirmPassword} required />
        </div> */}
        <div className="form-group">
          <label htmlFor="cash">Initial Cash ($):</label>
          <input type="number" id="cash" {...cash} required />
        </div>
        <div className="form-group">
          <label htmlFor="itemsOwned">Initial Items Owned:</label>
          <input type="number" id="itemsOwned" {...itemsOwned} required />
        </div>
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigate('/login')}>Go to Login</button>
      </form>
    </div>
  );
};

export default Signup;
