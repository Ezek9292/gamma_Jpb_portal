import { ArrowRight, BriefcaseBusiness, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils/formatters';

export function ApplicantDashboardPage() {
  const { currentUser, currentProfile, applications, jobs } = usePortal();
  const mine = applications.filter((item) => item.applicantId === currentUser.id).map((application) => ({ ...application, job: jobs.find((job) => job.id === application.jobId) })).filter((item) => item.job);
  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Applicant dashboard</p><h1 className="page-title mt-3">Welcome back, {currentUser.name.split(' ')[0]}.</h1><p className="mt-3 text-slate">Track every application from one departure board.</p></div><Link to="/jobs" className="btn-primary">Browse more jobs <ArrowRight size={17} /></Link></div>
      {!currentProfile && <div className="mt-9 flex flex-col justify-between gap-5 rounded-2xl bg-amber/15 p-6 sm:flex-row sm:items-center"><div className="flex gap-4"><UserRound className="shrink-0 text-coral" /><div><h2 className="font-display font-bold">Complete your applicant profile</h2><p className="mt-1 text-sm text-slate">You’ll need a profile before applying to a role.</p></div></div><Link to="/applicant/profile" className="btn-secondary shrink-0">Complete profile</Link></div>}
      <section className="mt-10"><div className="mb-5 flex items-center gap-3"><h2 className="font-display text-2xl font-bold">My applications</h2><span className="grid h-7 min-w-7 place-items-center rounded-full bg-ink px-2 font-mono text-xs text-white">{mine.length}</span></div>
        {mine.length ? <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paperCard shadow-ticket"><div className="hidden grid-cols-[1fr_10rem_9rem_3rem] gap-4 border-b border-ink/10 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-slate md:grid"><span>Role</span><span>Applied</span><span>Status</span><span /></div>{mine.map(({ id, job, status, appliedAt }) => <div key={id} className="grid gap-4 border-b border-ink/10 p-5 last:border-0 md:grid-cols-[1fr_10rem_9rem_3rem] md:items-center md:px-6"><div><Link to={`/jobs/${job.id}`} className="font-display text-lg font-bold hover:text-coral">{job.title}</Link><p className="mt-1 text-sm text-slate">{job.company} · {job.location}</p></div><p className="font-mono text-xs text-slate">{formatDate(appliedAt)}</p><div><StatusBadge status={status} /></div><Link to={`/jobs/${job.id}`} className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 hover:border-amber" aria-label={`View ${job.title}`}><ArrowRight size={16} /></Link></div>)}</div> : <div className="rounded-2xl border border-dashed border-ink/25 bg-paperCard py-14 text-center"><BriefcaseBusiness className="mx-auto text-amber" size={34} /><h3 className="mt-4 font-display text-xl font-bold">No applications yet</h3><p className="mt-2 text-slate">The right role could be waiting on the job board.</p><Link to="/jobs" className="btn-primary mt-6">Explore open roles</Link></div>}
      </section>
    </div>
  );
}
