const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// --- SCORE CALCULATION LOGIC ---
const calculateScore = (formData) => {
    let score = 50; // Start with a baseline score
    // formData = { sleepHours: 7, exerciseDays: 3, junkFoodFreq: 'rarely' }
    
    // Sleep points
    if (formData.sleepHours >= 8) score += 20;
    else if (formData.sleepHours >= 6) score += 10;
    else score -= 10;

    // Exercise points
    score += formData.exerciseDays * 5;

    // Diet points
    if (formData.junkFoodFreq === 'rarely') score += 15;
    if (formData.junkFoodFreq === 'sometimes') score += 5;
    if (formData.junkFoodFreq === 'often') score -= 15;
    
    return Math.max(0, Math.min(100, score)); // Clamp score between 0 and 100
};

// @route   POST /api/user/survey
// @desc    Submit user survey and calculate score
// @access  Private
router.post('/survey', authMiddleware, async (req, res) => {
    try {
        const score = calculateScore(req.body);
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        user.lifestyleScore = score;
        user.surveyTaken = true;
        await user.save();
        
        res.json({ msg: 'Score calculated successfully', user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Use .populate to get full challenge details instead of just IDs
        const user = await User.findById(req.user.id).select('-password').populate('joinedChallenges.challengeId');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;