import { useState } from 'react';
import { ArrowLeft, Play, CheckCircle2, XCircle, Code2, FileText, Clock, RotateCcw } from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  passed?: boolean;
}

const mockProblem = {
  id: '1',
  title: 'Two Sum',
  difficulty: 'Easy',
  category: 'Array',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
    },
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  starterCode: {
    python: `def twoSum(nums, target):
    # Write your code here
    pass`,
    javascript: `function twoSum(nums, target) {
    // Write your code here
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
    }
}`
  }
};

type Language = 'python' | 'javascript' | 'cpp' | 'java';

export function ProblemSolve({ 
  problemId,
  onBack 
}: { 
  problemId: string;
  onBack: () => void;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState(mockProblem.starterCode[selectedLanguage]);
  const [testResults, setTestResults] = useState<TestCase[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setCode(mockProblem.starterCode[lang]);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTestResults(null);

    // Simulate running test cases
    setTimeout(() => {
      const mockResults: TestCase[] = [
        { input: '[2,7,11,15], target = 9', expectedOutput: '[0,1]', passed: true },
        { input: '[3,2,4], target = 6', expectedOutput: '[1,2]', passed: true },
        { input: '[3,3], target = 6', expectedOutput: '[0,1]', passed: false },
      ];
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      alert('Solution submitted successfully! ✓');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleReset = () => {
    if (confirm('Reset code to starter template?')) {
      setCode(mockProblem.starterCode[selectedLanguage]);
      setTestResults(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const passedTests = testResults?.filter(t => t.passed).length || 0;
  const totalTests = testResults?.length || 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Problems</span>
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-white" />
              <div>
                <h1 className="text-lg font-bold text-white">{mockProblem.title}</h1>
                <div className="flex items-center gap-2 text-xs">
                  <span className={getDifficultyColor(mockProblem.difficulty)}>{mockProblem.difficulty}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500">{mockProblem.category}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-zinc-800 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {mockProblem.description}
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Examples</h3>
              <div className="space-y-4">
                {mockProblem.examples.map((example, index) => (
                  <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Example {index + 1}</div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Input: </span>
                        <code className="text-white font-mono">{example.input}</code>
                      </div>
                      <div>
                        <span className="text-gray-500">Output: </span>
                        <code className="text-white font-mono">{example.output}</code>
                      </div>
                      <div>
                        <span className="text-gray-500">Explanation: </span>
                        <span className="text-gray-400">{example.explanation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Constraints</h3>
              <ul className="space-y-2">
                {mockProblem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-gray-600">•</span>
                    <code className="font-mono">{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Language Selector */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex gap-2">
            {(['python', 'javascript', 'cpp', 'java'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black p-6">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              style={{ lineHeight: '1.6' }}
            />
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="bg-zinc-900 border-t border-zinc-800 p-6 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Test Results
                </h3>
                <div className="text-sm">
                  <span className={passedTests === totalTests ? 'text-green-500' : 'text-yellow-500'}>
                    {passedTests}/{totalTests} Passed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {testResults.map((test, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-3 ${
                      test.passed 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {test.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                        Test Case {index + 1}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-gray-400 pl-6">
                      <div>
                        <span className="text-gray-500">Input: </span>
                        <code className="font-mono">{test.input}</code>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected: </span>
                        <code className="font-mono">{test.expectedOutput}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
