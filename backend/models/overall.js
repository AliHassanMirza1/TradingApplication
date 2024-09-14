import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cash: { type: Number, required: true, default: 0 },
  itemsOwned: { type: Number, required: true, default: 0 },
  tradesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }],
  offersMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }]
});

const tradeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  conditions: [{ type: String }],  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }],
  acceptedOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', default: null },
  status: { type: String, default: 'active' } // 'active', 'completed', 'deleted'
});

const offerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trade: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
  itemsOffered: { type: Number, required: true },
  cashOffered: { type: Number, required: true },
});

export const User = mongoose.model('User', userSchema);
export const Trade = mongoose.model('Trade', tradeSchema);
export const Offer = mongoose.model('Offer', offerSchema);
