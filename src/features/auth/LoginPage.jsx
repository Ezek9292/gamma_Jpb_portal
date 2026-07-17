import { ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function LoginPage({ role = 'applicant' }) {
  const { login } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault(); setError('');
    setSubmitting(true);
    const result = await login({ ...form, expectedRole: role });
    setSubmitting(false);
    if (!result.ok) { setError(result.message); return; }
    navigate(location.state?.from || (role === 'admin' ? '/admin/dashboard' : '/applicant/dashboard'), { replace: true });
  };

  const isAdmin = role === 'admin';

  return (
    <div className="page-shell grid min-h-[calc(100vh-72px)] items-center gap-12 py-14 lg:grid-cols-2">
      <div className="hidden lg:block"><p className="eyebrow">{isAdmin ? 'Administrator access' : 'Welcome back'}</p><h1 className="mt-4 max-w-lg font-display text-6xl font-bold leading-[1.02] tracking-[-0.055em]">{isAdmin ? 'Manage jobs and applicants securely.' : 'Manage your career opportunities.'}</h1><p className="mt-6 max-w-md text-lg leading-8 text-slate">{isAdmin ? 'This sign-in area is restricted to authorized GammaJobs administrators.' : 'Log in to manage your applications and keep your professional profile current.'}</p><div className="route-line mt-12 h-px max-w-md" /></div>
      <div className="panel mx-auto w-full max-w-md sm:p-8">
        <p className="eyebrow lg:hidden">{isAdmin ? 'Administrator access' : 'Welcome back'}</p><h2 className="mt-2 font-display text-3xl font-bold">{isAdmin ? 'Administrator login' : 'Applicant login'}</h2>
        {location.state?.message && <div className="mt-5 flex gap-2 rounded-lg bg-amber/15 p-3 text-sm text-ink"><Info className="mt-0.5 shrink-0" size={16} />{location.state.message}</div>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-coral/10 p-3 text-sm text-coral">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label><span className="label">Email address</span><input className="field" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" /></label>
          <label><span className="label">Password</span><input className="field" name="password" type="password" autoComplete="current-password" required value={form.password} onChange={update} placeholder="Your password" /></label>
          <button className="btn-primary w-full" type="submit" disabled={submitting}>{submitting ? 'Logging in…' : (isAdmin ? 'Log in as administrator' : 'Log in')} {!submitting && <ArrowRight size={17} />}</button>
        </form>
        {isAdmin ? <p className="mt-7 text-center text-sm text-slate">Looking for work? <Link to="/login" className="font-semibold text-coral hover:underline">Applicant login</Link></p> : <><p className="mt-7 text-center text-sm text-slate">New here? <Link to="/signup" className="font-semibold text-coral hover:underline">Create an account</Link></p><p className="mt-3 text-center text-xs text-slate"><Link to="/admin/login" className="hover:text-coral hover:underline">Administrator login</Link></p></>}
      </div>
    </div>
  );
}
