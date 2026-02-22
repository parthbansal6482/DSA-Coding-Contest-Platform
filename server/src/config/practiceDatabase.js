const mongoose = require('mongoose');

let practiceConnection = null;

const connectPracticeDB = async () => {
    try {
        practiceConnection = await mongoose.createConnection(process.env.MONGODB_PRACTICE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Practice MongoDB Connected: ${practiceConnection.host}`);
        return practiceConnection;
    } catch (error) {
        console.error(`Practice DB Error: ${error.message}`);
        process.exit(1);
    }
};

const getPracticeConnection = () => {
    if (!practiceConnection) {
        throw new Error('Practice database not connected. Call connectPracticeDB() first.');
    }
    return practiceConnection;
};

module.exports = { connectPracticeDB, getPracticeConnection };
