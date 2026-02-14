const mongoose = require('mongoose');

const whitelistedUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email to whitelist'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('WhitelistedUser', whitelistedUserSchema);
