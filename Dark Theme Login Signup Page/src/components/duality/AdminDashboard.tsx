import { useState } from 'react';
import { Code2, Plus, Edit2, Trash2, User, LogOut, Settings, BookOpen } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  testCases: number;
}

const mockQuestions: Question[] = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'Array', description: 'Find two numbers that add up to target', testCases: 5 },
  { id: '2', title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', description: 'Add two numbers represented by linked lists', testCases: 8 },
  { id: '3', title: 'Longest Substring', difficulty: 'Medium', category: 'String', description: 'Find longest substring without repeating characters', testCases: 10 },
  { id: '4', title: 'Median of Arrays', difficulty: 'Hard', category: 'Array', description: 'Find median of two sorted arrays', testCases: 12 },
];

export function AdminDashboard({ 
  userName, 
  onLogout 
}: { 
  userName: string; 
  onLogout: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    description: '',
    testCases: 5,
  });

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      ...formData,
    };
    setQuestions([...questions, newQuestion]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditQuestion = () => {
    if (editingQuestion) {
      setQuestions(questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...editingQuestion, ...formData }
          : q
      ));
      setEditingQuestion(null);
      resetForm();
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      title: question.title,
      difficulty: question.difficulty,
      category: question.category,
      description: question.description,
      testCases: question.testCases,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      category: '',
      description: '',
      testCases: 5,
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingQuestion(null);
    resetForm();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Duality Admin</h1>
                <p className="text-xs text-gray-500">Question Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Settings className="w-4 h-4" />
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-white">{questions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Easy</p>
                <p className="text-2xl font-bold text-green-500">
                  {questions.filter(q => q.difficulty === 'Easy').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Medium</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {questions.filter(q => q.difficulty === 'Medium').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hard</p>
                <p className="text-2xl font-bold text-red-500">
                  {questions.filter(q => q.difficulty === 'Hard').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">All Questions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>

        {/* Questions Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black border-b border-zinc-800">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Difficulty</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Test Cases</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{question.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{question.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{question.testCases}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(question)}
                          className="p-2 bg-zinc-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 bg-zinc-800 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Question Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="e.g., Two Sum"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-zinc-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="e.g., Array, String, Tree"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                  placeholder="Enter question description..."
                ></textarea>
              </div>

              {/* Test Cases */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Number of Test Cases</label>
                <input
                  type="number"
                  min="1"
                  value={formData.testCases}
                  onChange={(e) => setFormData({ ...formData, testCases: parseInt(e.target.value) })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={editingQuestion ? handleEditQuestion : handleAddQuestion}
                className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {editingQuestion ? 'Save Changes' : 'Add Question'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-zinc-800 text-gray-400 py-3 rounded-lg font-medium hover:text-white hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
