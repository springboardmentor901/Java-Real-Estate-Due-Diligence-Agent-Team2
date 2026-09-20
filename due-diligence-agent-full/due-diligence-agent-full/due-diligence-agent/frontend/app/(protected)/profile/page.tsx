"use client";

import { useEffect, useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { profileApi } from "@/lib/api";
import { useAuth, errorMessage } from "@/lib/auth-context";
import { roleLabel } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Best-effort refresh from the server; falls back to the locally stored
  // session if GET /api/users/profile isn't available yet.
  useEffect(() => {
    profileApi
      .get()
      .then((p) => {
        setFullName(p.fullName);
        setEmail(p.email);
      })
      .catch(() => {
        /* fall back silently to values from the session */
      });
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setSavingProfile(true);
    try {
      await profileApi.update({ fullName, email });
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(errorMessage(err, "Could not update your profile."));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    setSavingPassword(true);
    try {
      await profileApi.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(errorMessage(err, "Could not change your password."));
    } finally {
      setSavingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Profile</h1>
        <p className="text-sm text-ink-muted">{roleLabel(user.role)}</p>
      </div>

      <SectionCard title="Account details">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {profileError && <p className="text-sm text-brick">{profileError}</p>}
          {profileSuccess && <p className="text-sm text-forest">Profile updated.</p>}
          <div>
            <Button type="submit" loading={savingProfile}>
              Save changes
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Change password">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {passwordError && <p className="text-sm text-brick">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-forest">Password changed.</p>}
          <div>
            <Button type="submit" loading={savingPassword}>
              Update password
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
