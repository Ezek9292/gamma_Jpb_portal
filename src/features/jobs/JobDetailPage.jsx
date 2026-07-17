import { useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, Check, Clock3, FileUp, MapPin, WalletCards, X } from 'lucide-react';
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
  const [showApplication, setShowApplication] = useState(false);
  const [documents, setDocuments] = useState({ cv: null, coverLetter: null });
  const [formError, setFormError] = useState('');
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return <NotFoundPage compact />;
  const applied = hasApplied(job.id);

  const handleApply = () => {
    if (!currentUser) { navigate('/login', { state: { from: location.pathname, message: 'Log in to apply for this role.' } }); return; }
    if (currentUser.role !== 'applicant') return;
    if (!currentProfile) { navigate('/applicant/profile', { state: { from: location.pathname } }); return; }
    setShowApplication(true);
  };

  const chooseDocument = (field, file) => {
    setFormError('');
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(extension)) {
      setFormError('Please upload PDF, DOC, or DOCX files only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Each document must be 5 MB or smaller.');
      return;
    }
    setDocuments((value) => ({ ...value, [field]: file }));
  };

  const submitApplication = (event) => {
    event.preventDefault();
    if (!documents.cv || !documents.coverLetter) {
      setFormError('Upload both your CV and cover letter to continue.');
      return;
    }
    if (applyToJob(job.id, documents)) setShowApplication(false);
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
          <p className="font-display text-lg font-bold">Ready to make your move?</p><p className="mt-2 text-sm leading-6 text-slate">Your profile, CV, and cover letter will be shared with {job.company}.</p>
          {!showApplication && <button onClick={handleApply} disabled={applied || job.status === 'closed' || currentUser?.role === 'admin'} className="btn-primary mt-6 w-full">{applied && <Check size={17} />}{buttonText}</button>}
          {showApplication && !applied && (
            <form onSubmit={submitApplication} className="mt-6 grid gap-4" noValidate>
              <div className="flex items-center justify-between gap-3"><h2 className="font-display font-bold">Application documents</h2><button type="button" onClick={() => setShowApplication(false)} className="grid h-8 w-8 place-items-center rounded-lg text-slate hover:bg-ink/5 hover:text-ink" aria-label="Close application form"><X size={17} /></button></div>
              <DocumentUpload label="CV or resume" file={documents.cv} onChange={(file) => chooseDocument('cv', file)} />
              <DocumentUpload label="Cover letter" file={documents.coverLetter} onChange={(file) => chooseDocument('coverLetter', file)} />
              <p className="text-xs leading-5 text-slate">PDF, DOC, or DOCX · 5 MB maximum per file</p>
              {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" role="alert">{formError}</p>}
              <button type="submit" className="btn-primary w-full">Submit application</button>
            </form>
          )}
          {!currentUser && <p className="mt-4 text-center text-xs text-slate">You’ll be asked to log in first.</p>}
          {currentUser?.role === 'applicant' && !currentProfile && <Link to="/applicant/profile" state={{ from: location.pathname }} className="mt-4 block text-center text-xs font-semibold text-coral hover:underline">Complete your profile to apply</Link>}
        </aside>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, text }) { return <span className="flex items-center gap-2"><Icon className="text-amber" size={18} />{text}</span>; }

function DocumentUpload({ label, file, onChange }) {
  return (
    <label>
      <span className="label">{label}</span>
      <span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/25 p-3 transition hover:border-amber">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber/15 text-coral"><FileUp size={18} /></span>
        <span className="min-w-0 text-xs"><strong className="block truncate font-display text-sm">{file?.name || `Choose ${label.toLowerCase()}`}</strong><span className="text-slate">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Select a file'}</span></span>
        <input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={(event) => onChange(event.target.files?.[0])} />
      </span>
    </label>
  );
}
