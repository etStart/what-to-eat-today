import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "../components/AppShell";
import { RecipePickerSheet } from "../components/RecipePickerSheet";
import { useAuth } from "../providers/AuthProvider";
import { clearMealPlan, listMealPlansForRange, upsertMealPlan } from "../services/mealPlans";
import { listRecipes } from "../services/recipes";
import type { MealPlanEntry, MealType } from "../types/models";
import { buildSevenDayRange, getMealLabel, getMealTimeHint } from "../utils/date";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export function MealPlanPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const week = useMemo(() => buildSevenDayRange(new Date()), []);
  const requestedDate = searchParams.get("date");
  const selectedDate =
    requestedDate && week.some((item) => item.iso === requestedDate)
      ? requestedDate
      : week[0].iso;
  const [pickerMealType, setPickerMealType] = useState<MealType | null>(null);
  const [actionError, setActionError] = useState("");

  const mealPlansQuery = useQuery({
    queryKey: ["meal-plans", user?.id, week[0].iso, week[week.length - 1].iso],
    queryFn: () => listMealPlansForRange(user!.id, week[0].iso, week[week.length - 1].iso),
    enabled: Boolean(user),
  });

  const recipesQuery = useQuery({
    queryKey: ["recipes", user?.id, "planner"],
    queryFn: () => listRecipes(user!.id),
    enabled: Boolean(user),
  });

  const selectedEntries = useMemo(() => {
    const map = new Map<MealType, MealPlanEntry>();
    (mealPlansQuery.data || [])
      .filter((entry) => entry.date === selectedDate)
      .forEach((entry) => map.set(entry.mealType, entry));
    return map;
  }, [mealPlansQuery.data, selectedDate]);

  const upsertMutation = useMutation({
    mutationFn: (payload: { mealType: MealType; recipeId: string }) =>
      upsertMealPlan({
        userId: user!.id,
        date: selectedDate,
        mealType: payload.mealType,
        recipeId: payload.recipeId,
      }),
    onSuccess: async () => {
      setActionError("");
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
        exact: false,
      });
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : "更新餐计划失败，请稍后再试。");
    },
  });

  const clearMutation = useMutation({
    mutationFn: (mealType: MealType) =>
      clearMealPlan({
        userId: user!.id,
        date: selectedDate,
        mealType,
      }),
    onSuccess: async () => {
      setActionError("");
      await queryClient.invalidateQueries({
        queryKey: ["meal-plans", user?.id],
        exact: false,
      });
    },
    onError: (error) => {
      setActionError(error instanceof Error ? error.message : "清空餐位失败，请稍后再试。");
    },
  });

  const plannerError =
    mealPlansQuery.error instanceof Error
      ? mealPlansQuery.error.message
      : "读取餐计划失败，请稍后再试。";
  const recipesError =
    recipesQuery.error instanceof Error
      ? recipesQuery.error.message
      : "读取菜谱失败，请稍后再试。";

  const handleSelectDate = (date: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (date === week[0].iso) {
        next.delete("date");
      } else {
        next.set("date", date);
      }

      return next;
    });
  };

  return (
    <AppShell
      subtitle="先把接下来 7 天排好，今天打开首页时就不用再临时想。"
      title="餐计划"
    >
      <section className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-3">
          {week.map((item) => {
            const active = item.iso === selectedDate;
            return (
              <button
                className={`min-w-[92px] rounded-[24px] border px-4 py-3 text-left transition ${
                  active
                    ? "border-ember/40 bg-ember text-white shadow-premium-orange"
                    : "border-white/10 bg-white/5 text-text-secondary"
                }`}
                key={item.iso}
                onClick={() => handleSelectDate(item.iso)}
                type="button"
              >
                <div className="font-label text-xs uppercase tracking-[0.24em]">
                  {item.dayLabel}
                </div>
                <div className="mt-1 font-display text-2xl font-bold">{item.numberLabel}</div>
                <div className="mt-1 text-xs opacity-80">{item.monthLabel}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          className="rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
          to="/recipes/new"
        >
          先加一道菜
        </Link>
        <Link
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-secondary"
          to="/recipes"
        >
          去菜谱库
        </Link>
      </section>

      {mealPlansQuery.isError ? (
        <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
          {plannerError}
        </div>
      ) : null}

      {recipesQuery.isError ? (
        <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
          {recipesError}
        </div>
      ) : null}

      {actionError ? (
        <div className="mb-6 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-7 text-red-200">
          {actionError}
        </div>
      ) : null}

      <section className="space-y-6">
        {MEAL_TYPES.map((mealType) => {
          const entry = selectedEntries.get(mealType);

          return (
            <article className="glass-panel rounded-[28px] p-5 shadow-premium-card" key={mealType}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {getMealLabel(mealType)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">
                    {getMealTimeHint(mealType)}
                  </p>
                </div>
                <button
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"
                  onClick={() => setPickerMealType(mealType)}
                  type="button"
                >
                  {entry ? "换一道" : "选一道"}
                </button>
              </div>

              {entry ? (
                <div className="space-y-4">
                  <div className="h-40 overflow-hidden rounded-[24px] bg-white/5">
                    {entry.recipeSummary.imageUrl ? (
                      <img
                        alt={entry.recipeSummary.name}
                        className="h-full w-full object-cover"
                        src={entry.recipeSummary.imageUrl}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                        暂无封面
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary">
                        {entry.recipeSummary.type === "takeout" ? "外卖" : "自己做"}
                      </span>
                      {entry.recipeSummary.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[11px] text-ember/90">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display text-3xl font-bold text-text-primary">
                      {entry.recipeSummary.name}
                    </h3>
                    <p className="text-sm leading-7 text-text-secondary">
                      {entry.recipeSummary.description ||
                        "这道菜还没有简介，但已经被安排进这顿饭里了。"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-full bg-ember px-5 py-2.5 text-sm text-white shadow-premium-orange"
                      onClick={() => navigate(`/recipes/${entry.recipeId}`)}
                      type="button"
                    >
                      看详情
                    </button>
                    <button
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-text-secondary"
                      onClick={() => clearMutation.mutate(mealType)}
                      type="button"
                    >
                      清空这顿
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/12 bg-white/5 p-6 text-center">
                  <p className="text-sm leading-7 text-text-secondary">
                    这顿还没安排，点一下“选一道”，从你的菜谱库里挑一个就好。
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <RecipePickerSheet
        mealLabel={pickerMealType ? getMealLabel(pickerMealType) : ""}
        onClear={
          pickerMealType && selectedEntries.get(pickerMealType)
            ? () => {
                clearMutation.mutate(pickerMealType);
                setPickerMealType(null);
              }
            : undefined
        }
        onClose={() => setPickerMealType(null)}
        onSelect={(recipeId) => {
          if (!pickerMealType) {
            return;
          }

          upsertMutation.mutate(
            { mealType: pickerMealType, recipeId },
            {
              onSuccess: () => setPickerMealType(null),
            },
          );
        }}
        open={Boolean(pickerMealType)}
        recipes={recipesQuery.data || []}
        selectedRecipeId={
          pickerMealType ? selectedEntries.get(pickerMealType)?.recipeId : undefined
        }
      />
    </AppShell>
  );
}
