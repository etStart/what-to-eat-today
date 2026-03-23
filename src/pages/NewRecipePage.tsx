import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "../components/AppShell";
import { PRESET_TAGS } from "../constants/tags";
import { useAuth } from "../providers/AuthProvider";
import { createRecipe } from "../services/recipes";
import { compressRecipeImage } from "../services/storage";
import type { RecipeType } from "../types/models";

const recipeSchema = z.object({
  name: z.string().trim().min(1, "请输入菜名"),
  type: z.enum(["homemade", "takeout"]),
  description: z.string().max(280, "简介最多 280 字").optional(),
  customTags: z.string().optional(),
  steps: z.array(
    z.object({
      value: z.string().optional(),
    }),
  ),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export function NewRecipePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      type: "homemade",
      description: "",
      customTags: "",
      steps: [{ value: "" }, { value: "" }],
    },
  });

  const stepsFieldArray = useFieldArray({
    control: form.control,
    name: "steps",
  });

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const recipeType = form.watch("type");

  const mutation = useMutation({
    mutationFn: async (values: RecipeFormValues) => {
      const customTags = values.customTags
        ?.split(/[,，\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean);

      const compressedImage = imageFile
        ? await compressRecipeImage(imageFile)
        : null;

      return createRecipe({
        user: user!,
        type: values.type as RecipeType,
        name: values.name,
        description: values.description?.trim() || "",
        steps: values.steps.map((item) => item.value?.trim() || "").filter(Boolean),
        tags: Array.from(new Set([...(selectedTags || []), ...(customTags || [])])),
        imageFile: compressedImage,
      });
    },
    onSuccess: async (recipe) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["recipes", user?.id], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["meal-plans", user?.id], exact: false }),
      ]);
      navigate(`/recipes/${recipe.id}`);
    },
  });

  const helperText = useMemo(
    () =>
      recipeType === "takeout"
        ? "外卖也正常记录：菜名、简介、图片、标签都可照样保存。"
        : "步骤可以先空着，先把想吃的菜存下来再慢慢补。",
    [recipeType],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError("");
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "保存失败，请稍后再试。");
    }
  });

  return (
    <AppShell
      subtitle="图片可选、步骤可选。先把常做菜和常点外卖录进去，后面选菜会越来越快。"
      title="上传菜谱"
    >
      <form className="space-y-8" onSubmit={onSubmit}>
        <section className="glass-panel rounded-[32px] p-6 shadow-premium-card">
          <label className="block">
            <div className="mb-3 text-sm text-text-secondary">封面图</div>
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-ember/40 bg-black/20">
              {previewUrl ? (
                <img alt="菜谱预览" className="absolute inset-0 h-full w-full object-cover" src={previewUrl} />
              ) : (
                <div className="p-6 text-center text-sm leading-7 text-text-secondary">
                  手机原图会在上传前自动压缩到最大 1200px、500KB 内，再上传到图片存储。
                </div>
              )}
              <input
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setImageFile(file);
                }}
                type="file"
              />
              <span className="pointer-events-none absolute bottom-4 rounded-full bg-black/55 px-4 py-2 text-xs text-white">
                {previewUrl ? "重新选择图片" : "点这里选择图片"}
              </span>
            </div>
          </label>

          <div className="mt-6 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm text-text-secondary">菜名</span>
              <input
                className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
                placeholder="比如：番茄炒蛋"
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <span className="text-sm text-red-300">{form.formState.errors.name.message}</span>
              ) : null}
            </label>

            <div className="space-y-2">
              <span className="text-sm text-text-secondary">类型</span>
              <div className="glass-panel flex rounded-full p-1.5">
                {([
                  { value: "homemade", label: "自己做" },
                  { value: "takeout", label: "外卖" },
                ] as const).map((option) => (
                  <button
                    className={`flex-1 rounded-full px-4 py-3 text-sm transition ${
                      recipeType === option.value
                        ? "bg-ember text-white shadow-premium-orange"
                        : "text-text-secondary"
                    }`}
                    key={option.value}
                    onClick={() => form.setValue("type", option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-text-secondary">简介</span>
              <textarea
                className="glass-panel min-h-[120px] w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
                placeholder="简单写一下这道菜适合什么时候吃、是什么味道。"
                {...form.register("description")}
              />
            </label>

            <p className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-text-secondary">
              {helperText}
            </p>
          </div>
        </section>

        <section className="glass-panel rounded-[32px] p-6 shadow-premium-card">
          <div className="mb-4">
            <h2 className="font-display text-2xl font-bold text-text-primary">标签</h2>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              先点预设标签，如果还不够，再补几个自定义标签就好。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {PRESET_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  className={`rounded-full px-4 py-2.5 text-sm transition ${
                    active
                      ? "bg-ember text-white shadow-premium-orange"
                      : "glass-panel text-text-secondary"
                  }`}
                  key={tag}
                  onClick={() =>
                    setSelectedTags((current) =>
                      current.includes(tag)
                        ? current.filter((item) => item !== tag)
                        : [...current, tag],
                    )
                  }
                  type="button"
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <label className="mt-5 block space-y-2">
            <span className="text-sm text-text-secondary">自定义标签</span>
            <input
              className="glass-panel w-full rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
              placeholder="多个标签用逗号隔开，比如：夜宵, 小朋友爱吃"
              {...form.register("customTags")}
            />
          </label>
        </section>

        <section className="glass-panel rounded-[32px] p-6 shadow-premium-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-text-primary">做法步骤</h2>
              <p className="mt-2 text-sm leading-7 text-text-secondary">
                可留空。先给两条输入框，不够的话继续加。
              </p>
            </div>
            <button
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"
              onClick={() => stepsFieldArray.append({ value: "" })}
              type="button"
            >
              新增一步
            </button>
          </div>

          <div className="space-y-4">
            {stepsFieldArray.fields.map((field, index) => (
              <div className="flex items-center gap-4" key={field.id}>
                <span className="w-10 text-right font-display text-2xl font-bold text-ember/70">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <input
                  className="glass-panel flex-1 rounded-[22px] px-5 py-4 text-text-primary outline-none placeholder:text-text-secondary/40"
                  placeholder={`描述第 ${index + 1} 步`}
                  {...form.register(`steps.${index}.value`)}
                />
              </div>
            ))}
          </div>
        </section>

        {submitError ? (
          <div className="rounded-[20px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {submitError}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-text-secondary"
            onClick={() => navigate("/recipes")}
            type="button"
          >
            返回菜谱库
          </button>
          <button
            className="rounded-full bg-ember px-6 py-3.5 text-sm text-white shadow-premium-orange disabled:cursor-not-allowed disabled:opacity-60"
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending ? "正在压缩并上传..." : "保存这道菜"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

