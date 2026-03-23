import clsx from "clsx";

import type { RecipeSummary } from "../types/models";

type RecipeCardProps = {
  recipe: RecipeSummary;
  onClick?: () => void;
  compact?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export function RecipeCard({
  recipe,
  onClick,
  compact = false,
  actionLabel,
  onAction,
}: RecipeCardProps) {
  if (compact) {
    return (
      <article className="glass-panel flex items-center gap-4 rounded-[22px] p-4 shadow-premium-card">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-white/5">
          {recipe.imageUrl ? (
            <img
              alt={recipe.name}
              className="h-full w-full object-cover"
              src={recipe.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-secondary">
              无图
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-text-secondary">
              {recipe.type === "takeout" ? "外卖" : "自己做"}
            </span>
            {recipe.tags[0] ? (
              <span className="text-[11px] text-ember/90">{recipe.tags[0]}</span>
            ) : null}
          </div>
          <div>
            <h3 className="truncate font-display text-lg font-bold text-text-primary">
              {recipe.name}
            </h3>
            <p className="line-clamp-2 text-xs leading-6 text-text-secondary">
              {recipe.description || "这道菜还没有简介，先收藏起来，等你开做。"}
            </p>
          </div>
        </div>
        {actionLabel ? (
          <button
            className="rounded-full bg-ember px-4 py-2 text-xs text-white shadow-premium-orange"
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </button>
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-[28px] border border-white/10 bg-cocoa-panel-alt shadow-premium-card transition hover:-translate-y-1 hover:border-white/15",
        onClick ? "cursor-pointer" : "",
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="aspect-[4/3] overflow-hidden bg-white/5">
        {recipe.imageUrl ? (
          <img
            alt={recipe.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            src={recipe.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent-hero text-sm text-text-secondary">
            暂无封面
          </div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary">
            {recipe.type === "takeout" ? "外卖" : "自己做"}
          </span>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[11px] text-ember/90">
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold leading-tight text-text-primary">
            {recipe.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-7 text-text-secondary">
            {recipe.description || "还没有写简介，先保存下来，之后再慢慢补充。"}
          </p>
        </div>
      </div>
    </article>
  );
}
