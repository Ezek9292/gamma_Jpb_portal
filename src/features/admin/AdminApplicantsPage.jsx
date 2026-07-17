import { ArrowLeft, FileText, Mail, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { formatDate, titleCase } from '../../utils/formatters';
import { NotFoundPage } from '../not-found/NotFoundPage';

const statuses = ['applied', 'reviewed', 'shortlisted', 'rejected'];

export function AdminApplicantsPage() {
  const { jobId } = useParams();
  const { jobs, applications, profiles, updateApplicationStatus } = usePortal();
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return <NotFoundPage compact />;
  const applicants = applications.filter((item) => item.jobId === jobId).map((application) => ({ ...application, profile: profiles[application.applicantId] || { fullName: 'Applicant', skills: [], bio: 'Profile details are not available.', resumeName: '' } }));
  return (
    <div className="page-shell py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />All job listings</Link>
      <div className="mt-7"><p className="eyebrow">Applicant manifest · {job.code}</p><h1 className="page-title mt-3">{job.title}</h1><p className="mt-3 text-slate">{applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'} for {job.company}</p></div>
      {applicants.length ? <div className="mt-10 grid gap-5">{applicants.map((applicant) => <article key={applicant.id} className="panel sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber/20 text-coral"><UserRound size={22} /></span><div><h2 className="font-display text-xl font-bold">{applicant.profile.fullName}</h2><p className="mt-1 font-mono text-xs text-slate">Applied {formatDate(applicant.appliedAt)}</p></div></div><label><span className="sr-only">Application status</span><select value={applicant.status} onChange={(event) => updateApplicationStatus(applicant.id, event.target.value)} className="field !w-auto !py-2 font-semibold">{statuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></label></div><p className="mt-5 max-w-3xl leading-7 text-slate">{applicant.profile.bio}</p><div className="mt-5 flex flex-wrap gap-2">{applicant.profile.skills.map((skill) => <span key={skill} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold">{skill}</span>)}</div><div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5"><button className="btn-secondary !min-h-9 !px-4 !py-1.5"><FileText size={15} />{applicant.profile.resumeName || 'No resume'}</button><button className="btn-secondary !min-h-9 !px-4 !py-1.5"><Mail size={15} />Contact</button></div></article>)}</div> : <div className="mt-10 rounded-2xl border border-dashed border-ink/25 bg-paperCard px-6 py-16 text-center"><UserRound className="mx-auto text-amber" size={34} /><h2 className="mt-4 font-display text-2xl font-bold">No applicants yet</h2><p className="mt-2 text-slate">New applications will appear here as soon as they arrive.</p></div>}
    </div>
  );
}
