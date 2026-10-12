/**
 * Alumni Connect — KMP Pattern Search System
 * Authoritative Data Structures and Algorithms (DSA) Implementation in Java
 * 
 * Features:
 * - Knuth-Morris-Pratt (KMP) exact string pattern matching
 * - Longest Proper Prefix which is also Suffix (LPS) array computation
 * - Overlapping pattern occurrence detection
 * - Batch search across 100 structured text documents in 'data/' directory
 * - Result reporting and export to 'results/' directory
 * - Automated self-test suite for academic validation
 */

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class AlumniConnect {

    // Represents a single document search match result
    public static class DocumentMatch {
        public String filename;
        public String alumniId;
        public String name;
        public String department;
        public int graduationYear;
        public String role;
        public String company;
        public int occurrenceCount;
        public List<Integer> matchPositions;
        public String previewSnippet;

        public DocumentMatch(String filename) {
            this.filename = filename;
            this.matchPositions = new ArrayList<>();
        }
    }

    // Comprehensive search outcome container
    public static class SearchResult {
        public String pattern;
        public boolean caseSensitive;
        public boolean wholeWord;
        public int[] lpsArray;
        public int totalDocumentsSearched;
        public int totalMatchingDocuments;
        public int totalOccurrences;
        public long executionTimeNanos;
        public List<DocumentMatch> matches = new ArrayList<>();
    }

    /**
     * Constructs the Longest Proper Prefix which is also a Suffix (LPS) array.
     * Time Complexity: O(m) where m = pattern.length()
     * Space Complexity: O(m)
     *
     * Example:
     * Pattern: "ABABC" -> LPS: [0, 0, 1, 2, 0]
     */
    public static int[] computeLPSArray(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        if (m == 0) return lps;

        lps[0] = 0; // lps[0] is always 0
        int len = 0; // length of the previous longest prefix suffix
        int i = 1;

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = lps[len - 1]; // fallback to previous longest match
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    /**
     * Executes the Knuth-Morris-Pratt (KMP) string matching algorithm.
     * Returns a list of starting indices (0-based) of all occurrences.
     * Correctly handles overlapping occurrences (e.g., 'ana' in 'banana' at [1, 3]).
     *
     * Time Complexity: O(n) where n = text.length()
     * Space Complexity: O(1) auxiliary (excluding LPS array of size m)
     */
    public static List<Integer> searchKMP(String text, String pattern, boolean caseSensitive, boolean wholeWord) {
        List<Integer> occurrences = new ArrayList<>();
        if (text == null || pattern == null || pattern.isEmpty() || text.length() < pattern.length()) {
            return occurrences;
        }

        String searchTarget = caseSensitive ? text : text.toLowerCase();
        String searchPattern = caseSensitive ? pattern : pattern.toLowerCase();

        int[] lps = computeLPSArray(searchPattern);
        int n = searchTarget.length();
        int m = searchPattern.length();

        int i = 0; // index for searchTarget (text)
        int j = 0; // index for searchPattern

        while (i < n) {
            if (searchPattern.charAt(j) == searchTarget.charAt(i)) {
                i++;
                j++;
            }

            if (j == m) {
                // Occurrence found at starting index: (i - j)
                int matchIndex = i - j;

                if (wholeWord) {
                    boolean startBoundary = (matchIndex == 0) || !Character.isLetterOrDigit(searchTarget.charAt(matchIndex - 1));
                    boolean endBoundary = (i == n) || !Character.isLetterOrDigit(searchTarget.charAt(i));
                    if (startBoundary && endBoundary) {
                        occurrences.add(matchIndex);
                    }
                } else {
                    occurrences.add(matchIndex);
                }

                // In KMP, after match, pattern falls back to lps[j - 1] to continue finding overlapping matches
                j = lps[j - 1];
            } else if (i < n && searchPattern.charAt(j) != searchTarget.charAt(i)) {
                // Mismatch after j matches
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    i++;
                }
            }
        }

        return occurrences;
    }

    /**
     * Searches all text documents in the target directory for the given pattern.
     */
    public static SearchResult searchCorpus(File dataDir, String pattern, boolean caseSensitive, boolean wholeWord) {
        SearchResult result = new SearchResult();
        result.pattern = pattern;
        result.caseSensitive = caseSensitive;
        result.wholeWord = wholeWord;
        result.lpsArray = computeLPSArray(caseSensitive ? pattern : pattern.toLowerCase());

        long startTime = System.nanoTime();

        File[] files = dataDir.listFiles((dir, name) -> name.endsWith(".txt"));
        if (files == null) {
            files = new File[0];
        }

        Arrays.sort(files, Comparator.comparing(File::getName));
        result.totalDocumentsSearched = files.length;

        for (File file : files) {
            try {
                String content = Files.readString(file.toPath());
                List<Integer> matches = searchKMP(content, pattern, caseSensitive, wholeWord);

                if (!matches.isEmpty()) {
                    DocumentMatch docMatch = new DocumentMatch(file.getName());
                    docMatch.matchPositions = matches;
                    docMatch.occurrenceCount = matches.size();
                    result.totalOccurrences += matches.size();

                    // Parse metadata
                    parseDocumentMetadata(content, docMatch);

                    // Create snippet around first match
                    int firstPos = matches.get(0);
                    int start = Math.max(0, firstPos - 40);
                    int end = Math.min(content.length(), firstPos + pattern.length() + 60);
                    docMatch.previewSnippet = (start > 0 ? "..." : "") + content.substring(start, end).replace("\n", " ").trim() + (end < content.length() ? "..." : "");

                    result.matches.add(docMatch);
                }
            } catch (IOException e) {
                System.err.println("Error reading " + file.getName() + ": " + e.getMessage());
            }
        }

        long endTime = System.nanoTime();
        result.executionTimeNanos = (endTime - startTime);
        result.totalMatchingDocuments = result.matches.size();

        return result;
    }

    private static void parseDocumentMetadata(String content, DocumentMatch docMatch) {
        for (String line : content.split("\n")) {
            line = line.trim();
            if (line.startsWith("Alumni ID:")) {
                docMatch.alumniId = line.substring("Alumni ID:".length()).trim();
            } else if (line.startsWith("Name:")) {
                docMatch.name = line.substring("Name:".length()).trim();
            } else if (line.startsWith("Department:")) {
                docMatch.department = line.substring("Department:".length()).trim();
            } else if (line.startsWith("Graduation Year:")) {
                try {
                    docMatch.graduationYear = Integer.parseInt(line.substring("Graduation Year:".length()).trim());
                } catch (NumberFormatException ignored) {}
            } else if (line.startsWith("Current Role:")) {
                docMatch.role = line.substring("Current Role:".length()).trim();
            } else if (line.startsWith("Company:")) {
                docMatch.company = line.substring("Company:".length()).trim();
            }
        }
    }

    /**
     * Saves the search results to a file in the results/ directory.
     */
    public static File exportResultsToFile(SearchResult result, File resultsDir) throws IOException {
        if (!resultsDir.exists()) {
            resultsDir.mkdirs();
        }

        String sanitizedPattern = result.pattern.replaceAll("[^a-zA-Z0-9_-]", "_").toLowerCase();
        if (sanitizedPattern.isEmpty()) sanitizedPattern = "query";
        String filename = sanitizedPattern + "_search_results.txt";
        File targetFile = new File(resultsDir, filename);

        StringBuilder sb = new StringBuilder();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        sb.append("================================================================================\n");
        sb.append("ALUMNI CONNECT — KMP PATTERN SEARCH SYSTEM\n");
        sb.append("Academic Evaluation Report & DSA Demonstration\n");
        sb.append("================================================================================\n");
        sb.append("Execution Timestamp : ").append(LocalDateTime.now().format(dtf)).append("\n");
        sb.append("Algorithm           : Knuth-Morris-Pratt (KMP) String Matching\n");
        sb.append("Search Pattern      : \"").append(result.pattern).append("\"\n");
        sb.append("Pattern Length      : ").append(result.pattern.length()).append(" characters\n");
        sb.append("Case Sensitive      : ").append(result.caseSensitive).append("\n");
        sb.append("Whole Word Match    : ").append(result.wholeWord).append("\n");
        sb.append("Computed LPS Array  : ").append(Arrays.toString(result.lpsArray)).append("\n");
        sb.append("Documents Searched  : ").append(result.totalDocumentsSearched).append("\n");
        sb.append("Documents Matched   : ").append(result.totalMatchingDocuments).append("\n");
        sb.append("Total Occurrences   : ").append(result.totalOccurrences).append("\n");
        sb.append(String.format("Execution Time      : %.3f ms\n", result.executionTimeNanos / 1_000_000.0));
        sb.append("--------------------------------------------------------------------------------\n");
        sb.append("MATCHING DOCUMENTS SUMMARY:\n");
        sb.append("--------------------------------------------------------------------------------\n");

        if (result.matches.isEmpty()) {
            sb.append("No matches found across the corpus.\n");
        } else {
            for (DocumentMatch m : result.matches) {
                sb.append(String.format("File: %-14s | ID: %-5s | Name: %-22s | Matches: %2d | Year: %d | Positions: %s\n",
                        m.filename,
                        (m.alumniId != null ? m.alumniId : "N/A"),
                        (m.name != null ? m.name : "N/A"),
                        m.occurrenceCount,
                        m.graduationYear,
                        m.matchPositions.toString()));
                sb.append("  Preview: ").append(m.previewSnippet).append("\n\n");
            }
        }

        sb.append("================================================================================\n");
        sb.append("Complexity Analysis:\n");
        sb.append("- LPS Construction: O(m)\n");
        sb.append("- Single Document Search: O(n + m)\n");
        sb.append("- Multi-Document Corpus Search: O(N + D * m)\n");
        sb.append("  Where N = total corpus characters, D = number of documents, m = pattern length.\n");
        sb.append("================================================================================\n");

        Files.writeString(targetFile.toPath(), sb.toString());
        return targetFile;
    }

    /**
     * Automated verification tests for faculty demonstration & CI/CD.
     */
    public static void runSelfTests() {
        System.out.println("Running KMP Verification Test Suite...");

        // Test 1: Standard LPS Array calculation
        int[] lps1 = computeLPSArray("ABABC");
        assert Arrays.equals(lps1, new int[]{0, 0, 1, 2, 0}) : "LPS calculation failed for ABABC";
        System.out.println("✓ Test 1 Passed: LPS Array for ABABC -> " + Arrays.toString(lps1));

        // Test 2: Overlapping occurrence detection ('ana' in 'banana')
        List<Integer> matches1 = searchKMP("banana", "ana", true, false);
        assert matches1.size() == 2 && matches1.get(0) == 1 && matches1.get(1) == 3 : "Overlapping search failed for 'ana' in 'banana'";
        System.out.println("✓ Test 2 Passed: Overlapping match 'ana' in 'banana' -> indices " + matches1);

        // Test 3: Repeating characters ('AA' in 'AAAA')
        List<Integer> matches2 = searchKMP("AAAA", "AA", true, false);
        assert matches2.size() == 3 : "Overlapping search failed for 'AA' in 'AAAA'";
        System.out.println("✓ Test 3 Passed: Repeating 'AA' in 'AAAA' -> indices " + matches2);

        // Test 4: Case insensitive matching
        List<Integer> matches3 = searchKMP("Java and JAVA", "java", false, false);
        assert matches3.size() == 2 : "Case-insensitive test failed";
        System.out.println("✓ Test 4 Passed: Case insensitive 'java' in 'Java and JAVA' -> " + matches3.size() + " matches");

        // Test 5: Pattern not found
        List<Integer> matches4 = searchKMP("Machine Learning and AI", "Quantum", false, false);
        assert matches4.isEmpty() : "Unmatched pattern test failed";
        System.out.println("✓ Test 5 Passed: Non-existent pattern handled cleanly -> " + matches4.size() + " matches");

        System.out.println("All automated tests completed successfully!\n");
    }

    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("  ALUMNI CONNECT — KMP PATTERN SEARCH SYSTEM (JAVA CORE)");
        System.out.println("============================================================");

        runSelfTests();

        File dataDir = new File("data");
        File resultsDir = new File("results");

        if (!dataDir.exists() || !dataDir.isDirectory()) {
            System.err.println("Warning: 'data' directory not found at " + dataDir.getAbsolutePath());
            return;
        }

        String testPattern = args.length > 0 ? args[0] : "Java";
        System.out.println("Executing corpus search for pattern: \"" + testPattern + "\"");

        SearchResult result = searchCorpus(dataDir, testPattern, false, false);

        System.out.println("Corpus documents searched : " + result.totalDocumentsSearched);
        System.out.println("Matching documents found  : " + result.totalMatchingDocuments);
        System.out.println("Total pattern occurrences : " + result.totalOccurrences);
        System.out.printf("Search execution time     : %.3f ms\n", result.executionTimeNanos / 1_000_000.0);

        try {
            File exportedFile = exportResultsToFile(result, resultsDir);
            System.out.println("Search results saved to   : " + exportedFile.getPath());
        } catch (IOException e) {
            System.err.println("Could not export results: " + e.getMessage());
        }
    }
}
