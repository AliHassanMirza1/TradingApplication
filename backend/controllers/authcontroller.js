import { User } from '../models/overall.js';

export const signup = async (req, res) => {
    try {
        const { username, password, cash, itemsOwned } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            username,
            password, 
            cash,
            itemsOwned
        });
        await newUser.save();
        const userToReturn = await User.findById(newUser._id)
            .populate('tradesCreated')
            .populate('offersMade');
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: userToReturn._id,
                username: userToReturn.username,
                cash: userToReturn.cash,
                itemsOwned: userToReturn.itemsOwned,
                tradesCreated: userToReturn.tradesCreated,
                offersMade: userToReturn.offersMade
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
            .populate('tradesCreated')
            .populate('offersMade');

        if (!user || password !== user.password) {  
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.json({ 
            message: "User logged in",
            userProfile: {
                id: user._id,
                username: user.username,
                cash: user.cash,
                itemsOwned: user.itemsOwned,
                tradesCreated: user.tradesCreated,
                offersMade: user.offersMade
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const changePassword = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (currentPassword !== user.password) {  
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;  
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
