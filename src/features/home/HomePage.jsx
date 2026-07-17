import { ArrowRight, BriefcaseBusiness, CircleCheck, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { JobCard } from '../jobs/components/JobCard';

export function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { jobs, jobsLoading } = usePortal();
  const availableRoles = jobs
    .filter((job) => job.status === 'open')
    .sort((first, second) => Number(second.featured) - Number(first.featured))
    .slice(0, 3);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(query.trim() ? `/jobs?q=${encodeURIComponent(query.trim())}` : '/jobs');
  };

  return (
    <>
      <section className="overflow-hidden bg-ink pb-20 pt-16 text-white sm:pb-28 sm:pt-24">
        <div className="page-shell relative">
          <div className="absolute -right-32 -top-36 h-96 w-96 rounded-full border-[70px] border-white/[0.035]" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-amber">Build your career with GammaJobs</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem]">Find work that<br /><span className="text-amber">matches your ambition.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">Explore relevant roles from growing organizations across Africa and beyond. Search, apply, and manage your applications in one professional platform.</p>
          </div>
          <form onSubmit={submitSearch} className="relative mt-10 flex max-w-3xl flex-col gap-2 rounded-2xl bg-paperCard p-2 text-ink shadow-2xl sm:flex-row" role="search">
            <label className="flex flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-coral" size={21} />
              <span className="sr-only">Search jobs</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full bg-transparent text-base outline-none placeholder:text-slate/60" placeholder="Job title or company" />
            </label>
            <button className="btn-primary sm:min-w-36" type="submit">Find jobs <ArrowRight size={17} /></button>
          </form>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wider text-white/50">
            <span>{jobs.filter((job) => job.status === 'open').length} open roles</span><span>8 categories</span><span>Remote-friendly</span>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Available roles</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Explore current opportunities.</h2></div>
          <Link to="/jobs" className="inline-flex items-center gap-2 font-display text-sm font-bold text-coral hover:gap-3">View all roles <ArrowRight size={17} /></Link>
        </div>
        {jobsLoading ? <div className="rounded-2xl border border-ink/10 bg-paperCard py-12 text-center text-slate" role="status">Loading available roles…</div> : availableRoles.length ? <div className="grid gap-5">{availableRoles.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="rounded-2xl border border-dashed border-ink/20 bg-paperCard py-12 text-center"><p className="font-display text-lg font-bold">No open roles at the moment</p><p className="mt-2 text-sm text-slate">Please check back soon for new opportunities.</p></div>}
      </section>

      <section className="border-y border-ink/10 bg-white/45 py-20">
        <div className="page-shell">
          <div className="max-w-xl"><p className="eyebrow">How it works</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Apply for your next role in three steps.</h2></div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              [Search, '01', 'Search opportunities', 'Find relevant positions by job title, company, location, or category.'],
              [Sparkles, '02', 'Create your profile', 'Present your experience, skills, and qualifications to prospective employers.'],
              [CircleCheck, '03', 'Submit applications', 'Upload your CV and cover letter, then track each application in one place.'],
            ].map(([Icon, number, title, copy]) => <div key={number} className="relative border-t-2 border-ink pt-6"><span className="font-mono text-xs font-bold text-coral">{number}</span><Icon className="mt-7 text-amber" size={28} /><h3 className="mt-5 font-display text-xl font-bold">{title}</h3><p className="mt-2 leading-7 text-slate">{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-amber p-8 sm:flex-row sm:items-center sm:p-12">
          <div className="max-w-2xl"><BriefcaseBusiness size={30} /><h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Take the next step in your career.</h2><p className="mt-3 text-ink/70">Create your profile and apply confidently to roles that match your goals.</p></div>
          <Link to="/signup?role=applicant" className="btn-dark shrink-0">Create free profile <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
