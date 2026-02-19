import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  Question as APIQuestion,
  CreateQuestionData,
} from '../../../services/question.service';

interface Question {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  hiddenTestCases?: { input: string; output: string; explanation?: string }[];
  testCases: number;
  boilerplateCode?: {
    python?: string;
    c?: string;
    cpp?: string;
    java?: string;
  };
}

export function QuestionsSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeBoilerplateTab, setActiveBoilerplateTab] = useState('python');
  const [formData, setFormData] = useState<Partial<CreateQuestionData>>({
    title: '',
    difficulty: 'Easy',
    category: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
    hiddenTestCases: [],
    boilerplateCode: {
      python: '# Write your solution here\n',
      c: '// Write your solution here\n',
      cpp: '// Write your solution here\n',
      java: '// Write your solution here\n',
    },
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions();
      setQuestions(data as Question[]);
      setError('');
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        title: question.title,
        difficulty: question.difficulty,
        category: question.category,
        description: question.description,
        inputFormat: question.inputFormat,
        outputFormat: question.outputFormat,
        constraints: question.constraints,
        examples: question.examples,
        hiddenTestCases: question.hiddenTestCases || [],
        boilerplateCode: question.boilerplateCode || {
          python: '# Write your solution here\n',
          c: '// Write your solution here\n',
          cpp: '// Write your solution here\n',
          java: '// Write your solution here\n',
        },
      });
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
        hiddenTestCases: [],
        boilerplateCode: {
          python: '# Write your solution here\n',
          c: '// Write your solution here\n',
          cpp: '// Write your solution here\n',
          java: '// Write your solution here\n',
        },
      });
    }
    setActiveBoilerplateTab('python');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Auto-calculate testCases from examples and hiddenTestCases
      const totalTestCases = (formData.examples?.length || 0) + (formData.hiddenTestCases?.length || 0);
      const dataToSubmit = { ...formData, testCases: totalTestCases };

      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, dataToSubmit);
      } else {
        await createQuestion(dataToSubmit as CreateQuestionData);
      }
      await fetchQuestions();
      handleCloseModal();
    } catch (err: any) {
      console.error('Error saving question:', err);
      setError(err.response?.data?.message || 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
        await fetchQuestions();
      } catch (err: any) {
        console.error('Error deleting question:', err);
        alert('Failed to delete question');
      }
    }
  };

  const difficultyColors = {
    Easy: 'text-green-500 bg-green-500/10',
    Medium: 'text-yellow-500 bg-yellow-500/10',
    Hard: 'text-red-500 bg-red-500/10',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading questions...</div>
      </div>
    );
  }

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

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

      {/* Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-400">
            {searchTerm ? 'No questions found matching your search' : 'No questions yet. Click "Add Question" to create one.'}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{question.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[question.difficulty as keyof typeof difficultyColors]}`}>
                      {question.difficulty}
                    </span>
                    <span className="text-gray-400 text-sm">{question.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(question)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">{question.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{question.testCases} test cases</span>
                <span>{question.examples.length} examples</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
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
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    placeholder="e.g., Arrays, Trees, DP"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    rows={3}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Input Format</label>
                  <textarea
                    value={formData.inputFormat}
                    onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    rows={2}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Output Format</label>
                  <textarea
                    value={formData.outputFormat}
                    onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    rows={2}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Constraints</label>
                  <textarea
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-zinc-600"
                    rows={2}
                    required
                  />
                </div>


                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Examples</label>
                  {formData.examples?.map((example, index) => (
                    <div key={index} className="mb-3 p-3 bg-black border border-zinc-800 rounded-lg">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Input"
                          value={example.input}
                          onChange={(e) => {
                            const newExamples = [...(formData.examples || [])];
                            newExamples[index] = { ...newExamples[index], input: e.target.value };
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Output"
                          value={example.output}
                          onChange={(e) => {
                            const newExamples = [...(formData.examples || [])];
                            newExamples[index] = { ...newExamples[index], output: e.target.value };
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Explanation (optional)"
                          value={example.explanation || ''}
                          onChange={(e) => {
                            const newExamples = [...(formData.examples || [])];
                            newExamples[index] = { ...newExamples[index], explanation: e.target.value };
                            setFormData({ ...formData, examples: newExamples });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      examples: [...(formData.examples || []), { input: '', output: '', explanation: '' }]
                    })}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    + Add Example
                  </button>
                </div>

                {/* Hidden Test Cases Section */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-300">
                      Hidden Test Cases
                      <span className="text-xs text-gray-500 ml-2">(Private - not visible to teams)</span>
                    </label>
                  </div>
                  {formData.hiddenTestCases && formData.hiddenTestCases.length > 0 ? (
                    formData.hiddenTestCases.map((testCase, index) => (
                      <div key={index} className="mb-3 p-3 bg-black border border-amber-900/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-amber-500 font-medium">Hidden Test Case {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newHiddenTests = [...(formData.hiddenTestCases || [])];
                              newHiddenTests.splice(index, 1);
                              setFormData({ ...formData, hiddenTestCases: newHiddenTests });
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => {
                              const newHiddenTests = [...(formData.hiddenTestCases || [])];
                              newHiddenTests[index] = { ...newHiddenTests[index], input: e.target.value };
                              setFormData({ ...formData, hiddenTestCases: newHiddenTests });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Output"
                            value={testCase.output}
                            onChange={(e) => {
                              const newHiddenTests = [...(formData.hiddenTestCases || [])];
                              newHiddenTests[index] = { ...newHiddenTests[index], output: e.target.value };
                              setFormData({ ...formData, hiddenTestCases: newHiddenTests });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Explanation (optional)"
                            value={testCase.explanation || ''}
                            onChange={(e) => {
                              const newHiddenTests = [...(formData.hiddenTestCases || [])];
                              newHiddenTests[index] = { ...newHiddenTests[index], explanation: e.target.value };
                              setFormData({ ...formData, hiddenTestCases: newHiddenTests });
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded py-1 px-2 text-white text-sm"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic mb-2">No hidden test cases added yet</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      hiddenTestCases: [...(formData.hiddenTestCases || []), { input: '', output: '', explanation: '' }]
                    })}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    + Add Hidden Test Case
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Hidden test cases are used for evaluation but not shown to teams
                  </p>
                </div>

                {/* Boilerplate Code Section */}
                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">Boilerplate Code (Starter Code)</label>
                  <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
                    {/* Language Tabs */}
                    <div className="flex border-b border-zinc-800">
                      {['python', 'c', 'cpp', 'java'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setActiveBoilerplateTab(lang)}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${activeBoilerplateTab === lang
                            ? 'bg-zinc-900 text-white border-b-2 border-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        >
                          {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </div>
                    {/* Code Editor */}
                    <textarea
                      value={formData.boilerplateCode?.[activeBoilerplateTab as keyof typeof formData.boilerplateCode] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        boilerplateCode: {
                          ...formData.boilerplateCode,
                          [activeBoilerplateTab]: e.target.value
                        }
                      })}
                      className="w-full bg-zinc-900 p-3 text-white font-mono text-sm focus:outline-none"
                      rows={10}
                      placeholder={`Enter ${activeBoilerplateTab} starter code...`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This code will be pre-loaded for teams when they open the question</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Create Question')}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 bg-zinc-800 text-white py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
