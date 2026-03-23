import clsx from "clsx";

import type { MealType, RecipeType } from "../types/models";
import { getMealLabel, getMealTimeHint } from "../utils/date";

type HomeMealCardProps = {
  mealType: MealType;
  title?: string;
  description?: string;
  imageUrl?: string | null;
  tags?: string[];
  type?: RecipeType;
  demo?: boolean;
  empty?: boolean;
  actionLabel: string;
  onAction: () => void;
  onCardClick?: () => void;
};

export function HomeMealCard({
  mealType,
  title,
  description,
  imageUrl,
  tags = [],
  type = "homemade",
  demo = false,
  empty = false,
  actionLabel,
  onAction,
  onCardClick,
}: HomeMealCardProps) {
  return (
    <article
      className={clsx(
        "overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-premium-card backdrop-blur-2xl transition hover:border-white/15",
        onCardClick ? "cursor-pointer" : "",
      )}
      onClick={onCardClick}
      onKeyDown={(event) => {
        if (onCardClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onCardClick();
        }
      }}
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
    >
      <div className="relative h-48 overflow-hidden bg-white/5">
        {imageUrl ? (
          <img alt={title || "餐卡封面"} className="h-full w-full object-cover" src={imageUrl} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent-hero text-sm text-text-secondary">
            暂未安排
          </div>
        )}
        {demo ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 font-label text-[11px] text-white">
            示例
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-label text-[11px] uppercase tracking-[0.24em] text-ember/90">
                {getMealLabel(mealType)}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {getMealTimeHint(mealType)}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary">
              {type === "takeout" ? "外卖" : "自己做"}
            </span>
          </div>

          {empty ? (
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-text-primary">
                还没选这顿
              </h3>
              <p className="text-sm leading-7 text-text-secondary">
                点一下就能从菜谱库里挑一道菜，今天的安排会在这里立刻更新。
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold leading-tight text-text-primary">
                {title}
              </h3>
              <p className="text-sm leading-7 text-text-secondary">{description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!empty
            ? tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-text-secondary"
                >
                  {tag}
                </span>
              ))
            : null}

          <button
            className="ml-auto rounded-full bg-ember px-5 py-2.5 font-label text-sm text-white shadow-premium-orange"
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
            type="button"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
