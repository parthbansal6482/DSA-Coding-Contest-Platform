import { Code2, Trophy } from 'lucide-react';

export function Landing({ 
  onSelectDuality, 
  onSelectDualityExtended 
}: { 
  onSelectDuality: () => void; 
  onSelectDualityExtended: () => void; 
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Duality Platform
          </h1>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Duality - Practice Platform */}
          <button
            onClick={onSelectDuality}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all hover:bg-zinc-800/50"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                <Code2 className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Duality
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Practice DSA problems anytime, anywhere. Build your coding profile, track your progress, and improve your skills continuously.
                </p>
              </div>

              <div className="pt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Unlimited Practice Problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Personal Profile Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Practice Anytime</span>
                </div>
              </div>

              <div className="pt-4 w-full">
                <div className="bg-white text-black px-6 py-3 rounded-lg font-medium group-hover:bg-gray-200 transition-colors">
                  Enter Practice Mode
                </div>
              </div>
            </div>
          </button>

          {/* Duality Extended - Competition Platform */}
          <button
            onClick={onSelectDualityExtended}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all hover:bg-zinc-800/50"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Duality Extended
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Compete in timed DSA contests with your team. Use tactical sabotage tokens, earn points, and climb the leaderboard.
                </p>
              </div>

              <div className="pt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Team-Based Competition</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Tactical Sabotage System</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                  <span>Live Leaderboards</span>
                </div>
              </div>

              <div className="pt-4 w-full">
                <div className="bg-white text-black px-6 py-3 rounded-lg font-medium group-hover:bg-gray-200 transition-colors">
                  Enter Competition Mode
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
