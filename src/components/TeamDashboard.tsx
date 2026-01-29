import { useState, useEffect } from 'react';
import {
  Home,
  Trophy,
  PlayCircle,
  ShoppingBag,
  LogOut,
  Coins,
  Shield as ShieldIcon,
  Zap,
  Crosshair
} from 'lucide-react';
import { DashboardHome } from './team-dashboard/DashboardHome';
import { Leaderboard } from './team-dashboard/Leaderboard';
import { ActiveRounds } from './team-dashboard/ActiveRounds';
import { TokenShop } from './team-dashboard/TokenShop';
import { SabotagePanel } from './team-dashboard/SabotagePanel';
import { getTeamStats, TeamStats } from '../services/team.service';

type Section = 'home' | 'leaderboard' | 'rounds' | 'shop' | 'tactics';

interface TeamDashboardProps {
  onEnterRound?: (roundId: string) => void;
}

export function TeamDashboard({ onEnterRound }: TeamDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [teamData, setTeamData] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamData();
    // Refresh team data every 30 seconds
    const interval = setInterval(fetchTeamData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeamData = async () => {
    try {
      const data = await getTeamStats();
      setTeamData(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching team data:', err);
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/team-auth';
  };

  const navItems = [
    { id: 'home' as Section, label: 'Dashboard', icon: Home },
    { id: 'leaderboard' as Section, label: 'Leaderboard', icon: Trophy },
    { id: 'rounds' as Section, label: 'Active Rounds', icon: PlayCircle },
    { id: 'shop' as Section, label: 'Token Shop', icon: ShoppingBag },
    { id: 'tactics' as Section, label: 'Tactics', icon: Crosshair },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading team data...</div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Failed to load team data'}</p>
          <button
            onClick={fetchTeamData}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold text-white">{teamData.teamName}</h1>
              <p className="text-sm text-gray-400">Rank #{teamData.rank}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Points Display */}
            <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-4 py-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-400">Points</p>
                <p className="text-lg font-bold text-white">{teamData.points}</p>
              </div>
            </div>

            {/* Tokens Display */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-3 py-2">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-white font-medium">{teamData.tokens.sabotage}</span>
              </div>
              <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-3 py-2">
                <ShieldIcon className="w-4 h-4 text-blue-500" />
                <span className="text-white font-medium">{teamData.tokens.shield}</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeSection === item.id
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        {activeSection === 'home' && <DashboardHome teamData={teamData} />}
        {activeSection === 'leaderboard' && <Leaderboard currentTeam={teamData.teamName} />}
        {activeSection === 'rounds' && <ActiveRounds onEnterRound={onEnterRound} />}
        {activeSection === 'shop' && (
          <TokenShop
            currentPoints={teamData.points}
            currentTokens={teamData.tokens}
            onPurchase={(type, cost) => {
              setTeamData({
                ...teamData,
                points: teamData.points - cost,
                tokens: {
                  ...teamData.tokens,
                  [type]: teamData.tokens[type as keyof typeof teamData.tokens] + 1,
                },
              });
            }}
          />
        )}
        {activeSection === 'tactics' && <SabotagePanel />}
      </main>
    </div>
  );
}
