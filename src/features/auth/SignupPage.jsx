import { ArrowRight, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = usePortal();
  const navigate = useNavigate();
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (form.password.length < 12) { setError('Use at least 12 characters for your password.'); return; }
    setSubmitting(true);
    const result = await signup(form);
    setSubmitting(false);
    if (!result.ok) { setError(result.message); return; }
    navigate('/applicant/profile', { replace: true });
  };

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="mx-auto max-w-xl"><div className="text-center"><p className="eyebrow">Create an account</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">Join GammaJobs</h1><p className="mt-3 text-slate">Create your applicant account to build a profile and apply for open roles.</p></div>
        <div className="panel mt-9 sm:p-8">
          <div className="flex items-center gap-3 rounded-xl border border-amber bg-amber/10 p-4"><UserRound className="text-coral" size={21} /><div><p className="font-display font-bold">Applicant account</p><p className="text-xs text-slate">Administrator access is provisioned separately.</p></div></div>
          {error && <p role="alert" className="mt-5 rounded-lg bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label><span className="label">Full name</span><input className="field" name="name" autoComplete="name" maxLength="100" required value={form.name} onChange={update} placeholder="Your full name" /></label>
            <label><span className="label">Email address</span><input className="field" type="email" name="email" autoComplete="email" maxLength="254" required value={form.email} onChange={update} placeholder="you@example.com" /></label>
            <label><span className="label">Password</span><input className="field" type="password" name="password" autoComplete="new-password" minLength="12" maxLength="72" required value={form.password} onChange={update} placeholder="At least 12 characters" /></label>
            <button className="btn-primary w-full" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create applicant account'} {!submitting && <ArrowRight size={17} />}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate">Already registered? <Link to="/login" className="font-semibold text-coral hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
