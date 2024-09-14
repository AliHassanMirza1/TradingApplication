import React from 'react';
import Navbar from './navbar';  
import '../styles/home.css';   

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <section className="hero" style={{ backgroundImage: "url('../images/backgroundImage.jpg')" }}>
          <div className="hero-overlay">
            <h1>Welcome to Tradathon!</h1>
            <p>Your Trading Partner for Life.</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
