import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage({ compact = false }) {
  return <div className={`${compact ? 'py-16' : 'page-shell py-24'} text-center`}><p className="font-mono text-sm font-bold text-coral">404 / MISSED DEPARTURE</p><h1 className="mt-4 font-display text-4xl font-bold">This route doesn’t exist.</h1><p className="mt-3 text-slate">Let’s get you back to the departure board.</p><Link to="/jobs" className="btn-primary mt-7"><ArrowLeft size={17} />Browse jobs</Link></div>;
}
