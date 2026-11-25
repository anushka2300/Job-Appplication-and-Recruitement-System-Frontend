import { useAuth } from '../../hooks/useAuth';

export default function CandidateProfile() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">Candidate profile</h1><p className="mt-1 text-slate-500">Account information from the backend.</p></div>
      <div className="card p-6"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-slate-500">Name</dt><dd className="mt-1 font-medium">{user?.name}</dd></div><div><dt className="text-sm text-slate-500">Email</dt><dd className="mt-1 font-medium">{user?.email}</dd></div><div><dt className="text-sm text-slate-500">Role</dt><dd className="mt-1 font-medium">{user?.role}</dd></div></dl><p className="mt-6 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">The backend currently does not provide a profile update endpoint.</p></div>
    </div>
  );
}
