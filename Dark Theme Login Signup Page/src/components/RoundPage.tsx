import { useState } from 'react';
import { ArrowLeft, Clock, Zap, Shield as ShieldIcon } from 'lucide-react';
import { QuestionList } from './round-page/QuestionList';
import { ProblemView } from './round-page/ProblemView';
import { TacticalPanel } from './round-page/TacticalPanel';
import { SabotageEffects } from './round-page/SabotageEffects';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  status: 'unsolved' | 'attempted' | 'solved';
  category: string;
}

interface SabotageEffect {
  type: 'blackout' | 'typing-delay' | 'format-chaos' | 'ui-glitch';
  endTime: number;
  fromTeam?: string;
}

export function RoundPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>('1');
  const [timeRemaining, setTimeRemaining] = useState(3245); // seconds
  const [sabotageTokens, setSabotageTokens] = useState(2);
  const [shieldTokens, setShieldTokens] = useState(1);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [activeEffects, setActiveEffects] = useState<SabotageEffect[]>([]);

  const questions: Question[] = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      points: 100,
      status: 'solved',
      category: 'Arrays',
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      points: 100,
      status: 'attempted',
      category: 'Stack',
    },
    {
      id: '3',
      title: 'Binary Tree Traversal',
      difficulty: 'Medium',
      points: 150,
      status: 'unsolved',
      category: 'Trees',
    },
    {
      id: '4',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      points: 150,
      status: 'unsolved',
      category: 'Dynamic Programming',
    },
    {
      id: '5',
      title: 'Maximum Path Sum',
      difficulty: 'Hard',
      points: 200,
      status: 'unsolved',
      category: 'Trees',
    },
    {
      id: '6',
      title: 'Word Break II',
      difficulty: 'Hard',
      points: 200,
      status: 'unsolved',
      category: 'Dynamic Programming',
    },
  ];

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

  const handleBack = () => {
    // Navigate back to team dashboard
    console.log('Navigate back to dashboard');
  };

  const solvedCount = questions.filter((q) => q.status === 'solved').length;
  const totalPoints = questions
    .filter((q) => q.status === 'solved')
    .reduce((sum, q) => sum + q.points, 0);

  const handleUseSabotage = (targetTeam: string, sabotageType: string) => {
    if (sabotageTokens > 0) {
      setSabotageTokens((prev) => prev - 1);
      alert(`Launched ${sabotageType} attack on ${targetTeam}!`);
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
              onClick={handleBack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Semi Finals Round</h1>
              <p className="text-sm text-gray-400">Code Warriors</p>
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
              isShieldActive={isShieldActive}
              onUseSabotage={handleUseSabotage}
              onActivateShield={handleActivateShield}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Question List */}
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
          <QuestionList
            questions={questions}
            selectedQuestionId={selectedQuestion}
            onSelectQuestion={handleQuestionSelect}
          />
        </aside>

        {/* Right Side - Problem View */}
        <main className="flex-1 overflow-hidden">
          {selectedQuestion ? (
            <ProblemView
              question={questions.find((q) => q.id === selectedQuestion)!}
              activeEffects={activeEffects}
              isShieldActive={isShieldActive}
              onStatusChange={(status) => {
                // Update question status
                console.log('Status changed:', status);
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Select a question to start solving</p>
            </div>
          )}
        </main>
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