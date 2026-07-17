import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/routing/ProtectedRoute';
import { AdminApplicantsPage } from '../features/admin/AdminApplicantsPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { NewJobPage } from '../features/admin/NewJobPage';
import { ApplicantDashboardPage } from '../features/applicant/ApplicantDashboardPage';
import { ProfilePage } from '../features/applicant/ProfilePage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { HomePage } from '../features/home/HomePage';
import { JobDetailPage } from '../features/jobs/JobDetailPage';
import { JobsPage } from '../features/jobs/JobsPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute role="applicant" />}>
          <Route path="applicant/dashboard" element={<ApplicantDashboardPage />} />
          <Route path="applicant/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/jobs/new" element={<NewJobPage />} />
          <Route path="admin/jobs/:jobId/applicants" element={<AdminApplicantsPage />} />
        </Route>

        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
