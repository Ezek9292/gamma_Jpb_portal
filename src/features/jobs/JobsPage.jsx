import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { titleCase } from '../../utils/formatters';
import { JobCard } from './components/JobCard';

export function JobsPage() {
  const { jobs, jobsLoading, startupError } = usePortal();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [category, setCategory] = useState('');

  const options = (key) => [...new Set(jobs.map((job) => job[key]))].sort();
  const filteredJobs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = !search || job.title.toLowerCase().includes(search) || job.company.toLowerCase().includes(search);
      return matchesSearch && (!location || job.location === location) && (!jobType || job.jobType === jobType) && (!category || job.category === category);
    });
  }, [jobs, query, location, jobType, category]);

  const clearFilters = () => { setQuery(''); setLocation(''); setJobType(''); setCategory(''); };
  const hasFilters = query || location || jobType || category;

  return (
    <div className="page-shell py-12 sm:py-16">
      <div className="max-w-3xl"><p className="eyebrow">Job opportunities</p><h1 className="page-title mt-3">Find your next role.</h1><p className="mt-4 text-lg text-slate">Search current vacancies from organizations across a range of industries.</p></div>
      <div className="mt-10 rounded-2xl border border-ink/10 bg-ink p-4 shadow-ticket sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <label className="relative"><span className="sr-only">Search jobs</span><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" size={18} /><input className="field !pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or company" /></label>
          <FilterSelect label="Location" value={location} onChange={setLocation} options={options('location')} />
          <FilterSelect label="Job type" value={jobType} onChange={setJobType} options={options('jobType')} format={titleCase} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={options('category')} />
        </div>
      </div>
      <div className="mb-6 mt-9 flex items-center justify-between gap-4"><p className="font-display text-sm font-semibold"><span className="text-2xl font-bold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'role' : 'roles'} found</p>{hasFilters && <button onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"><X size={15} />Clear filters</button>}</div>
      {jobsLoading ? <div className="py-16 text-center text-slate" role="status">Loading jobs…</div> : startupError && !jobs.length ? <div className="rounded-2xl bg-coral/10 p-6 text-coral" role="alert">{startupError}</div> : filteredJobs.length ? <div className="grid gap-5">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="rounded-2xl border border-dashed border-ink/25 bg-paperCard px-6 py-16 text-center"><SlidersHorizontal className="mx-auto text-amber" size={35} /><h2 className="mt-5 font-display text-2xl font-bold">No jobs found</h2><p className="mx-auto mt-2 max-w-md text-slate">Try a broader search or clear your filters to see all available roles.</p><button onClick={clearFilters} className="btn-primary mt-6">Clear all filters</button></div>}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, format = (item) => item }) {
  return <label><span className="sr-only">{label}</span><select className="field" value={value} onChange={(event) => onChange(event.target.value)}><option value="">All {label.toLowerCase()}s</option>{options.map((option) => <option key={option} value={option}>{format(option)}</option>)}</select></label>;
}
