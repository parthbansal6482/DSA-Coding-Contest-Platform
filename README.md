# DSA Coding Contest Platform

A full-stack web application for hosting offline Data Structures & Algorithms coding contests with team management, real-time dashboards, and automated code execution.

## 🚀 Features

### Authentication & Security
- **Admin Dashboard**: Secure management system for administrators.
- **Team Registration**: Teams of 2-3 members with admin approval workflow.
- **Single Device Login**: Prevents multiple concurrent logins for the same team account.
- **JWT-based Security**: Secure token-based authentication and protected API routes.

### Contest Management
- **Rounds Control**: Create and manage multiple contest rounds with timing controls.
- **Question Bank**: Manage DSA problems with visible examples and hidden test cases.
- **Real-time Leaderboard**: Live ranking updates based on points and solve time.
- **System Health**: Automated system monitoring and health checks.

### Code Execution System
- **Docker Sandboxing**: Executes user code in isolated containers for maximum security.
- **Multi-Language Support**: Support for Python, C++, C, and Java.
- **Submission Queue**: MongoDB-backed queue to manage system load and prevent CPU spikes.
- **Resource Limits**: Configurable CPU (1 core) and Memory (256MB) limits per execution.
- **Error Detection**: Specific reporting for Time Limit Exceeded (TLE) and Memory Limit Exceeded (MLE).

### Tactical Mechanics
- **Sabotage System**: Teams can buy tokens to sabotage opponents.
- **Shield Protection**: Defensive tokens to block incoming attacks.
- **Token Shop**: Currency-based system for purchasing tactical advantages.

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript, Vite)
- **Tailwind CSS** & **Radix UI**
- **Lucide React** (Icons)
- **Socket.io-client** (Real-time updates)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **Dockerode** (Docker API for Node.js)
- **Socket.io** (WebSocket server)

### Execution Environment
- **Docker**: Containerized execution for security.
- **Compilers**: OpenJDK 17, GCC/G++ 11, Python 3.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Docker (Installed and running)

### Setup Instructions

1. **Clone & Install**:
   ```bash
   git clone https://github.com/parthbansal6482/DSA-Coding-Contest-Platform.git
   cd DSA-Coding-Contest-Platform
   npm install
   cd server && npm install
   ```

2. **Build Code Executor**:
   ```bash
   cd server/docker
   ./build-executor.sh
   ```

3. **Configure Environment**:
   - Backend: Copy `server/.env.example` to `server/.env` and fill in details.
   - Frontend: Copy `.env.example` to `.env` and set `VITE_API_URL`.

4. **Run Application**:
   - Backend: `cd server && npm run dev`
   - Frontend: `npm run dev`

## 🔑 API Categories
- `/api/admin` - Admin Auth & Profile
- `/api/team` - Team Auth & Registration
- `/api/questions` - Problem Management
- `/api/rounds` - Contest Control
- `/api/submissions` - Code Evaluation & Leaderboard

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the ISC License.

## 👨‍💻 Author
**Parth Bansal** - [@parthbansal6482](https://github.com/parthbansal6482)