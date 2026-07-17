import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink py-10 text-white">
      <div className="page-shell flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div><p className="font-display text-xl font-bold">GammaJobs</p><p className="mt-1 text-sm text-white/60">Connecting professionals with meaningful opportunities.</p></div>
        <div className="flex flex-wrap gap-6 text-sm text-white/70"><Link to="/jobs" className="hover:text-amber">Jobs</Link><Link to="/login" className="hover:text-amber">Applicant login</Link><Link to="/admin/login" className="hover:text-amber">Admin login</Link><span>© 2026 GammaJobs</span></div>
      </div>
    </footer>
  );
}
