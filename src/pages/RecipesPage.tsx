import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "../components/AppShell";
import { RecipeCard } from "../components/RecipeCard";
import { PRESET_TAGS } from "../constants/tags";
import { useAuth } from "../providers/AuthProvider";
import { listRecipes } from "../services/recipes";

export function RecipesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const recipesQuery = useQuery({
    queryKey: ["recipes", user?.id, query, selectedTag],
    queryFn: () =>
      listRecipes(user!.id, {
        query,
        tag: selectedTag || undefined,
      }),
    enabled: Boolean(user),
  });

  const filterTags = useMemo(() => {
    const dynamicTags = new Set<string>(PRESET_TAGS);
    (recipesQuery.data || []).forEach((recipe) => {
      recipe.tags.forEach((tag) => dynamicTags.add(tag));
    });
    return Array.from(dynamicTags);
  }, [recipesQuery.data]);

  const queryError =
    recipesQuery.error instanceof Error
      ? recipesQuery.error.message
      : "读取菜谱库失败，请稍后再试。";

  return (
    <AppShell
      subtitle="把自己做和常点外卖都收进来，之后选菜会轻松很多。"
      title="菜谱库"
    >
      <section className="mb-6">
        <div className="glass-panel flex items-center gap-3 rounded-full px-5 py-4 shadow-premium-card">
          <span className="text-sm text-text-secondary">搜索</span>
          <input
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/50"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="按菜名搜索，比如番茄炒蛋"
            value={query}
          />
        </div>
      </section>

      <section className="mb-8 flex flex-wrap gap-3">
        <button
          className={`rounded-full px-4 py-2.5 text-sm transition ${
            !selectedTag
              ? "bg-ember text-white shadow-premium-orange"
              : "glass-panel text-text-secondary"
          }`}
          onClick={() => setSelectedTag("")}
          type="button"
        >
          全部
        </button>
        {filterTags.map((tag) => (
          <button
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              selectedTag === tag
                ? "bg-ember text-white shadow-premium-orange"
                : "glass-panel text-text-secondary"
            }`}
            key={tag}
            onClick={() => setSelectedTag(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </section>

      {recipesQuery.isError ? (
        <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-6 text-sm leading-7 text-red-200">
          {queryError}
        </div>
      ) : recipesQuery.isLoading ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-text-secondary">
          正在读取菜谱库...
        </div>
      ) : recipesQuery.data && recipesQuery.data.length > 0 ? (
        <section className="space-y-5">
          {recipesQuery.data.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              recipe={recipe}
            />
          ))}
        </section>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center shadow-premium-card">
          <h2 className="font-display text-2xl font-bold text-text-primary">还没有菜谱</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            先新增一道常做菜或常点外卖，后面首页和餐计划页就能直接选了。
          </p>
          <Link
            className="mt-6 inline-flex rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
            to="/recipes/new"
          >
            去新增第一道菜
          </Link>
        </div>
      )}

      <div className="pointer-events-none fixed bottom-28 left-1/2 z-30 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 justify-end px-4">
        <Link
          className="pointer-events-auto rounded-full bg-ember px-5 py-4 text-sm text-white shadow-premium-orange"
          to="/recipes/new"
        >
          新增菜谱
        </Link>
      </div>
    </AppShell>
  );
}
