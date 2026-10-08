import { useMemo, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../services/authApi";

function ResetPassword() {
  const location = useLocation();
  const resetDetails = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      email: params.get("email") ?? "",
      token: params.get("token") ?? "",
    };
  }, [location.search]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    !resetDetails.email || !resetDetails.token ? "This password reset link is incomplete or invalid." : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (!resetDetails.email || !resetDetails.token) {
      setErrorMessage("This password reset link is incomplete or invalid.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Complete both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("The new passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        email: resetDetails.email,
        token: resetDetails.token,
        newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been reset. You can now sign in with your new password.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't reset your password. Please request a new link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Secure account recovery"
      title="Reset your password"
      description="Choose a new password for your HomeOS account."
      footer={<>Remember your password? <Link to="/login" className="font-semibold text-[#5E7563] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Sign in</Link></>}
    >
      {errorMessage && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{errorMessage}</p>}
      {message && <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">{message}</p>}

      {!message && (
        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="reset-new-password" className="text-sm font-medium text-stone-700">New password</label>
            <input id="reset-new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#5E7563] focus:ring-4 focus:ring-[#5E7563]/10" required />
            <p className="mt-2 text-xs leading-5 text-stone-500">Use at least 8 characters with uppercase, lowercase, a number, and a symbol.</p>
          </div>
          <div>
            <label htmlFor="reset-confirm-password" className="text-sm font-medium text-stone-700">Confirm new password</label>
            <input id="reset-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#5E7563] focus:ring-4 focus:ring-[#5E7563]/10" required />
          </div>
          <button type="submit" disabled={isSubmitting || !resetDetails.email || !resetDetails.token} className="w-full rounded-lg bg-[#5E7563] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Resetting password..." : "Reset Password"}
          </button>
        </form>
      )}

      {message && <Link to="/login" className="mt-7 block w-full rounded-lg bg-[#5E7563] px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2">Sign in</Link>}
    </AuthLayout>
  );
}

export default ResetPassword;
