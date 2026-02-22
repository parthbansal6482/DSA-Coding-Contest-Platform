import { CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';

interface Submission {
  id: string;
  problemTitle: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  runtime: string;
  memory: string;
  timestamp: string;
  testsPassed: number;
  totalTests: number;
}

const mockSubmissions: Submission[] = [
  {
    id: '1',
    problemTitle: 'Two Sum',
    language: 'Python',
    status: 'Accepted',
    runtime: '45 ms',
    memory: '14.2 MB',
    timestamp: '2026-02-22 14:30',
    testsPassed: 5,
    totalTests: 5
  },
  {
    id: '2',
    problemTitle: 'Add Two Numbers',
    language: 'C++',
    status: 'Accepted',
    runtime: '12 ms',
    memory: '8.5 MB',
    timestamp: '2026-02-22 13:15',
    testsPassed: 8,
    totalTests: 8
  },
  {
    id: '3',
    problemTitle: 'Longest Substring',
    language: 'Java',
    status: 'Wrong Answer',
    runtime: '78 ms',
    memory: '16.8 MB',
    timestamp: '2026-02-21 18:45',
    testsPassed: 7,
    totalTests: 10
  },
  {
    id: '4',
    problemTitle: 'Valid Parentheses',
    language: 'Python',
    status: 'Accepted',
    runtime: '32 ms',
    memory: '13.1 MB',
    timestamp: '2026-02-21 16:20',
    testsPassed: 6,
    totalTests: 6
  },
  {
    id: '5',
    problemTitle: 'Median of Arrays',
    language: 'C++',
    status: 'Time Limit Exceeded',
    runtime: '> 2000 ms',
    memory: '10.2 MB',
    timestamp: '2026-02-20 20:10',
    testsPassed: 3,
    totalTests: 12
  },
];

export function SubmissionsHistory() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Wrong Answer': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'Runtime Error': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Time Limit Exceeded': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Accepted') {
      return <CheckCircle2 className="w-4 h-4" />;
    }
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Submission History</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Code2 className="w-4 h-4" />
          <span>{mockSubmissions.length} Total Submissions</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black border-b border-zinc-800">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Problem</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Language</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Runtime</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Memory</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Tests</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(submission.status)} w-fit`}>
                      {getStatusIcon(submission.status)}
                      <span className="text-xs font-medium">{submission.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{submission.problemTitle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400 font-mono">{submission.language}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{submission.runtime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{submission.memory}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${submission.testsPassed === submission.totalTests ? 'text-green-500' : 'text-yellow-500'}`}>
                      {submission.testsPassed}/{submission.totalTests}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{submission.timestamp}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Acceptance Rate</p>
          <p className="text-2xl font-bold text-green-500">
            {Math.round((mockSubmissions.filter(s => s.status === 'Accepted').length / mockSubmissions.length) * 100)}%
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Accepted</p>
          <p className="text-2xl font-bold text-white">
            {mockSubmissions.filter(s => s.status === 'Accepted').length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Most Used Language</p>
          <p className="text-lg font-bold text-white">Python</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Total Submissions</p>
          <p className="text-2xl font-bold text-white">{mockSubmissions.length}</p>
        </div>
      </div>
    </div>
  );
}
