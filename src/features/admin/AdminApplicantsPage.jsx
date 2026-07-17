import { ArrowLeft, FileText, Phone, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { formatDate, titleCase } from '../../utils/formatters';
import { NotFoundPage } from '../not-found/NotFoundPage';

const statuses = ['applied', 'reviewed', 'shortlisted', 'rejected'];
const fallbackProfile = { fullName: 'Applicant', skills: [], bio: 'Profile details are not available.', phone: '' };

export function AdminApplicantsPage() {
  const { jobId } = useParams();
  const { jobs, applications, loadApplicationsForJob, updateApplicationStatus } = usePortal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const job = jobs.find((item) => item.id === jobId);
  const applicants = applications.filter((item) => item.jobId === jobId);

  useEffect(() => {
    let active = true;
    loadApplicationsForJob(jobId)
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // The provider method intentionally runs once for this job route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const changeStatus = async (applicationId, status) => {
    setError('');
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingId('');
    }
  };

  if (!job) return <NotFoundPage compact />;

  return (
    <div className="page-shell py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />All job listings</Link>
      <div className="mt-7"><p className="eyebrow">Applicants · {job.code}</p><h1 className="page-title mt-3">{job.title}</h1><p className="mt-3 text-slate">{applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'} for {job.company}</p></div>
      {error && <p className="mt-6 rounded-lg bg-coral/10 p-3 text-sm text-coral" role="alert">{error}</p>}
      {loading ? <div className="py-16 text-center text-slate" role="status">Loading applicants…</div> : applicants.length ? <div className="mt-10 grid gap-5">{applicants.map((applicant) => {
        const profile = applicant.profile || fallbackProfile;
        return <article key={applicant.id} className="panel sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber/20 text-coral"><UserRound size={22} /></span><div><h2 className="font-display text-xl font-bold">{profile.fullName}</h2><p className="mt-1 font-mono text-xs text-slate">Applied {formatDate(applicant.appliedAt)}</p></div></div><label><span className="sr-only">Application status</span><select value={applicant.status} disabled={updatingId === applicant.id} onChange={(event) => changeStatus(applicant.id, event.target.value)} className="field !w-auto !py-2 font-semibold">{statuses.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></label></div><p className="mt-5 max-w-3xl leading-7 text-slate">{profile.bio}</p><div className="mt-5 flex flex-wrap gap-2">{(profile.skills || []).map((skill) => <span key={skill} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold">{skill}</span>)}</div><div className="mt-6 flex flex-wrap gap-3 border-t border-ink/10 pt-5"><DocumentLink document={applicant.documents?.cv} label="CV" /><DocumentLink document={applicant.documents?.coverLetter} label="Cover letter" />{profile.phone && <a href={`tel:${profile.phone}`} className="btn-secondary !min-h-9 !px-4 !py-1.5"><Phone size={15} />Contact</a>}</div></article>;
      })}</div> : <div className="mt-10 rounded-2xl border border-dashed border-ink/25 bg-paperCard px-6 py-16 text-center"><UserRound className="mx-auto text-amber" size={34} /><h2 className="mt-4 font-display text-2xl font-bold">No applicants yet</h2><p className="mt-2 text-slate">New applications will appear here when candidates apply for this role.</p></div>}
    </div>
  );
}

function DocumentLink({ document, label }) {
  const name = document?.originalName;
  if (!document?.url) return <span title={`${label} not provided`} className="btn-secondary !min-h-9 !max-w-full !px-4 !py-1.5 opacity-60"><FileText size={15} />No {label.toLowerCase()}</span>;
  return <a href={document.url} target="_blank" rel="noreferrer noopener" title={name || label} className="btn-secondary !min-h-9 !max-w-full !px-4 !py-1.5"><FileText size={15} /><span className="max-w-52 truncate">{name || label}</span></a>;
}
