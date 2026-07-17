import { Menu, Plane, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';

const navClass = ({ isActive }) => `text-sm font-semibold transition hover:text-coral ${isActive ? 'text-coral' : 'text-ink/75'}`;

export function Header() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = usePortal();
  const navigate = useNavigate();
  const dashboard = currentUser?.role === 'admin' ? '/admin/dashboard' : '/applicant/dashboard';

  const handleLogout = () => { logout(); setOpen(false); navigate('/'); };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="page-shell flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-[-0.04em]" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-amber"><Plane size={18} /></span>
          Departure
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <NavLink to="/jobs" className={navClass}>Browse jobs</NavLink>
          {currentUser ? (
            <>
              <NavLink to={dashboard} className={navClass}>Dashboard</NavLink>
              {currentUser.role === 'applicant' && <NavLink to="/applicant/profile" className={navClass}>Profile</NavLink>}
              <button onClick={handleLogout} className="btn-secondary !min-h-9 !px-4 !py-1.5">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Log in</NavLink>
              <Link to="/signup?role=applicant" className="btn-primary !min-h-9 !px-4 !py-1.5">Get started</Link>
            </>
          )}
        </nav>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-ink/15 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="page-shell flex flex-col gap-4 border-t border-ink/10 py-5 md:hidden" aria-label="Mobile navigation">
          <NavLink to="/jobs" className={navClass} onClick={() => setOpen(false)}>Browse jobs</NavLink>
          {currentUser ? <>
            <NavLink to={dashboard} className={navClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
            {currentUser.role === 'applicant' && <NavLink to="/applicant/profile" className={navClass} onClick={() => setOpen(false)}>Profile</NavLink>}
            <button onClick={handleLogout} className="text-left text-sm font-semibold text-coral">Log out</button>
          </> : <>
            <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>Log in</NavLink>
            <NavLink to="/signup?role=applicant" className={navClass} onClick={() => setOpen(false)}>Create account</NavLink>
          </>}
        </nav>
      )}
    </header>
  );
}
