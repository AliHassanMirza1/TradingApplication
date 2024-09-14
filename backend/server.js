// import express from 'express';
// import { Server } from "socket.io";
// import http from "http";
// import { config } from "dotenv";
// import mongoose from 'mongoose';
// import cors from 'cors';
// import authRoutes from './routes/authroute.js'; 
// import userRoutes from './routes/userRoutes.js';  
// import tradeRoutes from './routes/traderoute.js';

// // config({ path: "./config.env" });

// const app = express();
// app.use(cors());  
// app.use(express.json());  
// app.use(express.urlencoded({ extended: true }));  

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", 
//     methods: ["GET", "POST"],
//   },
// });

// mongoose.connect("mongodb://localhost:27017/OMMA", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log("Connected to Database");
//   server.listen(8000, () => {
//     console.log("Server is running on port 8000");
//   });
// })
// .catch((error) => {
//   console.error("Database connection failed:", error);
//   process.exit();
// });

// app.use('/', authRoutes);  
// app.use('/user', userRoutes);  
// app.use('/trades', tradeRoutes); 

// io.on("connection", (socket) => {
//   console.log("USER CONNECTED:", socket.id);
// });



/////////////////////////////////////////////////////////////////////////////////////

import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authroute.js';
import userRoutes from './routes/userRoutes.js';
import tradeRoutes from './routes/traderoute.js';
import { Trade, User, Offer } from './models/overall.js'; 

// Rest of the imports...

const app = express();
app.use(cors());
app.use(express.json());


// Replace <db_password> with your actual password
const mongoAtlasUri = "mongodb+srv://mirza:new@cluster0.ugujv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoAtlasUri)
  .then(() => {
    console.log("Connected to Database");
    server.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit();
  });



app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/trades', tradeRoutes);

const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_trade', (tradeId) => {
    socket.join(tradeId);
    console.log(`User joined trade room: ${tradeId}`);
  });

  socket.on('leave_trade', (tradeId) => {
    socket.leave(tradeId);
    console.log(`User left trade room: ${tradeId}`);
  });

  socket.on('new_offer', ({ tradeId, offer }) => {
    io.to(tradeId).emit('offer_received', offer);
  });

  socket.on('accept_offer', (tradeId) => {
    io.to(tradeId).emit('trade_completed');
  });


  socket.on('delete_trade', async (tradeId) => {
    try {
        const trade = await Trade.findById(tradeId);
        if (!trade) {
            socket.to(tradeId).emit('error', 'Trade not found');
            return;
        }
        trade.status = 'completed'; 
        await trade.save();
        io.to(tradeId).emit('trade_deleted', { message: 'Traded successfully' });
        io.to(tradeId).emit('trade_updated', { tradeId: trade._id, status: trade.status });  // Emitting an event
    } catch (error) {
        console.error('Error updating trade:', error);
        socket.to(tradeId).emit('error', 'Error updating trade');
    }
});

socket.on('uncomplete_trade', async (tradeId) => {
  try {
      const trade = await Trade.findById(tradeId);
      if (!trade) {
          socket.to(tradeId).emit('error', 'Trade not found');
          return;
      }
      trade.status = 'uncompleted'; // Update status to 'uncompleted'
      await trade.save();
      io.to(tradeId).emit('trade_status_updated', { tradeId: trade._id, status: 'uncompleted' });
  } catch (error) {
      console.error('Error uncompleting trade:', error);
      socket.to(tradeId).emit('error', 'Error uncompleting trade');
  }
});


socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
});
});

// io.on("connection", (socket) => {
//   console.log("USER CONNECTED:", socket.id);

//   socket.on('newOffer', (offerData) => {
//       const newOffer = new Offer({
//           cashOffered: offerData.cash,
//           itemsOffered: offerData.quantity,
//           trade: offerData.tradeId,
//           user: socket.userId // Assuming you manage user sessions/socket mapping elsewhere
//       });

//       newOffer.save()
//           .then(offer => {
//               io.to(offer.trade).emit('offerMade', offer);
//               console.log('Offer saved:', offer);
//           })
//           .catch(error => {
//               console.log('Error saving offer:', error);
//           });
//   });
//   socket.on('acceptOffer', ({ tradeId, offerId }) => {
//     Trade.findByIdAndUpdate(tradeId, { acceptedOffer: offerId }, { new: true })
//       .populate('acceptedOffer')
//       .then(trade => {
//         io.to(tradeId).emit('offerAccepted', trade.acceptedOffer);
//       })
//       .catch(error => {
//         console.log('Error accepting offer:', error);
//       });
//   });
// });




///////////////////////////////////////////////////////////////////////////////////


// import express from 'express';
// import { Server } from 'socket.io';
// import http from 'http';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// const app = express();

// // Schema Definitions
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   cash: { type: Number, required: true, default: 0 },
//   itemsOwned: { type: Number, required: true, default: 0 },
//   tradesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }],
//   offersMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }]
// });

// const tradeSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   conditions: [{ type: String }],
//   creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
//   acceptedOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', default: null }
// });

// const offerSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   trade: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
//   itemsOffered: { type: Number, required: true },
//   cashOffered: { type: Number, required: true }
// });

// // Model Definitions
// const User = mongoose.model('User', userSchema);
// const Trade = mongoose.model('Trade', tradeSchema);
// const Offer = mongoose.model('Offer', offerSchema);

// //Controllers logic

// const signup = async (req, res) => {
//     try {
//         const { username, password, cash, itemsOwned } = req.body;
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const newUser = new User({
//             username,
//             password, 
//             cash,
//             itemsOwned
//         });
//         await newUser.save();
//         const userToReturn = await User.findById(newUser._id)
//             .populate('tradesCreated')
//             .populate('offersMade');
//         res.status(201).json({ 
//             message: 'User created successfully',
//             user: {
//                 id: userToReturn._id,
//                 username: userToReturn.username,
//                 cash: userToReturn.cash,
//                 itemsOwned: userToReturn.itemsOwned,
//                 tradesCreated: userToReturn.tradesCreated,
//                 offersMade: userToReturn.offersMade
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username })
//             .populate('tradesCreated')
//             .populate('offersMade');

//         if (!user || password !== user.password) {  
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         res.json({ 
//             message: "User logged in",
//             userProfile: {
//                 id: user._id,
//                 username: user.username,
//                 cash: user.cash,
//                 itemsOwned: user.itemsOwned,
//                 tradesCreated: user.tradesCreated,
//                 offersMade: user.offersMade
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// const changePassword = async (req, res) => {
//     const { username, currentPassword, newPassword } = req.body;
//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
        
//         if (currentPassword !== user.password) {  
//             return res.status(401).json({ message: 'Current password is incorrect' });
//         }
        
//         user.password = newPassword;  
//         await user.save();
        
//         res.json({ message: 'Password updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Trade Controller Logic

// const createTrade = async (req, res) => {
//     const { title, description, minCash, minItems, conditions, userId } = req.body;

//     try {
//         const user = await User.findById(userId);  
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const newTrade = new Trade({
//             title,
//             description,
//             minCash,
//             minItems,
//             conditions,
//             creator: user._id  
//         });

//         await newTrade.save(); 
//         user.tradesCreated.push(newTrade._id);  
//         await user.save();  

//         res.status(201).json({
//             message: "Trade created successfully",
//             tradeId: newTrade._id,
//             userTradesUpdated: user.tradesCreated
//         });
//     } catch (error) {
//         console.error('Trade creation failed:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const getTrades = async (req, res) => {
//     const search = req.query.search || '';
//     try {
//         const trades = await Trade.find({
//             title: { $regex: search, $options: 'i' }
//         }).populate('creator', 'username');
//         res.json(trades);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching trades', error });
//     }
// };

// const getTradeDetails = async (req, res) => {
//     try {
//         const trade = await Trade.findById(req.params.tradeId)
//                                 .populate('creator', 'username')
//                                 .populate('offers');
//         if (!trade) {
//             return res.status(404).json({ message: 'Trade not found' });
//         }
//         res.json(trade);
//     } catch (error) {
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };



// const acceptOffer = async (req, res) => {
//     const { tradeId, offerId } = req.params;
//     try {
//         const trade = await Trade.findById(tradeId);
//         if (!trade) {
//             return res.status(404).json({ message: 'Trade not found' });
//         }
//         trade.acceptedOffer = offerId;  
//         await trade.save();
//         res.status(200).json({ message: "Offer accepted successfully", trade });
//     } catch (error) {
//         console.error('Failed to accept offer:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // User Controller logic



// const updateUserProfile = async (req, res) => {
// const { username, cash, itemsOwned } = req.body;
// try {
//   const user = await User.findOne({ username });
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   user.cash = cash;
//   user.itemsOwned = itemsOwned;
//   await user.save();
//   res.json({ message: 'Profile updated successfully' });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ message: 'Internal server error' });
// }
// };

// // Use environment variables
// const PORT = process.env.PORT || 8000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/NEWDB';
// const SECRET_KEY = process.env.SECRET || 'ninjadojoshifuyoshimarioluigipeachbowser';

// // Authentication Middleware
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).send('Authorization token is missing or invalid');
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).send('Invalid Token: ' + err.message);
//   }
// };


// const requireAuth = async (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return res.status(401).json({ error: 'Authorization token required' });
//   }

//   const token = authorization.split(' ')[1];

//   try {
//     const { _id } = jwt.verify(token, SECRET_KEY); // Use SECRET_KEY instead of process.env.SECRET

//     req.user = await User.findById(_id).select('_id');
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: 'Request is not authorized' });
//   }
// };


// // Express application setup

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Route Handlers
// app.post('/signup', signup);
// app.post('/login', login);
// app.post('/change-password', requireAuth, changePassword); 

// app.post('/trade/create', requireAuth, createTrade);
// app.get('/trades', requireAuth, getTrades);  
// app.get('/trade/:tradeId', requireAuth, getTradeDetails); 
// app.put('/trade/:tradeId/accept/:offerId', requireAuth, acceptOffer);  

// // app.get('/user/profile', requireAuth, getUserProfile);
// app.post('/user/profile/update', requireAuth, updateUserProfile);


// app.get('/user/profile', requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .populate('tradesCreated')
//       .populate('offersMade');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user); // Send the user object as a response
//   } catch (error) {
//     console.error("Error accessing database:", error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Socket.io Setup
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:8000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('USER CONNECTED:', socket.id);
//   // Handle socket.io events here
// });

// // MongoDB Connection and Server Initialization
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("Connected to Database");
//   server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// })
// .catch((error) => {
//   console.error("Database connection failed:", error);
//   process.exit();
// });