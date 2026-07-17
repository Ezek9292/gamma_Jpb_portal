import { ArrowLeft, BriefcaseBusiness, Check, Clock3, MapPin, WalletCards } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, titleCase } from '../../utils/formatters';
import { NotFoundPage } from '../not-found/NotFoundPage';

export function JobDetailPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { jobs, currentUser, currentProfile, hasApplied, applyToJob } = usePortal();
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return <NotFoundPage compact />;
  const applied = hasApplied(job.id);

  const handleApply = () => {
    if (!currentUser) { navigate('/login', { state: { from: location.pathname, message: 'Log in to apply for this role.' } }); return; }
    if (currentUser.role !== 'applicant') return;
    if (!currentProfile) { navigate('/applicant/profile', { state: { from: location.pathname } }); return; }
    applyToJob(job.id);
  };

  let buttonText = 'Apply for this role';
  if (applied) buttonText = 'Applied';
  else if (job.status === 'closed') buttonText = 'Applications closed';
  else if (currentUser?.role === 'admin') buttonText = 'Applicant accounts only';

  return (
    <div className="page-shell py-10 sm:py-14">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />Back to all jobs</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <article>
          <div className="flex flex-wrap gap-2"><StatusBadge status={job.status} /><span className="status-pill bg-ink/5 text-slate">{titleCase(job.jobType)}</span><span className="status-pill bg-amber/15 text-[#855711]">{job.category}</span></div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-6xl">{job.title}</h1>
          <p className="mt-3 font-display text-xl font-semibold text-coral">{job.company}</p>
          <div className="mt-7 grid gap-3 text-sm text-slate sm:grid-cols-2">
            <Meta icon={MapPin} text={job.location} /><Meta icon={WalletCards} text={job.salaryRange} /><Meta icon={Clock3} text={`Posted ${formatDate(job.postedAt)}`} /><Meta icon={BriefcaseBusiness} text={titleCase(job.jobType)} />
          </div>
          <div className="route-line my-10 h-px" />
          <section><h2 className="font-display text-2xl font-bold">About the role</h2><p className="mt-4 max-w-3xl text-base leading-8 text-slate">{job.description}</p></section>
          <section className="mt-10"><h2 className="font-display text-2xl font-bold">What you’ll bring</h2><ul className="mt-5 grid gap-4">{job.requirements.map((item) => <li key={item} className="flex gap-3 text-slate"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest/10 text-forest"><Check size={14} /></span><span>{item}</span></li>)}</ul></section>
        </article>
        <aside className="ticket-card sticky top-28 rounded-2xl border border-ink/10 bg-paperCard p-6 shadow-ticket">
          <p className="font-mono text-xs uppercase tracking-widest text-slate">Boarding pass</p><p className="mt-2 font-mono text-xl font-bold text-coral">{job.code}</p><div className="route-line my-6 h-px" />
          <p className="font-display text-lg font-bold">Ready to make your move?</p><p className="mt-2 text-sm leading-6 text-slate">Your profile will be shared with {job.company}.</p>
          <button onClick={handleApply} disabled={applied || job.status === 'closed' || currentUser?.role === 'admin'} className="btn-primary mt-6 w-full">{applied && <Check size={17} />}{buttonText}</button>
          {!currentUser && <p className="mt-4 text-center text-xs text-slate">You’ll be asked to log in first.</p>}
          {currentUser?.role === 'applicant' && !currentProfile && <Link to="/applicant/profile" state={{ from: location.pathname }} className="mt-4 block text-center text-xs font-semibold text-coral hover:underline">Complete your profile to apply</Link>}
        </aside>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, text }) { return <span className="flex items-center gap-2"><Icon className="text-amber" size={18} />{text}</span>; }
