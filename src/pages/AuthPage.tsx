import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AppShell } from "../components/AppShell";
import { useAuth } from "../providers/AuthProvider";
import type { AuthMode } from "../types/models";

const authSchema = z.object({
  displayName: z.string().max(24, "昵称最多 24 个字").optional(),
  email: z.string().email("请输入正确的邮箱地址"),
  password: z.string().min(6, "密码至少 6 位"),
  confirmPassword: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitError, setSubmitError] = useState("");
  const [submitHint, setSubmitHint] = useState("");
  const { user, isConfigured, signInWithPassword, signUpWithPassword } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate(next, { replace: true });
    }
  }, [navigate, next, user]);

  const title = useMemo(
    () => (mode === "login" ? "登录后开始规划" : "先创建一个账号"),
    [mode],
  );

  const subtitle = useMemo(
    () =>
      mode === "login"
        ? "第一版先保留邮箱 + 密码登录。登录后首页会自动切换成你的真实餐计划。"
        : "如果当前还开着邮箱确认，注册后可能需要先验证邮箱。",
    [mode],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");
    setSubmitHint("");

    if (mode === "signup" && values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "两次输入的密码不一致",
      });
      return;
    }

    try {
      if (mode === "login") {
        await signInWithPassword(values.email, values.password);
      } else {
        await signUpWithPassword(values.email, values.password, values.displayName);
        setSubmitHint(
          "账号创建请求已提交。如果当前已关闭邮箱确认，你会直接登录；否则请先完成邮箱验证。",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "登录失败，请稍后再试。";
      setSubmitError(message);
    }
  });

  return (
    <AppShell showBottomNav={false} subtitle={subtitle} title={title}>
      <div className="glass-panel rounded-[32px] p-6 shadow-premium-card">
        {!isConfigured ? (
          <div className="mb-6 rounded-[24px] border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
            还没有配置 Supabase 环境变量。请先填写 `.env.local` 中的
            `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`，再回来登录。
          </div>
        ) : null}

        <div className="mb-6 flex rounded-full border border-white/10 bg-black/20 p-1">
          <button
            className={`flex-1 rounded-full px-4 py-3 text-sm transition ${
              mode === "login"
                ? "bg-ember text-white shadow-premium-orange"
                : "text-text-secondary"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            登录
          </button>
          <button
            className={`flex-1 rounded-full px-4 py-3 text-sm transition ${
              mode === "signup"
                ? "bg-ember text-white shadow-premium-orange"
                : "text-text-secondary"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            注册
          </button>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <label className="block space-y-2">
              <span className="text-sm text-text-secondary">昵称</span>
              <input
                className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
                placeholder="比如：晚饭总策划"
                {...form.register("displayName")}
              />
              {form.formState.errors.displayName ? (
                <span className="text-sm text-red-300">
                  {form.formState.errors.displayName.message}
                </span>
              ) : null}
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="text-sm text-text-secondary">邮箱</span>
            <input
              autoComplete="email"
              className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
              placeholder="请输入常用邮箱"
              type="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <span className="text-sm text-red-300">{form.formState.errors.email.message}</span>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-text-secondary">密码</span>
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
              placeholder="至少 6 位"
              type="password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <span className="text-sm text-red-300">
                {form.formState.errors.password.message}
              </span>
            ) : null}
          </label>

          {mode === "signup" ? (
            <label className="block space-y-2">
              <span className="text-sm text-text-secondary">确认密码</span>
              <input
                autoComplete="new-password"
                className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
                placeholder="再输入一次密码"
                type="password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword ? (
                <span className="text-sm text-red-300">
                  {form.formState.errors.confirmPassword.message}
                </span>
              ) : null}
            </label>
          ) : null}

          {submitError ? (
            <div className="rounded-[20px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {submitError}
            </div>
          ) : null}

          {submitHint ? (
            <div className="rounded-[20px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {submitHint}
            </div>
          ) : null}

          <button
            className="w-full rounded-full bg-ember px-5 py-4 font-label text-sm text-white shadow-premium-orange disabled:cursor-not-allowed disabled:opacity-60"
            disabled={form.formState.isSubmitting || !isConfigured}
            type="submit"
          >
            {form.formState.isSubmitting
              ? "处理中..."
              : mode === "login"
                ? "登录并继续"
                : "创建账号"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}

