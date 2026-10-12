# The Knuth-Morris-Pratt (KMP) Algorithm: Theoretical & Practical Analysis

## 1. Introduction
The Knuth-Morris-Pratt (KMP) algorithm (Knuth, Morris, Pratt, 1977) solves the exact pattern matching problem in linear time. Given a text string $T$ of length $n$ and a pattern $P$ of length $m$, KMP finds all occurrences of $P$ in $T$ in $O(n + m)$ time.

### Why Naive String Matching is Inefficient
In a naive string search, when a mismatch occurs after matching $j$ characters, the text pointer $i$ is reset backwards to $(i - j + 1)$, and the pattern pointer $j$ is reset to $0$. In pathological cases (such as searching for $P = \text{"AAAA"}$ in $T = \text{"AAAAAAAAAAAA"}$), the naive algorithm executes $(n - m + 1) \times m$ comparisons, exhibiting $O(n \times m)$ time complexity.

KMP eliminates text pointer backtracking. The text pointer $i$ moves monotonically forward from $0$ to $n-1$. When a mismatch occurs at $P[j] \neq T[i]$, KMP uses precomputed prefix knowledge to shift the pattern to the next valid alignment without re-examining previously matched text characters.

---

## 2. The Longest Proper Prefix which is also Suffix (LPS) Array

### Definition
For a pattern $P$ of length $m$, the LPS array $\pi$ (or `lps[]`) of size $m$ is defined such that:
$$LPS[k] = \max \{ \ell \mid \ell < k + 1 \text{ and } P[0 \dots \ell-1] = P[k-\ell+1 \dots k] \}$$

In plain terms, $LPS[k]$ stores the length of the longest proper prefix of the subpattern $P[0 \dots k]$ that is also a suffix of $P[0 \dots k]$.

### Worked Example: $P = \text{"ABABC"}$
- Index 0: `P[0] = 'A'` -> proper prefix/suffix = $\emptyset$ -> $LPS[0] = 0$
- Index 1: `P[0..1] = "AB"` -> prefixes: `{"A"}`; suffixes: `{"B"}` -> $LPS[1] = 0$
- Index 2: `P[0..2] = "ABA"` -> prefixes: `{"A", "AB"}`; suffixes: `{"A", "BA"}` -> match: `"A"` (len 1) -> $LPS[2] = 1$
- Index 3: `P[0..3] = "ABAB"` -> prefixes: `{"A", "AB", "ABA"}`; suffixes: `{"B", "AB", "BAB"}` -> match: `"AB"` (len 2) -> $LPS[3] = 2$
- Index 4: `P[0..4] = "ABABC"` -> no matching prefix/suffix -> $LPS[4] = 0$

Resulting LPS Table:
```
Index:    0   1   2   3   4
Char:     A   B   A   B   C
LPS:      0   0   1   2   0
```

---

## 3. LPS Construction Pseudocode

```
Algorithm Compute-LPS(P, m):
    lps[0] = 0
    len = 0
    i = 1
    
    while i < m:
        if P[i] == P[len]:
            len = len + 1
            lps[i] = len
            i = i + 1
        else:
            if len != 0:
                len = lps[len - 1]
            else:
                lps[i] = 0
                i = i + 1
    return lps
```

**Complexity of Preprocessing**: Each iteration either increments `i` or decreases `len` by at least 1. Since `len` cannot be reduced below 0, the total number of operations is bounded by $2m$. Thus, preprocessing requires $O(m)$ time and $O(m)$ auxiliary space.

---

## 4. KMP Search Algorithm

```
Algorithm KMP-Search(T, P):
    n = length(T)
    m = length(P)
    lps = Compute-LPS(P, m)
    
    i = 0  // pointer in T
    j = 0  // pointer in P
    occurrences = []
    
    while i < n:
        if P[j] == T[i]:
            i = i + 1
            j = j + 1
            
        if j == m:
            occurrences.append(i - j)
            j = lps[j - 1]   // shift pattern to find overlapping occurrences
        else if i < n and P[j] != T[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i = i + 1
                
    return occurrences
```

---

## 5. Overlapping Occurrences Handling
A critical test of correct KMP implementation is overlapping match preservation:
- Searching for pattern `ana` in text `banana`:
  - `i = 0`: 'b' != 'a' -> mismatch
  - `i = 1..3`: `T[1..3] = "ana"`, match at index `1`.
  - Next match alignment: $j$ resets to $LPS[3 - 1] = LPS[2] = 1$ (character `'a'`).
  - `i = 4`: 'n' == $P[1]$, `i = 5`: 'a' == $P[2]$. Match found at index `3` (`T[3..5] = "ana"`).
  - Total matches: **2** at indices $[1, 3]$.

---

## 6. Multi-Document Corpus Complexity
When querying across $D$ documents where document $d$ has length $n_d$:
- Pattern preprocessing: $O(m)$
- Document searches: $\sum_{d=1}^{D} O(n_d) = O(N)$ where $N = \sum n_d$ is the total corpus character count.
- **Overall Corpus Time Complexity**:
$$T_{\text{corpus}} = O(N + D \times m)$$
- **Auxiliary Space Complexity**:
$$S_{\text{auxiliary}} = O(m)$$
for the single reusable LPS table across all $D$ documents.
