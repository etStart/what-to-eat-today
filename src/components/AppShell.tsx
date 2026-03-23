import { NavLink, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import type { ReactNode } from "react";

import { useAuth } from "../providers/AuthProvider";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showBottomNav?: boolean;
};

const navItems = [
  { to: "/", label: "首页" },
  { to: "/recipes", label: "菜谱库" },
  { to: "/plan", label: "餐计划" },
  { to: "/recipes/new", label: "新增" },
];

export function AppShell({
  children,
  title,
  subtitle,
  actions,
  showBottomNav = true,
}: AppShellProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="page-shell flex items-center gap-3 px-4 py-4">
          <button className="min-w-0 flex-1 text-left" onClick={() => navigate("/")} type="button">
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-ember/90">
              今天吃什么
            </p>
            <p className="mt-1 truncate text-sm text-text-secondary">
              把三餐安排这件事，变得轻一点。
            </p>
          </button>

          {actions}

          {user ? (
            <button
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-label text-xs text-text-secondary transition hover:border-ember/40 hover:text-text-primary"
              onClick={() => {
                void signOut().then(() => navigate("/"));
              }}
              type="button"
            >
              退出
            </button>
          ) : (
            <button
              className="rounded-full bg-ember px-4 py-2.5 font-label text-xs text-white shadow-premium-orange"
              onClick={() =>
                navigate(`/auth?next=${encodeURIComponent(location.pathname + location.search)}`)
              }
              type="button"
            >
              登录
            </button>
          )}
        </div>
      </header>

      <main className="page-shell px-4 pb-10 pt-6">
        {(title || subtitle) && (
          <section className="mb-6 space-y-2">
            {title ? (
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="text-sm leading-7 text-text-secondary">{subtitle}</p>
            ) : null}
          </section>
        )}

        {children}
      </main>

      {showBottomNav ? (
        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[28px] border border-white/10 bg-white/8 px-3 py-3 shadow-premium-card backdrop-blur-2xl">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex min-w-[68px] flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center font-label text-[11px] transition",
                  isActive
                    ? "bg-ember text-white shadow-premium-orange"
                    : "text-text-secondary",
                )
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
