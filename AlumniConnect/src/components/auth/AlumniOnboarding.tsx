import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  X, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Sparkles 
} from 'lucide-react';
import { AlumniProfile, SkillItem, AlumniProfileVisibility } from '../../auth/types';
import { saveUser } from '../../auth/authService';

interface AlumniOnboardingProps {
  onComplete: (profile: AlumniProfile) => void;
  onCancel: () => void;
}

const DEGREES = [
  'B.Tech / B.E.',
  'B.Sc.',
  'B.Com.',
  'BBA',
  'BCA',
  'M.Tech / M.E.',
  'M.Sc.',
  'MBA',
  'Other'
];

const SUGGESTED_SKILLS = [
  'Java',
  'Python',
  'C++',
  'JavaScript',
  'React',
  'Node.js',
  'Web Development',
  'Android Development',
  'Data Structures and Algorithms',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'SQL',
  'MySQL',
  'Cloud Computing',
  'AWS',
  'Cybersecurity',
  'UI/UX Design',
  'Product Management',
  'Digital Marketing',
  'Communication',
  'Leadership'
];

const MENTORING_OPTIONS = [
  'Career guidance',
  'Resume reviews',
  'Interview preparation',
  'Technical mentoring',
  'Project guidance',
  'Internship and job advice',
  'Industry insights',
  'Guest lectures',
  'Networking',
  'Open to all forms of guidance'
];

export const AlumniOnboarding: React.FC<AlumniOnboardingProps> = ({
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('University Institute of Engineering & Technology');
  const [alumniId, setAlumniId] = useState('');

  // Step 2: Academic
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [customDegree, setCustomDegree] = useState('');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(2022);
  const [specialization, setSpecialization] = useState('');
  const [certifications, setCertifications] = useState('');

  // Step 3: Professional
  const [seekingOpportunities, setSeekingOpportunities] = useState(false);
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [company, setCompany] = useState('Example Tech');
  const [industry, setIndustry] = useState('Information Technology');
  const [yearsExperience, setYearsExperience] = useState<number>(2);
  const [linkedIn, setLinkedIn] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Step 4: Skills
  const [skills, setSkills] = useState<SkillItem[]>([
    { name: 'Java', proficiency: 'Advanced', yearsExperience: 3 },
    { name: 'Data Structures and Algorithms', proficiency: 'Advanced', yearsExperience: 3 }
  ]);
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [primaryArea, setPrimaryArea] = useState('Backend Systems & Algorithmic Optimization');

  // Step 5: Mentoring
  const [mentoringInterests, setMentoringInterests] = useState<string[]>([
    'Interview preparation',
    'Technical mentoring',
    'Career guidance'
  ]);
  const [bio, setBio] = useState('Alumnus excited to guide students on data structures, technical interviews, and backend careers.');

  // Step 6: Visibility
  const [visibility, setVisibility] = useState<AlumniProfileVisibility>({
    headline: true,
    academic: true,
    skills: true,
    company: true,
    links: true,
    contact: false // Private by default
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step Validation
  const validateCurrentStep = (): boolean => {
    const err: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) err.name = 'Full name is required.';
      if (!email.trim()) err.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Please provide a valid email format.';
      if (password && password !== confirmPassword) {
        err.confirmPassword = 'Passwords do not match.';
      }
    } else if (step === 2) {
      if (!department.trim()) err.department = 'Department / Branch is required.';
      if (degree === 'Other' && !customDegree.trim()) err.customDegree = 'Please specify your degree.';
    } else if (step === 3) {
      if (!seekingOpportunities && !jobTitle.trim()) err.jobTitle = 'Job title is required (or select "Seeking opportunities").';
      if (!seekingOpportunities && !company.trim()) err.company = 'Company is required (or select "Seeking opportunities").';
    } else if (step === 4) {
      if (skills.length === 0) err.skills = 'Please add at least one skill to share with the community.';
    } else if (step === 5) {
      if (mentoringInterests.length === 0) err.mentoring = 'Please select at least one way you would like to help.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
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

  // Add / Remove Skills
  const handleAddSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    setSkills([...skills, { name: trimmed, proficiency: 'Intermediate', yearsExperience: 2 }]);
    setSkillSearch('');
    setCustomSkillInput('');
    if (errors.skills) setErrors({});
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const handleUpdateProficiency = (skillName: string, prof: SkillItem['proficiency']) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, proficiency: prof } : s));
  };

  // Toggle Mentoring
  const toggleMentoring = (opt: string) => {
    if (mentoringInterests.includes(opt)) {
      setMentoringInterests(mentoringInterests.filter(o => o !== opt));
    } else {
      setMentoringInterests([...mentoringInterests, opt]);
    }
    if (errors.mentoring) setErrors({});
  };

  const handleSubmitFinal = () => {
    const finalProfile: AlumniProfile = {
      userId: `usr_alumni_${Date.now()}`,
      role: 'ALUMNI',
      name: name.trim(),
      email: email.trim(),
      university: university.trim(),
      alumniId: alumniId.trim() || undefined,
      degree: degree === 'Other' ? customDegree.trim() : degree,
      department: department.trim(),
      graduationYear,
      specialization: specialization.trim() || undefined,
      certifications: certifications.trim() || undefined,
      jobTitle: seekingOpportunities ? 'Seeking Opportunities' : jobTitle.trim(),
      company: seekingOpportunities ? 'Open to roles' : company.trim(),
      industry: industry.trim(),
      yearsExperience,
      seekingOpportunities,
      linkedIn: linkedIn.trim() || undefined,
      portfolio: portfolio.trim() || undefined,
      skills,
      primaryArea: primaryArea.trim(),
      mentoringInterests,
      bio: bio.trim(),
      visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveUser(finalProfile);
    onComplete(finalProfile);
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
            Alumni Registration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#242522]">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Academic Background'}
            {step === 3 && 'Professional Experience'}
            {step === 4 && 'Skills & Expertise'}
            {step === 5 && 'How Would You Like to Help?'}
            {step === 6 && 'Profile Visibility & Preview'}
          </h1>
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
                placeholder="e.g., Rahul Sharma"
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
                placeholder="e.g., rahul.sharma@alumni.edu"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              {errors.email && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set password (optional for demo)"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
                {errors.confirmPassword && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Alumni Roll / Student ID <span className="text-[#777873] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={alumniId}
                  onChange={(e) => setAlumniId(e.target.value)}
                  placeholder="e.g., A042"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Background */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Degree Completed <span className="text-[#9E3B3B]">*</span>
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
                  Graduation Year <span className="text-[#9E3B3B]">*</span>
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                >
                  {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {degree === 'Other' && (
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Specify Degree <span className="text-[#9E3B3B]">*</span>
                </label>
                <input
                  type="text"
                  value={customDegree}
                  onChange={(e) => setCustomDegree(e.target.value)}
                  placeholder="e.g., Integrated M.Tech"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
                {errors.customDegree && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.customDegree}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Department / Branch <span className="text-[#9E3B3B]">*</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science and Engineering"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              {errors.department && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Specialization / Major <span className="text-[#777873] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g., Data Science, Embedded Systems"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Relevant Certifications <span className="text-[#777873] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="e.g., AWS Solutions Architect, Kubernetes CKA"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Professional Experience */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md">
              <label className="flex items-center gap-2.5 text-xs text-[#242522] cursor-pointer">
                <input
                  type="checkbox"
                  checked={seekingOpportunities}
                  onChange={(e) => setSeekingOpportunities(e.target.checked)}
                  className="rounded border-[#E8E6E0] text-[#315C46] focus:ring-[#315C46]"
                />
                <span className="font-medium">Currently seeking opportunities / Between roles</span>
              </label>
            </div>

            {!seekingOpportunities && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#242522] mb-1">
                    Current Job Title <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                  />
                  {errors.jobTitle && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.jobTitle}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#242522] mb-1">
                    Current Company / Org <span className="text-[#9E3B3B]">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Adobe, Google, Startup"
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                  />
                  {errors.company && <p className="text-[11px] text-[#9E3B3B] mt-1">{errors.company}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., FinTech, Healthcare, SaaS"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Years of Professional Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="45"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  LinkedIn Profile URL <span className="text-[#777873] font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Portfolio / Website <span className="text-[#777873] font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://mywebsite.dev"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Skills and Expertise */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Primary Area of Expertise <span className="text-[#9E3B3B]">*</span>
              </label>
              <input
                type="text"
                value={primaryArea}
                onChange={(e) => setPrimaryArea(e.target.value)}
                placeholder="e.g., Backend Systems, Data Engineering, Mobile Apps"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
            </div>

            {/* Selected Skills List with Proficiency Toggles */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#242522]">
                Your Skills ({skills.length}) <span className="text-[#9E3B3B]">*</span>
              </label>
              {errors.skills && <p className="text-[11px] text-[#9E3B3B] mb-1">{errors.skills}</p>}

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {skills.map((s) => (
                  <div 
                    key={s.name}
                    className="p-2.5 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="font-mono font-medium text-[#242522]">{s.name}</div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={s.proficiency}
                        onChange={(e) => handleUpdateProficiency(s.name, e.target.value as any)}
                        className="px-2 py-1 bg-white border border-[#E8E6E0] rounded text-[11px] text-[#242522] focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-[#777873] hover:text-[#9E3B3B] p-1 cursor-pointer"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Searchable Skill Selector & Custom Skill Input */}
            <div className="space-y-2 pt-2 border-t border-[#E8E6E0]">
              <span className="text-[11px] font-mono text-[#777873] uppercase tracking-wider block">
                Add skills from catalog or type custom:
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(customSkillInput); } }}
                  placeholder="Type any skill and click add..."
                  className="flex-1 px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(customSkillInput)}
                  className="px-3 py-1.5 bg-[#F2F1EC] hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] text-xs font-medium rounded-md transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Quick suggestions pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_SKILLS.filter(s => !skills.some(existing => existing.name.toLowerCase() === s.toLowerCase())).slice(0, 10).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="text-[11px] font-mono px-2 py-0.5 bg-white hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] rounded transition cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: How Would You Like to Help? */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Select forms of guidance you're open to: <span className="text-[#9E3B3B]">*</span>
              </label>
              {errors.mentoring && <p className="text-[11px] text-[#9E3B3B] mb-2">{errors.mentoring}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MENTORING_OPTIONS.map((opt) => {
                  const isSelected = mentoringInterests.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMentoring(opt)}
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

            <div>
              <label className="block text-xs font-medium text-[#242522] mb-1">
                Short Introduction / Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell students a little about your experience and what you can help with..."
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
              />
              <span className="text-[10px] text-[#777873] block mt-0.5">
                Up to 300 characters recommended.
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: Profile Visibility and Completion */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#242522] block">
                Profile Visibility Controls
              </span>
              <p className="text-xs text-[#777873]">
                Control what details are publicly visible to students in search results.
              </p>

              <div className="divide-y divide-[#E8E6E0] border border-[#E8E6E0] rounded-md bg-[#F8F7F4] text-xs">
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Job Title & Current Company</span>
                  <input
                    type="checkbox"
                    checked={visibility.company}
                    onChange={(e) => setVisibility({ ...visibility, company: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Academic Background & Grad Year</span>
                  <input
                    type="checkbox"
                    checked={visibility.academic}
                    onChange={(e) => setVisibility({ ...visibility, academic: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Skills & Proficiencies</span>
                  <input
                    type="checkbox"
                    checked={visibility.skills}
                    onChange={(e) => setVisibility({ ...visibility, skills: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <span>Display Professional Links (LinkedIn / Portfolio)</span>
                  <input
                    type="checkbox"
                    checked={visibility.links}
                    onChange={(e) => setVisibility({ ...visibility, links: e.target.checked })}
                    className="rounded text-[#315C46] focus:ring-[#315C46]"
                  />
                </label>
                <label className="p-3 flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="block font-medium">Direct Contact Details (Email)</span>
                    <span className="text-[11px] text-[#777873]">Private by default. Messages are routed through platform.</span>
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

            {/* Profile Preview Card */}
            <div className="p-4 bg-white border border-[#E8E6E0] rounded-md space-y-2">
              <span className="text-[10px] font-mono tracking-wider text-[#777873] uppercase block">
                Live Public Profile Preview
              </span>
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[#242522]">{name || 'Your Name'}</h3>
                  <p className="text-xs text-[#777873]">
                    {seekingOpportunities ? 'Seeking Opportunities' : `${jobTitle} at ${company}`} · {department} ({graduationYear})
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#315C46] bg-[#EBF1EE] px-2 py-0.5 rounded">
                  Alumnus
                </span>
              </div>
              <p className="text-xs text-[#242522] italic pt-1">{bio}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {skills.map(s => (
                  <span key={s.name} className="text-[10px] font-mono bg-[#F2F1EC] text-[#242522] px-1.5 py-0.5 rounded">
                    {s.name} ({s.proficiency})
                  </span>
                ))}
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
            <span>{step === totalSteps ? 'Create Alumni Profile' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
