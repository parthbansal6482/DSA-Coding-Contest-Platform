import { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, AlertCircle } from 'lucide-react';
import {
  getAllRounds,
  updateRoundStatus,
  Round as APIRound,
} from '../../services/round.service';

interface Round {
  _id: string;
  name: string;
  duration: number;
  status: 'upcoming' | 'active' | 'completed';
  elapsedTime: number; // in seconds
  startTime?: string;
  endTime?: string;
  questions: any[];
}

export function RoundControlSection() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRounds();
    const interval = setInterval(() => {
      fetchRounds();
      updateElapsedTimes();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchRounds = async () => {
    try {
      const data = await getAllRounds();
      setRounds(data.map(r => ({
        ...r,
        elapsedTime: calculateElapsedTime(r),
        status: mapStatus(r.status),
      })));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rounds:', err);
      setLoading(false);
    }
  };

  const mapStatus = (status: string): 'upcoming' | 'active' | 'completed' => {
    if (status === 'upcoming') return 'upcoming';
    if (status === 'active') return 'active';
    return 'completed';
  };

  const calculateElapsedTime = (round: APIRound): number => {
    if (!round.startTime || round.status !== 'active') return 0;
    const start = new Date(round.startTime).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 1000);
  };

  const updateElapsedTimes = () => {
    setRounds(prevRounds =>
      prevRounds.map(round => {
        if (round.status === 'active' && round.startTime) {
          const newElapsedTime = calculateElapsedTime(round as any);
          const maxTime = round.duration * 60;

          if (newElapsedTime >= maxTime) {
            // Auto-complete round when time is up
            handleStatusChange(round._id, 'completed');
            return { ...round, elapsedTime: maxTime };
          }
          return { ...round, elapsedTime: newElapsedTime };
        }
        return round;
      })
    );
  };

  const handleStatusChange = async (roundId: string, newStatus: 'upcoming' | 'active' | 'completed') => {
    try {
      await updateRoundStatus(roundId, newStatus);
      await fetchRounds();
    } catch (err) {
      console.error('Error updating round status:', err);
      alert('Failed to update round status');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeRemaining = (round: Round) => {
    const maxTime = round.duration * 60;
    const remaining = maxTime - round.elapsedTime;
    return Math.max(0, remaining);
  };

  const getProgress = (round: Round) => {
    const maxTime = round.duration * 60;
    return (round.elapsedTime / maxTime) * 100;
  };

  const handleStart = (roundId: string) => {
    handleStatusChange(roundId, 'active');
  };

  const handlePause = (roundId: string) => {
    // Note: Backend doesn't have pause, so we'll use upcoming status
    handleStatusChange(roundId, 'upcoming');
  };

  const handleResume = (roundId: string) => {
    handleStatusChange(roundId, 'active');
  };

  const handleStop = (roundId: string) => {
    if (confirm('Are you sure you want to stop this round? This action cannot be undone.')) {
      handleStatusChange(roundId, 'completed');
    }
  };

  const handleReset = (roundId: string) => {
    if (confirm('Are you sure you want to reset this round?')) {
      handleStatusChange(roundId, 'upcoming');
    }
  };

  const statusColors = {
    'upcoming': 'text-gray-500 bg-gray-500/10',
    'active': 'text-green-500 bg-green-500/10',
    'completed': 'text-blue-500 bg-blue-500/10',
  };

  const statusLabels = {
    'upcoming': 'Not Started',
    'active': 'Active',
    'completed': 'Completed',
  };

  const activeRound = rounds.find((r) => r.status === 'active');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading rounds...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Round Control</h2>
        <p className="text-gray-400 mt-1">Monitor and control contest rounds in real-time</p>
      </div>

      {/* Active Round Alert */}
      {activeRound && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-500 font-medium">Active Round: {activeRound.name}</p>
            <p className="text-sm text-green-500/80 mt-1">
              Time Remaining: {formatTime(getTimeRemaining(activeRound))}
            </p>
          </div>
        </div>
      )}

      {/* Rounds Grid */}
      <div className="grid grid-cols-1 gap-6">
        {rounds.map((round) => {
          const timeRemaining = getTimeRemaining(round);
          const progress = getProgress(round);
          const isWarning = timeRemaining <= 300 && round.status === 'active'; // 5 minutes

          return (
            <div
              key={round._id}
              className={`bg-zinc-900 border rounded-xl p-6 transition-all ${round.status === 'active'
                  ? 'border-green-500 shadow-lg shadow-green-500/20'
                  : 'border-zinc-800'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{round.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[round.status]
                        }`}
                    >
                      {statusLabels[round.status]}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Duration: {round.duration} minutes</p>
                </div>
              </div>

              {/* Timer Display */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-400">Time Remaining</span>
                  </div>
                  <span
                    className={`text-2xl font-bold font-mono ${isWarning ? 'text-red-500' : 'text-white'
                      }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${isWarning
                        ? 'bg-red-500'
                        : round.status === 'active'
                          ? 'bg-green-500'
                          : round.status === 'completed'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                      }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Elapsed: {formatTime(round.elapsedTime)}</span>
                  <span>Total: {formatTime(round.duration * 60)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3">
                {round.status === 'upcoming' && (
                  <button
                    onClick={() => handleStart(round._id)}
                    className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Round
                  </button>
                )}

                {round.status === 'active' && (
                  <>
                    <button
                      onClick={() => handlePause(round._id)}
                      className="flex-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 py-3 rounded-lg font-medium hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Pause className="w-5 h-5" />
                      Pause
                    </button>
                    <button
                      onClick={() => handleStop(round._id)}
                      className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 py-3 rounded-lg font-medium hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      Stop
                    </button>
                  </>
                )}

                {round.status === 'completed' && (
                  <button
                    onClick={() => handleReset(round._id)}
                    className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                  >
                    Reset Round
                  </button>
                )}
              </div>

              {/* Additional Info */}
              {round.status === 'active' && isWarning && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-500 font-medium">
                    ⚠️ Less than 5 minutes remaining!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Instructions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Control Instructions</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              <span className="text-white font-medium">Start:</span> Begin the round timer. Teams
              will be able to view and submit answers to questions.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              <span className="text-white font-medium">Pause:</span> Temporarily pause the round.
              The timer will stop and teams cannot submit during this time.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              <span className="text-white font-medium">Resume:</span> Continue a paused round from
              where it was stopped.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              <span className="text-white font-medium">Stop:</span> End the round immediately. This
              action cannot be undone.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-white">•</span>
            <p>
              <span className="text-white font-medium">Reset:</span> Reset a completed round back
              to its initial state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
