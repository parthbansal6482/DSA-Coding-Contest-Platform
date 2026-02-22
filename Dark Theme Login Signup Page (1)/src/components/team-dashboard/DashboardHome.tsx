import { Users, Award, Target, Clock } from 'lucide-react';

interface TeamData {
  teamName: string;
  points: number;
  rank: number;
  tokens: {
    sabotage: number;
    shield: number;
  };
  members: string[];
}

export function DashboardHome({ teamData }: { teamData: TeamData }) {
  const stats = [
    { label: 'Total Points', value: teamData.points.toString(), icon: Award, color: 'text-yellow-500' },
    { label: 'Current Rank', value: `#${teamData.rank}`, icon: Target, color: 'text-blue-500' },
    { label: 'Team Members', value: teamData.members.length.toString(), icon: Users, color: 'text-green-500' },
    { label: 'Active Rounds', value: '2', icon: Clock, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {teamData.teamName}!</h2>
        <p className="text-gray-400 mt-1">Here's your team overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Team Members */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>
        <div className="space-y-3">
          {teamData.members.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-black border border-zinc-800 rounded-lg"
            >
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {member.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{member}</p>
                <p className="text-sm text-gray-400">Member {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Completed "Two Sum"', points: '+100 points', time: '5 mins ago', type: 'success' },
            { action: 'Attempted "Binary Tree"', points: 'No points', time: '15 mins ago', type: 'neutral' },
            { action: 'Purchased Shield Token', points: '-200 points', time: '30 mins ago', type: 'purchase' },
            { action: 'Completed "Valid Parentheses"', points: '+80 points', time: '1 hour ago', type: 'success' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
            >
              <div>
                <p className="text-gray-300">{activity.action}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
              </div>
              <span
                className={`text-sm font-medium ${
                  activity.type === 'success'
                    ? 'text-green-500'
                    : activity.type === 'purchase'
                    ? 'text-yellow-500'
                    : 'text-gray-500'
                }`}
              >
                {activity.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
