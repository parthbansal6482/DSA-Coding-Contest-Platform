interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  status: 'unsolved' | 'attempted' | 'solved';
  category: string;
}

interface ProblemDescriptionProps {
  question: Question;
}

// Mock problem data - in real app this would come from backend
const problemData: Record<string, any> = {
  '1': {
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    inputFormat: 'The first line contains two integers n and target.\nThe second line contains n space-separated integers representing the array.',
    outputFormat: 'Two space-separated integers representing the indices of the two numbers.',
    constraints: [
      '2 ≤ n ≤ 10^4',
      '-10^9 ≤ nums[i] ≤ 10^9',
      '-10^9 ≤ target ≤ 10^9',
      'Only one valid answer exists.',
    ],
    examples: [
      {
        input: '4 9\n2 7 11 15',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: '3 6\n3 2 4',
        output: '1 2',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: '2 6\n3 3',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].',
      },
    ],
  },
  '2': {
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'Print "true" if the string is valid, otherwise print "false".',
    constraints: [
      '1 ≤ s.length ≤ 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    examples: [
      {
        input: '()',
        output: 'true',
        explanation: 'The string contains valid parentheses.',
      },
      {
        input: '()[]{}',
        output: 'true',
        explanation: 'All brackets are properly closed.',
      },
      {
        input: '(]',
        output: 'false',
        explanation: 'Brackets are not of the same type.',
      },
    ],
  },
  '3': {
    description: 'Given the root of a binary tree, return the inorder, preorder, and postorder traversal of its nodes\' values.',
    inputFormat: 'The first line contains an integer n, the number of nodes.\nThe next n lines contain the nodes in level-order (use -1 for null nodes).',
    outputFormat: 'Three lines:\n- First line: inorder traversal\n- Second line: preorder traversal\n- Third line: postorder traversal',
    constraints: [
      '0 ≤ n ≤ 1000',
      '-100 ≤ Node.val ≤ 100',
    ],
    examples: [
      {
        input: '3\n1\n2\n3',
        output: '2 1 3\n1 2 3\n2 3 1',
        explanation: 'The tree has root 1 with left child 2 and right child 3.',
      },
    ],
  },
  '4': {
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',
    inputFormat: 'Two lines, each containing a string (text1 and text2).',
    outputFormat: 'A single integer representing the length of the longest common subsequence.',
    constraints: [
      '1 ≤ text1.length, text2.length ≤ 1000',
      'text1 and text2 consist of only lowercase English characters.',
    ],
    examples: [
      {
        input: 'abcde\nace',
        output: '3',
        explanation: 'The longest common subsequence is "ace" and its length is 3.',
      },
      {
        input: 'abc\nabc',
        output: '3',
        explanation: 'The longest common subsequence is "abc" and its length is 3.',
      },
    ],
  },
  '5': {
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. The path sum of a path is the sum of the node\'s values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    inputFormat: 'The first line contains an integer n, the number of nodes.\nThe next n lines contain the nodes in level-order (use -1 for null nodes).',
    outputFormat: 'A single integer representing the maximum path sum.',
    constraints: [
      '1 ≤ n ≤ 3 * 10^4',
      '-1000 ≤ Node.val ≤ 1000',
    ],
    examples: [
      {
        input: '3\n1\n2\n3',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.',
      },
    ],
  },
  '6': {
    description: 'Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.',
    inputFormat: 'First line contains the string s.\nSecond line contains an integer n.\nNext n lines contain the dictionary words.',
    outputFormat: 'All possible sentences, one per line.',
    constraints: [
      '1 ≤ s.length ≤ 20',
      '1 ≤ wordDict.length ≤ 1000',
      '1 ≤ wordDict[i].length ≤ 10',
    ],
    examples: [
      {
        input: 'catsanddog\n5\ncat\ncats\nand\nsand\ndog',
        output: 'cats and dog\ncat sand dog',
        explanation: 'Both sentences use all characters from s and only dictionary words.',
      },
    ],
  },
};

export function ProblemDescription({ question }: ProblemDescriptionProps) {
  const problem = problemData[question.id] || {};

  const difficultyColors = {
    Easy: 'text-green-500 bg-green-500/10',
    Medium: 'text-yellow-500 bg-yellow-500/10',
    Hard: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Title and Metadata */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-white">{question.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Category: {question.category}</span>
            <span>•</span>
            <span>Points: {question.points}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Problem Description</h2>
          <p className="text-gray-300 leading-relaxed">{problem.description}</p>
        </div>

        {/* Input Format */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Input Format</h2>
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-black p-4 rounded-lg border border-zinc-800">
            {problem.inputFormat}
          </pre>
        </div>

        {/* Output Format */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Output Format</h2>
          <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm bg-black p-4 rounded-lg border border-zinc-800">
            {problem.outputFormat}
          </pre>
        </div>

        {/* Constraints */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Constraints</h2>
          <ul className="space-y-2">
            {problem.constraints?.map((constraint: string, index: number) => (
              <li key={index} className="text-gray-300 font-mono text-sm flex items-start gap-2">
                <span className="text-gray-600">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Examples</h2>
          {problem.examples?.map((example: any, index: number) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Example {index + 1}</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Input:</p>
                  <pre className="bg-black border border-zinc-800 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                    {example.input}
                  </pre>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Output:</p>
                  <pre className="bg-black border border-zinc-800 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                    {example.output}
                  </pre>
                </div>

                {example.explanation && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Explanation:</p>
                    <p className="text-gray-300 text-sm">{example.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hints/Notes */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-400 mb-3">Note</h2>
          <p className="text-blue-300 text-sm">
            Make sure to handle all edge cases and test your solution against the sample inputs before submitting.
          </p>
        </div>
      </div>
    </div>
  );
}
