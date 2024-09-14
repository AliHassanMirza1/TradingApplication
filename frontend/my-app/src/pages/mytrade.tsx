import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

interface Offer {
    _id: string;
    userName: string;
    commodityQuantity: number;
    offerCash: number;
}

interface Trade {
    _id: string;
    title: string;
    description: string;
    conditions: string[];
    offers: Offer[];
}

const MyTrade = () => {
    const navigate = useNavigate();
    const { tradeId } = useParams<{ tradeId: string }>();
    const [trade, setTrade] = useState<Trade | null>(null);

    useEffect(() => {
        socket.emit('join_trade', tradeId);

        const fetchTrade = async () => {
            try {
                const response = await fetch(`http://localhost:8000/trades/${tradeId}`);
                const data = await response.json();
                setTrade(data);
            } catch (error) {
                console.error('Error fetching trade details:', error);
                alert('Could not load trade details. Please try again later.');
            }
        };

        fetchTrade();



        socket.on('trade_deleted', () => {
            alert('Traded Successfully.');
            navigate('/browse');
        });

        return () => {
            socket.emit('leave_trade', tradeId);
            socket.off('trade_deleted');
        };
    }, [tradeId, navigate]);

    const handleDeleteTrade = () => {
        socket.emit('delete_trade', tradeId);
    };

    if (!trade) return <div>Loading...</div>;

    return (
        <div className="trade-detail-container">
            <a href="#" className="back-link" onClick={() => navigate(-1)}>← Back</a>
            <h1 className="trade-title">{trade.title}</h1>
            <p className="trade-details">{trade.description}</p>
            <h3>Accepting Conditions:</h3>
            <ul className="accepting-conditions">
                {trade.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                ))}
            </ul>
            <div className="offers-section">
                {trade.offers.length > 0 ? (
                    trade.offers.map((offer) => (
                        <div key={offer._id} className="offer">
                            <div className="user-info">
                                <h4>{offer.userName}</h4>
                                <p>Quantity: {offer.commodityQuantity}</p>
                                <p>Cash Offer: ${offer.offerCash}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {/* <p>No offers available.</p> */}
                        <button onClick={handleDeleteTrade}>Accept Offer</button>
                        <button onClick={handleDeleteTrade}>Reject Offer</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTrade;
