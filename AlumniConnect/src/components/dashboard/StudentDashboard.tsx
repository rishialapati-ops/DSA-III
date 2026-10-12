import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Plus, 
  X, 
  Edit3, 
  MessageSquare, 
  Sparkles, 
  ExternalLink, 
  Send, 
  Clock, 
  Check, 
  AlertCircle,
  Binary,
  Mail,
  Copy,
  Users,
  Building2,
  Briefcase
} from 'lucide-react';
import { StudentProfile, MentorshipRequest, AlumniProfile } from '../../auth/types';
import { 
  calculateProfileCompleteness, 
  getMentorshipRequests, 
  sendMentorshipRequest, 
  updateMentorshipRequestStatus,
  getRegisteredUsers,
  saveUser 
} from '../../auth/authService';
import { getCorpusDocuments } from '../../kmp/corpusService';

interface StudentDashboardProps {
  profile: StudentProfile;
  onSearchCorpus: (pattern: string) => void;
  onSelectCorpusDoc: (docId: string) => void;
  onOpenEditProfile: () => void;
  onNavigateToCorpus: () => void;
  onNavigateToVisualizer: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  profile,
  onSearchCorpus,
  onSelectCorpusDoc,
  onOpenEditProfile,
  onNavigateToCorpus,
  onNavigateToVisualizer,
}) => {
  const [skillQuery, setSkillQuery] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [localSkillsToLearn, setLocalSkillsToLearn] = useState<string[]>(profile.skillsToLearn);

  // Filter tab for connection requests
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'ACCEPTED' | 'PENDING'>('ALL');

  // Mentorship / Connection Requests State
  const [requests, setRequests] = useState<MentorshipRequest[]>(() => {
    return getMentorshipRequests().filter(r => r.studentId === profile.userId || r.studentEmail === profile.email);
  });

  // Copied Email Feedback State
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Connection Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [targetType, setTargetType] = useState<'REGISTERED' | 'CORPUS'>('REGISTERED');
  const [selectedAlumnusId, setSelectedAlumnusId] = useState('');
  const [selectedCorpusDocId, setSelectedCorpusDocId] = useState('');
  const [requestTopic, setRequestTopic] = useState('Career Guidance & Mail Exchange');
  const [requestMessage, setRequestMessage] = useState(
    'Hi! I noticed your background and career journey in technology. I would love to connect and exchange mail IDs for guidance and further discussions.'
  );
  const [requestSuccessMsg, setRequestSuccessMsg] = useState(false);

  // Registered Alumni available for mentorship
  const registeredAlumni = getRegisteredUsers().filter(
    (u): u is AlumniProfile => u.role === 'ALUMNI'
  );

  // 100 historical corpus documents for additional connection opportunities
  const corpusDocs = getCorpusDocuments();

  const completeness = calculateProfileCompleteness({ ...profile, skillsToLearn: localSkillsToLearn });

  const handleKmpSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillQuery.trim()) return;
    onSearchCorpus(skillQuery.trim());
  };

  const handleAddSkillToLearn = () => {
    if (!newSkillToLearn.trim()) return;
    if (localSkillsToLearn.includes(newSkillToLearn.trim())) return;

    const updated = [...localSkillsToLearn, newSkillToLearn.trim()];
    setLocalSkillsToLearn(updated);
    setNewSkillToLearn('');
    setShowAddSkill(false);

    const updatedProfile: StudentProfile = {
      ...profile,
      skillsToLearn: updated,
      updatedAt: new Date().toISOString()
    };
    saveUser(updatedProfile);
  };

  const handleRemoveSkillToLearn = (skillName: string) => {
    const updated = localSkillsToLearn.filter(s => s !== skillName);
    setLocalSkillsToLearn(updated);

    const updatedProfile: StudentProfile = {
      ...profile,
      skillsToLearn: updated,
      updatedAt: new Date().toISOString()
    };
    saveUser(updatedProfile);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setToastMessage(`Copied ${email} to clipboard!`);
    setTimeout(() => {
      setCopiedEmail(null);
      setToastMessage(null);
    }, 2500);
  };

  const handleSendMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestMessage.trim()) return;

    let targetAlumnusName = '';
    let targetAlumnusId = '';
    let targetEmail = '';
    let targetRole = '';
    let targetCompany = '';
    let targetDept = '';

    if (targetType === 'REGISTERED') {
      const targetAlumnus = registeredAlumni.find(a => a.userId === selectedAlumnusId);
      if (!targetAlumnus) return;
      targetAlumnusName = targetAlumnus.name;
      targetAlumnusId = targetAlumnus.userId;
      targetEmail = targetAlumnus.email;
      targetRole = targetAlumnus.jobTitle;
      targetCompany = targetAlumnus.company;
      targetDept = targetAlumnus.department;
    } else {
      const doc = corpusDocs.find(d => d.id === selectedCorpusDocId);
      if (!doc) return;
      targetAlumnusName = doc.name;
      targetAlumnusId = `corpus_${doc.id}`;
      targetEmail = `${doc.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@${doc.company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`;
      targetRole = doc.currentRole;
      targetCompany = doc.company;
      targetDept = doc.department;
    }

    const newReq = sendMentorshipRequest(
      profile,
      targetAlumnusId,
      targetAlumnusName,
      requestTopic,
      requestMessage.trim(),
      {
        alumnusEmail: targetEmail,
        alumnusRole: targetRole,
        alumnusCompany: targetCompany,
        alumnusDepartment: targetDept
      }
    );

    setRequests(prev => [newReq, ...prev]);
    setRequestSuccessMsg(true);
    setToastMessage(`Connection request sent to ${targetAlumnusName}!`);

    setTimeout(() => {
      setRequestSuccessMsg(false);
      setIsRequestModalOpen(false);
      setToastMessage(null);
    }, 1500);
  };

  // Demonstration simulation to instantly approve a pending connection
  const handleSimulateAccept = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (!target) return;

    const email = target.alumnusEmail || `${target.alumnusName.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@alumni.edu`;
    const note = `Glad to connect with you, ${profile.name}! Feel free to write to me at this mail ID with your questions.`;

    updateMentorshipRequestStatus(reqId, 'ACCEPTED', {
      alumnusEmail: email,
      replyNote: note
    });

    setRequests(prev => prev.map(r => r.id === reqId ? {
      ...r,
      status: 'ACCEPTED',
      alumnusEmail: email,
      alumnusReplyNote: note,
      acceptedAt: new Date().toISOString()
    } : r));

    setToastMessage(`Connection accepted! ${target.alumnusName}'s mail ID is now unlocked.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredRequests = requests.filter(r => {
    if (requestFilter === 'ACCEPTED') return r.status === 'ACCEPTED';
    if (requestFilter === 'PENDING') return r.status === 'PENDING';
    return true;
  });

  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED').length;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="max-w-4xl space-y-10 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-[#EBF1EE] border border-[#315C46] text-[#315C46] rounded-lg shadow-lg text-xs flex items-center gap-2.5 max-w-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Student Greeting Header */}
      <div className="space-y-2 border-b border-[#E8E6E0] pb-6">
        <div className="text-[11px] font-mono tracking-widest text-[#777873] uppercase">
          Student Portal · Career & Skills Discovery
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522] tracking-tight">
              Welcome, {profile.name}.
            </h1>
            <p className="text-sm text-[#777873] mt-1">
              Explore alumni career journeys, target in-demand skills, and connect for direct mail exchange.
            </p>
          </div>

          <button
            onClick={onOpenEditProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#242522] hover:text-[#315C46] border border-[#E8E6E0] bg-white rounded-md hover:border-[#315C46] transition cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#777873]" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Overview & Completeness Card */}
      <div className="p-6 bg-white border border-[#E8E6E0] rounded-lg shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6E0]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777873] block">
              Profile Completeness
            </span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-[#242522]">{completeness}%</span>
              <span className="text-xs text-[#777873]">
                {completeness === 100 ? 'All student profile sections complete' : 'Complete remaining details to strengthen connections'}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-[#F2F1EC] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#315C46] h-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Education & Academic Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777873] block">Academic Track</span>
            <span className="font-semibold text-[#242522] text-sm block">
              {profile.degree} · {profile.department}
            </span>
            <span className="text-[#777873] block">{profile.university}</span>
          </div>

          <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777873] block">Timeline</span>
            <span className="font-semibold text-[#242522] text-sm block">
              {profile.yearOfStudy}
            </span>
            <span className="text-[#777873] block">Expected Graduation: Class of {profile.expectedGraduationYear}</span>
          </div>
        </div>
      </div>

      {/* FEATURE: Connections & Mail IDs Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8E6E0] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl text-[#242522]">Alumni Connections & Mail IDs</h2>
              {acceptedCount > 0 && (
                <span className="px-2 py-0.5 bg-[#EBF1EE] text-[#315C46] text-[10px] font-mono rounded-full font-semibold">
                  {acceptedCount} Mail ID{acceptedCount > 1 ? 's' : ''} Unlocked
                </span>
              )}
            </div>
            <p className="text-xs text-[#777873] mt-0.5">
              Send connection requests to alumni. Once accepted, their verified email address is unlocked below for further discussions.
            </p>
          </div>

          <button
            onClick={() => {
              if (registeredAlumni.length > 0) {
                setSelectedAlumnusId(registeredAlumni[0].userId);
              }
              if (corpusDocs.length > 0) {
                setSelectedCorpusDocId(corpusDocs[0].id);
              }
              setIsRequestModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded-md transition cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Connection</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRequestFilter('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              requestFilter === 'ALL'
                ? 'bg-[#242522] text-white'
                : 'bg-white border border-[#E8E6E0] text-[#777873] hover:text-[#242522]'
            }`}
          >
            All Connections ({requests.length})
          </button>
          <button
            onClick={() => setRequestFilter('ACCEPTED')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              requestFilter === 'ACCEPTED'
                ? 'bg-[#315C46] text-white'
                : 'bg-white border border-[#E8E6E0] text-[#777873] hover:text-[#315C46]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Unlocked Mail IDs ({acceptedCount})</span>
          </button>
          <button
            onClick={() => setRequestFilter('PENDING')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              requestFilter === 'PENDING'
                ? 'bg-amber-700 text-white'
                : 'bg-white border border-[#E8E6E0] text-[#777873] hover:text-amber-800'
            }`}
          >
            Pending Requests ({pendingCount})
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-8 bg-white border border-[#E8E6E0] rounded-lg text-center text-xs text-[#777873] space-y-3">
            <Mail className="w-8 h-8 text-[#777873] mx-auto opacity-40" />
            <div className="font-medium text-sm text-[#242522]">No requests found in this view</div>
            <p className="max-w-md mx-auto text-[#777873]">
              Send a connection request to an alumnus in your department or with target skills to unlock their verified mail ID.
            </p>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#315C46] text-white rounded text-xs font-medium cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Send Connection Request</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isAccepted = req.status === 'ACCEPTED';
              const isPending = req.status === 'PENDING';
              const isDeclined = req.status === 'DECLINED';

              return (
                <div 
                  key={req.id} 
                  className={`p-5 rounded-lg border transition ${
                    isAccepted 
                      ? 'bg-white border-[#315C46]/40 shadow-xs' 
                      : isPending
                      ? 'bg-white border-amber-200/80 shadow-xs'
                      : 'bg-[#F8F7F4] border-[#E8E6E0]'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#E8E6E0]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg font-normal text-[#242522]">
                          {req.alumnusName}
                        </span>
                        {isAccepted && (
                          <span className="px-2 py-0.5 bg-[#EBF1EE] text-[#315C46] border border-[#315C46]/20 text-[10px] font-mono rounded-full font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Connected · Mail ID Unlocked</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono rounded-full font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Pending Alumnus Response</span>
                          </span>
                        )}
                        {isDeclined && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-mono rounded-full">
                            Declined
                          </span>
                        )}
                      </div>

                      {(req.alumnusRole || req.alumnusCompany) && (
                        <div className="text-xs text-[#777873] mt-0.5 flex items-center gap-2">
                          <span>{req.alumnusRole} {req.alumnusCompany ? `at ${req.alumnusCompany}` : ''}</span>
                          {req.alumnusDepartment && <span>· {req.alumnusDepartment}</span>}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-[#777873]">
                      Requested {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pt-3 space-y-3">
                    
                    {/* Topic and Message */}
                    <div className="text-xs space-y-1">
                      <div className="font-medium text-[#242522] flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#315C46]" />
                        <span>Inquiry Topic: {req.topic}</span>
                      </div>
                      <p className="text-[#777873] italic">
                        "{req.message}"
                      </p>
                    </div>

                    {/* UNLOCKED MAIL ID HIGHLIGHT CARD (For Accepted Requests) */}
                    {isAccepted && (
                      <div className="p-4 bg-[#EBF1EE] border border-[#315C46]/30 rounded-lg space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C46] font-semibold block">
                              Verified Mail ID for Further Talkings:
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4 text-[#315C46]" />
                              <span className="font-mono text-sm font-semibold text-[#242522] select-all">
                                {req.alumnusEmail || 'alumnus@university.edu'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyEmail(req.alumnusEmail || 'alumnus@university.edu')}
                              className="px-3 py-1.5 bg-white border border-[#315C46]/30 hover:border-[#315C46] text-[#242522] text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#315C46]" />
                              <span>{copiedEmail === req.alumnusEmail ? 'Copied!' : 'Copy Mail ID'}</span>
                            </button>

                            <a
                              href={`mailto:${req.alumnusEmail || 'alumnus@university.edu'}?subject=Alumni%20Connect:%20Follow-up%20from%20${encodeURIComponent(profile.name)}%20(${encodeURIComponent(profile.department)})&body=Hi%20${encodeURIComponent(req.alumnusName)},%0D%0A%0D%0AThank%20you%20for%20accepting%20my%20connection%20request%20on%20Alumni%20Connect!%20I%20am%20a%20${encodeURIComponent(profile.yearOfStudy)}%20student%20in%20${encodeURIComponent(profile.department)}.%0D%0A%0D%0AI%20would%20love%20to%20learn%20more%20about%20your%20experience%20with%20${encodeURIComponent(req.topic)}.%0D%0A%0D%0ABest%20regards,%0D%0A${encodeURIComponent(profile.name)}`}
                              className="px-3 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Email</span>
                            </a>
                          </div>
                        </div>

                        {req.alumnusReplyNote && (
                          <div className="pt-2 border-t border-[#315C46]/20 text-xs text-[#242522]">
                            <span className="font-semibold text-[#315C46]">Note from {req.alumnusName}: </span>
                            <span className="italic">"{req.alumnusReplyNote}"</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pending State Explanatory Footnote & Simulation */}
                    {isPending && (
                      <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[#777873]">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Mail ID is protected until {req.alumnusName} accepts your connection request.
                          </span>
                        </div>

                        {/* Interactive Simulation Button for DSA Evaluators */}
                        <button
                          type="button"
                          onClick={() => handleSimulateAccept(req.id)}
                          className="px-2.5 py-1 bg-white hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] rounded text-[11px] font-mono text-[#777873] transition cursor-pointer shrink-0"
                          title="Simulate alumnus accepting request to immediately reveal mail ID"
                        >
                          ⚡ Test: Simulate Alumnus Acceptance
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Skills & Interests Manager */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-[#E8E6E0] pb-2">
          <div>
            <h2 className="font-serif text-xl text-[#242522]">Skills you want to learn</h2>
            <p className="text-xs text-[#777873]">Track competencies you want to develop and match with alumni.</p>
          </div>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="text-xs text-[#315C46] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Target Skill</span>
          </button>
        </div>

        {showAddSkill && (
          <div className="p-3 bg-white border border-[#E8E6E0] rounded-md flex gap-2">
            <input
              type="text"
              value={newSkillToLearn}
              onChange={(e) => setNewSkillToLearn(e.target.value)}
              placeholder="Enter skill name (e.g. Distributed Systems, Docker)..."
              className="flex-1 px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
            />
            <button
              onClick={handleAddSkillToLearn}
              className="px-3 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition cursor-pointer"
            >
              Save
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {localSkillsToLearn.map((skill) => (
            <div
              key={skill}
              className="px-3 py-1.5 bg-white border border-[#E8E6E0] rounded-md flex items-center gap-2 text-xs"
            >
              <span className="font-mono font-medium text-[#242522]">{skill}</span>
              <button
                type="button"
                onClick={() => onSearchCorpus(skill)}
                className="text-[10px] text-[#315C46] bg-[#EBF1EE] hover:bg-[#315C46] hover:text-white px-1.5 py-0.5 rounded transition cursor-pointer"
                title={`Find alumni with ${skill}`}
              >
                Search KMP
              </button>
              <button
                onClick={() => handleRemoveSkillToLearn(skill)}
                className="text-[#777873] hover:text-[#9E3B3B] cursor-pointer ml-1"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KMP Search across 100 Alumni Documents */}
      <div className="p-6 bg-white border border-[#E8E6E0] rounded-lg shadow-xs space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C46] font-semibold block">
              Direct KMP Pattern Matching
            </span>
            <span className="text-[10px] font-mono text-[#777873] bg-[#F2F1EC] px-1.5 py-0.5 rounded">
              O(N + D×m) Complexity
            </span>
          </div>
          <h2 className="font-serif text-xl text-[#242522] mt-1">
            Find alumni with specific skills or companies
          </h2>
          <p className="text-xs text-[#777873] mt-0.5">
            Execute the exact Knuth-Morris-Pratt pattern search algorithm across all 100 alumni documents in the project corpus.
          </p>
        </div>

        <form onSubmit={handleKmpSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777873] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search alumni for Java, Python, Machine Learning, AWS, Google..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded-md transition cursor-pointer shrink-0"
          >
            Run KMP Search
          </button>
        </form>

        {/* Quick Recommended Searches based on Student Career Interests */}
        <div className="space-y-2 pt-2 border-t border-[#E8E6E0]">
          <span className="text-[11px] font-mono text-[#777873] block uppercase tracking-wider">
            Quick Discovery Shortcuts (Click to Search):
          </span>
          <div className="flex flex-wrap gap-2">
            {['Java', 'Python', 'Machine Learning', 'Cloud Computing', 'Data Structures', 'SQL', 'React', 'Cybersecurity'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onSearchCorpus(tag)}
                className="px-2.5 py-1 bg-[#F8F7F4] hover:bg-[#EBF1EE] hover:text-[#315C46] border border-[#E8E6E0] rounded text-xs text-[#242522] font-mono transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{tag}</span>
                <span className="text-[10px] text-[#777873]">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#777873] pt-1">
          <span>100 raw .txt profiles indexed in <code>data/</code></span>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCorpus}
              className="text-[#315C46] hover:underline cursor-pointer"
            >
              Browse 100 Documents →
            </button>
            <span>·</span>
            <button
              onClick={onNavigateToVisualizer}
              className="text-[#315C46] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Binary className="w-3 h-3" />
              <span>How KMP Works</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Connection Request & Mail ID Exchange Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E8E6E0] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C46] font-semibold block">
                  New Connection & Mail Exchange
                </span>
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  Request Alumnus Contact Information
                </h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 text-[#777873] hover:text-[#242522] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {requestSuccessMsg ? (
              <div className="p-4 bg-[#EBF1EE] border border-[#315C46]/20 text-[#315C46] rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Connection request sent! Once the alumnus accepts, their mail ID will appear on your dashboard.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMentorship} className="space-y-4">
                
                {/* Target Source Toggle: Registered Alumni vs 100 Historical Corpus Profiles */}
                <div>
                  <label className="block text-xs font-medium text-[#242522] mb-1.5">
                    Choose Alumnus Source:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setTargetType('REGISTERED')}
                      className={`p-2 rounded border text-left transition cursor-pointer ${
                        targetType === 'REGISTERED'
                          ? 'bg-[#EBF1EE] border-[#315C46] text-[#315C46] font-medium'
                          : 'bg-white border-[#E8E6E0] text-[#777873]'
                      }`}
                    >
                      <div className="font-semibold text-[11px]">Registered Portal Alumni</div>
                      <div className="text-[10px] opacity-80">{registeredAlumni.length} verified accounts</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('CORPUS')}
                      className={`p-2 rounded border text-left transition cursor-pointer ${
                        targetType === 'CORPUS'
                          ? 'bg-[#EBF1EE] border-[#315C46] text-[#315C46] font-medium'
                          : 'bg-white border-[#E8E6E0] text-[#777873]'
                      }`}
                    >
                      <div className="font-semibold text-[11px]">100 Corpus Documents</div>
                      <div className="text-[10px] opacity-80">Historical dataset alumni</div>
                    </button>
                  </div>
                </div>

                {/* Target Alumnus Dropdown */}
                {targetType === 'REGISTERED' ? (
                  <div>
                    <label className="block text-xs font-medium text-[#242522] mb-1">
                      Select Alumnus:
                    </label>
                    <select
                      value={selectedAlumnusId}
                      onChange={(e) => setSelectedAlumnusId(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                    >
                      {registeredAlumni.map(alumnus => (
                        <option key={alumnus.userId} value={alumnus.userId}>
                          {alumnus.name} — {alumnus.jobTitle} at {alumnus.company} ({alumnus.department})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-[#242522] mb-1">
                      Select Alumnus from Corpus:
                    </label>
                    <select
                      value={selectedCorpusDocId}
                      onChange={(e) => setSelectedCorpusDocId(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                    >
                      {corpusDocs.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} — {doc.currentRole} at {doc.company} ({doc.department}) [{doc.filename}]
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#242522] mb-1">
                    Guidance / Discussion Topic:
                  </label>
                  <select
                    value={requestTopic}
                    onChange={(e) => setRequestTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                  >
                    <option value="Career Guidance & Mail Exchange">Career Guidance & Mail Exchange</option>
                    <option value="Interview Preparation & Tips">Interview Preparation & Tips</option>
                    <option value="Resume Review & Project Feedback">Resume Review & Project Feedback</option>
                    <option value="Technical Project Mentorship">Technical Project Mentorship</option>
                    <option value="Industry Networking & Insights">Industry Networking & Insights</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#242522]">
                      Personal Message & Inquiry:
                    </label>
                    <span className="text-[10px] text-[#777873]">Explain what you'd like to talk about</span>
                  </div>
                  <textarea
                    rows={4}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Introduce yourself, your study background, and why you would like to connect and talk via email..."
                    required
                    className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                  />
                </div>

                <div className="p-3 bg-white border border-[#E8E6E0] rounded text-[11px] text-[#777873]">
                  💡 <strong>Privacy protection:</strong> The alumnus's mail ID remains private until they accept your request.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-3 py-1.5 border border-[#E8E6E0] bg-white text-xs text-[#777873] hover:text-[#242522] rounded transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Connection Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
