import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock } from 'lucide-react';

interface Round {
  id: string;
  name: string;
  duration: number; // in minutes
  questions: string[];
  status: 'upcoming' | 'active' | 'completed';
  startTime?: string;
  endTime?: string;
}

export function RoundsSection() {
  const [rounds, setRounds] = useState<Round[]>([
    {
      id: '1',
      name: 'Qualifier Round',
      duration: 60,
      questions: ['Two Sum', 'Valid Parentheses', 'Merge Sorted Arrays'],
      status: 'completed',
      startTime: '2026-01-20T10:00:00',
      endTime: '2026-01-20T11:00:00',
    },
    {
      id: '2',
      name: 'Semi Finals',
      duration: 90,
      questions: ['Binary Tree Traversal', 'Dynamic Programming - LCS'],
      status: 'upcoming',
    },
  ]);

  const [availableQuestions] = useState([
    'Two Sum',
    'Valid Parentheses',
    'Merge Sorted Arrays',
    'Binary Tree Traversal',
    'Dynamic Programming - LCS',
    'Graph BFS',
    'Shortest Path',
    'Maximum Subarray',
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [formData, setFormData] = useState<Partial<Round>>({
    name: '',
    duration: 60,
    questions: [],
    status: 'upcoming',
  });

  const filteredRounds = rounds.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (round?: Round) => {
    if (round) {
      setEditingRound(round);
      setFormData(round);
    } else {
      setEditingRound(null);
      setFormData({
        name: '',
        duration: 60,
        questions: [],
        status: 'upcoming',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRound(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRound) {
      setRounds(
        rounds.map((r) =>
          r.id === editingRound.id ? { ...formData, id: r.id } as Round : r
        )
      );
    } else {
      setRounds([
        ...rounds,
        { ...formData, id: Date.now().toString() } as Round,
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this round?')) {
      setRounds(rounds.filter((r) => r.id !== id));
    }
  };

  const toggleQuestion = (question: string) => {
    const questions = formData.questions || [];
    if (questions.includes(question)) {
      setFormData({
        ...formData,
        questions: questions.filter((q) => q !== question),
      });
    } else {
      setFormData({
        ...formData,
        questions: [...questions, question],
      });
    }
  };

  const statusColors = {
    upcoming: 'text-blue-500 bg-blue-500/10',
    active: 'text-green-500 bg-green-500/10',
    completed: 'text-gray-500 bg-gray-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contest Rounds</h2>
          <p className="text-gray-400 mt-1">Manage and configure contest rounds</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Round
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search rounds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-12 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Rounds List */}
      <div className="space-y-4">
        {filteredRounds.map((round) => (
          <div
            key={round.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{round.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[round.status]
                    }`}
                  >
                    {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{round.duration} minutes</span>
                  </div>
                  <span>•</span>
                  <span>{round.questions.length} questions</span>
                </div>

                {round.questions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {round.questions.map((question, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-black border border-zinc-800 rounded-lg text-xs text-gray-300"
                      >
                        {question}
                      </span>
                    ))}
                  </div>
                )}

                {round.startTime && (
                  <div className="mt-3 text-sm text-gray-500">
                    Started: {new Date(round.startTime).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleOpenModal(round)}
                  className="p-2 bg-zinc-800 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(round.id)}
                  className="p-2 bg-zinc-800 rounded-lg text-gray-400 hover:text-red-500 hover:bg-zinc-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRounds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rounds found.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingRound ? 'Edit Round' : 'Create New Round'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Round Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Round Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g., Qualifier Round"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  min="1"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'upcoming' | 'active' | 'completed',
                    })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Questions Selection */}
              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Select Questions ({formData.questions?.length || 0} selected)
                </label>
                <div className="bg-black border border-zinc-800 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                  {availableQuestions.map((question) => (
                    <label
                      key={question}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.questions?.includes(question) || false}
                        onChange={() => toggleQuestion(question)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-white"
                      />
                      <span className="text-gray-300">{question}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {editingRound ? 'Update Round' : 'Create Round'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
