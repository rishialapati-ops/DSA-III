/**
 * Alumni Connect — Intelligent Alumni Document Search
 * Editorial Minimalism & Academic Technology Design
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ResultsTable } from './components/ResultsTable';
import { DocumentViewer } from './components/DocumentViewer';
import { CorpusExplorer } from './components/CorpusExplorer';
import { KmpVisualizer } from './components/KmpVisualizer';
import { SearchHistoryView } from './components/SearchHistoryView';
import { ProjectInfo } from './components/ProjectInfo';

// Auth & Role-based Dashboards
import { AuthLanding } from './components/auth/AuthLanding';
import { SignInModal } from './components/auth/SignInModal';
import { AlumniOnboarding } from './components/auth/AlumniOnboarding';
import { StudentOnboarding } from './components/auth/StudentOnboarding';
import { AlumniDashboard } from './components/dashboard/AlumniDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';

import { 
  getCurrentUser, 
  setCurrentUser, 
  logoutUser, 
  getRegisteredUsers,
  saveUser 
} from './auth/authService';
import { UserProfile, UserRole, AlumniProfile, StudentProfile } from './auth/types';

import { 
  getCorpusDocuments, 
  getDocumentById, 
  executeCorpusSearch 
} from './kmp/corpusService';
import { KmpSearchResult, AlumniDocument } from './kmp/types';

export default function App() {
  // Authentication & Role State
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => getCurrentUser());
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [onboardingRole, setOnboardingRole] = useState<UserRole | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Core Application Views
  const [activeTab, setActiveTab] = useState<string>(() => {
    const user = getCurrentUser();
    return user ? 'my-dashboard' : 'overview';
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<KmpSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Retrieve full loaded corpus (100 documents)
  const documents = useMemo(() => getCorpusDocuments(), []);

  // Currently inspected document
  const selectedDocument = useMemo(() => {
    if (!selectedDocumentId) return null;
    return getDocumentById(selectedDocumentId) || null;
  }, [selectedDocumentId]);

  // Execute search across corpus using true KMP
  const handleSearch = (pattern: string, caseSensitive: boolean = false, wholeWord: boolean = false) => {
    setIsSearching(true);
    setSelectedDocumentId(null);

    setTimeout(() => {
      try {
        const result = executeCorpusSearch(pattern, caseSensitive, wholeWord);
        setSearchResult(result);
        setActiveTab('search');
      } catch (err: any) {
        alert(err.message || 'An error occurred during search.');
      } finally {
        setIsSearching(false);
      }
    }, 40);
  };

  const handleSelectDocument = (docId: string) => {
    setSelectedDocumentId(docId);
  };

  const handleBackFromDocument = () => {
    setSelectedDocumentId(null);
  };

  const handleRerunSearch = (pattern: string, caseSensitive: boolean, wholeWord: boolean) => {
    handleSearch(pattern, caseSensitive, wholeWord);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUserState(user);
    setIsSignInOpen(false);
    setIsGuestMode(false);
    setActiveTab('my-dashboard');
    setSelectedDocumentId(null);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const users = getRegisteredUsers();
    const demo = users.find(u => u.role === role);
    if (demo) {
      setCurrentUser(demo);
      setCurrentUserState(demo);
      setIsSignInOpen(false);
      setIsGuestMode(false);
      setActiveTab('my-dashboard');
      setSelectedDocumentId(null);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUserState(null);
    setIsGuestMode(false);
    setActiveTab('overview');
    setSelectedDocumentId(null);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    saveUser(profile);
    setCurrentUserState(profile);
    setOnboardingRole(null);
    setIsEditingProfile(false);
    setIsGuestMode(false);
    setActiveTab('my-dashboard');
  };

  // If user is not logged in, not in guest mode, and not onboarding -> Render Auth Landing Screen
  if (!currentUser && !isGuestMode) {
    if (onboardingRole === 'ALUMNI') {
      return (
        <AlumniOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => setOnboardingRole(null)}
        />
      );
    }

    if (onboardingRole === 'STUDENT') {
      return (
        <StudentOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => setOnboardingRole(null)}
        />
      );
    }

    return (
      <>
        <AuthLanding
          onSelectRole={(role) => setOnboardingRole(role)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          onQuickDemoLogin={handleQuickDemoLogin}
          onEnterGuestMode={() => {
            setIsGuestMode(true);
            setActiveTab('overview');
          }}
        />

        <SignInModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
          onSuccess={handleLoginSuccess}
          onNavigateToRegister={(role) => {
            setIsSignInOpen(false);
            setOnboardingRole(role);
          }}
          onQuickDemoLogin={handleQuickDemoLogin}
        />
      </>
    );
  }

  // Edit Profile Modal / Flow
  if (isEditingProfile && currentUser) {
    if (currentUser.role === 'ALUMNI') {
      return (
        <AlumniOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => setIsEditingProfile(false)}
        />
      );
    } else {
      return (
        <StudentOnboarding
          onComplete={handleOnboardingComplete}
          onCancel={() => setIsEditingProfile(false)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#242522] flex flex-col lg:flex-row font-sans selection:bg-[#F5E7A8] selection:text-[#242522]">
      
      {/* Editorial Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedDocumentId(null);
        }}
        corpusCount={documents.length}
        hasResults={searchResult !== null}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenRoleSelection={() => {
          setIsGuestMode(false);
          setCurrentUserState(null);
        }}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 min-h-screen px-4 sm:px-8 lg:px-12 py-8 lg:py-10 max-w-5xl">
        
        {/* Document Viewer takes precedence if a document is selected */}
        {selectedDocument ? (
          <DocumentViewer
            document={selectedDocument}
            searchPattern={searchResult?.pattern}
            caseSensitive={searchResult?.caseSensitive}
            wholeWord={searchResult?.wholeWord}
            onBack={handleBackFromDocument}
            theme="light"
          />
        ) : (
          <>
            {/* Personalized Role-Based Dashboards */}
            {activeTab === 'my-dashboard' && currentUser && (
              currentUser.role === 'ALUMNI' ? (
                <AlumniDashboard
                  profile={currentUser as AlumniProfile}
                  onSearchCorpus={(pattern) => handleSearch(pattern, false, false)}
                  onSelectCorpusDoc={handleSelectDocument}
                  onOpenEditProfile={() => setIsEditingProfile(true)}
                  onNavigateToCorpus={() => setActiveTab('documents')}
                />
              ) : (
                <StudentDashboard
                  profile={currentUser as StudentProfile}
                  onSearchCorpus={(pattern) => handleSearch(pattern, false, false)}
                  onSelectCorpusDoc={handleSelectDocument}
                  onOpenEditProfile={() => setIsEditingProfile(true)}
                  onNavigateToCorpus={() => setActiveTab('documents')}
                  onNavigateToVisualizer={() => setActiveTab('visualizer')}
                />
              )
            )}

            {/* General KMP Corpus Overview & Search Interface */}
            {activeTab === 'overview' && (
              <Dashboard
                totalDocs={100}
                loadedDocs={documents.length}
                lastResult={searchResult}
                onSearch={handleSearch}
                isSearching={isSearching}
                sampleDocs={documents}
                onSelectDocument={handleSelectDocument}
                onNavigateToResults={() => setActiveTab('search')}
                onNavigateToCorpus={() => setActiveTab('documents')}
                onNavigateToVisualizer={() => setActiveTab('visualizer')}
                theme="light"
              />
            )}

            {/* Search Results Table with KPIs & Snippets */}
            {activeTab === 'search' && (
              <ResultsTable
                searchResult={searchResult}
                onSelectDocument={handleSelectDocument}
                onBackToSearch={() => setActiveTab(currentUser ? 'my-dashboard' : 'overview')}
                theme="light"
              />
            )}

            {/* Complete 100-Document Corpus Catalog */}
            {activeTab === 'documents' && (
              <CorpusExplorer
                documents={documents}
                onSelectDocument={handleSelectDocument}
                onSearchPatternFromCorpus={(term) => handleSearch(term, false, false)}
                theme="light"
              />
            )}

            {/* Historical Search Queries & Timestamps */}
            {activeTab === 'history' && (
              <SearchHistoryView
                onRerunSearch={handleRerunSearch}
              />
            )}

            {/* Interactive Step-by-Step KMP Algorithm Visualizer */}
            {activeTab === 'visualizer' && (
              <KmpVisualizer />
            )}

            {/* Academic Project Info & Benchmark Details */}
            {activeTab === 'info' && (
              <ProjectInfo />
            )}
          </>
        )}
      </main>

      {/* Global Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSuccess={handleLoginSuccess}
        onNavigateToRegister={(role) => {
          setIsSignInOpen(false);
          setOnboardingRole(role);
        }}
        onQuickDemoLogin={handleQuickDemoLogin}
      />
    </div>
  );
}
