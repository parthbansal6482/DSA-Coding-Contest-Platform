require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@contest.com' });

        if (existingAdmin) {
            console.log('Admin already exists!');
            console.log('Email: admin@contest.com');
            process.exit(0);
        }

        // Create admin
        const admin = await Admin.create({
            name: 'Admin User',
            email: 'admin@contest.com',
            password: 'admin123',
        });

        console.log('✅ Admin created successfully!');
        console.log('Email: admin@contest.com');
        console.log('Password: admin123');
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seedAdmin();
