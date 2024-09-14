import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/changePasswordStyles.css';

const ChangePassword: React.FC = () => {
    const [passwords, setPasswords] = React.useState({
        current: '',
        new: '',
        confirm: '',
    });

    const navigate = useNavigate();

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPasswords((prevPasswords) => ({
            ...prevPasswords,
            [name]: value,
        }));
    }, []);

    const canChange = passwords.new === passwords.confirm;

    const changePassword = async () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const { username } = JSON.parse(userData);
            const response = await fetch('http://localhost:8000/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, currentPassword: passwords.current, newPassword: passwords.new }),
            });

            return response.ok;
        }
        return false;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canChange) {
            alert("New passwords do not match.");
            return;
        }
        
        if (await changePassword()) {
            alert('Password changed successfully');
            navigate('/login');
        } else {
            alert('Failed to change password or user not logged in.');
            navigate('/login');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="change-password-form">
                {/* Render input fields */}
                {Object.entries(passwords).map(([name, value]) => (
                    <div key={name}>
                        <label htmlFor={name}>
                            {name === 'current' ? 'Current Password:' : name === 'new' ? 'New Password:' : 'Confirm New Password:'}
                        </label>
                        <input
                            type="password"
                            id={name}
                            name={name}
                            value={value}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                ))}
                <button type="submit" disabled={!canChange}>Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
