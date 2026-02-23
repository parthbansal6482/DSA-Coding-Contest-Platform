import { CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';

interface Submission {
  _id: string;
  question: {
    title: string;
  };
  language: string;
  status: string;
  executionTime: number;
  memoryUsed: number;
  submittedAt: string;
  testCasesPassed: number;
  totalTestCases: number;
}

import { useEffect, useState } from 'react';
import { getDualityUserSubmissions } from '../../services/duality.service';

export function SubmissionsHistory() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const result = await getDualityUserSubmissions();
        if (result.success) {
          setSubmissions(result.data);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'wrong_answer': return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'runtime_error': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'time_limit_exceeded': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase() === 'accepted') {
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
          <span>{submissions.length} Total Submissions</span>
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
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(submission.status)} w-fit`}>
                      {getStatusIcon(submission.status)}
                      <span className="text-xs font-medium">{getStatusDisplay(submission.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{submission.question.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400 font-mono capitalize">{submission.language}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{submission.executionTime} ms</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{submission.memoryUsed} KB</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${submission.testCasesPassed === submission.totalTestCases ? 'text-green-500' : 'text-yellow-500'}`}>
                      {submission.testCasesPassed}/{submission.totalTestCases}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(submission.submittedAt).toLocaleString()}</span>
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
            {submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Accepted</p>
          <p className="text-2xl font-bold text-white">
            {submissions.filter(s => s.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Language Distribution</p>
          <p className="text-xs font-bold text-white">
            {submissions.length > 0 ? Array.from(new Set(submissions.map(s => s.language))).slice(0, 2).join(', ') : 'None'}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Total Submissions</p>
          <p className="text-2xl font-bold text-white">{submissions.length}</p>
        </div>
      </div>
    </div>
  );
}
