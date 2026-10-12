import React from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  FolderGit2, 
  Terminal,
  FileText
} from 'lucide-react';

export const ProjectInfo: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-12 pb-20">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[#E8E6E0] pb-6">
        <div className="text-[11px] font-mono tracking-widest text-[#777873] uppercase">
          Academic Dossier / CS-301
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522] tracking-tight">
          Project information
        </h1>
        <p className="text-sm text-[#777873] leading-relaxed max-w-xl">
          Alumni Connect: Intelligent Alumni Document Search Using the Knuth-Morris-Pratt (KMP) Algorithm.
        </p>
      </div>

      {/* Team & Supervision */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-normal text-[#242522]">
          Supervision & team
        </h2>

        <div className="border border-[#E8E6E0] bg-white rounded-md divide-y divide-[#E8E6E0] text-xs">
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Course & Dept</span>
            <span className="text-[#242522] font-medium sm:text-right">
              CS-301 Data Structures and Algorithms · Computer Science & Engineering
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Supervisor</span>
            <span className="text-[#242522] font-medium sm:text-right">
              Prof. [Supervisor Name / Faculty Advisor]
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Student 1</span>
            <span className="text-[#242522] font-medium sm:text-right">
              [Student Name 1] · ID: [Student ID / Roll No 1]
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Student 2</span>
            <span className="text-[#242522] font-medium sm:text-right">
              [Student Name 2] · ID: [Student ID / Roll No 2]
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Student 3</span>
            <span className="text-[#242522] font-medium sm:text-right">
              [Student Name 3] · ID: [Student ID / Roll No 3]
            </span>
          </div>

          <div className="p-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-[#777873] font-mono text-[11px] uppercase">Project Phase</span>
            <span className="text-[#315C46] font-medium sm:text-right">
              Phase 2: Demonstration & Evaluation
            </span>
          </div>
        </div>
      </section>

      {/* Problem Statement & Objectives */}
      <section className="space-y-4 border-t border-[#E8E6E0] pt-8 text-sm text-[#242522]/90 leading-relaxed">
        <h2 className="font-serif text-xl font-normal text-[#242522]">
          Problem statement & objectives
        </h2>
        <p>
          Searching a collection of alumni-related text documents manually for specific skills or phrases is time-consuming. This project demonstrates how the Knuth-Morris-Pratt (KMP) exact string matching algorithm can locate patterns across a 100-document text corpus without redundant character comparisons.
        </p>
        <p>
          The authoritative algorithm is written in Java (<span className="font-mono text-xs text-[#315C46]">src/AlumniConnect.java</span>), reading the 100 raw documents in <span className="font-mono text-xs">data/</span> and exporting search reports to <span className="font-mono text-xs">results/</span>.
        </p>
      </section>

      {/* Repository Architecture */}
      <section className="space-y-4 border-t border-[#E8E6E0] pt-8">
        <h2 className="font-serif text-xl font-normal text-[#242522]">
          Repository structure
        </h2>
        <div className="p-4 bg-[#FAF9F6] border border-[#E8E6E0] rounded-md font-mono text-xs text-[#242522] overflow-x-auto leading-relaxed">
{`AlumniConnect/
├── README.md                          # Academic documentation & manual
├── src/
│   ├── AlumniConnect.java             # Authoritative Java DSA implementation
│   ├── App.tsx                        # Web demonstration application
│   └── kmp/                           # Algorithmic engine & corpus dataset
├── data/                              # 100 individual text documents
│   ├── alumni001.txt ... alumni100.txt
├── docs/                              # Project documentation
│   ├── project_overview.md
│   ├── algorithm.md
│   └── screenshots/README.md
├── results/                           # Generated search reports
│   └── sample_search_results.txt
└── reports/                           # Milestone phase reports
    └── phase_report.md`}
        </div>
      </section>

      {/* Execution commands */}
      <section className="space-y-4 border-t border-[#E8E6E0] pt-8 text-xs font-mono">
        <h2 className="font-serif text-xl font-normal text-[#242522] font-sans">
          Execution instructions
        </h2>
        <div className="space-y-3">
          <div>
            <div className="text-[#777873] mb-1 font-sans">Authoritative Java CLI:</div>
            <div className="p-3 bg-white border border-[#E8E6E0] rounded text-[#315C46]">
              javac -d bin src/AlumniConnect.java<br/>
              java -ea -cp bin AlumniConnect "Machine Learning"
            </div>
          </div>
          <div>
            <div className="text-[#777873] mb-1 font-sans">Web demonstration:</div>
            <div className="p-3 bg-white border border-[#E8E6E0] rounded text-[#315C46]">
              npm install<br/>
              npm run dev
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
