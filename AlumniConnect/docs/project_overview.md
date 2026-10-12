# Project Overview: Alumni Connect

## 1. Project Title
**Alumni Connect — Intelligent Alumni Document Search Using the Knuth-Morris-Pratt (KMP) Algorithm**

## 2. Problem Statement
Searching through large collections of unstructured and semi-structured academic and alumni records for specific technical competencies, domain experience, and skill sets using standard linear search or naive substring comparison suffers from redundant character comparisons and non-deterministic overhead ($O(n \times m)$ worst-case time complexity per document).

In university placement offices, alumni relations departments, and institutional research centers, locating candidates who match niche skills (e.g., "Machine Learning", "Distributed Systems", "Cloud Architecture") across hundreds or thousands of textual profiles requires an efficient, deterministic, linear-time pattern search algorithm.

## 3. Objectives
1. **Academic Rigor**: Implement and evaluate the Knuth-Morris-Pratt (KMP) string pattern matching algorithm without resorting to standard high-level language built-ins (`String.indexOf`, regexes, or database LIKE operators).
2. **Deterministic Linear Complexity**: Achieve $O(m)$ pattern preprocessing time via Longest Proper Prefix which is also a Suffix (LPS) table construction, and $O(n)$ search time per document, yielding $O(N + D \times m)$ across the entire corpus.
3. **Realistic Corpus Scale**: Evaluate against 100 structured text documents (`alumni001.txt` through `alumni100.txt`) containing diverse skills, departments, graduation years, roles, and project chronicles.
4. **Interactive Demonstration**: Provide an interactive visualizer of the LPS array and pointer movements ($i$ for text, $j$ for pattern) to facilitate faculty review and educational demonstrations.
5. **Auditable Artifacts**: Support search reporting, export to `results/`, and performance comparison against naive string search.

## 4. Proposed Workflow
1. **Corpus Discovery**: System loads and validates the 100 text files in `data/`.
2. **Preprocessing**: User enters a query pattern. The system constructs the LPS array using the mathematical prefix function.
3. **Pattern Matching**: KMP scans each document linearly, advancing the text pointer $i$ monotonically without backtracking. When mismatches occur, the pattern pointer $j$ falls back to `LPS[j - 1]`.
4. **Aggregation**: Matching document IDs, alumni names, occurrence counts, starting character indices, and highlighted snippets are captured.
5. **Reporting**: Results are presented in an academic SaaS dashboard with sorting, filtering, document inspection, and file export options (TXT, CSV, JSON).

## 5. Corpus Description
The corpus comprises 100 plain-text files stored in `data/`:
- **Naming format**: `alumni001.txt` to `alumni100.txt`
- **Fields**: Alumni ID, Full Name, Department, Graduation Year, Current Role, Company, Technical Skills, Key Projects, and Professional Experience.
- **Synthetics**: Realistic synthetic student/alumni records generated for educational research.
