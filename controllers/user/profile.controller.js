const User = require('../../models/user.model');
const AuthService = require('../../services/auth.service');

const updateProfile = async (req, res, next) => {
    try {
        const username = req.user.username;
        const updates = {};

        if (req.body.newUsername) {
            const existingUser = await User.findOne({ username: req.body.newUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            updates.username = req.body.newUsername;
        }

        if (req.body.newPassword) {
            updates.password = await AuthService.hashPassword(req.body.newPassword);
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            updates,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};

const deleteProfile = async (req, res, next) => {
    try {
        const username = req.user.username;
        const deletedUser = await User.findOneAndDelete({ username });
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateProfile,
    deleteProfile
};