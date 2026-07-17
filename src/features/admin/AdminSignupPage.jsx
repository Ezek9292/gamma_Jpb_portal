import { ArrowLeft, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function AdminSignupPage() {
  const { createAdmin } = usePortal();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    const result = await createAdmin(form);
    setSubmitting(false);
    if (!result.ok) { setError(result.message); return; }
    setSuccess(`Administrator account created for ${result.user.email}.`);
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div className="page-shell py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />Admin dashboard</Link>
      <div className="mx-auto mt-8 max-w-xl">
        <div className="text-center"><p className="eyebrow">Restricted administration</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">Create an administrator</h1><p className="mt-3 text-slate">Only an authenticated administrator can provision another administrator account.</p></div>
        <div className="panel mt-9 sm:p-8">
          <div className="flex gap-3 rounded-xl border border-amber bg-amber/10 p-4"><ShieldCheck className="shrink-0 text-coral" size={21} /><p className="text-sm text-slate">Grant this role only to trusted staff who need access to job listings and applicant information.</p></div>
          {error && <p role="alert" className="mt-5 rounded-lg bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          {success && <p role="status" className="mt-5 rounded-lg bg-forest/10 p-3 text-sm font-semibold text-forest">{success}</p>}
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label><span className="label">Full name</span><input className="field" name="name" autoComplete="name" maxLength="100" required value={form.name} onChange={update} /></label>
            <label><span className="label">Work email</span><input className="field" type="email" name="email" autoComplete="email" maxLength="254" required value={form.email} onChange={update} /></label>
            <label><span className="label">Temporary password</span><input className="field" type="password" name="password" autoComplete="new-password" minLength="12" maxLength="72" required value={form.password} onChange={update} placeholder="At least 12 characters" /></label>
            <button className="btn-primary w-full" type="submit" disabled={submitting}><UserPlus size={17} />{submitting ? 'Creating administrator…' : 'Create administrator'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
