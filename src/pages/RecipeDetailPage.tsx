import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "../components/AppShell";
import { useAuth } from "../providers/AuthProvider";
import { getRecipeById } from "../services/recipes";

export function RecipeDetailPage() {
  const navigate = useNavigate();
  const { recipeId = "" } = useParams();
  const { user } = useAuth();

  const recipeQuery = useQuery({
    queryKey: ["recipe", user?.id, recipeId],
    queryFn: () => getRecipeById(user!.id, recipeId),
    enabled: Boolean(user && recipeId),
  });

  const recipe = recipeQuery.data;
  const queryError =
    recipeQuery.error instanceof Error
      ? recipeQuery.error.message
      : "读取菜谱详情失败，请稍后再试。";

  return (
    <AppShell
      subtitle="图片、标签和步骤都在这里，临到吃饭时一眼就能回忆起来。"
      title={recipe?.name || "菜谱详情"}
    >
      {recipeQuery.isLoading ? (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-text-secondary">
          正在读取菜谱...
        </div>
      ) : recipeQuery.isError ? (
        <div className="rounded-[32px] border border-red-400/20 bg-red-500/10 p-8 text-sm leading-7 text-red-200">
          {queryError}
        </div>
      ) : recipe ? (
        <div className="space-y-6">
          <section className="space-y-5">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-premium-card">
              {recipe.imageUrl ? (
                <img
                  alt={recipe.name}
                  className="h-full max-h-[520px] w-full object-cover"
                  src={recipe.imageUrl}
                />
              ) : (
                <div className="flex min-h-[360px] items-center justify-center bg-accent-hero text-text-secondary">
                  这道菜还没有封面图
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-ember px-4 py-2 text-sm text-white shadow-premium-orange">
                {recipe.type === "takeout" ? "外卖" : "自己做"}
              </span>
              {recipe.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="glass-panel space-y-6 rounded-[32px] p-6 shadow-premium-card">
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold text-text-primary">这道菜怎么吃？</h2>
              <p className="text-sm leading-7 text-text-secondary">
                {recipe.description || "这道菜还没有简介，但已经可以被加入你的餐计划。"}
              </p>
            </div>

            {recipe.steps.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-text-primary">做法步骤</h3>
                <div className="space-y-3">
                  {recipe.steps.map((step, index) => (
                    <div className="glass-panel flex gap-4 rounded-[24px] p-4" key={`${step}-${index}`}>
                      <span className="mt-1 font-display text-xl font-bold text-ember/90">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-7 text-text-secondary">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/12 bg-white/5 p-5 text-sm leading-7 text-text-secondary">
                这道菜还没有填写步骤，当前也能正常加入餐计划。
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full bg-ember px-5 py-3 text-sm text-white shadow-premium-orange"
                onClick={() => navigate("/plan")}
                type="button"
              >
                放进餐计划
              </button>
              <Link
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-secondary"
                to="/recipes"
              >
                返回菜谱库
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-text-secondary">
          没找到这道菜，可能已经被删除或当前账号无权限查看。
        </div>
      )}
    </AppShell>
  );
}
