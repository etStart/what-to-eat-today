import { supabase } from "../lib/supabase";
import type {
  MealPlanEntry,
  MealPlanRow,
  MealType,
  Recipe,
  RecipeRow,
} from "../types/models";
import { createSignedImageUrl } from "./storage";

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase 还没有配置完成，请先补齐环境变量。");
  }

  return supabase;
}

async function mapRecipe(row: RecipeRow): Promise<Recipe> {
  const imageUrl = row.image_path ? await createSignedImageUrl(row.image_path) : null;

  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    name: row.name,
    description: row.description,
    imagePath: row.image_path,
    imageUrl,
    steps: row.steps ?? [],
    tags: row.tags ?? [],
    createdAt: row.created_at,
  };
}

export async function listMealPlansForRange(
  userId: string,
  startDate: string,
  endDate: string,
) {
  const client = ensureSupabase();

  const { data, error } = await client
    .from("meal_plans")
    .select(
      "id, user_id, date, meal_type, recipe_id, created_at, recipes:recipe_id(*)",
    )
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = data as MealPlanRow[];

  return Promise.all(
    rows.map(async (row) => {
      const recipeSource = Array.isArray(row.recipes) ? row.recipes[0] : row.recipes;
      const recipe = await mapRecipe(recipeSource as RecipeRow);

      return {
        id: row.id,
        date: row.date,
        mealType: row.meal_type,
        recipeId: row.recipe_id,
        recipeSummary: {
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          imagePath: recipe.imagePath,
          imageUrl: recipe.imageUrl,
          tags: recipe.tags,
          type: recipe.type,
        },
      } satisfies MealPlanEntry;
    }),
  );
}

export async function upsertMealPlan(params: {
  userId: string;
  date: string;
  mealType: MealType;
  recipeId: string;
}) {
  const client = ensureSupabase();

  const { error } = await client.from("meal_plans").upsert(
    {
      user_id: params.userId,
      date: params.date,
      meal_type: params.mealType,
      recipe_id: params.recipeId,
    },
    {
      onConflict: "user_id,date,meal_type",
    },
  );

  if (error) {
    throw error;
  }
}

export async function clearMealPlan(params: {
  userId: string;
  date: string;
  mealType: MealType;
}) {
  const client = ensureSupabase();

  const { error } = await client
    .from("meal_plans")
    .delete()
    .eq("user_id", params.userId)
    .eq("date", params.date)
    .eq("meal_type", params.mealType);

  if (error) {
    throw error;
  }
}
