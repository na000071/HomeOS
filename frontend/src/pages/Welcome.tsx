import { Link } from "react-router-dom";

function Welcome() {
  return (
    <section className="flex min-h-[calc(100vh-2rem)] items-center py-8 sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
      <div
        className="relative w-full overflow-hidden rounded-[2rem] border border-white/40 bg-cover bg-center shadow-[0_24px_70px_rgba(22,63,91,0.24)] sm:min-h-[620px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(9, 33, 49, 0.74) 0%, rgba(9, 33, 49, 0.54) 42%, rgba(9, 33, 49, 0.12) 100%), url('/images/Hero.png')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#092131]/22 via-transparent to-transparent" />

        <div className="relative flex min-h-[calc(100vh-4rem)] items-center px-6 py-12 sm:min-h-[620px] sm:px-12 sm:py-16 lg:px-20 lg:py-24">
          <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
            Welcome to HomeOS
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Your home, organized around the way you live.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Keep appliances, maintenance, warranties, expenses, and important documents in one calm, useful place.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/dashboard"
              className="homeos-primary-button inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677B8] focus-visible:ring-offset-2"
            >
              Open your dashboard
            </Link>
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/15 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
            >
              Explore My Home
            </Link>
          </div>
          </div>

          <div className="absolute bottom-8 left-6 right-6 grid max-w-3xl grid-cols-1 gap-3 border-t border-white/25 pt-5 text-sm text-white/75 sm:left-12 sm:right-12 sm:grid-cols-3 lg:left-20 lg:right-20">
            <p><span className="font-semibold text-white">Track</span> the details that matter.</p>
            <p><span className="font-semibold text-white">Plan</span> routine care ahead of time.</p>
            <p><span className="font-semibold text-white">Know</span> what needs attention next.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;