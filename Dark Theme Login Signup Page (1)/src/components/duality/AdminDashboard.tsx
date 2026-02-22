import { useState } from 'react';
import { Code2, Plus, Edit2, Trash2, User, LogOut, Settings, BookOpen, Users, Trophy, TrendingUp, Eye } from 'lucide-react';

interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface BoilerplateCode {
  python: string;
  c: string;
  cpp: string;
  java: string;
}

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  examples: Example[];
  testCases: TestCase[];
  boilerplate: BoilerplateCode;
}

interface Student {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  lastActive: string;
  rank: number;
}

const mockQuestions: Question[] = [
  { 
    id: '1', 
    title: 'Two Sum', 
    difficulty: 'Easy', 
    category: 'Array', 
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }
    ],
    testCases: [
      { input: '[2,7,11,15], 9', output: '[0,1]' },
      { input: '[3,2,4], 6', output: '[1,2]' }
    ],
    boilerplate: {
      python: 'def twoSum(nums, target):\n    pass',
      c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    \n}',
      java: 'public int[] twoSum(int[] nums, int target) {\n    \n}'
    }
  },
];

const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', joinDate: '2026-01-15', totalSolved: 45, easySolved: 20, mediumSolved: 18, hardSolved: 7, streak: 12, lastActive: '2026-02-22', rank: 1247 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', joinDate: '2026-01-20', totalSolved: 78, easySolved: 30, mediumSolved: 35, hardSolved: 13, streak: 25, lastActive: '2026-02-22', rank: 856 },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', joinDate: '2026-02-01', totalSolved: 23, easySolved: 15, mediumSolved: 6, hardSolved: 2, streak: 5, lastActive: '2026-02-21', rank: 2341 },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', joinDate: '2026-01-10', totalSolved: 92, easySolved: 35, mediumSolved: 42, hardSolved: 15, streak: 18, lastActive: '2026-02-22', rank: 654 },
  { id: '5', name: 'Eve Wilson', email: 'eve@example.com', joinDate: '2026-02-10', totalSolved: 12, easySolved: 8, mediumSolved: 3, hardSolved: 1, streak: 3, lastActive: '2026-02-20', rank: 3567 },
];

type ActiveTab = 'questions' | 'students';

export function AdminDashboard({ 
  userName, 
  onLogout 
}: { 
  userName: string; 
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('questions');
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [students] = useState<Student[]>(mockStudents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    description: '',
    constraints: [''],
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', output: '' }],
    boilerplate: {
      python: '',
      c: '',
      cpp: '',
      java: ''
    }
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
      constraints: question.constraints,
      examples: question.examples,
      testCases: question.testCases,
      boilerplate: question.boilerplate,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      category: '',
      description: '',
      constraints: [''],
      examples: [{ input: '', output: '', explanation: '' }],
      testCases: [{ input: '', output: '' }],
      boilerplate: {
        python: '',
        c: '',
        cpp: '',
        java: ''
      }
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingQuestion(null);
    resetForm();
  };

  const addConstraint = () => {
    setFormData({ ...formData, constraints: [...formData.constraints, ''] });
  };

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...formData.constraints];
    newConstraints[index] = value;
    setFormData({ ...formData, constraints: newConstraints });
  };

  const removeConstraint = (index: number) => {
    setFormData({ ...formData, constraints: formData.constraints.filter((_, i) => i !== index) });
  };

  const addExample = () => {
    setFormData({ ...formData, examples: [...formData.examples, { input: '', output: '', explanation: '' }] });
  };

  const updateExample = (index: number, field: keyof Example, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setFormData({ ...formData, examples: newExamples });
  };

  const removeExample = (index: number) => {
    setFormData({ ...formData, examples: formData.examples.filter((_, i) => i !== index) });
  };

  const addTestCase = () => {
    setFormData({ ...formData, testCases: [...formData.testCases, { input: '', output: '' }] });
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const removeTestCase = (index: number) => {
    setFormData({ ...formData, testCases: formData.testCases.filter((_, i) => i !== index) });
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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Duality Admin</h1>
                  <p className="text-xs text-gray-500">Management Dashboard</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'questions'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Questions
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'students'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Students
                </button>
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
        {activeTab === 'questions' ? (
          <>
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
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{question.description}</p>
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
                          <span className="text-sm text-gray-400">{question.testCases.length}</span>
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
          </>
        ) : (
          <>
            {/* Students Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-white">{students.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Today</p>
                    <p className="text-2xl font-bold text-green-500">
                      {students.filter(s => s.lastActive === '2026-02-22').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Problems Solved</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {Math.round(students.reduce((acc, s) => acc + s.totalSolved, 0) / students.length)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Top Streak</p>
                    <p className="text-2xl font-bold text-purple-500">
                      {Math.max(...students.map(s => s.streak))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-6">All Students</h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black border-b border-zinc-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Student</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Rank</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Total Solved</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Easy/Med/Hard</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Streak</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Last Active</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">#{student.rank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-white">{student.totalSolved}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <span className="text-sm text-green-500">{student.easySolved}</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-sm text-yellow-500">{student.mediumSolved}</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-sm text-red-500">{student.hardSolved}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-orange-500">{student.streak}</span>
                            <span className="text-xs text-gray-500">days</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{student.lastActive}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-2 bg-zinc-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Question Modal */}
      {(showAddModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-4xl my-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Basic Info */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Question Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="e.g., Two Sum"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Category *</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="e.g., Array, String, Tree"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Difficulty *</label>
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

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                    placeholder="Enter question description..."
                  ></textarea>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-300">Constraints</label>
                  <button
                    type="button"
                    onClick={addConstraint}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Constraint
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.constraints.map((constraint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={constraint}
                        onChange={(e) => updateConstraint(index, e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg py-2 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 text-sm"
                        placeholder="e.g., 1 <= n <= 10^5"
                      />
                      {formData.constraints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeConstraint(index)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-300">Examples</label>
                  <button
                    type="button"
                    onClick={addExample}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Example
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.examples.map((example, index) => (
                    <div key={index} className="bg-black border border-zinc-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">Example {index + 1}</span>
                        {formData.examples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExample(index)}
                            className="text-xs text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={example.input}
                          onChange={(e) => updateExample(index, 'input', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                          placeholder="Input: nums = [2,7,11,15], target = 9"
                        />
                        <input
                          type="text"
                          value={example.output}
                          onChange={(e) => updateExample(index, 'output', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                          placeholder="Output: [0,1]"
                        />
                        <input
                          type="text"
                          value={example.explanation}
                          onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                          placeholder="Explanation: nums[0] + nums[1] == 9"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-300">Test Cases</label>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Add Test Case
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.testCases.map((testCase, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={testCase.input}
                        onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg py-2 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 text-sm font-mono"
                        placeholder="Input: [2,7,11,15], 9"
                      />
                      <input
                        type="text"
                        value={testCase.output}
                        onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-lg py-2 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-zinc-600 text-sm font-mono"
                        placeholder="Output: [0,1]"
                      />
                      {formData.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Boilerplate Code */}
              <div>
                <label className="block text-sm text-gray-300 mb-3">Boilerplate Code</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Python</label>
                    <textarea
                      value={formData.boilerplate.python}
                      onChange={(e) => setFormData({ ...formData, boilerplate: { ...formData.boilerplate, python: e.target.value } })}
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="def twoSum(nums, target):&#10;    pass"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">C</label>
                    <textarea
                      value={formData.boilerplate.c}
                      onChange={(e) => setFormData({ ...formData, boilerplate: { ...formData.boilerplate, c: e.target.value } })}
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="int* twoSum(int* nums, int size) {&#10;    &#10;}"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">C++</label>
                    <textarea
                      value={formData.boilerplate.cpp}
                      onChange={(e) => setFormData({ ...formData, boilerplate: { ...formData.boilerplate, cpp: e.target.value } })}
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="vector<int> twoSum(vector<int>& nums, int target) {&#10;    &#10;}"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Java</label>
                    <textarea
                      value={formData.boilerplate.java}
                      onChange={(e) => setFormData({ ...formData, boilerplate: { ...formData.boilerplate, java: e.target.value } })}
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-zinc-600"
                      placeholder="public int[] twoSum(int[] nums, int target) {&#10;    &#10;}"
                    ></textarea>
                  </div>
                </div>
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

      {/* Student Detail Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{viewingStudent.name}</h2>
                <p className="text-gray-400">{viewingStudent.email}</p>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Rank</p>
                  <p className="text-2xl font-bold text-white">#{viewingStudent.rank}</p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Solved</p>
                  <p className="text-2xl font-bold text-white">{viewingStudent.totalSolved}</p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Streak</p>
                  <p className="text-2xl font-bold text-orange-500">{viewingStudent.streak} days</p>
                </div>
                <div className="bg-black border border-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Join Date</p>
                  <p className="text-sm font-medium text-white">{viewingStudent.joinDate}</p>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="bg-black border border-zinc-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Problems by Difficulty</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-500">Easy</span>
                      <span className="text-white">{viewingStudent.easySolved}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="bg-green-500 rounded-full h-2" style={{ width: `${(viewingStudent.easySolved / viewingStudent.totalSolved) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-yellow-500">Medium</span>
                      <span className="text-white">{viewingStudent.mediumSolved}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${(viewingStudent.mediumSolved / viewingStudent.totalSolved) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-red-500">Hard</span>
                      <span className="text-white">{viewingStudent.hardSolved}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="bg-red-500 rounded-full h-2" style={{ width: `${(viewingStudent.hardSolved / viewingStudent.totalSolved) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-black border border-zinc-800 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Active</span>
                    <span className="text-white">{viewingStudent.lastActive}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Created</span>
                    <span className="text-white">{viewingStudent.joinDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-orange-500 font-medium">{viewingStudent.streak} days 🔥</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingStudent(null)}
              className="w-full mt-6 bg-zinc-800 text-gray-400 py-3 rounded-lg font-medium hover:text-white hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
