import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileQuestion,
  Layers,
  Users,
  PlayCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { QuestionsSection } from './dashboard/QuestionsSection';
import { RoundsSection } from './dashboard/RoundsSection';
import { TeamsSection } from './dashboard/TeamsSection';
import { RoundControlSection } from './dashboard/RoundControlSection';

type Section = 'overview' | 'questions' | 'rounds' | 'teams' | 'control';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'overview' as Section, label: 'Overview', icon: LayoutDashboard },
    { id: 'questions' as Section, label: 'Questions', icon: FileQuestion },
    { id: 'rounds' as Section, label: 'Rounds', icon: Layers },
    { id: 'teams' as Section, label: 'Teams', icon: Users },
    { id: 'control' as Section, label: 'Round Control', icon: PlayCircle },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-0'
          } bg-zinc-900 border-r border-zinc-800 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">DSA Contest</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-zinc-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-white">
              {navItems.find((item) => item.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@contest.com</p>
            </div>
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'questions' && <QuestionsSection />}
          {activeSection === 'rounds' && <RoundsSection />}
          {activeSection === 'teams' && <TeamsSection />}
          {activeSection === 'control' && <RoundControlSection />}
        </main>
      </div>
    </div>
  );
}

function OverviewSection() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingApprovals: 0,
    totalQuestions: 0,
    activeRounds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { getOverviewStats } = await import('../services/stats.service');
      const data = await getOverviewStats();
      setStats({
        totalTeams: data.totalTeams,
        pendingApprovals: data.pendingApprovals,
        totalQuestions: data.totalQuestions,
        activeRounds: data.activeRounds,
      });
      setError('');
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { label: 'Total Teams', value: stats.totalTeams.toString(), color: 'bg-blue-500' },
    { label: 'Pending Approvals', value: stats.pendingApprovals.toString(), color: 'bg-yellow-500' },
    { label: 'Total Questions', value: stats.totalQuestions.toString(), color: 'bg-green-500' },
    { label: 'Active Rounds', value: stats.activeRounds.toString(), color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-red-500 hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-black border border-zinc-800 rounded-lg p-4 text-left hover:border-zinc-600 transition-colors">
            <FileQuestion className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-white font-medium">Add Question</p>
            <p className="text-xs text-gray-400 mt-1">Create new DSA problem</p>
          </button>
          <button className="bg-black border border-zinc-800 rounded-lg p-4 text-left hover:border-zinc-600 transition-colors">
            <Layers className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-white font-medium">Create Round</p>
            <p className="text-xs text-gray-400 mt-1">Setup new contest round</p>
          </button>
          <button className="bg-black border border-zinc-800 rounded-lg p-4 text-left hover:border-zinc-600 transition-colors">
            <Users className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-white font-medium">Review Teams</p>
            <p className="text-xs text-gray-400 mt-1">Approve pending teams</p>
          </button>
          <button className="bg-black border border-zinc-800 rounded-lg p-4 text-left hover:border-zinc-600 transition-colors">
            <PlayCircle className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-white font-medium">Start Round</p>
            <p className="text-xs text-gray-400 mt-1">Begin contest round</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Team "Code Warriors" registered', time: '5 minutes ago' },
            { action: 'Round 1 completed successfully', time: '1 hour ago' },
            { action: 'Question "Binary Search Tree" added', time: '2 hours ago' },
            { action: 'Team "Debug Squad" approved', time: '3 hours ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
            >
              <p className="text-gray-300">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
