import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { changePassword } from "../services/authApi";
import { useAuth } from "../hooks/useAuth";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("The new passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password was changed successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "We couldn't change your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <header>
        <p className="text-sm font-medium text-stone-500">HomeOS account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#20211F]">Settings</h1>
        <p className="mt-2 text-stone-500">Manage your profile and account security.</p>
      </header>

      <section aria-labelledby="profile-title">
        <h2 id="profile-title" className="text-xl font-semibold text-[#20211F]">Profile</h2>
        <Card className="mt-4 p-6">
          <p className="text-sm text-stone-500">Email</p>
          <p className="mt-2 font-medium text-[#20211F]">{user?.email ?? "Unavailable"}</p>
          <p className="mt-4 text-sm text-stone-500">Account status</p>
          <p className="mt-2 font-medium text-[#5E7563]">Authenticated</p>
        </Card>
      </section>

      <section aria-labelledby="security-title">
        <div>
          <h2 id="security-title" className="text-xl font-semibold text-[#20211F]">Account Security</h2>
          <p className="mt-1 text-sm text-stone-500">Change your password or end the current session.</p>
        </div>
        <Card className="mt-4 p-6">
          {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
          {message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

          <form className="mt-5 max-w-xl space-y-5" onSubmit={handleChangePassword} noValidate>
            <div>
              <label htmlFor="current-password" className="text-sm font-medium text-stone-700">Current password</label>
              <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5E7563] focus:ring-2 focus:ring-[#5E7563]/20" required />
            </div>
            <div>
              <label htmlFor="new-password" className="text-sm font-medium text-stone-700">New password</label>
              <input id="new-password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5E7563] focus:ring-2 focus:ring-[#5E7563]/20" required />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="text-sm font-medium text-stone-700">Confirm new password</label>
              <input id="confirm-new-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5E7563] focus:ring-2 focus:ring-[#5E7563]/20" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#5E7563] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F6655] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7563] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Changing password..." : "Change password"}
            </button>
          </form>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-500">Current session</p>
            <p className="mt-2 text-sm text-stone-700">You are signed in as {user?.email ?? "your HomeOS account"}.</p>
            <button type="button" onClick={handleLogout} className="mt-4 rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">Log out</button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="preferences-title">
        <h2 id="preferences-title" className="text-xl font-semibold text-[#20211F]">Preferences</h2>
        <Card className="mt-4 p-6">
          <p className="text-sm text-stone-500">Appearance</p>
          <p className="mt-2 font-medium text-[#20211F]">Light theme</p>
          <p className="mt-1 text-sm text-stone-500">HomeOS is currently using its default light appearance.</p>
        </Card>
      </section>
    </div>
  );
}

export default Settings;
