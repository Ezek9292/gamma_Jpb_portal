import { createContext, useContext, useState } from 'react';
import { demoUsers, initialApplications, initialJobs, initialProfiles } from '../../data/jobs';

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [users, setUsers] = useState(demoUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);

  const login = ({ email, password }) => {
    const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!user) return { ok: false, message: 'We could not match that email and password.' };
    setCurrentUser(user);
    return { ok: true, user };
  };

  const signup = ({ name, email, password, role }) => {
    if (users.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, message: 'An account with this email already exists.' };
    }
    const user = { id: `${role}-${Date.now()}`, name: name.trim(), email: email.trim(), password, role };
    setUsers((items) => [...items, user]);
    setCurrentUser(user);
    return { ok: true, user };
  };

  const logout = () => setCurrentUser(null);

  const saveProfile = (profile) => {
    setProfiles((items) => ({ ...items, [currentUser.id]: profile }));
  };

  const applyToJob = (jobId) => {
    if (!currentUser || applications.some((item) => item.jobId === jobId && item.applicantId === currentUser.id)) return;
    setApplications((items) => [...items, { id: `application-${Date.now()}`, jobId, applicantId: currentUser.id, status: 'applied', appliedAt: new Date().toISOString().slice(0, 10) }]);
  };

  const addJob = (job) => {
    const newJob = { ...job, id: `job-${Date.now()}`, code: `${job.category.slice(0, 3).toUpperCase()}-${String(Date.now()).slice(-3)}`, postedBy: currentUser.id, postedAt: new Date().toISOString().slice(0, 10), status: 'open', requirements: job.requirements.filter(Boolean) };
    setJobs((items) => [newJob, ...items]);
    return newJob;
  };

  const updateApplicationStatus = (applicationId, status) => {
    setApplications((items) => items.map((item) => item.id === applicationId ? { ...item, status } : item));
  };

  const value = {
    jobs, applications, currentUser, profiles, login, signup, logout, saveProfile,
    applyToJob, addJob, updateApplicationStatus,
    currentProfile: currentUser ? profiles[currentUser.id] : null,
    hasApplied: (jobId) => Boolean(currentUser && applications.some((item) => item.jobId === jobId && item.applicantId === currentUser.id)),
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

// The hook intentionally shares this module with its provider for a compact MVP state boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error('usePortal must be used within PortalProvider');
  return context;
}
