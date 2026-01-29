# DSA Coding Contest Platform

A full-stack web application for hosting offline Data Structures & Algorithms coding contests with team management, real-time dashboards, and admin controls.

## 🚀 Features

### Authentication & Authorization
- **Admin Authentication**: Secure login-only system for administrators
- **Team Registration**: Teams can register with 2-3 members
- **JWT-based Authentication**: Secure token-based auth system
- **Approval Workflow**: Admin approval required for team registration

### Admin Dashboard
- **Real-time Overview**: Live statistics for teams, approvals, questions, and rounds
- **Team Management**: View, approve, and reject team registrations
- **Status Filtering**: Filter teams by pending, approved, or rejected status
- **Questions Management**: Add and manage DSA problems
- **Rounds Control**: Create and manage contest rounds

### Team Features
- **Team Dashboard**: View contest information and team stats
- **Member Management**: 2-3 member teams with validation
- **Status Tracking**: Real-time registration status updates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** enabled

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/parthbansal6482/DSA-Coding-Contest-Platform.git
cd DSA-Coding-Contest-Platform
```

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
NODE_ENV=development
PORT=5001

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3001
```

5. Seed initial admin account:
```bash
npm run seed
```

This creates an admin account:
- **Email**: `admin@contest.com`
- **Password**: `admin123`

6. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "VITE_API_URL=http://localhost:5001/api" > .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3001`

## 🔑 API Endpoints

### Authentication

#### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (Protected)

#### Team
- `POST /api/team/register` - Register team (2-3 members)
- `POST /api/team/login` - Team login (approved teams only)
- `GET /api/team/profile` - Get team profile (Protected)

### Team Management (Admin Only)
- `GET /api/teams?status=pending` - Get all teams with optional status filter
- `PUT /api/teams/:teamId/approve` - Approve team registration
- `PUT /api/teams/:teamId/reject` - Reject team registration

### Statistics (Admin Only)
- `GET /api/stats/overview` - Get dashboard overview statistics

### Health Check
- `GET /api/health` - Server health check

## 📱 Usage

### Admin Workflow

1. **Login**: Navigate to admin login and use credentials
2. **View Dashboard**: See real-time statistics
3. **Manage Teams**: 
   - View all registered teams
   - Filter by status (pending/approved/rejected)
   - Approve or reject team registrations
4. **Manage Questions**: Add DSA problems for contests
5. **Control Rounds**: Create and manage contest rounds

### Team Workflow

1. **Register**: 
   - Enter team name
   - Select 2 or 3 members
   - Provide member details (name, email)
   - Set team password
2. **Wait for Approval**: Admin must approve registration
3. **Login**: After approval, login with team credentials
4. **Access Dashboard**: View team information and contest details

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Protected routes with middleware
- Input validation on all endpoints
- CORS protection
- SQL injection prevention via Mongoose

## 📊 Database Schema

### Admin Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Team Model
```javascript
{
  teamName: String (required, unique),
  password: String (required, hashed),
  members: [{
    name: String (required),
    email: String (required)
  }], // 2-3 members required
  status: String (pending/approved/rejected),
  registrationDate: Date,
  approvedBy: ObjectId (ref: Admin),
  approvedAt: Date
}
```

## 🚧 Upcoming Features

- [ ] Questions management system
- [ ] Rounds creation and control
- [ ] Code submission and evaluation
- [ ] Real-time leaderboard
- [ ] Sabotage mechanics
- [ ] Token shop system
- [ ] Live contest monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Parth Bansal**
- GitHub: [@parthbansal6482](https://github.com/parthbansal6482)

## 🙏 Acknowledgments

- Built with React and Node.js
- UI components from Radix UI
- Icons from Lucide React
- Styled with Tailwind CSS

---

**Note**: Remember to change default admin credentials and JWT secret in production!