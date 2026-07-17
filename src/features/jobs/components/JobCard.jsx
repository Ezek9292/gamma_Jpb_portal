import { ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, titleCase } from '../../../utils/formatters';
import { StatusBadge } from '../../../components/ui/StatusBadge';

export function JobCard({ job }) {
  return (
    <article className="ticket-card grid overflow-hidden rounded-2xl border border-ink/10 bg-paperCard shadow-ticket transition duration-300 hover:-translate-y-1 hover:border-amber/60 sm:grid-cols-[1fr_8.5rem]">
      <div className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <StatusBadge status={job.status} />
          <span className="status-pill bg-ink/5 text-slate">{titleCase(job.jobType)}</span>
          <span className="text-xs font-medium text-slate">{job.category}</span>
        </div>
        <Link to={`/jobs/${job.id}`} className="group inline-flex items-start gap-2">
          <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.03em] group-hover:text-coral sm:text-2xl">{job.title}</h2>
          <ArrowUpRight className="mt-0.5 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
        </Link>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate">
          <span className="flex items-center gap-1.5"><Building2 size={15} />{job.company}</span>
          <span className="flex items-center gap-1.5"><MapPin size={15} />{job.location}</span>
        </div>
        <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-6 text-slate">{job.description}</p>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-ink/25 bg-ink/[0.025] px-5 py-4 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:px-4 sm:text-center">
        <div><p className="font-mono text-[10px] uppercase tracking-widest text-slate">Posted</p><p className="mt-1 font-mono text-xs font-semibold">{formatDate(job.postedAt).replace(', 2026', '')}</p></div>
        <div className="sm:mt-6"><p className="font-mono text-[10px] uppercase tracking-widest text-slate">Job code</p><p className="mt-1 font-mono text-sm font-bold text-coral">{job.code}</p></div>
      </div>
    </article>
  );
}
