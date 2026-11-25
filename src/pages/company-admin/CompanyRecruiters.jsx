export default function CompanyRecruiters() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6"><h1 className="text-2xl font-bold">Recruiters and admins</h1><p className="mt-1 text-slate-500">Create a company staff invitation.</p></div>
      <div className="card p-6">
        <h2 className="font-semibold">Not available to company admins</h2>
        <p className="mt-2 text-sm text-slate-600">The backend only permits SUPER_ADMIN to create staff invitations and does not expose staff or invitation list endpoints.</p>
      </div>
    </div>
  );
}
