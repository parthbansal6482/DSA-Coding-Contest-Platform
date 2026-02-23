import { useState, useEffect } from 'react';
import { AdminAuth } from './components/AdminAuth';
import { TeamAuth } from './components/TeamAuth';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamDashboard } from './components/TeamDashboard';
import { RoundPage } from './components/RoundPage';
import { Shield, Users } from 'lucide-react';

// Duality imports
import { Landing } from './components/duality/Landing';
import { DualityAuth } from './components/duality/DualityAuth';
import { StudentDashboard } from './components/duality/StudentDashboard';
import { AdminDashboard as DualityAdminDashboard } from './components/duality/AdminDashboard';
import { ProblemSolve } from './components/duality/ProblemSolve';

type UserType = 'admin' | 'team';
type DualityView = 'landing' | 'auth' | 'student' | 'admin' | 'problem';
type AppMode = 'platform-select' | 'duality' | 'duality-extended';

const DUALITY_VIEW_KEY = 'dualityView';
const DUALITY_SELECTED_PROBLEM_KEY = 'dualitySelectedProblemId';

export default function App() {
  // Platform mode
  const [appMode, setAppMode] = useState<AppMode>('platform-select');

  // Duality Extended state
  const [userType, setUserType] = useState<UserType>('team');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTeamLoggedIn, setIsTeamLoggedIn] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);

  // Duality state
  const [dualityView, setDualityView] = useState<DualityView>('landing');
  const [dualityUserType, setDualityUserType] = useState<'admin' | 'student'>('student');
  const [dualityUserName, setDualityUserName] = useState('');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Check for existing login on mount
  useEffect(() => {
    // 1. Check for Duality Extended login
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token && storedUserType) {
      setAppMode('duality-extended');
      if (storedUserType === 'admin') {
        setIsAdminLoggedIn(true);
        setUserType('admin');
      } else if (storedUserType === 'team') {
        setIsTeamLoggedIn(true);
        setUserType('team');
      }
    }

    // 2. Check for Duality Practice login (overrides platform-select if found)
    const dualityToken = localStorage.getItem('dualityToken');
    const dualityUserStr = localStorage.getItem('dualityUser');

    if (dualityToken && dualityUserStr) {
      try {
        const user = JSON.parse(dualityUserStr);
        const savedView = localStorage.getItem(DUALITY_VIEW_KEY) as DualityView | null;
        const savedProblemId = localStorage.getItem(DUALITY_SELECTED_PROBLEM_KEY);

        setAppMode('duality');
        setDualityUserName(user.name);
        setDualityUserType(user.role);
        if (user.role === 'admin') {
          setDualityView('admin');
        } else if (savedView === 'problem' && savedProblemId) {
          setSelectedProblemId(savedProblemId);
          setDualityView('problem');
        } else if (savedView === 'student' || savedView === 'auth' || savedView === 'landing') {
          setDualityView(savedView);
        } else {
          setDualityView('student');
        }
      } catch (e) {
        console.error('Error parsing duality user', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DUALITY_VIEW_KEY, dualityView);
  }, [dualityView]);

  useEffect(() => {
    if (selectedProblemId) {
      localStorage.setItem(DUALITY_SELECTED_PROBLEM_KEY, selectedProblemId);
    } else {
      localStorage.removeItem(DUALITY_SELECTED_PROBLEM_KEY);
    }
  }, [selectedProblemId]);

  // Platform selection handlers
  const handleSelectDuality = () => {
    setAppMode('duality');
    setDualityView('auth');
  };

  const handleSelectDualityExtended = () => {
    setAppMode('duality-extended');
  };

  // Duality handlers
  const handleDualityLogin = (userType: 'admin' | 'student', userName: string) => {
    setDualityUserType(userType);
    setDualityUserName(userName);
    setDualityView(userType === 'admin' ? 'admin' : 'student');
  };

  const handleDualityLogout = () => {
    setDualityView('auth');
    setDualityUserName('');
    localStorage.removeItem('dualityToken');
    localStorage.removeItem('dualityUser');
    localStorage.removeItem(DUALITY_VIEW_KEY);
    localStorage.removeItem(DUALITY_SELECTED_PROBLEM_KEY);
  };

  const handleSolveProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setDualityView('problem');
  };

  const handleBackFromProblem = () => {
    setSelectedProblemId(null);
    setDualityView('student');
  };

  const handleBackToLanding = () => {
    setDualityView('landing');
    setAppMode('platform-select');
  };

  // Render Duality Platform
  if (appMode === 'duality') {
    if (dualityView === 'landing') {
      return (
        <Landing
          onSelectDuality={handleSelectDuality}
          onSelectDualityExtended={handleSelectDualityExtended}
        />
      );
    }

    if (dualityView === 'auth') {
      return (
        <DualityAuth
          onLogin={handleDualityLogin}
          onBack={handleBackToLanding}
        />
      );
    }

    if (dualityView === 'problem' && selectedProblemId) {
      return (
        <ProblemSolve
          problemId={selectedProblemId}
          onBack={handleBackFromProblem}
        />
      );
    }

    if (dualityView === 'admin') {
      return (
        <DualityAdminDashboard
          userName={dualityUserName}
          onLogout={handleDualityLogout}
        />
      );
    }

    if (dualityView === 'student') {
      return (
        <StudentDashboard
          userName={dualityUserName}
          onLogout={handleDualityLogout}
          onSolveProblem={handleSolveProblem}
        />
      );
    }
  }

  // Render Duality Extended (existing competition system)
  if (appMode === 'duality-extended') {
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
          {/* Back Button */}
          <button
            onClick={() => setAppMode('platform-select')}
            className="mb-6 text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Platform Selection
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

  // Platform Selection (Landing)
  return (
    <Landing
      onSelectDuality={handleSelectDuality}
      onSelectDualityExtended={handleSelectDualityExtended}
    />
  );
}
