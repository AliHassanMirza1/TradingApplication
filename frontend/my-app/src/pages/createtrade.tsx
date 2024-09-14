import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/usercontext';
import '../styles/createTrade.css';

const CreateTrade: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [conditions, setConditions] = useState<string[]>(['']);

    const addCondition = useCallback(() => {
        setConditions(prev => [...prev, '']);
    }, []);

    const handleConditionChange = useCallback((index: number, value: string): void => {
        setConditions(prev => {
            const newConditions = [...prev];
            newConditions[index] = value;
            return newConditions;
        });
    }, []);

    const handleInputChange = useCallback((index: number, event: ChangeEvent<HTMLInputElement>): void => {
        handleConditionChange(index, event.target.value);
    }, [handleConditionChange]);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!user) {
            alert('No user logged in');
            return;
        }

        const trade = { 
            title, 
            description, 
            conditions, 
            userId: user?.id,
            userName: user?.username,  
            status: 'active'
        };

        try {
            const response = await fetch('http://localhost:8000/trades/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trade)
            });

            if (response.ok) {
                alert('Trade created successfully');
                navigate('/browse');
            } else {
                const errorText = await response.text();
                alert(`Failed to create trade: ${errorText}`);
            }
        } catch (error) {
            console.error('Failed to connect:', error);
            alert('Failed to connect to the server');
        }
    }, [title, description, conditions, user, navigate]);

    return (
        <div className="create-trade-container">
            <form onSubmit={handleSubmit} className="trade-form">
                <div className="field">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="field">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="field">
                    <label>Conditions:</label>
                    {conditions.map((condition, index) => (
                        <input
                            key={index}
                            type="text"
                            value={condition}
                            onChange={(e) => handleInputChange(index, e)}
                            required
                        />
                    ))}
                    <button type="button" onClick={addCondition} className="add-condition-btn">Add Condition</button>
                </div>
                <button type="submit" className="submit-btn">Create Trade</button>
            </form>
        </div>
    );
};

export default CreateTrade;
