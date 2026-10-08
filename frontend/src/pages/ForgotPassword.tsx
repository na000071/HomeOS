import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { forgotPassword } from "../services/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Enter your email address to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await forgotPassword({ email: email.trim() });
      setMessage(response.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't send the reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      description="Enter your email address and we'll send you a link to reset your password."
      footer={<>Remember your password? <Link to="/login" className="font-semibold text-[#5E7563] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Sign in</Link></>}
    >
      {errorMessage && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{errorMessage}</p>}
      {message && <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">{message}</p>}

      <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="forgot-email" className="text-sm font-medium text-stone-700">Email</label>
          <input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#5E7563] focus:ring-4 focus:ring-[#5E7563]/10" required />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-[#5E7563] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
