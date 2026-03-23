import { ReactNode } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { LayoutDashboard, Settings, CreditCard, Compass } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

export default function DashboardLayout({ children, title, action }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-flow-paper">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-flow-paper/80 backdrop-blur-xl border-b border-flow-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-flow-ink rounded-lg flex items-center justify-center">
                <span className="text-flow-paper font-display text-sm font-bold">F</span>
              </div>
              <span className="font-display text-lg text-flow-ink">Flowboard</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-flow-muted 
                           hover:text-flow-ink rounded-md transition-colors"
              >
                <LayoutDashboard size={15} />
                Boards
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-flow-muted 
                           hover:text-flow-ink rounded-md transition-colors"
              >
                <Compass size={15} />
                Explore
              </Link>
              <Link
                href="/billing"
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-flow-muted 
                           hover:text-flow-ink rounded-md transition-colors"
              >
                <CreditCard size={15} />
                Billing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Billing"
                  labelIcon={<CreditCard size={14} />}
                  href="/billing"
                />
                <UserButton.Link
                  label="Settings"
                  labelIcon={<Settings size={14} />}
                  href="/settings"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </div>
      </header>

      {/* Page header */}
      {(title || action) && (
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-end justify-between">
          {title && (
            <h1 className="font-display text-3xl text-flow-ink">{title}</h1>
          )}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">{children}</main>
    </div>
  );
}