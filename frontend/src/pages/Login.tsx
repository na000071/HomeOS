import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const from = location.state as {
        from?: { pathname?: string; search?: string; hash?: string };
      } | null;
      const destination = from?.from
        ? `${from.from.pathname ?? "/"}${from.from.search ?? ""}${from.from.hash ?? ""}`
        : "/";
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-10 text-[#20211F] sm:px-6">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(72,66,52,0.1)] sm:p-8" aria-labelledby="login-title">
        <div>
          <p className="text-sm font-medium text-stone-500">HomeOS</p>
          <h1 id="login-title" className="mt-2 text-3xl font-semibold tracking-tight text-[#20211F]">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">Sign in to continue managing your home.</p>
        </div>

        {errorMessage && (
          <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="login-email" className="text-sm font-medium text-stone-700">Email</label>
            <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#5E7563] focus:ring-2 focus:ring-[#5E7563]/20" required />
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-medium text-stone-700">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#5E7563] focus:ring-2 focus:ring-[#5E7563]/20" required />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account? <Link to="/register" className="font-semibold text-[#5E7563] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;