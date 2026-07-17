import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

const emptyJob = { title: '', company: '', location: '', salaryRange: '', jobType: 'full-time', category: 'Engineering', description: '', requirementsText: '' };

export function NewJobPage() {
  const [form, setForm] = useState(emptyJob);
  const { addJob } = usePortal();
  const navigate = useNavigate();
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const { requirementsText, ...job } = form;
    addJob({ ...job, requirements: requirementsText.split('\n').map((item) => item.trim()) });
    navigate('/admin/dashboard');
  };
  return (
    <div className="page-shell py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />Admin dashboard</Link>
      <div className="mt-7 max-w-3xl"><p className="eyebrow">New departure</p><h1 className="page-title mt-3">Post a new job.</h1><p className="mt-4 text-slate">Give applicants the useful details they need to decide with confidence.</p></div>
      <form onSubmit={submit} className="mt-9 max-w-3xl space-y-7">
        <section className="panel grid gap-5 sm:grid-cols-2"><h2 className="font-display text-xl font-bold sm:col-span-2">Role details</h2><label className="sm:col-span-2"><span className="label">Job title</span><input className="field" name="title" required value={form.title} onChange={update} placeholder="e.g. Product Manager" /></label><label><span className="label">Company</span><input className="field" name="company" required value={form.company} onChange={update} placeholder="Company name" /></label><label><span className="label">Location</span><input className="field" name="location" required value={form.location} onChange={update} placeholder="City, Country or Remote" /></label><label><span className="label">Salary range</span><input className="field" name="salaryRange" required value={form.salaryRange} onChange={update} placeholder="$40k–$55k" /></label><label><span className="label">Job type</span><select className="field" name="jobType" value={form.jobType} onChange={update}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option></select></label><label className="sm:col-span-2"><span className="label">Category</span><select className="field" name="category" value={form.category} onChange={update}>{['Engineering', 'Design', 'Marketing', 'Operations', 'Data', 'Finance', 'People', 'Sales'].map((item) => <option key={item}>{item}</option>)}</select></label></section>
        <section className="panel grid gap-5"><h2 className="font-display text-xl font-bold">Job description</h2><label><span className="label">About the role</span><textarea className="field min-h-40" name="description" required value={form.description} onChange={update} placeholder="Describe the role, its impact, and what success looks like." /></label><label><span className="label">Requirements</span><textarea className="field min-h-36" name="requirementsText" required value={form.requirementsText} onChange={update} placeholder={'One requirement per line\n3+ years of relevant experience\nStrong communication skills'} /><span className="mt-1 block text-xs text-slate">Enter one requirement per line.</span></label></section>
        <div className="flex flex-wrap gap-3"><button type="submit" className="btn-primary"><Plus size={18} />Publish job</button><Link to="/admin/dashboard" className="btn-secondary">Cancel</Link></div>
      </form>
    </div>
  );
}
