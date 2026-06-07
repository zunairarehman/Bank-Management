"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Wallet,
  Landmark,
  Shield,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { CreditCard } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/loans", label: "Loan Management", icon: Landmark },
  { href: "/repayments", label: "Repayment Tracking", icon: CreditCard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/security", label: "Security", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-bank-primary text-white shadow-xl">
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight">Bank AL Habib</h1>
        <p className="text-xs text-sky-200">Admin Portal</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-white/10",
              pathname === href && "bg-white/15 shadow-inner",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-200 hover:bg-white/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
