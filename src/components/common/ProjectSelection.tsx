import { Code2, Trophy } from 'lucide-react';

interface ProjectSelectionProps {
    onSelect: (project: 'extended' | 'duality') => void;
}

export function ProjectSelection({ onSelect }: ProjectSelectionProps) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Duality Extended - Contest Platform */}
                <button
                    onClick={() => onSelect('extended')}
                    className="group relative bg-white border border-zinc-800 rounded-3xl p-8 text-left transition-all hover:border-white hover:bg-zinc-900/80 hover:-translate-y-2 overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-black mb-2">Duality Extended</h2>
                        <p className="text-black-400 leading-relaxed mb-6">
                            Participate in high-stakes DSA contests, track team performance, and climb the leaderboard.
                        </p>
                        <div className="flex items-center text-sm font-medium text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            Enter Contest →
                        </div>
                    </div>
                </button>

                {/* Duality - Practice Platform */}
                <button
                    onClick={() => onSelect('duality')}
                    className="group relative bg-white border border-zinc-800 rounded-3xl p-8 text-left transition-all hover:border-white hover:bg-zinc-900/80 hover:-translate-y-2 overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-black mb-2">Duality</h2>
                        <p className="text-black-400 leading-relaxed mb-6">
                            Solve LeetCode-style problems daily, improve your profile, and master DSA at your own pace.
                        </p>
                        <div className="flex items-center text-sm font-medium text-black opacity-0 group-hover:opacity-100 transition-opacity">
                            Start Solving →
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
