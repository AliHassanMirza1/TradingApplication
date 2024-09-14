import React, { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/createoffer.css';
import { useUser } from '../contexts/usercontext';

const CreateOfferPage = () => {
    const { tradeId } = useParams<{ tradeId: string }>();
    const navigate = useNavigate();
    const [cash, setCash] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const { user } = useUser();


    const handleOfferSubmission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const offerData = {
            cashOffered: cash,
            itemsOffered: quantity,
            tradeId: tradeId,
            userId: user?.id,
            userName: user?.username
        };

        try {
            const response = await fetch('http://localhost:8000/trades/offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(offerData)
            });

            if (!response.ok) {
                throw new Error('Failed to create offer');
            }

            const result = await response.json();
            alert('Offer submitted!');
            navigate('/browse'); // Navigate to trades page or confirmation page
        } catch (error) {
            console.error('Failed to submit offer:', error);
            alert('Error submitting offer');
        }
    };

    return (
        <div className="create-offer-container">
            <a href="#" onClick={() => navigate(-1)} className="back-link">← Back</a>
            <form id="create-offer-form" onSubmit={handleOfferSubmission}>
                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" required />

                <label htmlFor="cash">Cash Offer ($):</label>
                <input type="number" id="cash" value={cash} onChange={(e) => setCash(parseFloat(e.target.value))} min="0" step="any" required />

                <button type="submit" className="submit-btn">Submit Offer</button>
            </form>
        </div>
    );
};

export default CreateOfferPage;
