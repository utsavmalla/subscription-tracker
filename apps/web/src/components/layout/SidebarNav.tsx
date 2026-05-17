"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/data/dashboard";

export function SidebarNav({
  onNavigate,
}: Readonly<{ onNavigate?: () => void }>) {
  const pathname = usePathname() ?? "/";
  const exactActiveHref = navItems.find((item) => item.href === pathname)?.href;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive =
          item.href === pathname ||
          (!exactActiveHref &&
            item.href !== "/" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
              isActive
                ? "bg-teal-50 text-teal-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
