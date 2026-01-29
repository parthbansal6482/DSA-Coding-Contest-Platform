import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LeaderboardTeam {
  rank: number;
  teamName: string;
  points: number;
  questionsCompleted: number;
  lastSubmission: string;
  rankChange: number; // positive = up, negative = down, 0 = no change
}

export function Leaderboard({ currentTeam }: { currentTeam: string }) {
  const teams: LeaderboardTeam[] = [
    {
      rank: 1,
      teamName: 'Algorithm Aces',
      points: 1250,
      questionsCompleted: 12,
      lastSubmission: '2 mins ago',
      rankChange: 2,
    },
    {
      rank: 2,
      teamName: 'Binary Beasts',
      points: 980,
      questionsCompleted: 10,
      lastSubmission: '5 mins ago',
      rankChange: -1,
    },
    {
      rank: 3,
      teamName: 'Code Warriors',
      points: 850,
      questionsCompleted: 9,
      lastSubmission: '8 mins ago',
      rankChange: 1,
    },
    {
      rank: 4,
      teamName: 'Debug Squad',
      points: 720,
      questionsCompleted: 8,
      lastSubmission: '12 mins ago',
      rankChange: -2,
    },
    {
      rank: 5,
      teamName: 'Runtime Rebels',
      points: 680,
      questionsCompleted: 7,
      lastSubmission: '15 mins ago',
      rankChange: 0,
    },
    {
      rank: 6,
      teamName: 'Stack Overflow',
      points: 620,
      questionsCompleted: 7,
      lastSubmission: '18 mins ago',
      rankChange: 1,
    },
    {
      rank: 7,
      teamName: 'Null Pointers',
      points: 580,
      questionsCompleted: 6,
      lastSubmission: '20 mins ago',
      rankChange: -1,
    },
    {
      rank: 8,
      teamName: 'Syntax Heroes',
      points: 540,
      questionsCompleted: 6,
      lastSubmission: '25 mins ago',
      rankChange: 0,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-500 text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-500 text-xs">
          <TrendingDown className="w-3 h-3" />
          <span>{change}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500 text-xs">
        <Minus className="w-3 h-3" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <p className="text-gray-400 mt-1">Live rankings • Updates every 30 seconds</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {teams.slice(0, 3).map((team, index) => (
          <div
            key={team.teamName}
            className={`${
              index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
            } ${index === 0 ? 'transform scale-105' : ''}`}
          >
            <div
              className={`bg-zinc-900 border rounded-xl p-6 text-center ${
                team.teamName === currentTeam
                  ? 'border-white shadow-lg shadow-white/10'
                  : 'border-zinc-800'
              }`}
            >
              <div className="flex justify-center mb-3">
                {getRankIcon(team.rank)}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{team.teamName}</h3>
              <p className="text-3xl font-bold text-white mb-2">{team.points}</p>
              <p className="text-sm text-gray-400">points</p>
              <div className="mt-3 flex justify-center">
                {getRankChangeIndicator(team.rankChange)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rank</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Team</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Points</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Completed</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Last Submission
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.teamName}
                  className={`border-b border-zinc-800 last:border-0 transition-colors ${
                    team.teamName === currentTeam
                      ? 'bg-white/5'
                      : 'hover:bg-zinc-800/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {team.rank <= 3 ? (
                        getRankIcon(team.rank)
                      ) : (
                        <span className="text-gray-400 font-medium">#{team.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          team.teamName === currentTeam ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {team.teamName}
                      </span>
                      {team.teamName === currentTeam && (
                        <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold">{team.points}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400">{team.questionsCompleted} questions</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{team.lastSubmission}</span>
                  </td>
                  <td className="px-6 py-4">{getRankChangeIndicator(team.rankChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Your Rank</p>
          <p className="text-2xl font-bold text-white">
            #{teams.find((t) => t.teamName === currentTeam)?.rank}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Points Gap (to #1)</p>
          <p className="text-2xl font-bold text-white">
            {teams[0].points - (teams.find((t) => t.teamName === currentTeam)?.points || 0)}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Teams</p>
          <p className="text-2xl font-bold text-white">{teams.length}</p>
        </div>
      </div>
    </div>
  );
}
