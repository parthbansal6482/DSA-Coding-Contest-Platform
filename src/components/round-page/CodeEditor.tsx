import { useState, useEffect } from 'react';
import { Play, Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useTypingDelay, useFormatChaos } from './SabotageEffects';

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

interface CodeEditorProps {
  question: Question;
  activeEffects: SabotageEffect[];
  isShieldActive: boolean;
  onStatusChange: (status: Question['status']) => void;
}

type Language = 'python' | 'c' | 'cpp' | 'java';

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
}

// Boilerplate code for each language
const boilerplateCode: Record<string, Record<Language, string>> = {
  '1': {
    python: `def two_sum(nums, target):
    # Write your code here
    pass

# Read input
n, target = map(int, input().split())
nums = list(map(int, input().split()))

# Call function and print result
result = two_sum(nums, target)
print(result[0], result[1])`,
    c: `#include <stdio.h>
#include <stdlib.h>

void two_sum(int* nums, int n, int target, int* result) {
    // Write your code here
}

int main() {
    int n, target;
    scanf("%d %d", &n, &target);
    
    int* nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    
    int result[2];
    two_sum(nums, n, target, result);
    printf("%d %d\\n", result[0], result[1]);
    
    free(nums);
    return 0;
}`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> two_sum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}

int main() {
    int n, target;
    cin >> n >> target;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    vector<int> result = two_sum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[2];
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
        
        sc.close();
    }
}`,
  },
  '2': {
    python: `def is_valid(s):
    # Write your code here
    pass

# Read input
s = input().strip()

# Call function and print result
result = is_valid(s)
print("true" if result else "false")`,
    c: `#include <stdio.h>
#include <string.h>
#include <stdbool.h>

bool is_valid(char* s) {
    // Write your code here
    return false;
}

int main() {
    char s[10001];
    scanf("%s", s);
    
    bool result = is_valid(s);
    printf("%s\\n", result ? "true" : "false");
    
    return 0;
}`,
    cpp: `#include <iostream>
#include <string>
using namespace std;

bool is_valid(string s) {
    // Write your code here
    return false;
}

int main() {
    string s;
    cin >> s;
    
    bool result = is_valid(s);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        return false;
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        
        boolean result = isValid(s);
        System.out.println(result ? "true" : "false");
        
        sc.close();
    }
}`,
  },
};

export function CodeEditor({ question, activeEffects, isShieldActive, onStatusChange }: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(boilerplateCode[question.id]?.[language] || '');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(boilerplateCode[question.id]?.[newLanguage] || '');
    setTestResults(null);
    setShowResults(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setShowResults(false);
    
    // Simulate running code
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock test results for sample test cases
    const mockResults: TestResult[] = [
      {
        passed: true,
        input: '4 9\n2 7 11 15',
        expectedOutput: '0 1',
        actualOutput: '0 1',
      },
    ];
    
    setTestResults(mockResults);
    setShowResults(true);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowResults(false);
    
    // Simulate submission and testing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock test results for all test cases
    const allPassed = Math.random() > 0.3; // 70% chance of success
    const mockResults: TestResult[] = [
      {
        passed: true,
        input: '4 9\n2 7 11 15',
        expectedOutput: '0 1',
        actualOutput: '0 1',
      },
      {
        passed: true,
        input: '3 6\n3 2 4',
        expectedOutput: '1 2',
        actualOutput: '1 2',
      },
      {
        passed: allPassed,
        input: '2 6\n3 3',
        expectedOutput: '0 1',
        actualOutput: allPassed ? '0 1' : '1 0',
      },
    ];
    
    setTestResults(mockResults);
    setShowResults(true);
    setIsSubmitting(false);
    
    // Update question status
    if (allPassed) {
      onStatusChange('solved');
    } else {
      onStatusChange('attempted');
    }
  };

  const allTestsPassed = testResults?.every((result) => result.passed) ?? false;
  const passedCount = testResults?.filter((result) => result.passed).length ?? 0;
  const totalCount = testResults?.length ?? 0;

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-400">Language:</label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-black text-gray-300 font-mono text-sm p-6 focus:outline-none resize-none"
            style={{
              tabSize: 4,
              lineHeight: '1.6',
            }}
            spellCheck={false}
          />
        </div>

        {/* Results Panel */}
        {showResults && testResults && (
          <div className="w-96 border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* Overall Status */}
              <div className={`p-4 rounded-lg border ${
                allTestsPassed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {allTestsPassed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className={`text-lg font-bold ${
                    allTestsPassed ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {allTestsPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                  </h3>
                </div>
                <p className={`text-sm ${
                  allTestsPassed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {passedCount} / {totalCount} test cases passed
                </p>
              </div>

              {/* Test Results */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Test Cases</h4>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.passed
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`font-medium ${
                        result.passed ? 'text-green-500' : 'text-red-500'
                      }`}>
                        Test Case {index + 1}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Input:</p>
                        <pre className="bg-black p-2 rounded text-gray-300 font-mono text-xs overflow-x-auto">
                          {result.input}
                        </pre>
                      </div>

                      <div>
                        <p className="text-gray-400 mb-1">Expected:</p>
                        <pre className="bg-black p-2 rounded text-gray-300 font-mono text-xs overflow-x-auto">
                          {result.expectedOutput}
                        </pre>
                      </div>

                      {result.actualOutput && (
                        <div>
                          <p className="text-gray-400 mb-1">Your Output:</p>
                          <pre className={`bg-black p-2 rounded font-mono text-xs overflow-x-auto ${
                            result.passed ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {result.actualOutput}
                          </pre>
                        </div>
                      )}

                      {result.error && (
                        <div>
                          <p className="text-red-400 mb-1">Error:</p>
                          <pre className="bg-black p-2 rounded text-red-400 font-mono text-xs overflow-x-auto">
                            {result.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}