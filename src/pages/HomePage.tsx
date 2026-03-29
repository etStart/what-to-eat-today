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
import { getTodayIso, getTomorrowIso } from "../utils/date";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [promptOpen, setPromptOpen] = useState(false);
  const { user } = useAuth();
  const todayIso = getTodayIso();
  const tomorrowIso = getTomorrowIso();
  const [selectedDateIso, setSelectedDateIso] = useState(todayIso);

  const mealPlansQuery = useQuery({
    queryKey: ["meal-plans", user?.id, selectedDateIso],
    queryFn: () => listMealPlansForRange(user!.id, selectedDateIso, selectedDateIso),
    enabled: Boolean(user),
  });

  const mealPlanMap = useMemo(() => {
    const map = new Map<MealType, MealPlanEntry>();
    (mealPlansQuery.data || []).forEach((entry) => {
      map.set(entry.mealType, entry);
    });
    return map;
  }, [mealPlansQuery.data]);

  const viewingTomorrow = selectedDateIso === tomorrowIso;
  const plannerHref = `/plan${selectedDateIso === todayIso ? "" : `?date=${selectedDateIso}`}`;

  const goToAuth = () => {
    const next = `${location.pathname}${location.search}`;
    navigate(`/auth?next=${encodeURIComponent(next)}`);
  };

  const queryError =
    mealPlansQuery.error instanceof Error
      ? mealPlansQuery.error.message
      : "读取餐计划失败，请稍后再试。";

  return (
    <>
      <AppShell>
        <section className="space-y-5 pb-2">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 font-label text-xs uppercase tracking-[0.24em] text-ember/90">
              {viewingTomorrow ? "明天安排" : "今日安排"}
            </div>
            <h2 className="max-w-[10ch] font-display text-4xl font-bold leading-tight text-text-primary">
              {user
                ? viewingTomorrow
                  ? "明天的三餐提前想好了吗？"
                  : "今天的三餐已经准备好了吗？"
                : "先看看这套首页 UI 长什么样。"}
            </h2>
            <p className="max-w-xl text-base leading-8 text-text-secondary">
              今天先吃什么，明天提前想一点，日子就会轻松很多。
            </p>

            {!user ? (
              <p className="text-sm leading-7 text-ember/90">
                当前展示的是示例数据，登录后会自动切换成你的真实餐计划。
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-1">
              {user ? (
                <>
                  <button
                    className="rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
                    onClick={() => navigate(plannerHref)}
                    type="button"
                  >
                    去安排 7 天餐计划
                  </button>
                  <button
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-secondary"
                    onClick={() =>
                      setSelectedDateIso((current) =>
                        current === todayIso ? tomorrowIso : todayIso,
                      )
                    }
                    type="button"
                  >
                    {viewingTomorrow ? "今天" : "明天"}
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
        </section>

        {user && mealPlansQuery.isError ? (
          <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
            {queryError}
          </div>
        ) : null}

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
                      entry ? navigate(`/recipes/${entry.recipeId}`) : navigate(plannerHref)
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
