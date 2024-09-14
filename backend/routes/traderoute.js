import express from 'express';
import { createTrade, getTrades, getTradeDetails, acceptOffer,createOffer,rejectOffer,deleteTrade,getOffersForTrade } from '../controllers/tradecontroller.js';

const router = express.Router();

router.post('/create', createTrade);
router.get('/', getTrades);  
router.get('/:tradeId', getTradeDetails); 
router.put('/:tradeId/accept/:offerId', acceptOffer);  
router.post('/offer', createOffer);
router.put('/:tradeId/accept/:offerId', acceptOffer);
router.delete('/:tradeId/reject/:offerId', rejectOffer);
router.delete('/:tradeId', deleteTrade);
router.get('/:tradeId/offers', getOffersForTrade);



export default router;