import type { ReactNode } from "react";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

const features = ["Appliances", "Maintenance", "Warranties", "Documents", "Expenses"];

function AuthLayout({ eyebrow, title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#20211F] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#E7E9E1] px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16" aria-label="HomeOS introduction">
        <div className="relative z-10">
          <p className="text-2xl font-semibold tracking-[0.12em] text-[#20211F]">HOMEOS</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5E7563]">Your home, organized.</p>
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5E7563]">A calmer home, by design</p>
          <h2 className="mt-5 max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight text-[#20211F] xl:text-6xl">
            Everything about your home. In one place.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-stone-600">
            HomeOS brings the details of everyday home life together, so you can keep track of what matters and act when it matters.
          </p>

          <ul className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-3 text-sm text-stone-700 xl:grid-cols-3">
            {features.map((feature, index) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#9BAE9E] text-[10px] font-semibold text-[#5E7563]" aria-hidden="true">0{index + 1}</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute -bottom-20 right-[-4rem] h-80 w-[34rem] rounded-t-[12rem] border-[18px] border-[#B7C3B5] bg-[#F7F5F0] opacity-80" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 h-32 w-32 -translate-x-1/2 rounded-t-full border-[14px] border-b-0 border-[#9BAE9E]" />
          <div className="absolute bottom-0 left-1/2 h-32 w-20 -translate-x-1/2 rounded-t-full bg-[#D8E0D5]" />
          <div className="absolute bottom-20 left-16 h-14 w-20 rounded-sm bg-[#D8E0D5]" />
          <div className="absolute bottom-20 right-16 h-14 w-20 rounded-sm bg-[#D8E0D5]" />
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-20" aria-labelledby="auth-title">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-xl font-semibold tracking-[0.12em] text-[#20211F]">HOMEOS</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5E7563]">Your home, organized.</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(72,66,52,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5E7563]">{eyebrow}</p>
            <h1 id="auth-title" className="mt-3 text-3xl font-semibold tracking-tight text-[#20211F]">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-stone-500">{description}</p>
            {children}
          </div>

          <div className="mt-6 text-center text-sm text-stone-500">{footer}</div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
