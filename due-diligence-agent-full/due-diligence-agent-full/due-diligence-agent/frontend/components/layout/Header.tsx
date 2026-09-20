"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import NotificationBell from "./NotificationBell";
import { cn, roleLabel } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Property Search" },
  { href: "/reports", label: "Reports" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = [
    ...NAV_LINKS,
    ...(user.role === "ADMINISTRATOR"
      ? [
          { href: "/admin/dashboard", label: "Admin" },
          { href: "/admin/report-requests", label: "Requests" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-line-strong bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-7">
          <Link
            href="/dashboard"
            className="font-[family-name:var(--font-display)] text-[1.05rem] font-medium tracking-tight text-paper"
          >
            Real Estate Due Diligence
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "border-b-2 px-1 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-brass text-paper"
                      : "border-transparent text-paper/60 hover:text-paper"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <Link
            href="/profile"
            className="hidden text-right sm:block"
            title="View profile"
          >
            <p className="text-sm font-medium leading-4 text-paper">{user.fullName}</p>
            <p className="text-xs text-paper/55">{roleLabel(user.role)}</p>
          </Link>
          <button
            onClick={logout}
            className="rounded-sm px-2.5 py-1.5 text-sm font-medium text-paper/70 hover:bg-white/10 hover:text-paper"
          >
            Log out
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-4 py-1.5 sm:hidden">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-sm px-3 py-1 text-xs font-medium",
                active ? "bg-brass text-white" : "text-paper/60 hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
