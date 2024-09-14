import { Trade, User, Offer } from '../models/overall.js'; 


export const createTrade = async (req, res) => {
    const { title, description, minCash, minItems, conditions, userId, userName } = req.body;

    try {
        const user = await User.findById(userId);  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newTrade = new Trade({
            title,
            description,
            minCash,
            minItems,
            conditions,
            creator: user._id,
            userName,
            status: 'active'
        });

        await newTrade.save(); 
        user.tradesCreated.push(newTrade._id);  
        await user.save();  

        res.status(201).json({
            message: "Trade created successfully",
            tradeId: newTrade._id,
            userTradesUpdated: user.tradesCreated
        });
    } catch (error) {
        console.error('Trade creation failed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const getTrades = async (req, res) => {
    const search = req.query.search || '';
    try {
        const trades = await Trade.find({
            title: { $regex: search, $options: 'i' }
        }).populate('creator', 'username');
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trades', error });
    }
};

// tradeController.js

export const getTradeDetails = async (req, res) => {
    try {
        // Include offers when fetching the trade details
        const trade = await Trade.findById(req.params.tradeId)
                                .populate({
                                    path: 'offers',
                                    populate: { path: 'user', select: 'username' }
                                })
                                .populate('creator', 'username'); // Assuming you store creator info as well

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Modify the trade object to include offer details in a more digestible format
        const modifiedTrade = {
            ...trade._doc,
            offers: trade.offers.map(offer => ({
                _id: offer._id,
                userName: offer.user.user,
                commodityQuantity: offer.itemsOffered, 
                offerCash: offer.cashOffered 
            }))
        };

        res.json(modifiedTrade);
    } catch (error) {
        console.error('Failed to fetch trade details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


// Controller to handle creating an offer
// export const createOffer = async (req, res) => {
//     try {
//         const { cashOffered, itemsOffered, tradeId, userId } = req.body;
//         console.log("PP",req.body);
//         const newOffer = new Offer({
//             cashOffered,
//             itemsOffered,
//             trade: tradeId,
//             user: userId
//         });

//         await newOffer.save();
//         res.status(201).json(newOffer);
//     } catch (error) {
//         console.error("Error creating offer:", error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };





// Controller to handle creating an offer
export const createOffer = async (req, res) => {
    
    try {
        const { cashOffered, itemsOffered, tradeId, userId,userName } = req.body; 
        // userId should be obtained securely, typically from session or token
        const newOffer = new Offer({
            user: userId, // Make sure the user is authenticated and authorized
            trade: tradeId,
            cashOffered,
            itemsOffered,
            userName
        });
        
        await newOffer.save();
        res.status(201).json({ message: "Offer created successfully", offer: newOffer });
    } catch (error) {
        console.error("Error creating offer:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const acceptOffer = async (req, res) => {
    const { tradeId, offerId } = req.params;
    try {
        // Update the trade to mark the offer as accepted
        const trade = await Trade.findById(tradeId);
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Optionally, ensure the offer belongs to the trade
        const offer = await Offer.findById(offerId);
        if (!offer || offer.trade.toString() !== tradeId) {
            return res.status(404).json({ message: 'Offer not found or does not belong to the specified trade' });
        }

        // Mark the offer as accepted
        trade.acceptedOffer = offerId;
        io.to(tradeId).emit('offer_accepted', { offerId });
        await trade.save();

        // Optionally, handle other business logic like notifying users or closing the trade
        res.status(200).json({ message: "Offer accepted successfully", trade });
    } catch (error) {
        console.error('Failed to accept offer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


};

export const rejectOffer = async (req, res) => {
    const { tradeId, offerId } = req.params;
    try {
        const trade = await Trade.findById(tradeId);
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        // Assuming offers are stored in an array within the Trade model
        trade.offers = trade.offers.filter(offer => offer._id.toString() !== offerId);
        io.to(tradeId).emit('offer_rejected', { offerId });
        await trade.save();
        res.status(200).json({ message: "Offer rejected successfully", trade });
    } catch (error) {
        console.error('Failed to reject offer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


};

export const deleteTrade = async (req, res) => {
    const { tradeId } = req.params;

    try {
        const trade = await Trade.findById(tradeId);
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Instead of deleting, mark the trade as completed
        trade.status = 'completed'; // Assuming 'completed' means the trade was accepted and finished
        await trade.save();

        res.status(200).json({ message: 'Trade completed successfully', trade });
    } catch (error) {
        console.error('Error completing trade:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// tradeController.js

export const getOffersForTrade = async (req, res) => {
    const { tradeId } = req.params;
    try {
        const trade = await Trade.findById(tradeId)
            .populate({
                path: 'offers',
                populate: { path: 'user', select: 'username' }
            });

        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        res.status(200).json(trade.offers);
    } catch (error) {
        console.error('Failed to fetch offers:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
