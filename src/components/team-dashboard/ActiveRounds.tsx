import { useState } from 'react';
import { Clock, Play, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface Round {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
  duration: number;
  timeRemaining?: number;
  questionsCount: number;
  pointsEarned?: number;
  maxPoints: number;
}

interface ActiveRoundsProps {
  onEnterRound?: (roundId: string) => void;
}

export function ActiveRounds({ onEnterRound }: ActiveRoundsProps) {
  const [rounds] = useState<Round[]>([
    {
      id: '1',
      name: 'Qualifier Round',
      status: 'completed',
      duration: 60,
      questionsCount: 5,
      pointsEarned: 420,
      maxPoints: 500,
    },
    {
      id: '2',
      name: 'Semi Finals',
      status: 'active',
      duration: 90,
      timeRemaining: 3245, // seconds
      questionsCount: 6,
      pointsEarned: 230,
      maxPoints: 800,
    },
    {
      id: '3',
      name: 'Finals',
      status: 'upcoming',
      duration: 120,
      questionsCount: 8,
      maxPoints: 1200,
    },
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleEnterRound = (roundId: string) => {
    console.log('Entering round:', roundId);
    if (onEnterRound) {
      onEnterRound(roundId);
    }
  };

  const getStatusBadge = (status: Round['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Live Now
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/10 text-gray-500 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Contest Rounds</h2>
        <p className="text-gray-400 mt-1">Join active rounds and track your progress</p>
      </div>

      {/* Active Round Alert */}
      {rounds.some((r) => r.status === 'active') && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-green-500 font-medium">Round is Live!</p>
              <p className="text-sm text-green-500/80">
                {rounds.find((r) => r.status === 'active')?.name} is currently active
              </p>
            </div>
          </div>
          <button
            onClick={() => handleEnterRound(rounds.find((r) => r.status === 'active')!.id)}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Enter Now
          </button>
        </div>
      )}

      {/* Rounds List */}
      <div className="grid grid-cols-1 gap-6">
        {rounds.map((round) => (
          <div
            key={round.id}
            className={`bg-zinc-900 border rounded-xl p-6 transition-all ${
              round.status === 'active'
                ? 'border-green-500 shadow-lg shadow-green-500/20'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{round.name}</h3>
                  {getStatusBadge(round.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{round.duration} minutes</span>
                  </div>
                  <span>•</span>
                  <span>{round.questionsCount} questions</span>
                  <span>•</span>
                  <span>{round.maxPoints} max points</span>
                </div>
              </div>
            </div>

            {/* Progress Bar (for active/completed rounds) */}
            {(round.status === 'active' || round.status === 'completed') && round.pointsEarned !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-400">Points Progress</span>
                  <span className="text-white font-medium">
                    {round.pointsEarned} / {round.maxPoints}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      round.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(round.pointsEarned / round.maxPoints) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Time Remaining (for active rounds) */}
            {round.status === 'active' && round.timeRemaining && (
              <div className="mb-4 p-3 bg-black border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Time Remaining</span>
                  <span className="text-xl font-bold text-white font-mono">
                    {formatTime(round.timeRemaining)}
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div>
              {round.status === 'active' && (
                <button
                  onClick={() => handleEnterRound(round.id)}
                  className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Enter Round
                </button>
              )}

              {round.status === 'upcoming' && (
                <button
                  disabled
                  className="w-full bg-zinc-800 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Waiting for Admin to Start
                </button>
              )}

              {round.status === 'completed' && (
                <div className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Round Completed</p>
                    <p className="text-sm text-gray-400">
                      You earned {round.pointsEarned} points
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">How it Works</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              Wait for the admin to start a round. When active, you'll see a "Live Now" badge.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              Click "Enter Round" to access the questions and start solving.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              Your team can only use one laptop at a time to solve problems.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              Points are awarded based on correctness and time taken to solve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}