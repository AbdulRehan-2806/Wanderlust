const User = require("../models/user.js");

module.exports.renderProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: "listings",
            select: "title location price image reviews",
            populate: {
                path: "reviews",
                select: "rating",
            }
        })
        .populate({
            path: "bookings",
            populate: {
                path: "listing",
                select: "title",
            }
        })
        .populate({
            path: "reviews",
            populate: {
                path: "listing",
                select: "title",
            }
        });
    res.render("users/profile.ejs", { user });
};

module.exports.editProfile = async (req, res) => {
    let { username, email } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.email = email;

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                req.flash('error', 'Username already taken');
                return res.redirect('/profile');
            }
            user.username = username;
        }

        await user.save();
        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (error) {
        req.flash('error', 'Error updating profile');
        res.redirect('/profile');
    }
};

module.exports.passwordCheck = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { user: authenticatedUser } = await User.authenticate()(user.username, currentPassword);

        if (!authenticatedUser) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New passwords do not match' });
        }
        res.json({ success: true, message: 'Password validation done' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }

        await user.changePassword(currentPassword, newPassword);
        req.flash('success', 'Password changed successfully');
        res.redirect('/profile');
    } catch (err) {
        if (err.name === 'IncorrectPasswordError') {
            req.flash('error', 'Current password is incorrect');
        } else {
            req.flash('error', 'Error changing password');
        }
        res.redirect('/profile');
    }
};