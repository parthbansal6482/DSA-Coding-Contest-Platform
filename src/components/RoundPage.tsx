import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Zap, Shield as ShieldIcon } from 'lucide-react';
import { QuestionList } from './round-page/QuestionList';
import { ProblemView } from './round-page/ProblemView';
import { TacticalPanel } from './round-page/TacticalPanel';
import { SabotageEffects } from './round-page/SabotageEffects';
import { getRoundQuestions } from '../services/round.service';
import { getTeamStats, purchaseToken } from '../services/team.service';
import { socketService } from '../services/socket.service';

interface Question {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  status: 'unsolved' | 'attempted' | 'solved';
  category: string;
  description?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  boilerplateCode?: {
    python?: string;
    c?: string;
    cpp?: string;
    java?: string;
    javascript?: string;
  };
}

interface Round {
  _id: string;
  name: string;
  duration: number;
  status: string;
  startTime: string;
  endTime: string;
}

interface SabotageEffect {
  type: 'blackout' | 'typing-delay' | 'format-chaos' | 'ui-glitch';
  endTime: number;
  fromTeam?: string;
}

interface RoundPageProps {
  roundId: string;
  onExitRound: () => void;
}

export function RoundPage({ roundId, onExitRound }: RoundPageProps) {
  const [round, setRound] = useState<Round | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sabotageTokens, setSabotageTokens] = useState(0);
  const [shieldTokens, setShieldTokens] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [activeEffects, setActiveEffects] = useState<SabotageEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('Your Team');
  const [teamPoints, setTeamPoints] = useState(0);

  // Fetch round data and team stats
  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch round questions
        const roundResponse = await getRoundQuestions(roundId);
        setRound(roundResponse.data.round);
        console.log('Round data loaded:', roundResponse.data.round);
        console.log('Round endTime:', roundResponse.data.round.endTime);
        console.log('Current time:', new Date().toISOString());

        // Map backend question structure to frontend
        const mappedQuestions: Question[] = roundResponse.data.questions.map((q: any) => ({
          _id: q._id,
          title: q.title,
          difficulty: q.difficulty,
          points: q.difficulty === 'Easy' ? 100 : q.difficulty === 'Medium' ? 150 : 200,
          status: q.submissionStatus || 'unsolved',
          category: q.category,
          description: q.description,
          inputFormat: q.inputFormat,
          outputFormat: q.outputFormat,
          constraints: q.constraints,
          examples: q.examples,
          boilerplateCode: q.boilerplateCode,
        }));

        setQuestions(mappedQuestions);
        if (mappedQuestions.length > 0 && !selectedQuestion) {
          setSelectedQuestion(mappedQuestions[0]._id);
        }

        // Fetch team stats for tokens
        const teamStats = await getTeamStats();
        setTeamName(teamStats.teamName || 'Your Team');
        setTeamPoints(teamStats.points || 0);
        setSabotageTokens(teamStats.tokens?.sabotage || 0);
        setShieldTokens(teamStats.tokens?.shield || 0);
      } catch (err: any) {
        console.error('Error fetching round data:', err);
        setError(err.response?.data?.message || 'Failed to load round data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoundData();
  }, [roundId]);

  // WebSocket subscriptions (separate effect to avoid re-running when teamName changes)
  useEffect(() => {
    if (!teamName || teamName === 'Your Team') {
      return; // Wait until we have the actual team name
    }

    // Connect to WebSocket
    socketService.connect();

    // Subscribe to team stats updates
    const unsubscribeStats = socketService.onTeamStatsUpdate((data) => {
      if (data.teamName === teamName) {
        console.log('Real-time team stats update in RoundPage');
        setSabotageTokens(data.tokens.sabotage);
        setShieldTokens(data.tokens.shield);
      }
    });

    // Subscribe to submission updates
    const unsubscribeSubmission = socketService.onSubmissionUpdate((data) => {
      if (data.teamName === teamName) {
        console.log('Real-time submission update:', data.questionId, data.status);
        // Update question status based on submission
        setQuestions((prev) => prev.map((q) =>
          q._id === data.questionId
            ? { ...q, status: data.status === 'accepted' ? 'solved' : 'attempted' }
            : q
        ));
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeStats();
      unsubscribeSubmission();
    };
  }, [teamName]);

  // Real-time timer countdown
  useEffect(() => {
    if (!round?.endTime) {
      console.log('Timer not starting - no endTime:', round);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(round.endTime).getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));

      console.log('Timer update:', {
        now: new Date(now).toISOString(),
        endTime: round.endTime,
        end: new Date(end).toISOString(),
        remaining,
        remainingFormatted: formatTime(remaining)
      });

      setTimeRemaining(remaining);

      if (remaining === 0) {
        alert('Round has ended!');
        onExitRound();
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [round?.endTime, onExitRound]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestion(questionId);
  };

  const handleQuestionStatusChange = (questionId: string, status: Question['status']) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === questionId ? { ...q, status } : q))
    );
  };

  const solvedCount = questions.filter((q) => q.status === 'solved').length;
  const totalPoints = questions
    .filter((q) => q.status === 'solved')
    .reduce((sum, q) => sum + q.points, 0);

  const handleUseSabotage = (targetTeam: string, sabotageType: string) => {
    if (sabotageTokens > 0) {
      setSabotageTokens((prev) => prev - 1);
      alert(`Launched ${sabotageType} attack on ${targetTeam}!`);
      // TODO: Implement real sabotage via WebSocket
    }
  };

  const handleActivateShield = () => {
    if (shieldTokens > 0 && !isShieldActive) {
      setShieldTokens((prev) => prev - 1);
      setIsShieldActive(true);
      // Shield lasts 10 minutes
      setTimeout(() => {
        setIsShieldActive(false);
      }, 600000);
      // TODO: Implement real shield activation via API
    }
  };

  const handleEffectEnd = (effect: SabotageEffect) => {
    setActiveEffects((prev) => prev.filter((e) => e !== effect));
  };

  // Simulate incoming attack (for demo purposes)
  const simulateAttack = (type: SabotageEffect['type']) => {
    if (isShieldActive) {
      alert('Your shield blocked the attack!');
      return;
    }
    const duration = type === 'typing-delay' ? 60000 : type === 'format-chaos' ? 45000 : 30000;
    setActiveEffects((prev) => [
      ...prev,
      { type, endTime: Date.now() + duration, fromTeam: 'Binary Beasts' },
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading round...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !round) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Round not found'}</p>
          <button
            onClick={onExitRound}
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedQuestionData = questions.find((q) => q._id === selectedQuestion);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sabotage Effects Overlay */}
      <SabotageEffects
        activeEffects={activeEffects}
        isShieldActive={isShieldActive}
        onEffectEnd={handleEffectEnd}
      />

      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExitRound}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{round.name}</h1>
              <p className="text-sm text-gray-400">{teamName}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-4 py-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-400">Time Left</p>
                <p className="text-lg font-bold text-white font-mono">{formatTime(timeRemaining)}</p>
              </div>
            </div>

            {/* Score */}
            <div className="bg-black border border-zinc-800 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-lg font-bold text-white">
                {totalPoints} pts ({solvedCount}/{questions.length})
              </p>
            </div>

            {/* Tokens Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-3 py-2">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-white font-medium">{sabotageTokens}</span>
              </div>
              <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg px-3 py-2">
                <ShieldIcon className="w-4 h-4 text-blue-500" />
                <span className="text-white font-medium">{shieldTokens}</span>
              </div>
            </div>

            {/* Tactical Panel Button */}
            <TacticalPanel
              sabotageTokens={sabotageTokens}
              shieldTokens={shieldTokens}
              currentPoints={teamPoints}
              isShieldActive={isShieldActive}
              onUseSabotage={handleUseSabotage}
              onActivateShield={handleActivateShield}
              onPurchaseToken={async (type, cost) => {
                try {
                  const updatedStats = await purchaseToken(type, cost);
                  setTeamPoints(updatedStats.points);
                  setSabotageTokens(updatedStats.tokens.sabotage);
                  setShieldTokens(updatedStats.tokens.shield);
                } catch (err: any) {
                  console.error('Error purchasing token:', err);
                  alert(err.response?.data?.message || 'Failed to purchase token');
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question List - Left Sidebar Panel */}
        <div className="w-80 border-r border-zinc-800 flex-shrink-0 overflow-hidden">
          <QuestionList
            questions={questions}
            selectedQuestionId={selectedQuestion}
            onSelectQuestion={handleQuestionSelect}
          />
        </div>

        {/* Main Content Area - Code Editor and Problem Description */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedQuestionData ? (
            <ProblemView
              roundId={roundId}
              question={selectedQuestionData}
              activeEffects={activeEffects}
              isShieldActive={isShieldActive}
              onStatusChange={(status) => handleQuestionStatusChange(selectedQuestionData._id, status)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Select a question to start coding</p>
            </div>
          )}
        </div>
      </div>

      {/* Debug: Simulate attacks (remove in production) */}
      <div className="fixed bottom-4 left-4 z-40 bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
        <p className="text-xs text-gray-400 mb-2">Debug: Simulate Attacks</p>
        <button
          onClick={() => simulateAttack('blackout')}
          className="w-full text-xs bg-black text-white px-3 py-1 rounded hover:bg-zinc-800"
        >
          Blackout
        </button>
        <button
          onClick={() => simulateAttack('typing-delay')}
          className="w-full text-xs bg-black text-white px-3 py-1 rounded hover:bg-zinc-800"
        >
          Typing Delay
        </button>
        <button
          onClick={() => simulateAttack('ui-glitch')}
          className="w-full text-xs bg-black text-white px-3 py-1 rounded hover:bg-zinc-800"
        >
          UI Glitch
        </button>
        <button
          onClick={() => simulateAttack('format-chaos')}
          className="w-full text-xs bg-black text-white px-3 py-1 rounded hover:bg-zinc-800"
        >
          Format Chaos
        </button>
      </div>
    </div>
  );
}