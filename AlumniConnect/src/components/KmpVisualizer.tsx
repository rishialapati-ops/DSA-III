import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Binary,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { computeLPSArray, generateKmpSteps } from '../kmp/kmpAlgorithm';
import { KmpStep } from '../kmp/types';

interface PresetExample {
  title: string;
  description: string;
  text: string;
  pattern: string;
}

const PRESET_EXAMPLES: PresetExample[] = [
  {
    title: 'Standard LPS Fallback',
    description: 'Demonstrates pattern shifting without moving text pointer i back upon mismatch at "C".',
    text: 'BACABABCABAB',
    pattern: 'ABABC'
  },
  {
    title: 'Overlapping Substring',
    description: 'Finds overlapping occurrences of "ana" in "banana" at index 1 and index 3.',
    text: 'banana',
    pattern: 'ana'
  },
  {
    title: 'Repeating Characters',
    description: 'Demonstrates maximal prefix overlap in repeated character runs.',
    text: 'AAAA',
    pattern: 'AA'
  },
  {
    title: 'Alumni Skill Search',
    description: 'Locates multiple skill mentions across an alumni experience line.',
    text: 'Experience with Java and Java backend systems.',
    pattern: 'Java'
  }
];

interface KmpVisualizerProps {
  theme?: 'dark' | 'light';
}

export const KmpVisualizer: React.FC<KmpVisualizerProps> = ({ theme = 'dark' }) => {
  const [text, setText] = useState('BACABABCABAB');
  const [pattern, setPattern] = useState('ABABC');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(800);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isDark = theme === 'dark';

  const lpsArray = useMemo(() => computeLPSArray(pattern), [pattern]);

  const steps: KmpStep[] = useMemo(() => {
    return generateKmpSteps(text, pattern);
  }, [text, pattern]);

  const currentStep = steps[currentStepIndex] || steps[0] || null;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handlePreset = (p: PresetExample) => {
    setIsPlaying(false);
    setText(p.text);
    setPattern(p.pattern);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Title Banner */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
          <Binary className="w-4 h-4" />
          <span>ALGORITHMIC EDUCATION & TRACE</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          How the KMP Algorithm Works
        </h1>
        <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          The Knuth-Morris-Pratt (KMP) algorithm locates all occurrences of a pattern in linear time by precomputing the Longest Proper Prefix which is also a Suffix (LPS) array, ensuring the text pointer never backtracks.
        </p>
      </div>

      {/* Conceptual Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="font-bold text-indigo-400 block mb-1">1. What is the LPS Array?</span>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            <span className="font-mono font-semibold">LPS[j]</span> stores the length of the longest proper prefix of <span className="font-mono">P[0..j]</span> that is also a suffix of <span className="font-mono">P[0..j]</span>. Precomputed in O(m) time.
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="font-bold text-rose-400 block mb-1">2. Why Naive Matching Fails</span>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            When naive matching mismatches, it resets the text index back to <span className="font-mono">i - j + 1</span>, repeating comparisons up to O(n × m) in pathological cases.
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="font-bold text-emerald-400 block mb-1">3. The KMP Guarantee</span>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Text pointer <span className="font-mono text-emerald-400 font-bold">i</span> moves strictly forward. Pattern pointer <span className="font-mono">j</span> shifts directly to <span className="font-mono">LPS[j - 1]</span> in deterministic O(n) time.
          </p>
        </div>
      </div>

      {/* Educational Presets */}
      <div className={`p-4 rounded-xl border ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Educational Examples:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_EXAMPLES.map((pr) => (
            <button
              key={pr.title}
              onClick={() => handlePreset(pr)}
              className={`p-2.5 rounded-lg text-left border transition cursor-pointer ${
                text === pr.text && pattern === pr.pattern
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : isDark
                  ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
            >
              <div className="font-semibold text-xs">{pr.title}</div>
              <div className={`text-[10px] mt-0.5 truncate ${
                text === pr.text && pattern === pr.pattern ? 'text-indigo-100' : isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {pr.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Target Text (T)
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value); setCurrentStepIndex(0); setIsPlaying(false); }}
            className={`w-full px-3 py-2 rounded-lg border font-mono ${
              isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-300'
            }`}
          />
        </div>
        <div>
          <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Search Pattern (P)
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => { setPattern(e.target.value); setCurrentStepIndex(0); setIsPlaying(false); }}
            className={`w-full px-3 py-2 rounded-lg border font-mono ${
              isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-300'
            }`}
          />
        </div>
      </div>

      {/* LPS Array Table Display */}
      <div className={`p-5 rounded-xl border ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Computed LPS Array
            </span>
            <span className="font-mono text-indigo-400">(Length m = {pattern.length})</span>
          </div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>O(m) Preprocessing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="text-xs font-mono text-center border-collapse">
            <tbody>
              <tr className={`border-b text-[10px] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                <td className="pr-4 py-1 text-left font-sans font-medium">Index (j)</td>
                {pattern.split('').map((_, idx) => (
                  <td key={idx} className="w-10 py-1">{idx}</td>
                ))}
              </tr>
              <tr className={`border-b font-bold ${isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'}`}>
                <td className="pr-4 py-2 text-left font-sans font-medium text-slate-400">Pattern</td>
                {pattern.split('').map((char, idx) => (
                  <td 
                    key={idx} 
                    className={`w-10 py-2 border-r ${isDark ? 'border-slate-800' : 'border-slate-200'} ${
                      currentStep?.patternIndex_j === idx ? 'bg-indigo-600/30 text-indigo-400' : ''
                    }`}
                  >
                    {char}
                  </td>
                ))}
              </tr>
              <tr className="font-bold text-indigo-400">
                <td className="pr-4 py-2 text-left font-sans font-medium text-slate-400">LPS[j]</td>
                {lpsArray.map((val, idx) => (
                  <td 
                    key={idx} 
                    className={`w-10 py-2 border-r ${isDark ? 'border-slate-800' : 'border-slate-200'} tabular-nums ${
                      currentStep?.patternIndex_j === idx ? 'bg-indigo-600/40 text-white font-extrabold' : ''
                    }`}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Alignment Canvas */}
      <div className={`p-6 rounded-2xl border shadow-xl space-y-6 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Playback Controls & Status */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded font-bold border ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
            }`}>
              Step {currentStepIndex + 1} / {steps.length}
            </span>
            <span>Comparisons: <strong>{currentStep?.comparisonsCount || 0}</strong></span>
            <span className="text-emerald-400">Matches: <strong>{currentStep?.matchedIndices.length || 0}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`p-2 rounded-lg border disabled:opacity-30 transition cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Previous Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex >= steps.length - 1}
              className={`p-2 rounded-lg border disabled:opacity-30 transition cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Next Step"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Description Box */}
        <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
          currentStep?.action === 'full_match'
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : currentStep?.action === 'mismatch_fallback'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            : currentStep?.action === 'mismatch_advance'
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            : currentStep?.action === 'match_char'
            ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300'
            : isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <span className="uppercase text-[10px] tracking-wider block font-bold mb-0.5">
            {currentStep?.action.replace('_', ' ')}
          </span>
          <div>{currentStep?.description}</div>
        </div>

        {/* Pointer Alignment Display */}
        <div className="space-y-4 pt-2 overflow-x-auto pb-4">
          
          {/* Target Text Row */}
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Target Text (T):</strong>
              <span>Pointer i = {currentStep?.textIndex_i ?? 0}</span>
            </div>

            <div className="flex gap-1 min-w-max font-mono text-xs">
              {text.split('').map((char, idx) => {
                const isCurrentI = currentStep?.textIndex_i === idx;
                const isMatchPos = currentStep?.matchedIndices.some(start => idx >= start && idx < start + pattern.length);

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="h-4 flex items-center justify-center font-bold text-amber-400 text-[10px]">
                      {isCurrentI ? 'i↓' : ''}
                    </div>
                    <div className={`w-8 h-9 flex items-center justify-center rounded-lg border font-bold transition-colors ${
                      isCurrentI
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                        : isMatchPos
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}>
                      {char}
                    </div>
                    <span className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pattern Alignment Row */}
          <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Pattern (P):</strong>
              <span>Pointer j = {currentStep?.patternIndex_j ?? 0}</span>
              <span className="text-indigo-400">(Aligned at index {Math.max(0, (currentStep?.textIndex_i ?? 0) - (currentStep?.patternIndex_j ?? 0))})</span>
            </div>

            <div className="flex gap-1 min-w-max font-mono text-xs">
              {Array.from({ length: Math.max(0, (currentStep?.textIndex_i ?? 0) - (currentStep?.patternIndex_j ?? 0)) }).map((_, padIdx) => (
                <div key={`pad-${padIdx}`} className="w-8 h-9" />
              ))}

              {pattern.split('').map((char, pIdx) => {
                const isCurrentJ = currentStep?.patternIndex_j === pIdx;
                const isCharMatch = currentStep?.action === 'match_char' && isCurrentJ;
                const isMismatch = (currentStep?.action === 'mismatch_fallback' || currentStep?.action === 'mismatch_advance') && isCurrentJ;

                return (
                  <div key={pIdx} className="flex flex-col items-center">
                    <div className={`w-8 h-9 flex items-center justify-center rounded-lg border font-bold transition-colors ${
                      isCharMatch
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                        : isMismatch
                        ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                        : isCurrentJ
                        ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300 ring-2 ring-indigo-400/30'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
                    }`}>
                      {char}
                    </div>
                    <div className="h-4 flex items-center justify-center font-bold text-indigo-400 text-[10px] mt-0.5">
                      {isCurrentJ ? '↑j' : ''}
                    </div>
                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{pIdx}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        <div className={`pt-3 border-t text-xs font-mono flex items-center justify-between ${
          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
          <div>
            Occurrences Identified: <strong className="text-emerald-400">[{currentStep?.matchedIndices.join(', ') || 'None'}]</strong>
          </div>
          <div>
            KMP guarantees at most 2n comparisons
          </div>
        </div>

      </div>

    </div>
  );
};
