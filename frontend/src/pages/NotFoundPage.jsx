import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="noise-bg flex min-h-screen items-center justify-center p-4">
    <article className="glass-panel rounded-3xl p-8 text-center">
      <p className="text-sm uppercase tracking-[0.28em] text-slate-400">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-slate-300">The page you requested does not exist.</p>
      <Link to="/login" className="mt-6 inline-block rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-900">
        Back to Login
      </Link>
    </article>
  </div>
);

export default NotFoundPage;
