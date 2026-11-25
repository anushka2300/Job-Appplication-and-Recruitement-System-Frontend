import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUsers, faChartLine, faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">The modern hiring workspace</span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">Find work. Build teams. Grow faster.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">Discover opportunities and manage recruitment in one focused, professional platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary px-5 py-3">Get started</Link>
            <Link to="/login" className="btn-secondary px-5 py-3">Browse as member</Link>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 border-b pb-5"><div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-100 text-brand-700"><FontAwesomeIcon icon={faBriefcase} /></div><div><p className="font-semibold">Senior Product Designer</p><p className="text-sm text-slate-500">Remote · Full time</p></div></div>
          {[['Bangalore, India', 'Full time'], ['London, UK', 'Contract'], ['Remote', 'Part time']].map(([place, type]) => <div key={place} className="flex items-center justify-between border-b py-4 last:border-0"><div><p className="font-medium">Software Engineer</p><p className="text-sm text-slate-500">{place}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{type}</span></div>)}
        </div>
      </section>
      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
          {[['Discover roles', faMagnifyingGlass], ['Manage applications', faUsers], ['Track hiring', faChartLine]].map(([title, icon]) => <div key={title} className="rounded-xl p-5"><FontAwesomeIcon icon={icon} className="mb-3 text-brand-600" /><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-500">Purpose-built workflows for candidates and recruitment teams.</p></div>)}
        </div>
      </section>
    </main>
  );
}
