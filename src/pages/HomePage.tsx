import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "../components/AppShell";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { HomeMealCard } from "../components/HomeMealCard";
import { demoMeals } from "../constants/demo";
import { useAuth } from "../providers/AuthProvider";
import { listMealPlansForRange } from "../services/mealPlans";
import type { MealPlanEntry, MealType } from "../types/models";
import { getTodayIso } from "../utils/date";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [promptOpen, setPromptOpen] = useState(false);
  const { user } = useAuth();
  const todayIso = getTodayIso();

  const mealPlansQuery = useQuery({
    queryKey: ["meal-plans", user?.id, todayIso],
    queryFn: () => listMealPlansForRange(user!.id, todayIso, todayIso),
    enabled: Boolean(user),
  });

  const mealPlanMap = useMemo(() => {
    const map = new Map<MealType, MealPlanEntry>();
    (mealPlansQuery.data || []).forEach((entry) => {
      map.set(entry.mealType, entry);
    });
    return map;
  }, [mealPlansQuery.data]);

  const goToAuth = () => {
    const next = `${location.pathname}${location.search}`;
    navigate(`/auth?next=${encodeURIComponent(next)}`);
  };

  const queryError =
    mealPlansQuery.error instanceof Error
      ? mealPlansQuery.error.message
      : "读取今日餐计划失败，请稍后再试。";

  return (
    <>
      <AppShell
        subtitle="今天先吃什么，明天提前想一点，日子就会轻松很多。"
        title="今天吃什么"
      >
        {!user ? (
          <div className="mb-6 rounded-[22px] border border-ember/30 bg-ember/15 px-4 py-3 text-sm leading-7 text-orange-50">
            这是示例数据，登录后展示你的真实餐计划。
          </div>
        ) : null}

        {user && mealPlansQuery.isError ? (
          <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
            {queryError}
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="rounded-[32px] border border-white/10 bg-accent-hero p-6 shadow-premium-card">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 font-label text-xs uppercase tracking-[0.24em] text-ember/90">
              今日安排
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-text-primary">
              {user ? "今天的三餐已经准备好了吗？" : "先看看这套首页 UI 长什么样。"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              {user
                ? "早餐、午餐、晚餐会自动从你的餐计划同步过来。没安排的餐位可以直接去选菜。"
                : "未登录时先展示完整首页和示例餐卡。点任何操作都会引导你登录，登录后这里就会变成你的真实数据。"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {user ? (
                <>
                  <button
                    className="rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
                    onClick={() => navigate("/plan")}
                    type="button"
                  >
                    去安排 7 天餐计划
                  </button>
                  <button
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-secondary"
                    onClick={() => navigate("/recipes")}
                    type="button"
                  >
                    打开菜谱库
                  </button>
                </>
              ) : (
                <button
                  className="rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
                  onClick={() => setPromptOpen(true)}
                  type="button"
                >
                  登录后开始规划
                </button>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-5 shadow-premium-card">
            <p className="font-label text-xs uppercase tracking-[0.24em] text-text-secondary">
              使用提示
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-text-secondary">
              <p>1. 先把常做菜和常点外卖录进去，后面选菜会越来越快。</p>
              <p>2. 首页展示的是当天结果，真正的安排入口在餐计划页。</p>
              <p>3. 图片可以不传，但有封面时家里人会更愿意点进去看。</p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {user
            ? MEAL_TYPES.map((mealType) => {
                const entry = mealPlanMap.get(mealType);

                return (
                  <HomeMealCard
                    actionLabel={entry ? "看详情" : "去选菜"}
                    description={entry?.recipeSummary.description}
                    empty={!entry}
                    imageUrl={entry?.recipeSummary.imageUrl}
                    key={mealType}
                    mealType={mealType}
                    onAction={() =>
                      entry ? navigate(`/recipes/${entry.recipeId}`) : navigate("/plan")
                    }
                    onCardClick={
                      entry ? () => navigate(`/recipes/${entry.recipeId}`) : undefined
                    }
                    tags={entry?.recipeSummary.tags}
                    title={entry?.recipeSummary.name}
                    type={entry?.recipeSummary.type}
                  />
                );
              })
            : demoMeals.map((meal) => (
                <HomeMealCard
                  actionLabel={meal.mealType === "breakfast" ? "看示例" : "登录后安排"}
                  demo
                  description={meal.description}
                  imageUrl={meal.imageUrl}
                  key={meal.id}
                  mealType={meal.mealType}
                  onAction={() => setPromptOpen(true)}
                  onCardClick={() => setPromptOpen(true)}
                  tags={meal.tags}
                  title={meal.title}
                  type={meal.type}
                />
              ))}
        </section>
      </AppShell>

      <AuthPromptModal
        onClose={() => setPromptOpen(false)}
        onConfirm={goToAuth}
        open={promptOpen}
      />
    </>
  );
}
