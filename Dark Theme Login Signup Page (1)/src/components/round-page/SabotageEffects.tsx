import { useState, useEffect } from 'react';
import { AlertTriangle, Shield as ShieldIcon, X } from 'lucide-react';

interface SabotageEffect {
  type: 'blackout' | 'typing-delay' | 'format-chaos' | 'ui-glitch';
  endTime: number;
  fromTeam?: string;
}

interface SabotageEffectsProps {
  activeEffects: SabotageEffect[];
  isShieldActive: boolean;
  onEffectEnd: (effect: SabotageEffect) => void;
}

export function SabotageEffects({ activeEffects, isShieldActive, onEffectEnd }: SabotageEffectsProps) {
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeRemaining: Record<string, number> = {};

      activeEffects.forEach((effect) => {
        const remaining = Math.max(0, Math.floor((effect.endTime - now) / 1000));
        newTimeRemaining[effect.type] = remaining;

        if (remaining === 0) {
          onEffectEnd(effect);
        }
      });

      setTimeRemaining(newTimeRemaining);
    }, 100);

    return () => clearInterval(interval);
  }, [activeEffects, onEffectEnd]);

  const hasBlackout = activeEffects.some((e) => e.type === 'blackout');
  const hasGlitch = activeEffects.some((e) => e.type === 'ui-glitch');

  return (
    <>
      {/* Shield Active Indicator */}
      {isShieldActive && (
        <div className="fixed top-20 right-6 z-40 bg-blue-500/20 border-2 border-blue-500 rounded-xl p-4 backdrop-blur-sm animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldIcon className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-blue-400 font-bold">Shield Active</p>
              <p className="text-blue-300 text-sm">Protected from attacks</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Effect Warnings */}
      {activeEffects.length > 0 && !isShieldActive && (
        <div className="fixed top-20 right-6 z-40 space-y-3 max-w-sm">
          {activeEffects.map((effect) => (
            <div
              key={effect.type}
              className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 backdrop-blur-sm animate-pulse"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-bold mb-1">Under Attack!</p>
                  <p className="text-red-300 text-sm mb-2">
                    {effect.type === 'blackout' && 'Screen Blackout Active'}
                    {effect.type === 'typing-delay' && 'Typing Delay Active'}
                    {effect.type === 'format-chaos' && 'Format Chaos Active'}
                    {effect.type === 'ui-glitch' && 'UI Glitch Active'}
                  </p>
                  <p className="text-red-200 text-xs">
                    {timeRemaining[effect.type]}s remaining
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screen Blackout Effect */}
      {hasBlackout && !isShieldActive && (
        <div className="fixed inset-0 z-50 bg-black animate-pulse pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500 text-4xl font-bold animate-pulse">
              SCREEN BLACKOUT ACTIVE
            </div>
          </div>
        </div>
      )}

      {/* UI Glitch Effect */}
      {hasGlitch && !isShieldActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 animate-pulse" />
          <div className="absolute inset-0 glitch-effect" />
        </div>
      )}
    </>
  );
}

// Add typing delay hook
export function useTypingDelay(activeEffects: SabotageEffect[], isShieldActive: boolean) {
  const [delayedValue, setDelayedValue] = useState('');
  const [pendingValue, setPendingValue] = useState('');

  const hasTypingDelay = activeEffects.some((e) => e.type === 'typing-delay') && !isShieldActive;

  useEffect(() => {
    if (!hasTypingDelay) {
      setDelayedValue(pendingValue);
      return;
    }

    const timeout = setTimeout(() => {
      setDelayedValue(pendingValue);
    }, 2000); // 2 second delay

    return () => clearTimeout(timeout);
  }, [pendingValue, hasTypingDelay]);

  return {
    value: delayedValue,
    setValue: setPendingValue,
    isDelayed: hasTypingDelay,
  };
}

// Add format chaos hook
export function useFormatChaos(activeEffects: SabotageEffect[], isShieldActive: boolean) {
  const hasFormatChaos = activeEffects.some((e) => e.type === 'format-chaos') && !isShieldActive;
  const [chaos, setChaos] = useState(false);

  useEffect(() => {
    if (!hasFormatChaos) {
      setChaos(false);
      return;
    }

    // Apply random formatting changes
    const interval = setInterval(() => {
      setChaos((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasFormatChaos]);

  const applyFormatChaos = (code: string) => {
    if (!hasFormatChaos || !chaos) return code;

    // Randomly add or remove spaces/newlines
    return code
      .split('\n')
      .map((line) => {
        if (Math.random() > 0.7) {
          return '  '.repeat(Math.floor(Math.random() * 3)) + line;
        }
        return line;
      })
      .join('\n');
  };

  return { applyFormatChaos, hasFormatChaos };
}
