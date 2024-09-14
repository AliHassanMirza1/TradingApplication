# MERN Trading App

## Overview
This project is a Trading App built using the MERN stack. The app allows users to trade items with other users, post trades, and send offers. Users can create accounts, log in, and manage their profiles. Real-time interactions are implemented using sockets, enabling live updates for trades and offers.

## Technologies Used

### Frontend:
- **React.js**
- **Vite**
- **React Router** for navigation
- **Axios** for API requests
- **Socket.io** for real-time communication
- **CSS** for styling

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB** for data storage
- **Mongoose** as ODM (Object Data Modeling)

### Authentication:
- **JSON Web Tokens (JWT)** for secure user authentication

## Getting Started

Follow these steps to set up and run the Trading App on your local machine:

### Clone the Repository:
bash
git clone https://github.com/AliSaif541/MERN-Trading-App.git
cd MERN-Trading-App

### Install Dependecies:

FrontEnd

cd frontend/my-app

npm install


Backend

cd backend

npm install

### Configure Environment Variables:

MONGODB_URI: 

MONGODB_URI=mongodb+srv:/username:password@cluster.mongodb.net/mydatabase

### Run the application

In the Frontend and Backend:

npm start

### Access the application:

Once both the backend and frontend are running, open your browser and navigate to:
http://localhost:3000

You should be able to use the application.