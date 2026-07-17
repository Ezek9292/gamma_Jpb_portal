import { createContext, useContext, useEffect, useState } from 'react';
import { ApiError, apiRequest, authToken } from '../../services/api';

const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [startupError, setStartupError] = useState('');

  useEffect(() => {
    let active = true;

    async function initialize() {
      let loadedJobs = [];
      try {
        const data = await apiRequest('/jobs');
        loadedJobs = data.jobs || [];
        if (active) setJobs(loadedJobs);
      } catch (error) {
        if (active) setStartupError(error.message);
      } finally {
        if (active) setJobsLoading(false);
      }

      if (!authToken.get()) {
        if (active) setAuthLoading(false);
        return;
      }

      try {
        const { user } = await apiRequest('/auth/me');
        if (!active) return;
        setCurrentUser(user);
        if (user.role === 'applicant') {
          const [profileResult, applicationResult] = await Promise.allSettled([
            apiRequest('/applicants/profile'),
            apiRequest('/applications/me'),
          ]);
          if (!active) return;
          if (profileResult.status === 'fulfilled') setCurrentProfile(profileResult.value.profile);
          else if (profileResult.reason.status !== 404) throw profileResult.reason;
          if (applicationResult.status === 'fulfilled') setApplications(applicationResult.value.applications || []);
          else throw applicationResult.reason;
        } else if (user.role === 'admin' && loadedJobs.length) {
          const results = await Promise.all(loadedJobs.map((job) => apiRequest(`/jobs/${job.id}/applications`)));
          if (active) setApplications(results.flatMap((result) => result.applications || []));
        }
      } catch (error) {
        if (error.status === 401) {
          authToken.clear();
          if (active) setCurrentUser(null);
        } else if (active) {
          setStartupError(error.message);
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    initialize();
    return () => { active = false; };
  }, []);

  const handleProtectedError = (error) => {
    if (error.status === 401) {
      authToken.clear();
      setCurrentUser(null);
      setCurrentProfile(null);
      setApplications([]);
    }
    throw error;
  };

  const refreshJobs = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
    const data = await apiRequest(`/jobs${params.size ? `?${params}` : ''}`);
    setJobs(data.jobs || []);
    return data.jobs || [];
  };

  const loadApplicantData = async () => {
    try {
      const [profileResult, applicationResult] = await Promise.allSettled([
        apiRequest('/applicants/profile'),
        apiRequest('/applications/me'),
      ]);
      if (profileResult.status === 'fulfilled') setCurrentProfile(profileResult.value.profile);
      else if (profileResult.reason.status === 404) setCurrentProfile(null);
      else throw profileResult.reason;
      if (applicationResult.status === 'fulfilled') setApplications(applicationResult.value.applications || []);
      else throw applicationResult.reason;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const loadAdminApplications = async () => {
    try {
      const results = await Promise.all(jobs.map((job) => apiRequest(`/jobs/${job.id}/applications`)));
      const loaded = results.flatMap((result) => result.applications || []);
      setApplications(loaded);
      return loaded;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const login = async ({ email, password, expectedRole }) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (expectedRole && data.user.role !== expectedRole) {
        return { ok: false, message: `Use the ${data.user.role} login page for this account.` };
      }
      authToken.set(data.token);
      setCurrentUser(data.user);
      if (data.user.role === 'applicant') await loadApplicantData();
      else await loadAdminApplications();
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message, errors: error.errors || [] };
    }
  };

  const signup = async ({ name, email, password }) => {
    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'applicant' }),
      });
      authToken.set(data.token);
      setCurrentUser(data.user);
      setCurrentProfile(null);
      setApplications([]);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message, errors: error.errors || [] };
    }
  };

  const createAdmin = async ({ name, email, password }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { ok: false, message: 'Administrator authorization is required.' };
    }
    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'admin' }),
      });
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message, errors: error.errors || [] };
    }
  };

  const logout = () => {
    authToken.clear();
    setCurrentUser(null);
    setCurrentProfile(null);
    setApplications([]);
  };

  const saveProfile = async (profile, resumeFile) => {
    try {
      const payload = {
        fullName: profile.fullName,
        phone: profile.phone,
        bio: profile.bio,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
      };
      const data = await apiRequest('/applicants/profile', { method: 'PUT', body: JSON.stringify(payload) });
      let savedProfile = data.profile;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await apiRequest('/applicants/profile/resume', { method: 'POST', body: formData });
        const refreshedData = await apiRequest('/applicants/profile');
        savedProfile = refreshedData.profile;
      }
      setCurrentProfile(savedProfile);
      return savedProfile;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const applyToJob = async (jobId, documents) => {
    try {
      const formData = new FormData();
      formData.append('cv', documents.cv);
      formData.append('coverLetter', documents.coverLetter);
      const data = await apiRequest(`/jobs/${jobId}/apply`, { method: 'POST', body: formData });
      setApplications((items) => [data.application, ...items]);
      return data.application;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const addJob = async (job) => {
    try {
      const data = await apiRequest('/jobs', { method: 'POST', body: JSON.stringify(job) });
      setJobs((items) => [data.job, ...items]);
      return data.job;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const updateJob = async (jobId, updates) => {
    try {
      const data = await apiRequest(`/jobs/${jobId}`, { method: 'PUT', body: JSON.stringify(updates) });
      setJobs((items) => items.map((job) => job.id === jobId ? data.job : job));
      return data.job;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      const data = await apiRequest(`/jobs/${jobId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setJobs((items) => items.map((job) => job.id === jobId ? data.job : job));
      return data.job;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const loadApplicationsForJob = async (jobId) => {
    try {
      const data = await apiRequest(`/jobs/${jobId}/applications`);
      setApplications((items) => [...items.filter((item) => item.jobId !== jobId), ...(data.applications || [])]);
      return data.applications || [];
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const data = await apiRequest(`/applications/${applicationId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setApplications((items) => items.map((item) => item.id === applicationId ? data.application : item));
      return data.application;
    } catch (error) {
      handleProtectedError(error);
    }
  };

  const value = {
    jobs, applications, currentUser, currentProfile, authLoading, jobsLoading, startupError,
    login, signup, createAdmin, logout, saveProfile, applyToJob, addJob, updateJob, updateJobStatus,
    updateApplicationStatus, loadApplicationsForJob, refreshJobs,
    hasApplied: (jobId) => applications.some((item) => item.jobId === jobId && item.applicantId === currentUser?.id),
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new ApiError('usePortal must be used within PortalProvider');
  return context;
}
