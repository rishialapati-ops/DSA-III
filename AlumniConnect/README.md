# Alumni Connect — KMP Pattern Search System

> **Intelligent Alumni Document Search Using the Knuth-Morris-Pratt (KMP) Algorithm**  
> *A Data Structures and Algorithms (DSA) Academic Capstone Project*

---

## Academic Information

- **Project Title**: Alumni Connect: Intelligent Alumni Document Search Using the Knuth-Morris-Pratt (KMP) Algorithm
- **Department**: Department of Computer Science & Engineering
- **Course**: CS-301 Data Structures and Algorithms Laboratory
- **Supervisor**: Prof. [Supervisor Name / Faculty Advisor]
- **Project Team**:
  1. Member 1: [Student Name 1] — ID: [Student ID / Roll No 1] (Team Lead, KMP Core)
  2. Member 2: [Student Name 2] — ID: [Student ID / Roll No 2] (Corpus Engineering & Parsing)
  3. Member 3: [Student Name 3] — ID: [Student ID / Roll No 3] (Interface & Visualization)
- **Current Phase**: Phase 2 Completed (System Demonstration & Academic Evaluation Ready)

---

## Abstract
Searching unstructured and semi-structured text collections for specific technical keywords or domain phrases is a ubiquitous operation in campus recruitment, alumni tracking, and talent discovery. Standard linear search techniques frequently execute redundant character comparisons, suffering from $O(n \times m)$ worst-case time complexity. This project implements the **Knuth-Morris-Pratt (KMP)** exact string matching algorithm to search a corpus of **100 individual alumni text documents** (`alumni001.txt` through `alumni100.txt`). The system computes the Longest Proper Prefix which is also a Suffix (LPS) array in $O(m)$ time and executes non-backtracking pattern matching in $O(n)$ time per document. The project features an authoritative Java DSA implementation, accompanied by a comprehensive web dashboard with step-by-step algorithmic visualization, document inspection, and multi-format result exports.

---

## Problem Statement
University placement coordinators and alumni networks frequently need to search across collections of alumni records for candidates with specific proficiencies (e.g., `"Machine Learning"`, `"Python"`, `"Spring Boot"`, `"Cloud Architecture"`). Conventional naive pattern matching re-evaluates characters in the target text upon mismatch, causing unnecessary processor overhead. An optimized pattern-matching system using the KMP algorithm enables deterministic, linear-time search across the entire corpus.

---

## Objectives
1. Implement the Knuth-Morris-Pratt (KMP) algorithm from first principles without relying on high-level language search abstractions (`indexOf`, regexes, or database queries).
2. Construct and verify the Longest Proper Prefix which is also a Suffix (LPS) array for any arbitrary user pattern.
3. Handle overlapping occurrences (e.g., `ana` in `banana`) and multi-word query strings correctly.
4. Index and query a verified corpus of 100 structured text records in the `data/` directory.
5. Provide empirical complexity and comparison analysis against naive pattern matching.
6. Provide an interactive educational visualizer tracking text pointer $i$, pattern pointer $j$, and LPS fallback shifts.

---

## Algorithm Explanation

### LPS Array Preprocessing
The LPS (Longest Proper Prefix Suffix) array stores the length of the longest prefix of `pattern[0...i]` that is also a proper suffix of `pattern[0...i]`.

For example, given the pattern `ABABC`:
- Substrings:
  - `A`: LPS = `0`
  - `AB`: LPS = `0`
  - `ABA`: LPS = `1` (prefix `A` == suffix `A`)
  - `ABAB`: LPS = `2` (prefix `AB` == suffix `AB`)
  - `ABABC`: LPS = `0`
- **Computed LPS**: `[0, 0, 1, 2, 0]`

### Non-Backtracking Search
While naive search resets the text index $i$ on mismatch, KMP keeps $i$ moving strictly forward. When character mismatch occurs at $P[j] \neq T[i]$:
- If $j > 0$: $j$ falls back to $LPS[j - 1]$. Text index $i$ remains unchanged.
- If $j == 0$: $i$ advances by 1.
- Upon a full match ($j == m$): the match index $(i - j)$ is recorded, and $j$ transitions to $LPS[j - 1]$ to detect overlapping occurrences.

---

## Complexity Analysis

| Operation | Naive String Matching | KMP Algorithm |
| :--- | :--- | :--- |
| **Preprocessing Time** | $O(1)$ | $O(m)$ |
| **Single Document Search** | $O(n \times m)$ worst-case | $O(n + m)$ |
| **Corpus Search ($D$ docs, $N$ chars)** | $O(D \times n \times m)$ | $O(N + D \times m)$ |
| **Auxiliary Memory Space** | $O(1)$ | $O(m)$ (LPS array) |

*Where $m$ = pattern length, $n$ = average document length, $D$ = number of documents (100), $N$ = total characters in corpus.*

---

## Repository Folder Structure

```
AlumniConnect/
├── README.md                          # Academic documentation & execution manual
├── src/
│   ├── AlumniConnect.java             # Authoritative Java DSA implementation & CLI
│   ├── App.tsx                        # Web demonstration application
│   ├── main.tsx                       # React application bootstrap
│   ├── index.css                      # Tailwind design system configuration
│   ├── kmp/                           # Dedicated KMP algorithmic module in TypeScript
│   │   ├── kmpAlgorithm.ts            # KMP engine matching Java specification
│   │   ├── corpusService.ts           # Corpus loading, indexing, and statistics
│   │   └── types.ts                   # Types and interfaces
│   └── components/                    # Modular UI components
│       ├── Dashboard.tsx              # Primary search and summary KPI view
│       ├── ResultsTable.tsx           # Matching records table & inline snippets
│       ├── DocumentViewer.tsx         # Full raw document inspector with highlighted matches
│       ├── CorpusExplorer.tsx         # 100-file corpus catalog viewer
│       ├── KmpVisualizer.tsx          # Interactive step-by-step pointer visualizer
│       ├── ComplexityComparison.tsx   # Naive vs KMP comparison & complexity dashboard
│       ├── SearchHistoryView.tsx      # Query history and re-run management
│       └── ProjectInfo.tsx            # Academic metadata, syllabus, and team details
├── data/                              # Mandatory 100 individual text documents
│   ├── alumni001.txt
│   ├── alumni002.txt
│   ├── ...
│   └── alumni100.txt
├── docs/                              # Project documentation
│   ├── project_overview.md
│   ├── algorithm.md
│   └── screenshots/
│       └── README.md
├── results/                           # Generated search reports
│   └── sample_search_results.txt
├── reports/                           # Academic phase milestone reports
│   └── phase_report.md
├── package.json
└── tsconfig.json
```

---

## Setup & Execution Instructions

### A. Running the Authoritative Java Implementation
Requirements: Java Development Kit (JDK 17 or higher).

1. Open a terminal in the project root directory:
   ```bash
   cd AlumniConnect
   ```
2. Compile the Java source file:
   ```bash
   javac -d bin src/AlumniConnect.java
   ```
3. Run with default self-tests and sample query:
   ```bash
   java -ea -cp bin AlumniConnect "Java"
   ```
4. Query custom multi-word patterns:
   ```bash
   java -ea -cp bin AlumniConnect "Machine Learning"
   ```
5. Check generated report in `results/`:
   ```bash
   cat results/machine_learning_search_results.txt
   ```

### B. Running the Web Application
Requirements: Node.js (v18+) and npm.

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:3000`.

---

## Sample Search & Output Format

### Input
- **Search Pattern**: `"Machine Learning"`
- **Options**: Case-insensitive, Whole-word off

### Output Format (Console / Report)
```
================================================================================
ALUMNI CONNECT — KMP PATTERN SEARCH SYSTEM
Academic Evaluation Report & DSA Demonstration
================================================================================
Execution Timestamp : 2026-10-11 05:52:30
Algorithm           : Knuth-Morris-Pratt (KMP) String Matching
Search Pattern      : "Machine Learning"
Pattern Length      : 16 characters
Case Sensitive      : false
Whole Word Match    : false
Computed LPS Array  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Documents Searched  : 100
Documents Matched   : 28
Total Occurrences   : 84
Execution Time      : 2.115 ms
--------------------------------------------------------------------------------
MATCHING DOCUMENTS SUMMARY:
--------------------------------------------------------------------------------
File: alumni001.txt  | ID: A001  | Name: Rahul Sharma           | Matches:  3 | Year: 2018 | Positions: [26, 178, 384]
  Preview: ...Skills: Python, Machine Learning, TensorFlow, PyTorch...
...
```

---

## Verification & Testing Suite
The implementation includes automated unit tests verifying:
- **LPS Construction**: Pattern `ABABC` -> `[0, 0, 1, 2, 0]`.
- **Overlapping Matches**: Pattern `ana` in `banana` -> indices `[1, 3]`.
- **Repeating Substrings**: Pattern `AA` in `AAAA` -> indices `[0, 1, 2]`.
- **Case Invariance**: `java` matching `Java` and `JAVA`.
- **Non-existent Patterns**: Zero matches, zero index errors.
- **Corpus Integrity**: Verification that all 100 documents exist and are readable.

---

## Current Status & Known Limitations
- **Current Status**: All 100 documents generated and verified; Java KMP engine and TypeScript interactive visualizer verified; search, export, and document inspection operational.
- **Limitations**: Searches are exact string pattern matches; phonetic matching (Soundex) or fuzzy Levenshtein distance searches are outside current KMP scope.
- **Future Enhancements**: Multi-pattern Aho-Corasick automaton for batch dictionary queries; PDF and OCR document ingestion.
