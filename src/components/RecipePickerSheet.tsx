import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import type { RecipeSummary } from "../types/models";
import { RecipeCard } from "./RecipeCard";

type RecipePickerSheetProps = {
  open: boolean;
  mealLabel: string;
  recipes: RecipeSummary[];
  selectedRecipeId?: string;
  onSelect: (recipeId: string) => void;
  onClear?: () => void;
  onClose: () => void;
};

export function RecipePickerSheet({
  open,
  mealLabel,
  recipes,
  selectedRecipeId,
  onSelect,
  onClear,
  onClose,
}: RecipePickerSheetProps) {
  const [query, setQuery] = useState("");

  const filteredRecipes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const source = `${recipe.name} ${recipe.description} ${recipe.tags.join(" ")}`.toLowerCase();
      return source.includes(keyword);
    });
  }, [query, recipes]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pt-10 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] border border-white/10 bg-obsidian-soft shadow-premium-card">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.24em] text-ember/90">
              {mealLabel}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-text-primary">
              选一道菜
            </h3>
          </div>
          <button
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"
            onClick={onClose}
            type="button"
          >
            关闭
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-5">
          <div className="glass-panel flex items-center gap-3 rounded-full px-5 py-3">
            <span className="text-sm text-text-secondary">搜索</span>
            <input
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/50"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="按菜名、简介或标签筛选"
              value={query}
            />
          </div>

          {recipes.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm leading-7 text-text-secondary">
                你还没有可选的菜谱，先去新增一道菜，餐计划就能选起来了。
              </p>
              <Link
                className="mt-4 inline-flex rounded-full bg-ember px-5 py-2.5 text-sm text-white shadow-premium-orange"
                to="/recipes/new"
              >
                去新增菜谱
              </Link>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm leading-7 text-text-secondary">
                没找到符合条件的菜谱，换个关键词试试。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  actionLabel={selectedRecipeId === recipe.id ? "已选中" : "选这道"}
                  compact
                  onAction={() => onSelect(recipe.id)}
                  recipe={recipe}
                />
              ))}
            </div>
          )}
        </div>

        {onClear ? (
          <div className="border-t border-white/10 px-5 py-4">
            <button
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-secondary"
              onClick={onClear}
              type="button"
            >
              清空这个餐位
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
