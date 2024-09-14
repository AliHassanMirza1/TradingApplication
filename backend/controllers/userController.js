import { User } from '../models/overall.js';

export const getUserProfile = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'No user ID found in request' });
    }

    try {
        const user = await User.findById(req.user.id).populate('tradesCreated offersMade');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error accessing database:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUserProfile = async (req, res) => {
  const { username, cash, itemsOwned } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.cash = cash;
    user.itemsOwned = itemsOwned;
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
