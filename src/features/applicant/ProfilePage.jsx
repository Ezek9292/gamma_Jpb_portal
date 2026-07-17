import { ArrowLeft, Check, FileUp, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '../../app/providers/PortalProvider';
import { validateDocument } from '../../utils/fileValidation';

export function ProfilePage() {
  const { currentUser, currentProfile, saveProfile } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState(currentProfile || { fullName: currentUser.name || '', phone: '', bio: '', skills: [], experience: '', education: '' });
  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const addSkill = () => { const skill = skillInput.trim(); if (skill && !form.skills.includes(skill)) setForm((value) => ({ ...value, skills: [...value.skills, skill] })); setSkillInput(''); };
  const removeSkill = (skill) => setForm((value) => ({ ...value, skills: value.skills.filter((item) => item !== skill) }));
  const submit = async (event) => {
    event.preventDefault();
    setSaved(false);
    setFormError('');
    if (!form.skills.length) { setFormError('Add at least one skill.'); return; }
    setSaving(true);
    try {
      await saveProfile(form, resumeFile);
      setSaved(true);
      if (location.state?.from) navigate(location.state.from, { replace: true });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };
  const chooseResume = (file) => {
    setFileError('');
    if (!file) return;
    const validationError = validateDocument(file);
    if (validationError) { setFileError(validationError); return; }
    setResumeFile(file);
  };

  return (
    <div className="page-shell py-12 sm:py-16">
      <Link to="/applicant/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate hover:text-coral"><ArrowLeft size={16} />Dashboard</Link>
      <div className="mt-7 max-w-3xl"><p className="eyebrow">Applicant profile</p><h1 className="page-title mt-3">Put your best work forward.</h1><p className="mt-4 text-slate">This is what hiring teams see when you apply. Keep it focused and current.</p></div>
      {location.state?.from && <p className="mt-7 max-w-3xl rounded-xl bg-amber/15 p-4 text-sm font-medium">Complete and save your profile, then we’ll take you back to the job.</p>}
      <form onSubmit={submit} className="mt-9 max-w-3xl space-y-7">
        {formError && <p className="rounded-lg bg-coral/10 p-3 text-sm text-coral" role="alert">{formError}</p>}
        <section className="panel grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><h2 className="font-display text-xl font-bold">Personal details</h2></div><label><span className="label">Full name</span><input className="field" name="fullName" required value={form.fullName} onChange={update} /></label><label><span className="label">Phone</span><input className="field" name="phone" type="tel" required value={form.phone} onChange={update} placeholder="+234 ..." /></label><label className="sm:col-span-2"><span className="label">Professional bio</span><textarea className="field min-h-28 resize-y" name="bio" required maxLength="500" value={form.bio} onChange={update} placeholder="A concise introduction to your experience and goals" /><span className="mt-1 block text-right font-mono text-[10px] text-slate">{form.bio.length}/500</span></label></section>
        <section className="panel"><h2 className="font-display text-xl font-bold">Skills</h2><p className="mt-1 text-sm text-slate">Add the skills most relevant to your target roles.</p><div className="mt-5 flex gap-2"><input className="field" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill(); } }} placeholder="e.g. Product strategy" /><button type="button" onClick={addSkill} className="btn-secondary !px-4"><Plus size={18} /><span className="sr-only">Add skill</span></button></div><div className="mt-4 flex flex-wrap gap-2">{form.skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">{skill}<button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}><X size={13} /></button></span>)}</div></section>
        <section className="panel grid gap-5"><h2 className="font-display text-xl font-bold">Background</h2><label><span className="label">Experience</span><textarea className="field min-h-28" name="experience" required maxLength="3000" value={form.experience} onChange={update} placeholder="Role, company, dates, and your most useful impact" /></label><label><span className="label">Education</span><textarea className="field min-h-24" name="education" required maxLength="2000" value={form.education} onChange={update} placeholder="Qualification, institution, year" /></label><label><span className="label">Resume</span><span className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-ink/25 p-5 hover:border-amber"><span className="grid h-10 w-10 place-items-center rounded-lg bg-amber/15 text-coral"><FileUp size={20} /></span><span className="text-sm"><strong className="block font-display">{resumeFile?.name || (currentProfile?.resumeUrl ? 'Current resume uploaded' : 'Choose a PDF or DOC file')}</strong><span className="text-xs text-slate">PDF, DOC, or DOCX · 5 MB maximum</span></span><input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={(event) => chooseResume(event.target.files?.[0])} /></span>{fileError && <span className="mt-2 block text-sm font-semibold text-red-700" role="alert">{fileError}</span>}</label></section>
        <div className="flex items-center gap-4"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'} {!saving && <Check size={17} />}</button>{saved && <span className="text-sm font-semibold text-forest">Profile saved</span>}</div>
      </form>
    </div>
  );
}
