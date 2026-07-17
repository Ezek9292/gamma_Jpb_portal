import { ArrowRight, BriefcaseBusiness, Plus, TicketCheck, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { formatDate } from '../../utils/formatters';

export function AdminDashboardPage() {
  const { currentUser, jobs, applications, startupError, updateJobStatus } = usePortal();
  const [error, setError] = useState('');
  const [updatingJobId, setUpdatingJobId] = useState('');
  const stats = [
    [BriefcaseBusiness, 'Open roles', jobs.filter((job) => job.status === 'open').length],
    [UsersRound, 'Applications', applications.length],
    [TicketCheck, 'Shortlisted', applications.filter((item) => item.status === 'shortlisted').length],
  ];
  const changeJobStatus = async (jobId, status) => {
    setError('');
    setUpdatingJobId(jobId);
    try {
      await updateJobStatus(jobId, status);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingJobId('');
    }
  };
  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Administration dashboard</p><h1 className="page-title mt-3">Welcome, {currentUser.name.split(' ')[0]}.</h1><p className="mt-3 text-slate">Manage job listings, review applicants, and update application statuses.</p></div><div className="flex flex-wrap gap-3"><Link to="/admin/signup" className="btn-secondary">Add administrator</Link><Link to="/admin/jobs/new" className="btn-primary"><Plus size={18} />Post a job</Link></div></div>
      {startupError && <p className="mt-6 rounded-lg bg-coral/10 p-3 text-sm text-coral" role="alert">Some dashboard data could not be loaded: {startupError}</p>}
      {error && <p className="mt-6 rounded-lg bg-coral/10 p-3 text-sm text-coral" role="alert">{error}</p>}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">{stats.map(([Icon, label, value]) => <div key={label} className="panel !p-5"><Icon className="text-amber" size={22} /><p className="mt-5 font-display text-4xl font-bold tracking-[-0.04em]">{value}</p><p className="mt-1 text-sm text-slate">{label}</p></div>)}</div>
      <section className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Job listings</h2><span className="font-mono text-xs text-slate">{jobs.length} TOTAL</span></div>
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paperCard shadow-ticket"><div className="hidden grid-cols-[1fr_8rem_7rem_8rem] gap-4 border-b border-ink/10 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-slate md:grid"><span>Role</span><span>Posted</span><span>Applicants</span><span>Status</span></div>{jobs.map((job) => { const count = applications.filter((item) => item.jobId === job.id).length; return <div key={job.id} className="grid gap-4 border-b border-ink/10 p-5 last:border-0 md:grid-cols-[1fr_8rem_7rem_8rem] md:items-center md:px-6"><div><Link to={`/jobs/${job.id}`} className="font-display text-lg font-bold hover:text-coral">{job.title}</Link><p className="mt-1 text-sm text-slate">{job.company} · <span className="font-mono text-xs">{job.code}</span></p></div><p className="font-mono text-xs text-slate">{formatDate(job.postedAt).replace(', 2026', '')}</p><Link to={`/admin/jobs/${job.id}/applicants`} className="inline-flex items-center gap-2 font-semibold text-coral hover:underline">{count} <ArrowRight size={15} /></Link><select aria-label={`Status for ${job.title}`} value={job.status} disabled={updatingJobId === job.id} onChange={(event) => changeJobStatus(job.id, event.target.value)} className="field !py-2 font-semibold"><option value="open">Open</option><option value="closed">Closed</option></select></div>; })}</div>
      </section>
    </div>
  );
}
