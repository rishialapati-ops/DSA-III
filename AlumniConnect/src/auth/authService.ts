import { 
  UserProfile, 
  AlumniProfile, 
  StudentProfile, 
  MentorshipRequest 
} from './types';

const STORAGE_KEY_CURRENT_USER = 'alumni_connect_current_user';
const STORAGE_KEY_USERS = 'alumni_connect_registered_users';
const STORAGE_KEY_REQUESTS = 'alumni_connect_mentorship_requests';

// Default Demo Accounts
const DEFAULT_ALUMNI: AlumniProfile = {
  userId: 'usr_alumni_demo_01',
  role: 'ALUMNI',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.edu',
  university: 'University Institute of Engineering & Technology',
  alumniId: 'A001',
  degree: 'B.Tech / B.E.',
  department: 'Computer Science and Engineering',
  graduationYear: 2021,
  specialization: 'Distributed Systems & Cloud Computing',
  certifications: 'AWS Certified Solutions Architect, Oracle Java SE 11',
  jobTitle: 'Senior Software Engineer',
  company: 'Adobe',
  industry: 'Software & Cloud Services',
  yearsExperience: 4,
  seekingOpportunities: false,
  linkedIn: 'https://linkedin.com/in/rahulsharma-demo',
  portfolio: 'https://rahulsharma.dev',
  skills: [
    { name: 'Java', proficiency: 'Expert', yearsExperience: 5 },
    { name: 'Python', proficiency: 'Advanced', yearsExperience: 4 },
    { name: 'Machine Learning', proficiency: 'Intermediate', yearsExperience: 2 },
    { name: 'SQL', proficiency: 'Advanced', yearsExperience: 4 },
    { name: 'Data Structures and Algorithms', proficiency: 'Expert', yearsExperience: 5 }
  ],
  primaryArea: 'Backend Architecture & High-Concurrency Systems',
  mentoringInterests: [
    'Technical mentoring',
    'Interview preparation',
    'Resume reviews',
    'Project guidance'
  ],
  bio: 'Alumnus from 2021 batch. Currently working on cloud document microservices at Adobe. Glad to help students navigating competitive programming, system design, and placement prep.',
  visibility: {
    headline: true,
    academic: true,
    skills: true,
    company: true,
    links: true,
    contact: false // Private by default
  },
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2024-01-15T09:00:00.000Z'
};

const DEFAULT_STUDENT: StudentProfile = {
  userId: 'usr_student_demo_02',
  role: 'STUDENT',
  name: 'Ananya Iyer',
  email: 'ananya.iyer@student.edu',
  university: 'University Institute of Engineering & Technology',
  degree: 'B.Tech / B.E.',
  department: 'Information Technology',
  yearOfStudy: 'Third year',
  expectedGraduationYear: 2026,
  interests: [
    'Software Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Interview Preparation'
  ],
  currentSkills: ['Java', 'C++', 'SQL'],
  skillsToLearn: ['Machine Learning', 'Python', 'Distributed Systems'],
  helpNeeded: [
    'Preparing for interviews',
    'Finding internships',
    'Resume improvement',
    'Building projects'
  ],
  bio: 'Pre-final year IT student interested in backend engineering and applied ML. Working on open-source projects and seeking internship guidance.',
  visibility: {
    academic: true,
    skills: true,
    interests: true,
    goals: true,
    contact: false // Private by default
  },
  createdAt: '2024-03-01T10:00:00.000Z',
  updatedAt: '2024-03-01T10:00:00.000Z'
};

const INITIAL_REQUESTS: MentorshipRequest[] = [
  {
    id: 'req_001',
    studentId: 'usr_student_demo_02',
    studentName: 'Ananya Iyer',
    studentEmail: 'ananya.iyer@student.edu',
    studentDegree: 'B.Tech / B.E.',
    studentDepartment: 'Information Technology',
    studentYear: 'Third year',
    alumnusId: 'usr_alumni_demo_01',
    alumnusName: 'Rahul Sharma',
    alumnusRole: 'Senior Software Engineer',
    alumnusCompany: 'Adobe',
    alumnusDepartment: 'Computer Science and Engineering',
    topic: 'Resume Review & Backend Interview Prep',
    message: 'Hi Rahul! I saw your experience in Java backend systems and would love some feedback on structuring my resume projects for tech company internship drives.',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'req_002',
    studentId: 'usr_student_demo_02',
    studentName: 'Ananya Iyer',
    studentEmail: 'ananya.iyer@student.edu',
    studentDegree: 'B.Tech / B.E.',
    studentDepartment: 'Information Technology',
    studentYear: 'Third year',
    alumnusId: 'usr_alumni_demo_priya',
    alumnusName: 'Priya Patel',
    alumnusEmail: 'priya.patel@microsoft.com',
    alumnusRole: 'Cloud Solutions Architect',
    alumnusCompany: 'Microsoft',
    alumnusDepartment: 'Computer Science and Engineering',
    topic: 'Cloud Career Guidance & Networking',
    message: 'Hello Priya, I am inspired by your journey in Azure cloud architecture. Could we connect and exchange mail IDs for guidance?',
    status: 'ACCEPTED',
    alumnusReplyNote: 'Great to connect Ananya! Happy to share tips on cloud certifications and backend engineering. Feel free to reach out via my email to schedule a 15-minute call.',
    acceptedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      const initial = [DEFAULT_ALUMNI, DEFAULT_STUDENT];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_ALUMNI, DEFAULT_STUDENT];
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    }
  } catch {
    // Graceful fallback
  }
}

export function saveUser(user: UserProfile): void {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.userId === user.userId || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  setCurrentUser(user);
}

export function loginUser(email: string): UserProfile | null {
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (found) {
    setCurrentUser(found);
    return found;
  }
  return null;
}

export function logoutUser(): void {
  setCurrentUser(null);
}

/**
 * Calculates genuine profile completeness score (0 - 100%) based on actual filled fields.
 */
export function calculateProfileCompleteness(profile: UserProfile): number {
  if (profile.role === 'ALUMNI') {
    const checks = [
      Boolean(profile.name),
      Boolean(profile.email),
      Boolean(profile.degree),
      Boolean(profile.department),
      Boolean(profile.graduationYear),
      Boolean(profile.jobTitle || profile.seekingOpportunities),
      Boolean(profile.company || profile.seekingOpportunities),
      profile.skills.length > 0,
      profile.skills.length >= 3,
      Boolean(profile.primaryArea),
      profile.mentoringInterests.length > 0,
      Boolean(profile.bio && profile.bio.length > 20),
      Boolean(profile.linkedIn || profile.portfolio)
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  } else {
    const checks = [
      Boolean(profile.name),
      Boolean(profile.email),
      Boolean(profile.degree),
      Boolean(profile.department),
      Boolean(profile.yearOfStudy),
      Boolean(profile.expectedGraduationYear),
      profile.interests.length > 0,
      profile.currentSkills.length > 0,
      profile.helpNeeded.length > 0,
      Boolean(profile.bio && profile.bio.length > 20)
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }
}

// Mentorship Requests Management
export function getMentorshipRequests(): MentorshipRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function sendMentorshipRequest(
  student: StudentProfile,
  alumnusId: string,
  alumnusName: string,
  topic: string,
  message: string,
  alumnusMeta?: {
    alumnusEmail?: string;
    alumnusRole?: string;
    alumnusCompany?: string;
    alumnusDepartment?: string;
  }
): MentorshipRequest {
  const requests = getMentorshipRequests();

  // If known, find matching registered user
  const users = getRegisteredUsers();
  const foundUser = users.find(u => u.userId === alumnusId || u.name.toLowerCase() === alumnusName.toLowerCase());

  const newReq: MentorshipRequest = {
    id: `req_${Date.now()}`,
    studentId: student.userId,
    studentName: student.name,
    studentEmail: student.email,
    studentDegree: student.degree,
    studentDepartment: student.department,
    studentYear: student.yearOfStudy,
    alumnusId,
    alumnusName,
    alumnusEmail: alumnusMeta?.alumnusEmail || foundUser?.email,
    alumnusRole: alumnusMeta?.alumnusRole || (foundUser?.role === 'ALUMNI' ? (foundUser as AlumniProfile).jobTitle : undefined),
    alumnusCompany: alumnusMeta?.alumnusCompany || (foundUser?.role === 'ALUMNI' ? (foundUser as AlumniProfile).company : undefined),
    alumnusDepartment: alumnusMeta?.alumnusDepartment || (foundUser?.role === 'ALUMNI' ? (foundUser as AlumniProfile).department : undefined),
    topic,
    message,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  requests.unshift(newReq);
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  return newReq;
}

export function updateMentorshipRequestStatus(
  requestId: string, 
  status: 'ACCEPTED' | 'DECLINED',
  replyData?: {
    alumnusEmail?: string;
    replyNote?: string;
  }
): void {
  const requests = getMentorshipRequests();
  const req = requests.find(r => r.id === requestId);
  if (req) {
    req.status = status;
    if (status === 'ACCEPTED') {
      req.acceptedAt = new Date().toISOString();
      if (replyData?.alumnusEmail) {
        req.alumnusEmail = replyData.alumnusEmail;
      }
      if (replyData?.replyNote) {
        req.alumnusReplyNote = replyData.replyNote;
      }
      // If still missing email, fallback to registered user or formatted address
      if (!req.alumnusEmail) {
        const users = getRegisteredUsers();
        const alumnus = users.find(u => u.userId === req.alumnusId || u.name.toLowerCase() === req.alumnusName.toLowerCase());
        if (alumnus?.email) {
          req.alumnusEmail = alumnus.email;
        } else {
          const cleanName = req.alumnusName.toLowerCase().replace(/[^a-z0-9]+/g, '.');
          req.alumnusEmail = `${cleanName}@alumni.edu`;
        }
      }
    }
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  }
}

