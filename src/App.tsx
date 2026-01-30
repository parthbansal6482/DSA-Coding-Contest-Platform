import { useState } from 'react';
import { AdminAuth } from './components/AdminAuth';
import { TeamAuth } from './components/TeamAuth';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamDashboard } from './components/TeamDashboard';
import { RoundPage } from './components/RoundPage';
import { Shield, Users } from 'lucide-react';

type UserType = 'admin' | 'team';

export default function App() {
  const [userType, setUserType] = useState<UserType>('team');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTeamLoggedIn, setIsTeamLoggedIn] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);

  // Show admin dashboard if logged in as admin
  if (isAdminLoggedIn) {
    return <AdminDashboard />;
  }

  // Show round page if team entered a round
  if (isTeamLoggedIn && activeRoundId) {
    return (
      <RoundPage
        roundId={activeRoundId}
        onExitRound={() => setActiveRoundId(null)}
      />
    );
  }

  // Show team dashboard if logged in as team
  if (isTeamLoggedIn) {
    return (
      <TeamDashboard
        onEnterRound={(roundId: string) => setActiveRoundId(roundId)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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