import { KmpStep, UnitTestResult } from './types';

/**
 * Computes the Longest Proper Prefix which is also a Suffix (LPS) array for the given pattern.
 * Time Complexity: O(m) where m is pattern.length
 * Space Complexity: O(m)
 *
 * Example:
 * Pattern: "ABABC"
 * Returns: [0, 0, 1, 2, 0]
 */
export function computeLPSArray(pattern: string): number[] {
  const m = pattern.length;
  if (m === 0) return [];
  const lps: number[] = new Array(m).fill(0);

  let len = 0; // length of previous longest prefix suffix
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1]; // Fallback to previous longest prefix suffix
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

/**
 * Executes the Knuth-Morris-Pratt (KMP) search algorithm.
 * Returns match positions (0-based starting character indices) and total character comparisons performed.
 *
 * Correctly accounts for overlapping occurrences by falling back to lps[j - 1] after finding a full match.
 */
export function searchKMP(
  text: string,
  pattern: string,
  caseSensitive = false,
  wholeWord = false
): { matches: number[]; comparisons: number } {
  const matches: number[] = [];
  let comparisons = 0;

  if (!text || !pattern || pattern.length === 0 || text.length < pattern.length) {
    return { matches, comparisons };
  }

  const searchTarget = caseSensitive ? text : text.toLowerCase();
  const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();

  const lps = computeLPSArray(searchPattern);
  const n = searchTarget.length;
  const m = searchPattern.length;

  let i = 0; // index for searchTarget (text)
  let j = 0; // index for searchPattern (pattern)

  while (i < n) {
    comparisons++;
    if (searchPattern[j] === searchTarget[i]) {
      i++;
      j++;
    }

    if (j === m) {
      const matchIndex = i - j;

      if (wholeWord) {
        const startBoundary = matchIndex === 0 || !/[a-zA-Z0-9_]/.test(searchTarget[matchIndex - 1]);
        const endBoundary = i === n || !/[a-zA-Z0-9_]/.test(searchTarget[i]);
        if (startBoundary && endBoundary) {
          matches.push(matchIndex);
        }
      } else {
        matches.push(matchIndex);
      }

      // After match, fall back to lps[j - 1] to continue finding overlapping matches
      j = lps[j - 1];
    } else if (i < n && searchPattern[j] !== searchTarget[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return { matches, comparisons };
}

/**
 * Standard Naive String Search implementation used strictly for fair algorithmic comparison.
 * Demonstrates the O(n * m) worst-case comparison count vs KMP's O(n + m).
 */
export function searchNaive(
  text: string,
  pattern: string,
  caseSensitive = false,
  wholeWord = false
): { matches: number[]; comparisons: number } {
  const matches: number[] = [];
  let comparisons = 0;

  if (!text || !pattern || pattern.length === 0 || text.length < pattern.length) {
    return { matches, comparisons };
  }

  const searchTarget = caseSensitive ? text : text.toLowerCase();
  const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();

  const n = searchTarget.length;
  const m = searchPattern.length;

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m) {
      comparisons++;
      if (searchTarget[i + j] !== searchPattern[j]) {
        break;
      }
      j++;
    }

    if (j === m) {
      if (wholeWord) {
        const startBoundary = i === 0 || !/[a-zA-Z0-9_]/.test(searchTarget[i - 1]);
        const endBoundary = i + m === n || !/[a-zA-Z0-9_]/.test(searchTarget[i + m]);
        if (startBoundary && endBoundary) {
          matches.push(i);
        }
      } else {
        matches.push(i);
      }
    }
  }

  return { matches, comparisons };
}

/**
 * Generates an educational, step-by-step progression trace for the interactive visualizer.
 */
export function generateKmpSteps(text: string, pattern: string): KmpStep[] {
  const steps: KmpStep[] = [];
  if (!text || !pattern) return steps;

  const lps = computeLPSArray(pattern);
  const n = text.length;
  const m = pattern.length;

  let i = 0;
  let j = 0;
  let comparisonsCount = 0;
  const matchedIndices: number[] = [];

  steps.push({
    stepIndex: 0,
    textIndex_i: 0,
    patternIndex_j: 0,
    action: 'compare',
    description: `Initialize KMP search. LPS Array precomputed: [${lps.join(', ')}]. Pattern length m=${m}, Text length n=${n}.`,
    lpsSnapshot: [...lps],
    matchedIndices: [],
    comparisonsCount: 0,
  });

  while (i < n) {
    comparisonsCount++;
    const charMatch = pattern[j] === text[i];

    if (charMatch) {
      steps.push({
        stepIndex: steps.length,
        textIndex_i: i,
        patternIndex_j: j,
        action: 'match_char',
        description: `Character match: Text[${i}] ('${text[i]}') == Pattern[${j}] ('${pattern[j]}'). Incrementing both pointers.`,
        lpsSnapshot: [...lps],
        matchedIndices: [...matchedIndices],
        comparisonsCount,
      });

      i++;
      j++;

      if (j === m) {
        const matchPos = i - j;
        matchedIndices.push(matchPos);
        const nextJ = lps[j - 1];

        steps.push({
          stepIndex: steps.length,
          textIndex_i: i - 1,
          patternIndex_j: j - 1,
          action: 'full_match',
          description: `Full pattern match found at text index ${matchPos}! Pattern pointer j falls back to LPS[${j - 1}] = ${nextJ} to search for subsequent matches.`,
          lpsSnapshot: [...lps],
          matchedIndices: [...matchedIndices],
          comparisonsCount,
        });

        j = nextJ;
      }
    } else {
      if (j !== 0) {
        const fallbackJ = lps[j - 1];
        steps.push({
          stepIndex: steps.length,
          textIndex_i: i,
          patternIndex_j: j,
          action: 'mismatch_fallback',
          description: `Mismatch: Text[${i}] ('${text[i]}') != Pattern[${j}] ('${pattern[j]}'). Since j > 0, KMP shifts pattern: j falls back to LPS[${j - 1}] = ${fallbackJ}. Text index i remains at ${i} without backtracking.`,
          lpsSnapshot: [...lps],
          matchedIndices: [...matchedIndices],
          comparisonsCount,
        });
        j = fallbackJ;
      } else {
        steps.push({
          stepIndex: steps.length,
          textIndex_i: i,
          patternIndex_j: 0,
          action: 'mismatch_advance',
          description: `Mismatch at pattern start (j=0): Text[${i}] ('${text[i]}') != Pattern[0] ('${pattern[0]}'). Advance text pointer i to ${i + 1}.`,
          lpsSnapshot: [...lps],
          matchedIndices: [...matchedIndices],
          comparisonsCount,
        });
        i++;
      }
    }

    if (steps.length > 250) {
      steps.push({
        stepIndex: steps.length,
        textIndex_i: i,
        patternIndex_j: j,
        action: 'complete',
        description: `Visualization capped at 250 steps for browser rendering performance.`,
        lpsSnapshot: [...lps],
        matchedIndices: [...matchedIndices],
        comparisonsCount,
      });
      break;
    }
  }

  if (steps[steps.length - 1].action !== 'complete') {
    steps.push({
      stepIndex: steps.length,
      textIndex_i: i,
      patternIndex_j: j,
      action: 'complete',
      description: `KMP search complete across text. Total matches: ${matchedIndices.length}. Total comparisons: ${comparisonsCount}.`,
      lpsSnapshot: [...lps],
      matchedIndices: [...matchedIndices],
      comparisonsCount,
    });
  }

  return steps;
}

/**
 * Automated test suite executable in browser and verifiable for academic evaluation.
 */
export function runAutomatedSelfTests(): UnitTestResult[] {
  const tests: UnitTestResult[] = [];

  // Test 1: LPS Array for "ABABC"
  const lps1 = computeLPSArray("ABABC");
  const expectedLps1 = [0, 0, 1, 2, 0];
  const passed1 = JSON.stringify(lps1) === JSON.stringify(expectedLps1);
  tests.push({
    id: "UT-1",
    name: "LPS Array Construction for 'ABABC'",
    pattern: "ABABC",
    expected: JSON.stringify(expectedLps1),
    actual: JSON.stringify(lps1),
    passed: passed1,
    notes: "Core academic requirement: verify longest proper prefix that is also suffix."
  });

  // Test 2: Overlapping match detection ('ana' in 'banana')
  const res2 = searchKMP("banana", "ana", true, false);
  const expectedRes2 = [1, 3];
  const passed2 = JSON.stringify(res2.matches) === JSON.stringify(expectedRes2);
  tests.push({
    id: "UT-2",
    name: "Overlapping Occurrences ('ana' in 'banana')",
    text: "banana",
    pattern: "ana",
    expected: "Indices: [1, 3] (count: 2)",
    actual: `Indices: [${res2.matches.join(', ')}] (count: ${res2.matches.length})`,
    passed: passed2,
    notes: "Must find both occurrences without skipping overlapping characters."
  });

  // Test 3: Repeating characters ('AA' in 'AAAA')
  const res3 = searchKMP("AAAA", "AA", true, false);
  const expectedRes3 = [0, 1, 2];
  const passed3 = JSON.stringify(res3.matches) === JSON.stringify(expectedRes3);
  tests.push({
    id: "UT-3",
    name: "Repeated Characters Pattern ('AA' in 'AAAA')",
    text: "AAAA",
    pattern: "AA",
    expected: "Indices: [0, 1, 2] (count: 3)",
    actual: `Indices: [${res3.matches.join(', ')}] (count: ${res3.matches.length})`,
    passed: passed3,
    notes: "Overlapping matches in homogeneous string."
  });

  // Test 4: Case-Insensitive Matching
  const res4 = searchKMP("Java developer using java and JAVA", "java", false, false);
  const passed4 = res4.matches.length === 3;
  tests.push({
    id: "UT-4",
    name: "Case-Insensitive Normalization",
    text: "Java developer using java and JAVA",
    pattern: "java",
    expected: "3 occurrences",
    actual: `${res4.matches.length} occurrences at [${res4.matches.join(', ')}]`,
    passed: passed4,
    notes: "Normalized pattern matching correctly across mixed cases."
  });

  // Test 5: Whole-Word Boundary Detection
  const res5 = searchKMP("Java JavaScript Java_Developer Java", "Java", true, true);
  const passed5 = res5.matches.length === 2 && res5.matches[0] === 0 && res5.matches[1] === 32;
  tests.push({
    id: "UT-5",
    name: "Whole-Word Boundary Check",
    text: "Java JavaScript Java_Developer Java",
    pattern: "Java",
    expected: "Indices: [0, 32] (count: 2)",
    actual: `Indices: [${res5.matches.join(', ')}] (count: ${res5.matches.length})`,
    passed: passed5,
    notes: "Excludes substrings inside 'JavaScript' and 'Java_Developer'."
  });

  // Test 6: Multi-word Phrase Matching
  const res6 = searchKMP("Specialized in Machine Learning and Data Science", "Machine Learning", false, false);
  const passed6 = res6.matches.length === 1 && res6.matches[0] === 15;
  tests.push({
    id: "UT-6",
    name: "Multi-Word Phrase Matching",
    text: "Specialized in Machine Learning and Data Science",
    pattern: "Machine Learning",
    expected: "Index 15 (count: 1)",
    actual: `Index ${res6.matches[0]} (count: ${res6.matches.length})`,
    passed: passed6,
    notes: "KMP handles arbitrary spaces and punctuation identically."
  });

  // Test 7: Non-existent Pattern Handling
  const res7 = searchKMP("Full stack web development with React", "Quantum", false, false);
  const passed7 = res7.matches.length === 0;
  tests.push({
    id: "UT-7",
    name: "Non-Existent Pattern in Text",
    text: "Full stack web development with React",
    pattern: "Quantum",
    expected: "0 occurrences",
    actual: `${res7.matches.length} occurrences`,
    passed: passed7,
    notes: "Proper termination without false positives."
  });

  return tests;
}
