import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import '../styles/profile.css';
import userimage from '../images/userImage.jpg';
import tradeimage from '../images/tradeImage.jpg';
import { useUser } from '../contexts/usercontext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

interface Trade {
  _id: string;
  title: string;
  description: string;
  conditions: string[];
  status: string;
}

interface Offer {
  _id: string;
  title: string;
  description: string;
  status: string;
}

interface UserProfile {
  username: string;
  cash: number;
  itemsOwned: number;
  tradesCreated: Trade[];
  offersMade: Offer[];
}



const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    socket.on('trade_updated', (data) => {
        if (data.status === 'completed') {
            // Re-fetch the trades or profile data here
            fetchUserProfile();
        }
    });

    return () => {
        socket.off('trade_updated');
    };
}, []);

const fetchUserProfile = async () => {
    // Assuming you have an API endpoint to fetch user profile
    const response = await fetch('http://localhost:8000/user/profile');
    const data = await response.json();
    setProfile(data);
};


  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setProfile(JSON.parse(userData) as UserProfile);
    } else {
      alert('No user data found. Please log in again.');
      window.location.href = '/login';
    }
  }, []);

  return profile;
};

// Separate components for rendering trade items and offers
const TradeItem = ({ trade }: { trade: Trade }) => {
    const navigate = useNavigate();

  const handleViewOffers = () => {
    // Navigate to the page where the user can accept or reject offers
    navigate(`/accept-offer/${trade._id}`);
  };
  return (
    <div className="trade-item" key={trade._id}>
      <img src={tradeimage} alt="Trade" className="trade-image" />
      <div className="trade-info">
        <h3 className="trade-title">{trade.title}</h3>
        <p className="trade-description">{trade.description}</p>
        <div className="trade-conditions">
          {trade.conditions.map((condition, index) => (
            <span key={index} className="condition-badge">{condition}</span>
          ))}
        </div>
        {trade.status === 'completed' ? (
          <p className="trade-status">This trade has been completed</p>
        ) : (
          <p></p>
          // <button className="view-offers-btn" onClick={handleViewOffers}>
          //   View Offers
          // </button>
        )}
      </div>
    </div>
  );
}

const OfferItem = ({ offer }: { offer: Offer }) => {
  return (
    <div className="offers-sent-container" key={offer._id}>
      <a href={`/offer-details/${offer._id}`} className="offer-tile">
        <div className="offer-image-container">
          <img src="../offerImage.jpg" alt="Offer" className="offer-image" />
        </div>
        <div className="offer-info">
          <h3 className="offer-title">{offer.title}</h3>
          <p className="offer-description">{offer.description}</p>
        </div>
        <div className="offer-status">{offer.status}</div>
      </a>
    </div>
  );
}


const ProfileSection = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="top-section">
      <div className="user-info">
        <img src={userimage} alt="User" className="user-image" />
        <div>
          <h1>{profile.username || 'Your Name'}</h1>
          <p className="user-username">@{profile.username}</p>
          <button className="update-password-btn" onClick={() => (window.location.href = '/change-password')}>
            Update Password
          </button>
          <button className="create-offer-btn" onClick={() => (window.location.href = '/create-trade')}>
            Create Trade Offer
          </button>
        </div>
      </div>
      <div className="cash-counter">
        <p>Cash: ${profile.cash}</p>
      </div>
      <div className="items-counter">
        <p>Number of Items Owned: {profile.itemsOwned}</p>
      </div>
    </div>
  );
}


const TradesSection = ({ trades }: { trades: Trade[] }) => {
  return (
    <>
      <h2>My Trades</h2>
      {trades && trades.length > 0 ? trades.map((trade) => (
        <TradeItem key={trade._id} trade={trade} />
      )) : <p>No trades found.</p>}
    </>
  );
}
const OffersSection = ({ offers }: { offers: Offer[] }) => {
  return (
    <>
      <h2>Offers Sent</h2>
      {offers ? offers.map((offer) => <OfferItem key={offer._id} offer={offer} />) : <p>No offers made.</p>}
    </>
  );
};


interface Trade {
    _id: string;
    title: string;
    description: string;
    conditions: string[];
    creator: {
        _id: string;
        username: string;
    };
    offers: string[];
}

const useTrades = (searchTerm: string) => {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const fetchTrades = async () => {
            const url = `http://localhost:8000/trades?search=${encodeURIComponent(searchTerm)}`;
            try {
                const response = await fetch(url);
                const data = await response.json() as Trade[];
                setTrades(data);
            } catch (error) {
                console.error('Failed to fetch trades:', error);
            }
        };

        fetchTrades();
    }, [searchTerm]);

    return trades;
};

const MyProfile: React.FC = () => {
    const profile = useUserProfile();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const trades = useTrades(searchTerm);

    
    
    if (!profile) {
      return <div>Loading profile...</div>;
    }
  
    return (
      <div>
        <Navbar />
        <ProfileSection profile={profile} />
        <TradesSection trades={profile.tradesCreated} />
        <OffersSection offers={profile.offersMade} />
      </div>
    );
  };
  
  export default MyProfile;
