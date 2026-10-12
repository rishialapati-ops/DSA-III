import React, { useState } from 'react';
import { 
  Briefcase, 
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
  ShieldCheck, 
  Check, 
  Clock,
  Mail,
  Send,
  Copy,
  Users
} from 'lucide-react';
import { AlumniProfile, SkillItem, MentorshipRequest } from '../../auth/types';
import { 
  calculateProfileCompleteness, 
  getMentorshipRequests, 
  updateMentorshipRequestStatus,
  saveUser 
} from '../../auth/authService';

interface AlumniDashboardProps {
  profile: AlumniProfile;
  onSearchCorpus: (pattern: string) => void;
  onSelectCorpusDoc: (docId: string) => void;
  onOpenEditProfile: () => void;
  onNavigateToCorpus: () => void;
}

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({
  profile,
  onSearchCorpus,
  onSelectCorpusDoc,
  onOpenEditProfile,
  onNavigateToCorpus,
}) => {
  const [skillQuery, setSkillQuery] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [requests, setRequests] = useState<MentorshipRequest[]>(() => {
    return getMentorshipRequests().filter(r => r.alumnusId === profile.userId || r.alumnusName === profile.name);
  });
  const [localSkills, setLocalSkills] = useState<SkillItem[]>(profile.skills);
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Accept & Share Email Modal State
  const [acceptingReq, setAcceptingReq] = useState<MentorshipRequest | null>(null);
  const [emailToShare, setEmailToShare] = useState(profile.email);
  const [replyNote, setReplyNote] = useState('Glad to connect! Feel free to email me directly to discuss your questions or set up a quick 15-minute call.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const completeness = calculateProfileCompleteness({ ...profile, skills: localSkills });

  const handleKmpSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillQuery.trim()) return;
    onSearchCorpus(skillQuery.trim());
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (localSkills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;

    const updated = [...localSkills, { name: newSkillName.trim(), proficiency: 'Intermediate' as const, yearsExperience: 2 }];
    setLocalSkills(updated);
    setNewSkillName('');
    setShowAddSkill(false);

    // Save to user profile
    const updatedProfile: AlumniProfile = { ...profile, skills: updated, updatedAt: new Date().toISOString() };
    saveUser(updatedProfile);
  };

  const handleRemoveSkill = (name: string) => {
    const updated = localSkills.filter(s => s.name !== name);
    setLocalSkills(updated);
    const updatedProfile: AlumniProfile = { ...profile, skills: updated, updatedAt: new Date().toISOString() };
    saveUser(updatedProfile);
  };

  const handleOpenAcceptModal = (req: MentorshipRequest) => {
    setAcceptingReq(req);
    setEmailToShare(profile.email);
    setReplyNote('Glad to connect! Feel free to email me directly to discuss your questions or set up a quick 15-minute call.');
  };

  const handleConfirmAccept = () => {
    if (!acceptingReq) return;
    const finalEmail = emailToShare.trim() || profile.email;

    updateMentorshipRequestStatus(acceptingReq.id, 'ACCEPTED', {
      alumnusEmail: finalEmail,
      replyNote: replyNote.trim()
    });

    setRequests(requests.map(r => r.id === acceptingReq.id ? { 
      ...r, 
      status: 'ACCEPTED',
      alumnusEmail: finalEmail,
      alumnusReplyNote: replyNote.trim(),
      acceptedAt: new Date().toISOString()
    } : r));

    setAcceptingReq(null);
    setToastMessage(`Connection accepted! Your mail ID (${finalEmail}) is now shared with ${acceptingReq.studentName}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDecline = (id: string) => {
    updateMentorshipRequestStatus(id, 'DECLINED');
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'DECLINED' } : r));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const acceptedRequests = requests.filter(r => r.status === 'ACCEPTED');

  return (
    <div className="max-w-4xl space-y-10 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-[#EBF1EE] border border-[#315C46] text-[#315C46] rounded-lg shadow-lg text-xs flex items-center gap-2.5 max-w-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="space-y-2 border-b border-[#E8E6E0] pb-6">
        <div className="text-[11px] font-mono tracking-widest text-[#777873] uppercase">
          Alumni Portal · Verified Alumnus
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522] tracking-tight">
              Welcome back, {profile.name}.
            </h1>
            <p className="text-sm text-[#777873] mt-1">
              Your experience can help junior students take their next career step.
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
                {completeness === 100 ? 'All essential fields complete' : 'Add remaining details to improve student reach'}
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

        {/* Overview details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777873] block">Professional Role</span>
            <span className="font-semibold text-[#242522] text-sm block">
              {profile.seekingOpportunities ? 'Seeking Opportunities' : `${profile.jobTitle} at ${profile.company}`}
            </span>
            <span className="text-[#777873] block">{profile.industry} · {profile.yearsExperience} yrs exp</span>
          </div>

          <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#777873] block">Academic Background</span>
            <span className="font-semibold text-[#242522] text-sm block">
              {profile.degree} · {profile.department}
            </span>
            <span className="text-[#777873] block">Graduated Class of {profile.graduationYear}</span>
          </div>
        </div>
      </div>

      {/* Student Connection Requests & Email Sharing */}
      <div className="space-y-4">
        <div className="border-b border-[#E8E6E0] pb-2 flex items-baseline justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl text-[#242522]">Student Connection Requests</h2>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono rounded-full font-semibold">
                  {pendingRequests.length} pending
                </span>
              )}
            </div>
            <p className="text-xs text-[#777873] mt-0.5">
              Review connection inquiries from students. Accepting shares your verified mail ID for further discussions.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 bg-white border border-[#E8E6E0] rounded-lg text-center text-xs text-[#777873] space-y-2">
            <Users className="w-6 h-6 text-[#777873] mx-auto opacity-50" />
            <div>No connection requests received yet.</div>
            <p className="text-[11px] text-[#777873]/80">
              When students find your profile in skill searches, their connection requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#777873] tracking-wider block">
                  Action Required ({pendingRequests.length})
                </span>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-5 bg-white border-2 border-amber-200/70 rounded-lg shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#242522]">{req.studentName}</span>
                            <span className="text-[11px] font-mono text-[#315C46] bg-[#EBF1EE] px-1.5 py-0.5 rounded">
                              Student
                            </span>
                          </div>
                          <span className="text-xs text-[#777873] block mt-0.5">
                            {req.studentDegree || 'B.Tech'} · {req.studentDepartment || 'Engineering'} ({req.studentYear || 'Pre-final year'})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded self-start">
                          Waiting for your approval
                        </span>
                      </div>

                      <div className="p-3 bg-[#F8F7F4] border border-[#E8E6E0] rounded text-xs space-y-1">
                        <div className="font-medium text-[#242522] flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#315C46]" />
                          <span>Topic: {req.topic}</span>
                        </div>
                        <p className="text-[#777873] italic leading-relaxed">
                          "{req.message}"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="text-[11px] text-[#777873]">
                          Accepting will share your email address so the student can write to you directly.
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecline(req.id)}
                            className="px-3 py-1.5 bg-white border border-[#E8E6E0] hover:text-[#9E3B3B] text-xs text-[#777873] rounded transition cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleOpenAcceptModal(req)}
                            className="px-4 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Accept & Share Mail ID</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted & Connected Students */}
            {acceptedRequests.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono uppercase text-[#315C46] tracking-wider block font-semibold">
                  Connected Students · Mail ID Shared ({acceptedRequests.length})
                </span>
                <div className="divide-y divide-[#E8E6E0] border border-[#E8E6E0] bg-white rounded-lg overflow-hidden">
                  {acceptedRequests.map((req) => (
                    <div key={req.id} className="p-4 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#242522]">{req.studentName}</span>
                            <span className="text-[10px] font-mono bg-[#EBF1EE] text-[#315C46] px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Connected</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-[#777873]">
                            {req.studentDegree} · {req.studentDepartment}
                          </span>
                        </div>

                        <div className="text-[10px] font-mono text-[#777873]">
                          Accepted {req.acceptedAt ? new Date(req.acceptedAt).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>

                      {/* Revealed Contact Details Box */}
                      <div className="p-3 bg-[#EBF1EE]/60 border border-[#315C46]/20 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-[#315C46] font-semibold block">
                            Shared Mail ID for talks
                          </span>
                          <span className="font-mono font-medium text-[#242522]">
                            {req.alumnusEmail || profile.email}
                          </span>
                          {req.alumnusReplyNote && (
                            <p className="text-[11px] text-[#777873] italic mt-1">
                              Your note: "{req.alumnusReplyNote}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(req.studentEmail)}
                            className="px-2.5 py-1 bg-white border border-[#E8E6E0] rounded text-[11px] text-[#242522] hover:border-[#315C46] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-[#777873]" />
                            <span>{copiedEmail === req.studentEmail ? 'Copied' : 'Copy Student Mail'}</span>
                          </button>
                          <a
                            href={`mailto:${req.studentEmail}?subject=Alumni%20Connect%20Mentorship%20-%20${encodeURIComponent(req.topic)}`}
                            className="px-3 py-1 bg-[#315C46] hover:bg-[#264736] text-white rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Email Student</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Your Expertise & Skills Manager */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-[#E8E6E0] pb-2">
          <div>
            <h2 className="font-serif text-xl text-[#242522]">Your expertise</h2>
            <p className="text-xs text-[#777873]">Skills you've verified to share with students.</p>
          </div>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="text-xs text-[#315C46] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {showAddSkill && (
          <div className="p-3 bg-white border border-[#E8E6E0] rounded-md flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Enter skill name (e.g. Distributed Systems)..."
              className="flex-1 px-3 py-1.5 bg-[#F8F7F4] border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition cursor-pointer"
            >
              Save
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {localSkills.map((s) => (
            <div
              key={s.name}
              className="px-3 py-1.5 bg-white border border-[#E8E6E0] rounded-md flex items-center gap-2 text-xs"
            >
              <span className="font-mono font-medium text-[#242522]">{s.name}</span>
              <span className="text-[10px] text-[#315C46] bg-[#EBF1EE] px-1.5 py-0.2 rounded font-mono">
                {s.proficiency}
              </span>
              <button
                onClick={() => handleRemoveSkill(s.name)}
                className="text-[#777873] hover:text-[#9E3B3B] cursor-pointer"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Ways to Contribute */}
      <div className="space-y-3">
        <div className="border-b border-[#E8E6E0] pb-2">
          <h2 className="font-serif text-xl text-[#242522]">Ways to contribute</h2>
          <p className="text-xs text-[#777873]">Mentoring and guidance topics you are open to.</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.mentoringInterests.map((opt) => (
            <span
              key={opt}
              className="px-3 py-1.5 bg-white border border-[#E8E6E0] rounded-md text-xs text-[#242522] flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-[#315C46]" />
              <span>{opt}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Skill Search using KMP over the Corpus */}
      <div className="p-6 bg-white border border-[#E8E6E0] rounded-lg shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#777873] block">
            Corpus Search · KMP Algorithm
          </span>
          <h2 className="font-serif text-xl text-[#242522]">
            Search skills across alumni corpus
          </h2>
          <p className="text-xs text-[#777873] mt-0.5">
            Execute Knuth-Morris-Pratt pattern search across the 100 historical text documents in the dataset.
          </p>
        </div>

        <form onSubmit={handleKmpSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            placeholder="Search for Java, Python, Machine Learning in corpus..."
            className="flex-1 px-3 py-2 bg-[#F8F7F4] border border-[#E8E6E0] rounded-md text-xs sm:text-sm text-[#242522] focus:outline-none focus:border-[#315C46]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded-md transition cursor-pointer shrink-0"
          >
            Run KMP Search
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-[#777873] pt-1">
          <span>Searches 100 actual .txt documents in data/</span>
          <button
            onClick={onNavigateToCorpus}
            className="text-[#315C46] hover:underline cursor-pointer"
          >
            View Corpus Catalog →
          </button>
        </div>
      </div>

      {/* Accept & Share Email Confirmation Modal */}
      {acceptingReq && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg shadow-xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E8E6E0] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#315C46] font-semibold block">
                  Accept Connection Request
                </span>
                <h3 className="font-serif text-xl font-normal text-[#242522]">
                  Share your Mail ID with {acceptingReq.studentName}
                </h3>
              </div>
              <button
                onClick={() => setAcceptingReq(null)}
                className="p-1 text-[#777873] hover:text-[#242522] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-white border border-[#E8E6E0] rounded-md text-xs space-y-1">
              <span className="text-[10px] font-mono text-[#777873] uppercase block">Student Inquiry</span>
              <div className="font-medium text-[#242522]">Topic: {acceptingReq.topic}</div>
              <p className="text-[#777873] italic">"{acceptingReq.message}"</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Mail ID to share with student for further talkings:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777873] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailToShare}
                    onChange={(e) => setEmailToShare(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                  />
                </div>
                <p className="text-[11px] text-[#777873] mt-1">
                  This email will be unlocked on {acceptingReq.studentName}'s dashboard with one-click copy and contact buttons.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#242522] mb-1">
                  Optional reply note or instructions:
                </label>
                <textarea
                  rows={3}
                  value={replyNote}
                  onChange={(e) => setReplyNote(e.target.value)}
                  placeholder="e.g., Happy to connect! Send me your resume or questions via email."
                  className="w-full px-3 py-2 bg-white border border-[#E8E6E0] rounded text-xs text-[#242522] focus:outline-none focus:border-[#315C46]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E8E6E0]">
              <button
                type="button"
                onClick={() => setAcceptingReq(null)}
                className="px-3 py-1.5 border border-[#E8E6E0] bg-white text-xs text-[#777873] hover:text-[#242522] rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="px-4 py-1.5 bg-[#315C46] hover:bg-[#264736] text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Share Mail ID</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
