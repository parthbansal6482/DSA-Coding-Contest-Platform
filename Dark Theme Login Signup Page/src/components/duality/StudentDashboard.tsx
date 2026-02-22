import { useState } from 'react';
import { Code2, CheckCircle2, Clock, Trophy, User, LogOut, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { Profile } from './Profile';

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solved: boolean;
  acceptance: number;
}

const mockProblems: Problem[] = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'Array', solved: true, acceptance: 85 },
  { id: '2', title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', solved: true, acceptance: 72 },
  { id: '3', title: 'Longest Substring Without Repeating', difficulty: 'Medium', category: 'String', solved: false, acceptance: 68 },
  { id: '4', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Array', solved: false, acceptance: 45 },
  { id: '5', title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'String', solved: false, acceptance: 62 },
  { id: '6', title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', solved: true, acceptance: 88 },
  { id: '7', title: 'Merge Two Sorted Lists', difficulty: 'Easy', category: 'Linked List', solved: false, acceptance: 80 },
  { id: '8', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', category: 'Tree', solved: false, acceptance: 76 },
  { id: '9', title: 'Maximum Subarray', difficulty: 'Medium', category: 'Array', solved: false, acceptance: 70 },
  { id: '10', title: 'Climbing Stairs', difficulty: 'Easy', category: 'Dynamic Programming', solved: true, acceptance: 82 },
];

export function StudentDashboard({ 
  userName, 
  onLogout,
  onSolveProblem 
}: { 
  userName: string; 
  onLogout: () => void;
  onSolveProblem: (problemId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'problems' | 'profile'>('problems');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const solvedCount = mockProblems.filter(p => p.solved).length;
  const totalCount = mockProblems.length;
  const easyCount = mockProblems.filter(p => p.difficulty === 'Easy' && p.solved).length;
  const mediumCount = mockProblems.filter(p => p.difficulty === 'Medium' && p.solved).length;
  const hardCount = mockProblems.filter(p => p.difficulty === 'Hard' && p.solved).length;

  const categories = ['All', ...Array.from(new Set(mockProblems.map(p => p.category)))];

  const filteredProblems = mockProblems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    return matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Duality</h1>
                  <p className="text-xs text-gray-500">Practice Platform</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('problems')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'problems'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  Problems
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Profile
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm">{userName}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'profile' ? (
          <Profile userName={userName} />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Total Solved */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Problems Solved</p>
                    <p className="text-2xl font-bold text-white">{solvedCount}/{totalCount}</p>
                  </div>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(solvedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Easy */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Easy</p>
                    <p className="text-2xl font-bold text-green-500">{easyCount}</p>
                  </div>
                </div>
              </div>

              {/* Medium */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Medium</p>
                    <p className="text-2xl font-bold text-yellow-500">{mediumCount}</p>
                  </div>
                </div>
              </div>

              {/* Hard */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hard</p>
                    <p className="text-2xl font-bold text-red-500">{hardCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                {/* Difficulty Filter */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedDifficulty === diff
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full max-w-xs bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-zinc-600"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black border-b border-zinc-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Title</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Difficulty</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Category</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Acceptance</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((problem) => (
                      <tr key={problem.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          {problem.solved ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-zinc-700"></div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">{problem.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{problem.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{problem.acceptance}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onSolveProblem(problem.id)}
                            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            {problem.solved ? 'Solve Again' : 'Solve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProblems.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No problems found with the selected filters.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}