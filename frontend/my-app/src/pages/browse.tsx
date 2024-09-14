import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import tradeimage from '../images/tradeImage.jpg';
import { useUser } from '../contexts/usercontext';

interface Trade {
    _id: string;
    title: string;
    description: string;
    conditions: string[];
    creator: {
        _id: string;
        username: string;
    };
    offers: string[]; // Assuming this could be an array of offer IDs or more detailed objects
    status: string;
}

const useTrades = (searchTerm: string) => {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const fetchTrades = async () => {
            const url = `http://localhost:8000/trades?search=${encodeURIComponent(searchTerm)}`;
            try {
                const response = await fetch(url);
                const data = await response.json() as Trade[];
                setTrades(data.filter(trade => trade.status !== 'completed')); // Filter out completed trades
            } catch (error) {
                console.error('Failed to fetch trades:', error);
            }
        };

        fetchTrades();
    }, [searchTerm]);

    return trades;
};

const Browse: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const trades = useTrades(searchTerm);
    const { user } = useUser();  // Use the user context

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }, []);

    const handleTradeClick = useCallback((tradeId: string) => {
        navigate(`/trade/${tradeId}`);
    }, [navigate]);

    const handleSendOffer = useCallback((tradeId: string) => {
        navigate(`/createoffer/${tradeId}`);
    }, [navigate]);

    const handleManageOffers = useCallback((tradeId: string) => {
        navigate(`/accept-offer/${tradeId}`);
    }, [navigate]);

    return (
        <div>
            <Navbar/>
            <section className="search-section">
                <input
                    type="text"
                    id="searchBar"
                    placeholder="Search trades..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </section>
            <section className="trades-list">
                {trades.map(trade => (
                    <div key={trade._id} className="trade-item">
                        <img src={tradeimage} alt="Trade" className="trade-image" onClick={() => handleTradeClick(trade._id)}/>
                        <div className="trade-info">
                            <h3 className="trade-title">{trade.title}</h3>
                            <p className="trade-description">{trade.description}</p>
                            <div className="trade-conditions">
                                {trade.conditions.map((condition, index) => (
                                    <span key={index} className="condition-badge">{condition}</span>
                                ))}
                            </div>
                            <p className="profile-name">Posted by: {trade.creator.username}</p>
                            {user && trade.creator._id === user.id ? (
                                <button className="manage-offers-btn" onClick={() => handleManageOffers(trade._id)}>
                                    Manage Offers
                                </button>
                            ) : (
                                <button className="send-offer-btn" onClick={() => handleSendOffer(trade._id)}>Send Offer</button>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Browse;
