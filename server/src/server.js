require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const { initializeSocket, getLeaderboardData, broadcastCheatingViolation } = require('./socket');

// Import routes
const adminRoutes = require('./routes/admin.routes');
const teamRoutes = require('./routes/team.routes');
const teamManagementRoutes = require('./routes/teamManagement.routes');
const statsRoutes = require('./routes/stats.routes');
const questionRoutes = require('./routes/question.routes');
const roundRoutes = require('./routes/round.routes');
const submissionRoutes = require('./routes/submission.routes');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Initialize socket utility
initializeSocket(io);

// Socket.IO connection handler
io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);

    // Send current leaderboard on connection
    try {
        const leaderboard = await getLeaderboardData();
        socket.emit('leaderboard:update', leaderboard);
    } catch (error) {
        console.error('Error sending initial leaderboard:', error);
    }

    // Handle cheating violations reported by clients
    socket.on('cheating:violation', ({ teamName, roundName, violationType, action, duration }) => {
        console.log(`Violation reported: ${teamName} - ${violationType} (${action}${duration ? `, ${duration}s` : ''}) in ${roundName}`);
        broadcastCheatingViolation(teamName, roundName, violationType, action, duration);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Connect to database
connectDB();

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'https://uninfectiously-rancid-tianna.ngrok-free.dev'
];

app.use(cors({
    origin: "https://dsa-coding-contest-platform.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/teams', teamManagementRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`WebSocket server ready on port ${PORT}`);
});
