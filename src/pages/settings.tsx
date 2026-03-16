import { useState } from 'react';
import Head from 'next/head';
import { useUser, useClerk } from '@clerk/nextjs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, Mail, Shield, Trash2, ExternalLink, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [initLoaded, setInitLoaded] = useState(false);

  // Load user data once
  if (isLoaded && user && !initLoaded) {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setInitLoaded(true);
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will permanently delete all your boards, cards, and data. This cannot be undone.'
    );
    if (!confirmed) return;
    const doubleConfirm = window.confirm(
      'This is your last chance. Type DELETE in the next prompt to confirm.'
    );
    if (!doubleConfirm) return;
    const typed = window.prompt('Type DELETE to confirm account deletion:');
    if (typed !== 'DELETE') return;

    try {
      await user.delete();
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  if (!isLoaded) {
    return (
      <DashboardLayout title="Settings">
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-flow-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Settings — Flowboard</title>
      </Head>

      <DashboardLayout title="Settings">
        <div className="max-w-2xl space-y-8">

          {/* Profile Section */}
          <section className="card-base p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-flow-warm flex items-center justify-center">
                <User size={18} className="text-flow-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg text-flow-ink">Profile</h2>
                <p className="text-xs text-flow-muted">Manage your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-flow-border"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-flow-ink">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-flow-muted">
                    Profile photo is managed through your auth provider
                  </p>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">First name</label>
                  <input
                    type="text"
                    className="input-base"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="label-base">Last name</label>
                  <input
                    type="text"
                    className="input-base"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="label-base">Email</label>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-flow-muted" />
                  <span className="text-sm text-flow-ink">
                    {user?.primaryEmailAddress?.emailAddress || 'No email'}
                  </span>
                </div>
                <p className="text-[10px] text-flow-muted mt-1">
                  Email is managed through your auth provider
                </p>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="card-base p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-flow-warm flex items-center justify-center">
                <Shield size={18} className="text-flow-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg text-flow-ink">Account</h2>
                <p className="text-xs text-flow-muted">Manage your account and security</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Account info */}
              <div className="flex items-center justify-between py-3 border-b border-flow-border">
                <div>
                  <p className="text-sm font-medium text-flow-ink">Account ID</p>
                  <p className="text-xs text-flow-muted font-mono">{user?.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-flow-border">
                <div>
                  <p className="text-sm font-medium text-flow-ink">Member since</p>
                  <p className="text-xs text-flow-muted">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-flow-border">
                <div>
                  <p className="text-sm font-medium text-flow-ink">Password & security</p>
                  <p className="text-xs text-flow-muted">Manage through your auth provider</p>
                </div>
                <a
                  href="https://accounts.clerk.dev/user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs"
                >
                  <ExternalLink size={12} />
                  Manage
                </a>
              </div>

              {/* Sign out */}
              <div className="flex items-center justify-between py-3 border-b border-flow-border">
                <div>
                  <p className="text-sm font-medium text-flow-ink">Sign out</p>
                  <p className="text-xs text-flow-muted">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary text-xs"
                >
                  <LogOut size={12} />
                  Sign out
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="border border-red-200 rounded-card p-6 bg-red-50/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-display text-lg text-red-700">Danger zone</h2>
                <p className="text-xs text-red-500">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-flow-ink">Delete account</p>
                <p className="text-xs text-flow-muted">
                  Permanently delete your account, all boards, cards, and data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 
                           border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} />
                Delete account
              </button>
            </div>
          </section>

        </div>
      </DashboardLayout>
    </>
  );
}

