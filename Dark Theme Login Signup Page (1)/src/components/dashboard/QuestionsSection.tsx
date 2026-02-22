import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: number;
}

export function QuestionsSection() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers, return indices of the two numbers that add up to a target.',
      inputFormat: 'First line contains n and target. Second line contains n space-separated integers.',
      outputFormat: 'Two space-separated integers representing indices.',
      constraints: '2 ≤ n ≤ 10^4, -10^9 ≤ nums[i] ≤ 10^9',
      examples: [
        { input: '4 9\n2 7 11 15', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }
      ],
      testCases: 10,
    },
    {
      id: '2',
      title: 'Binary Tree Traversal',
      difficulty: 'Medium',
      category: 'Trees',
      description: 'Implement inorder, preorder, and postorder traversal of a binary tree.',
      inputFormat: 'First line contains n. Next n lines contain node values in level order.',
      outputFormat: 'Three lines containing inorder, preorder, and postorder traversals.',
      constraints: '1 ≤ n ≤ 1000',
      examples: [
        { input: '3\n1 2 3', output: '2 1 3\n1 2 3\n2 3 1' }
      ],
      testCases: 15,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<Question>>({
    title: '',
    difficulty: 'Easy',
    category: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: 5,
  });

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData(question);
    } else {
      setEditingQuestion(null);
      setFormData({
        title: '',
        difficulty: 'Easy',
        category: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        examples: [{ input: '', output: '', explanation: '' }],
        testCases: 5,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? { ...formData, id: q.id } as Question : q
        )
      );
    } else {
      setQuestions([
        ...questions,
        { ...formData, id: Date.now().toString() } as Question,
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const difficultyColors = {
    Easy: 'text-green-500 bg-green-500/10',
    Medium: 'text-yellow-500 bg-yellow-500/10',
    Hard: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Questions Bank</h2>
          <p className="text-gray-400 mt-1">Manage DSA problems for the contest</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search questions by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-12 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficultyColors[question.difficulty]
                    }`}
                  >
                    {question.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-gray-300">
                    {question.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{question.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{question.testCases} test cases</span>
                  <span>•</span>
                  <span>{question.examples.length} examples</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleOpenModal(question)}
                  className="p-2 bg-zinc-800 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(question.id)}
                  className="p-2 bg-zinc-800 rounded-lg text-gray-400 hover:text-red-500 hover:bg-zinc-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found. Try a different search term.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Question Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>

              {/* Difficulty and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard',
                      })
                    }
                    className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    placeholder="e.g., Arrays, Trees"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  placeholder="Describe the problem..."
                  required
                />
              </div>

              {/* Input Format */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Input Format</label>
                <textarea
                  value={formData.inputFormat}
                  onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  placeholder="Describe the input format..."
                  required
                />
              </div>

              {/* Output Format */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Output Format</label>
                <textarea
                  value={formData.outputFormat}
                  onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                  placeholder="Describe the output format..."
                  required
                />
              </div>

              {/* Constraints */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Constraints</label>
                <input
                  type="text"
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g., 1 ≤ n ≤ 10^5"
                  required
                />
              </div>

              {/* Test Cases Count */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Number of Test Cases</label>
                <input
                  type="number"
                  value={formData.testCases}
                  onChange={(e) =>
                    setFormData({ ...formData, testCases: parseInt(e.target.value) })
                  }
                  className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  min="1"
                  required
                />
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
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
