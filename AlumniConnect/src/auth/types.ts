export type UserRole = 'ALUMNI' | 'STUDENT';

export interface SkillItem {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience?: number;
}

export interface AlumniProfileVisibility {
  headline: boolean;
  academic: boolean;
  skills: boolean;
  company: boolean;
  links: boolean;
  contact: boolean; // false by default
}

export interface AlumniProfile {
  userId: string;
  role: 'ALUMNI';
  name: string;
  email: string;
  university: string;
  alumniId?: string;
  photoUrl?: string;
  
  // Academic Background
  degree: string;
  department: string;
  graduationYear: number;
  specialization?: string;
  certifications?: string;

  // Professional Information
  jobTitle: string;
  company: string;
  industry: string;
  yearsExperience: number;
  seekingOpportunities: boolean;
  linkedIn?: string;
  portfolio?: string;

  // Skills & Expertise
  skills: SkillItem[];
  primaryArea: string;

  // Mentoring & Contributions
  mentoringInterests: string[];
  bio: string;

  // Visibility Controls
  visibility: AlumniProfileVisibility;

  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileVisibility {
  academic: boolean;
  skills: boolean;
  interests: boolean;
  goals: boolean;
  contact: boolean; // false by default
}

export interface StudentProfile {
  userId: string;
  role: 'STUDENT';
  name: string;
  email: string;
  university: string;
  photoUrl?: string;

  // Education
  degree: string;
  department: string;
  yearOfStudy: string; // "First year", "Second year", "Third year", "Fourth year", "Postgraduate", "Other"
  expectedGraduationYear: number;

  // Interests & Skills
  interests: string[];
  currentSkills: string[];
  skillsToLearn: string[];

  // Mentorship Needs
  helpNeeded: string[];
  bio: string;

  // Visibility Controls
  visibility: StudentProfileVisibility;

  createdAt: string;
  updatedAt: string;
}

export type UserProfile = AlumniProfile | StudentProfile;

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDegree?: string;
  studentDepartment?: string;
  studentYear?: string;
  alumnusId: string;
  alumnusName: string;
  alumnusEmail?: string; // Revealed to student upon status === 'ACCEPTED'
  alumnusRole?: string;
  alumnusCompany?: string;
  alumnusDepartment?: string;
  topic: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  alumnusReplyNote?: string;
  acceptedAt?: string;
  createdAt: string;
}

