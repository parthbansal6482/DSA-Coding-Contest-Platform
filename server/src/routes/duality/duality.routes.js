const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const WhitelistedUser = require('../../models/duality/WhitelistedUser');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email.toLowerCase();

        // 1. --- DOMAIN RESTRICTION ---
        if (!email.endsWith('@bmu.edu.in')) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: Please use your @bmu.edu.in organization email.'
            });
        }

        // 2. --- WHITELIST CHECK ---
        const isWhitelisted = await WhitelistedUser.findOne({ email });
        if (!isWhitelisted) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: You are not authorized to access this platform. Please contact the club administrator.'
            });
        }

        // Generate a token
        const token = jwt.sign(
            { id: email, role: 'duality-user' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                email,
                name: payload.name,
                picture: payload.picture
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid Google Token'
        });
    }
});

module.exports = router;
