import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  BookOpen, 
  Sparkles, 
  X,
  AlertCircle 
} from 'lucide-react';
import { StudentProfile, StudentProfileVisibility } from '../../auth/types';
import { saveUser } from '../../auth/authService';

interface StudentOnboardingProps {
  onComplete: (profile: StudentProfile) => void;
  onCancel: () => void;
}

const DEGREES = [
  'B.Tech / B.E.',
  'B.Sc.',
  'BCA',
  'B.Com.',
  'BBA',
  'M.Tech / M.E.',
  'MCA',
  'M.Sc.',
  'MBA',
  'Other'
];

const STUDY_YEARS = [
  'First year',
  'Second year',
  'Third year',
  'Fourth year',
  'Postgraduate',
  'Other'
];

const INTERESTS_LIST = [
  'Software Development',
  'Web Development',
  'App Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Competitive Programming',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Product Management',
  'Entrepreneurship',
  'Career Planning',
  'Higher Studies',
  'Interview Preparation'
];

const SKILL_DIRECTORY = [
  'Java',
  'Python',
  'C++',
  'JavaScript',
  'React',
  'Node.js',
  'SQL',
  'Data Structures and Algorithms',
  'Machine Learning',
  'HTML/CSS',
  'Git'
];

const HELP_OPTIONS = [
  'Choosing a career path',
  'Learning technical skills',
  'Preparing for interviews',
  'Finding internships',
  'Resume improvement',
  'Building projects',
  'Understanding industry expectations',
  'Exploring higher studies',
  'Finding a mentor',
  'General networking'
];

export const StudentOnboarding: React.FC<StudentOnboardingProps> = ({
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Basic
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('University Institute of Engineering & Technology');

  // Step 2: Education
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('Third year');
  const [expectedGraduationYear, setExpectedGraduationYear] = useState<number>(2026);

  // Step 3: Interests & Skills
  const [interests, setInterests] = useState<string[]>([
    'Software Development',
    'Machine Learning',
    'Interview Preparation'
  ]);
  const [currentSkills, setCurrentSkills] = useState<string[]>(['Java', 'SQL']);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(['Python', 'Machine Learning']);
  const [customInterest, setCustomInterest] = useState('');

  // Step 4: Help Needed
  const [helpNeeded, setHelpNeeded] = useState<string[]>([
    'Preparing for interviews',
    'Finding internships',
    'Building projects'
  ]);

  // Step 5: Completion & Visibility
  const [bio, setBio] = useState('Undergraduate student looking to learn from experienced alumni and prepare for upcoming campus recruitment.');
  const [visibility, setVisibility] = useState<StudentProfileVisibility>({
    academic: true,
    skills: true,
    interests: true,
    goals: true,
    contact: false // Private by default
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (): boolean => {
    const err: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) err.name = 'Full name is required.';
      if (!email.trim()) err.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Valid email format required.';
    } else if (step === 2) {
      if (!department.trim()) err.department = 'Department / Branch is required.';
    } else if (step === 3) {
      if (interests.length === 0) err.interests = 'Please select at least one learning interest.';
    } else if (step === 4) {
      if (helpNeeded.length === 0) err.helpNeeded = 'Please select at least one area where alumni guidance would help.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmitFinal();
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      onCancel();
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleCurrentSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setCurrentSkills(currentSkills.filter(s => s !== skill));
    } else {
      setCurrentSkills([...currentSkills, skill]);
    }
  };

  const toggleSkillToLearn = (skill: string) => {
    if (skillsToLearn.includes(skill)) {
      setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
    } else {
      setSkillsToLearn([...skillsToLearn, skill]);
    }
  };

  const toggleHelpOption = (opt: string) => {
    if (helpNeeded.includes(opt)) {
      setHelpNeeded(helpNeeded.filter(h => h !== opt));
    } else {
      setHelpNeeded([...helpNeeded, opt]);
    }
  };

  const handleSubmitFinal = () => {
    const profile: StudentProfile = {
      userId: `usr_student_${Date.now()}`,
      role: 'STUDENT',
      name: name.trim(),
      email: email.trim(),
      university: university.trim(),
      degree,
      department: department.trim(),
      yearOfStudy,
      expectedGraduationYear,
      interests,
      currentSkills,
      skillsToLearn,
      helpNeeded,
      bio: bio.trim(),
      visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveUser(profile);
    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      
      {/* Step Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#777873]">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 hover:text-[#242522] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          <span className="font-mono text-[11px]">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E8E6E0] h-1 rounded-full overflow-hidden">
          <div 
            className="bg-[#315C46] h-full transition-all duration-200" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="pt-2">
          <span className="text-[10px] font-mono tracking-widest text-[#777873] uppercase block">
            Student Onboarding
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
            Let's find the right people to learn from.
          </h1>
          <p className="text-xs text-[#777873]">
            Tell us what you're studying and what you'd like to explore.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#E8E6E0] rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Full Name <span className="text-[#9E3B3B]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ananya Iyer"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              {errors.name && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Email Address <span className="text-[#9E3B3B]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., ananya.iyer@student.edu"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              {errors.email && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Password <span className="text-[#777873] font-normal">(optional for demo)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password..."
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                College / University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Current Degree
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                >
                  {DEGREES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Current Year of Study
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                >
                  {STUDY_YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Department / Branch <span className="text-[#9E3B3B]">*</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Information Technology, Computer Science"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              {errors.department && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Expected Graduation Year
              </label>
              <select
                value={expectedGraduationYear}
                onChange={(e) => setExpectedGraduationYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Skills */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                What are you interested in learning? <span className="text-[#9E3B3B]">*</span>
              </label>
              {errors.interests && <p className="text-[11px] text-[#9E3B3B] mb-2">{errors.interests}</p>}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {INTERESTS_LIST.map((int) => {
                  const isSelected = interests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => toggleInterest(int)}
                      className={`text-xs px-2.5 py-1 rounded border transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#EBF1EE] border-[#315C46] text-[#315C46] font-medium'
                          : 'bg-[#F8F7F4] border-[#E8E6E0] text-[#242522] hover:bg-white'
                      }`}
                    >
                      {isSelected ? `✓ ${int}` : `+ ${int}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear distinction: Skills I have vs Skills I want to learn */}
            <div className="space-y-4 pt-4 border-t border-[#E8E6E0]">
              <div>
                <span className="text-xs font-medium text-[#242522] block mb-1">
                  Skills I currently have:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_DIRECTORY.map((sk) => {
                    const isSelected = currentSkills.includes(sk);
                    return (
                      <button
                        key={`have-${sk}`}
                        type="button"
                        onClick={() => toggleCurrentSkill(sk)}
                        className={`text-xs px-2 py-0.5 rounded font-mono border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#315C46] text-white border-[#315C46]'
                            : 'bg-white border-[#E8E6E0] text-[#777873] hover:text-[#242522]'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-[#242522] block mb-1">
                  Skills I want to learn / improve:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_DIRECTORY.map((sk) => {
                    const isSelected = skillsToLearn.includes(sk);
                    return (
                      <button
                        key={`learn-${sk}`}
                        type="button"
                        onClick={() => toggleSkillToLearn(sk)}
                        className={`text-xs px-2 py-0.5 rounded font-mono border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#EBF1EE] text-[#315C46] border-[#315C46] font-medium'
                            : 'bg-white border-[#E8E6E0] text-[#777873] hover:text-[#242522]'
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: What Help Do You Need? */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                What would you like help with from alumni? <span className="text-[#9E3B3B]">*</span>
              </label>
              {errors.helpNeeded && <p className="text-[11px] text-[#9E3B3B] mb-2">{errors.helpNeeded}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HELP_OPTIONS.map((opt) => {
                  const isSelected = helpNeeded.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleHelpOption(opt)}
                      className={`p-2.5 rounded-md text-left text-xs border transition flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-[#EBF1EE] border-[#315C46] text-[#315C46] font-medium'
                          : 'bg-[#F8F7F4] border-[#E8E6E0] text-[#242522] hover:bg-white'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Complete Student Profile & Visibility */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Tell alumni what you're working toward / Short intro
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="What projects are you building? What career aspirations do you have?"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-[#242522] block">
                Profile Visibility Controls
              </span>
              <div className="divide-y divide-[#E8E6E0] border border-[#E8E6E0] rounded-md bg-[#F8F7F4] text-xs">
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Education & Expected Graduation Year</span>
                  <input
                    type="checkbox"
                    checked={visibility.academic}
                    onChange={(e) => setVisibility({ ...visibility, academic: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Learning Interests & Current Skills</span>
                  <input
                    type="checkbox"
                    checked={visibility.skills}
                    onChange={(e) => setVisibility({ ...visibility, skills: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Mentorship Goals</span>
                  <input
                    type="checkbox"
                    checked={visibility.goals}
                    onChange={(e) => setVisibility({ ...visibility, goals: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block font-medium">Direct Contact Details (Email)</span>
                    <span className="text-[11px] text-[#777873]">Private by default.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={visibility.contact}
                    onChange={(e) => setVisibility({ ...visibility, contact: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
              </div>
            </div>

            {/* Profile Preview */}
            <div className="p-4 bg-white border border-[#E8E6E0] rounded-md space-y-2">
              <span className="text-[10px] font-mono tracking-wider text-[#777873] uppercase block">
                Public Student Profile Preview
              </span>
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[#242522]">{name || 'Your Name'}</h3>
                  <p className="text-xs text-[#777873]">
                    {yearOfStudy} · {department} (Class of {expectedGraduationYear})
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#315C46] bg-[#EBF1EE] px-2 py-0.5 rounded">
                  Student
                </span>
              </div>
              <p className="text-xs text-[#242522] italic pt-1">{bio}</p>
              <div className="text-[11px] font-mono text-[#777873] pt-1">
                Interests: {interests.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-[#E8E6E0] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="px-4 py-2 border border-[#E8E6E0] hover:bg-[#F2F1EC] text-xs font-medium text-[#242522] rounded-md transition cursor-pointer"
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded-md transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{step === totalSteps ? 'Create Student Profile' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
