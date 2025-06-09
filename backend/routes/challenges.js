const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @route   GET /api/challenges
// @desc    Get all available challenges
// @access  Public
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/challenges/join/:id
// @desc    Join a challenge
// @access  Private
router.post('/join/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });
        
        // Check if user has already joined
        if (user.joinedChallenges.some(c => c.challengeId.equals(challenge._id))) {
            return res.status(400).json({ msg: 'You have already joined this challenge' });
        }

        user.joinedChallenges.push({ challengeId: challenge._id });
        await user.save();

        res.json(user.joinedChallenges);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/challenges/complete/:challengeInstanceId
// @desc    Log a day as complete for a challenge
// @access  Private
router.post('/log/:challengeInstanceId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const challengeInstance = user.joinedChallenges.id(req.params.challengeInstanceId);

        if (!challengeInstance) return res.status(404).json({ msg: 'Challenge not found for this user' });

        // Add a log entry for today
        challengeInstance.progressLog.push({ date: new Date(), completed: true });
        
        // Check for completion to award a badge
        const challengeDetails = await Challenge.findById(challengeInstance.challengeId);
        if (challengeInstance.progressLog.length >= challengeDetails.durationDays) {
            challengeInstance.completed = true;
            if (!user.badges.includes(challengeDetails.badgeAwarded)) {
                 user.badges.push(challengeDetails.badgeAwarded);
            }
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;