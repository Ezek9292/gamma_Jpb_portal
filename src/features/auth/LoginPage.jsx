import { ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function LoginPage() {
  const { login } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault(); setError('');
    const result = login(form);
    if (!result.ok) { setError(result.message); return; }
    navigate(location.state?.from || (result.user.role === 'admin' ? '/admin/dashboard' : '/applicant/dashboard'), { replace: true });
  };

  const fillDemo = (role) => setForm({ email: `${role}@departure.dev`, password: 'demo123' });

  return (
    <div className="page-shell grid min-h-[calc(100vh-72px)] items-center gap-12 py-14 lg:grid-cols-2">
      <div className="hidden lg:block"><p className="eyebrow">Welcome back</p><h1 className="mt-4 max-w-lg font-display text-6xl font-bold leading-[1.02] tracking-[-0.055em]">Your next move is waiting.</h1><p className="mt-6 max-w-md text-lg leading-8 text-slate">Log in to manage applications, keep your profile current, or post the next great opportunity.</p><div className="route-line mt-12 h-px max-w-md" /></div>
      <div className="panel mx-auto w-full max-w-md sm:p-8">
        <p className="eyebrow lg:hidden">Welcome back</p><h2 className="mt-2 font-display text-3xl font-bold">Log in to Departure</h2>
        {location.state?.message && <div className="mt-5 flex gap-2 rounded-lg bg-amber/15 p-3 text-sm text-ink"><Info className="mt-0.5 shrink-0" size={16} />{location.state.message}</div>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-coral/10 p-3 text-sm text-coral">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label><span className="label">Email address</span><input className="field" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" /></label>
          <label><span className="label">Password</span><input className="field" name="password" type="password" autoComplete="current-password" required value={form.password} onChange={update} placeholder="Your password" /></label>
          <button className="btn-primary w-full" type="submit">Log in <ArrowRight size={17} /></button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-slate"><span className="h-px flex-1 bg-ink/10" />MVP demo access<span className="h-px flex-1 bg-ink/10" /></div>
        <div className="grid grid-cols-2 gap-3"><button onClick={() => fillDemo('applicant')} className="btn-secondary !px-3 text-xs">Applicant demo</button><button onClick={() => fillDemo('admin')} className="btn-secondary !px-3 text-xs">Admin demo</button></div>
        <p className="mt-7 text-center text-sm text-slate">New here? <Link to="/signup?role=applicant" className="font-semibold text-coral hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}
