import { useState, useEffect } from 'react';
import { AdminAuth } from './components/extended/AdminAuth';
import { TeamAuth } from './components/extended/TeamAuth';
import { AdminDashboard } from './components/extended/AdminDashboard';
import { TeamDashboard } from './components/extended/TeamDashboard';
import { RoundPage } from './components/extended/RoundPage';
import { ProjectSelection } from './components/common/ProjectSelection';
import { DualityAuth } from './components/duality/DualityAuth';
import { Shield, Users, ArrowLeft } from 'lucide-react';

type UserType = 'admin' | 'team' | 'duality-user';
type ProjectType = 'extended' | 'duality' | null;

export default function App() {
  const [project, setProject] = useState<ProjectType>(null);
  const [userType, setUserType] = useState<UserType>('team');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTeamLoggedIn, setIsTeamLoggedIn] = useState(false);
  const [isDualityLoggedIn, setIsDualityLoggedIn] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);

  // Check for existing login on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUserType) {
      if (storedUserType === 'admin') {
        setIsAdminLoggedIn(true);
        setUserType('admin');
        setProject('extended');
      } else if (storedUserType === 'team') {
        setIsTeamLoggedIn(true);
        setUserType('team');
        setProject('extended');
      } else if (storedUserType === 'duality-user') {
        setIsDualityLoggedIn(true);
        setUserType('duality-user');
        setProject('duality');
      }
    }
  }, []);

  // Handle Logout (Generic)
  const handleLogout = () => {
    localStorage.clear();
    setIsAdminLoggedIn(false);
    setIsTeamLoggedIn(false);
    setIsDualityLoggedIn(false);
    setProject(null);
  };

  // 1. Selection Page
  if (!project) {
    return <ProjectSelection onSelect={setProject} />;
  }

  // 2. Duality Path
  if (project === 'duality') {
    if (isDualityLoggedIn) {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Duality Dashboard</h1>
          <p className="text-zinc-400 mb-8">Welcome to the LeetCode-style practice section!</p>
          <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center max-w-lg">
            <p className="text-zinc-500 mb-6">This section is under development. Soon you will see problems here.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setProject(null)}
                className="bg-zinc-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Selection
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <DualityAuth
        onLogin={() => setIsDualityLoggedIn(true)}
        onBack={() => setProject(null)}
      />
    );
  }

  // 3. Duality Extended Path
  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        onBack={() => setProject(null)}
        onLogout={handleLogout}
      />
    );
  }

  if (isTeamLoggedIn && activeRoundId) {
    return (
      <RoundPage
        roundId={activeRoundId}
        onExitRound={() => setActiveRoundId(null)}
      />
    );
  }

  if (isTeamLoggedIn) {
    return (
      <TeamDashboard
        onEnterRound={(roundId: string) => setActiveRoundId(roundId)}
        onBack={() => setProject(null)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setProject(null)}
          className="flex items-center gap-2 text-white hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>

        {/* User Type Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setUserType('team')}
            className={`flex-1 py-4 px-6 rounded-xl border transition-all ${userType === 'team'
              ? 'bg-white text-black border-white'
              : 'bg-zinc-900 text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Users className="w-5 h-5" />
              <span className="font-medium">Team Registration</span>
            </div>
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 py-4 px-6 rounded-xl border transition-all ${userType === 'admin'
              ? 'bg-white text-black border-white'
              : 'bg-zinc-900 text-gray-400 border-zinc-800 hover:border-zinc-600'
              }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin Access</span>
            </div>
          </button>
        </div>

        {/* Render appropriate auth component */}
        {userType === 'admin' ? (
          <AdminAuth onLogin={() => setIsAdminLoggedIn(true)} />
        ) : (
          <TeamAuth onLogin={() => setIsTeamLoggedIn(true)} />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2026 Competition Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}