// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { UserProvider } from './usercontext/usercontext';
// import Signup from './pages/signup';
// import Navbar from './pages/navbar';
// import Home from './pages/home';
// import Login from './pages/login';
// import MyProfile from './pages/MyProfile';
// import ChangePassword from './pages/changepassword';
// import CreateTrade from './pages/createtrade';
// import Browse from './pages/browse';
// import './App.css';
// import CreateOfferPage from './pages/createOffer';

// function App() {
//   return (
//     <Router>
//       <UserProvider>
//         <div className="App">
//           <Routes>
//             <Route path="/" element={<Signup />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/profile" element={<MyProfile />} />
//             <Route path="/change-password" element={<ChangePassword />} />
//             <Route path="/create-trade" element={<CreateTrade />} />
//             <Route path="/browse" element={<Browse />} />
//             <Route path="/createoffer" element={<CreateOfferPage />} />
//           </Routes>
//         </div>
//       </UserProvider>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/usercontext';
import Signup from './pages/signup';
import Navbar from './pages/navbar';
import Home from './pages/home';
import Login from './pages/login';
import MyProfile from './pages/MyProfile';
import ChangePassword from './pages/changepassword';
import CreateTrade from './pages/createtrade';
import Browse from './pages/browse';
import './App.css';
import CreateOfferPage from './pages/createOffer';
import MyTrade from './pages/mytrade';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/create-trade" element={<CreateTrade />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/createoffer/:tradeId" element={<CreateOfferPage />} />  
            <Route path="/accept-offer/:tradeId" element={<MyTrade />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
