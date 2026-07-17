import { titleCase } from '../../utils/formatters';

const styles = {
  open: 'bg-forest/10 text-forest', closed: 'bg-coral/10 text-coral',
  applied: 'bg-amber/20 text-[#855711]', reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-forest/10 text-forest', rejected: 'bg-coral/10 text-coral',
};

export function StatusBadge({ status }) {
  return <span className={`status-pill ${styles[status] || 'bg-ink/10 text-ink'}`}>{titleCase(status)}</span>;
}
