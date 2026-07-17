import { ArrowRight, BriefcaseBusiness, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'applicant';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: initialRole });
  const [error, setError] = useState('');
  const { signup } = usePortal();
  const navigate = useNavigate();
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault(); setError('');
    if (form.password.length < 6) { setError('Use at least 6 characters for your password.'); return; }
    const result = signup(form);
    if (!result.ok) { setError(result.message); return; }
    navigate(form.role === 'admin' ? '/admin/dashboard' : '/applicant/profile', { replace: true });
  };

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="mx-auto max-w-xl"><div className="text-center"><p className="eyebrow">Create your pass</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">Start your Departure</h1><p className="mt-3 text-slate">Choose how you’ll use the portal. You can be ready in a minute.</p></div>
        <div className="panel mt-9 sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            <RoleButton active={form.role === 'applicant'} onClick={() => setForm((value) => ({ ...value, role: 'applicant' }))} icon={UserRound} title="Applicant" subtitle="Find and apply" />
            <RoleButton active={form.role === 'admin'} onClick={() => setForm((value) => ({ ...value, role: 'admin' }))} icon={BriefcaseBusiness} title="Admin" subtitle="Post and manage" />
          </div>
          {error && <p role="alert" className="mt-5 rounded-lg bg-coral/10 p-3 text-sm text-coral">{error}</p>}
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label><span className="label">Full name</span><input className="field" name="name" required value={form.name} onChange={update} placeholder="Your full name" /></label>
            <label><span className="label">Email address</span><input className="field" type="email" name="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" /></label>
            <label><span className="label">Password</span><input className="field" type="password" name="password" autoComplete="new-password" minLength="6" required value={form.password} onChange={update} placeholder="At least 6 characters" /></label>
            <button className="btn-primary w-full" type="submit">Create {form.role} account <ArrowRight size={17} /></button>
          </form>
          <p className="mt-7 text-center text-sm text-slate">Already registered? <Link to="/login" className="font-semibold text-coral hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

function RoleButton({ active, onClick, icon: Icon, title, subtitle }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition ${active ? 'border-amber bg-amber/10 ring-2 ring-amber/15' : 'border-ink/10 hover:border-ink/30'}`}><Icon className={active ? 'text-coral' : 'text-slate'} size={21} /><span className="mt-3 block font-display font-bold">{title}</span><span className="text-xs text-slate">{subtitle}</span></button>;
}
