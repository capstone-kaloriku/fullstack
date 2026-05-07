'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAccount, switchAccount } from '../../actions';

// ============================================================
// Types
// ============================================================

interface Account {
  user_id: string;
  name: string | null;
  email: string;
  gender: string | null;
}

interface AccountListProps {
  accounts: Account[];
}

// ============================================================
// Component — Renders list of registered accounts with delete btn
// ============================================================

function AccountList({ accounts }: AccountListProps) {
  // Track which account is being deleted (by user_id)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // useTransition for non-blocking server action calls
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle delete — calls server action then refreshes page
  function handleDelete(userId: string) {
    // Confirm before deleting
    const confirmed = window.confirm(
      'Yakin ingin menghapus akun ini? Data tidak bisa dikembalikan.'
    );
    if (!confirmed) return;

    setDeletingId(userId);
    startTransition(async () => {
      const result = await deleteAccount(userId);
      if (!result.success) {
        alert(result.error || 'Gagal menghapus akun.');
      }
      setDeletingId(null);
      // Refresh page to reflect changes
      router.refresh();
    });
  }

  // Handle switch — calls server action to set cookie, then refreshes
  function handleSwitch(userId: string) {
    startTransition(async () => {
      await switchAccount(userId);
      // Refresh page to load the switched user's profile
      router.refresh();
    });
  }

  // Empty state
  if (accounts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        Tidak ada akun terdaftar.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Section title */}
      <h2 className="text-lg font-bold text-primary">
        Daftar Akun ({accounts.length})
      </h2>

      {/* Account cards */}
      {accounts.map((account) => (
        <div
          key={account.user_id}
          className="flex items-center justify-between gap-3 rounded-lg border border-muted/10 bg-surface p-4"
        >
          {/* Account info */}
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <User2 size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">{account.name}</span>
              <span className="text-xs text-muted-foreground">
                {account.email}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {account.gender}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Switch button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSwitch(account.user_id)}
              disabled={isPending}
              className="border-primary text-primary hover:bg-primary hover:text-secondary"
            >
              Switch
            </Button>

            {/* Delete button */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(account.user_id)}
              disabled={isPending && deletingId === account.user_id}
            >
              <Trash2 size={16} className="mr-1" />
              {isPending && deletingId === account.user_id
                ? 'Menghapus...'
                : 'Hapus'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccountList;
