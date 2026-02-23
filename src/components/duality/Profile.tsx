import { User, Trophy, Target, Calendar, TrendingUp, Award } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  joinDate: string;
  lastActiveDate: string;
}

interface Submission {
  _id: string;
  question: {
    title: string;
    difficulty: string;
  };
  status: string;
  submittedAt: string;
}

export function Profile({ user, submissions }: { user: User, submissions: Submission[] }) {
  const recentActivity = submissions.slice(0, 5).map(s => ({
    date: new Date(s.submittedAt).toLocaleDateString(),
    problem: s.question.title,
    difficulty: s.question.difficulty,
    status: s.status === 'accepted' ? 'Solved' : 'Attempted'
  }));
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-400 text-sm">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.streak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{user.totalSolved}</div>
              <div className="text-xs text-gray-500">Solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Easy Problems</p>
              <p className="text-2xl font-bold text-green-500">{user.easySolved}</p>
            </div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 text-transparent">.</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Medium Problems</p>
              <p className="text-2xl font-bold text-yellow-500">{user.mediumSolved}</p>
            </div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 text-transparent">.</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hard Problems</p>
              <p className="text-2xl font-bold text-red-500">{user.hardSolved}</p>
            </div>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 text-transparent">.</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-black rounded-lg border border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">{activity.date}</div>
                <div>
                  <p className="text-white font-medium">{activity.problem}</p>
                  <p className="text-xs text-gray-500">{activity.difficulty}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${activity.status === 'Solved'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                {activity.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black border border-zinc-800 rounded-lg p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-white">First Solve</p>
            <p className="text-xs text-gray-500 mt-1">Unlocked</p>
          </div>
          <div className="bg-black border border-zinc-800 rounded-lg p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-white">10 Day Streak</p>
            <p className="text-xs text-gray-500 mt-1">Unlocked</p>
          </div>
          <div className="bg-black border border-zinc-800 rounded-lg p-4 text-center opacity-50">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-sm font-medium text-white">50 Problems</p>
            <p className="text-xs text-gray-500 mt-1">Locked</p>
          </div>
          <div className="bg-black border border-zinc-800 rounded-lg p-4 text-center opacity-50">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm font-medium text-white">Hard Master</p>
            <p className="text-xs text-gray-500 mt-1">Locked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
