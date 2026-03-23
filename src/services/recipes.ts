import type { User } from "@supabase/supabase-js";

import { createSignedImageUrl, uploadRecipeImage } from "./storage";
import { supabase } from "../lib/supabase";
import type { Recipe, RecipeRow, RecipeType } from "../types/models";

type ListRecipeParams = {
  query?: string;
  tag?: string;
};

export type CreateRecipeInput = {
  user: User;
  type: RecipeType;
  name: string;
  description: string;
  steps: string[];
  tags: string[];
  imageFile?: File | null;
};

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase 还没有配置完成，请先补齐环境变量。");
  }

  return supabase;
}

async function mapRecipeRow(row: RecipeRow): Promise<Recipe> {
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

export async function listRecipes(userId: string, params: ListRecipeParams = {}) {
  const client = ensureSupabase();

  let query = client
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (params.query) {
    query = query.ilike("name", `%${params.query.trim()}%`);
  }

  if (params.tag) {
    query = query.contains("tags", [params.tag]);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return Promise.all((data as RecipeRow[]).map(mapRecipeRow));
}

export async function getRecipeById(userId: string, recipeId: string) {
  const client = ensureSupabase();

  const { data, error } = await client
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .eq("id", recipeId)
    .single();

  if (error) {
    throw error;
  }

  return mapRecipeRow(data as RecipeRow);
}

export async function createRecipe(input: CreateRecipeInput) {
  const client = ensureSupabase();

  let imagePath: string | null = null;

  if (input.imageFile) {
    imagePath = await uploadRecipeImage(input.user.id, input.imageFile);
  }

  const { data, error } = await client
    .from("recipes")
    .insert({
      user_id: input.user.id,
      type: input.type,
      name: input.name.trim(),
      description: input.description.trim(),
      image_path: imagePath,
      steps: input.steps.filter(Boolean),
      tags: Array.from(new Set(input.tags.filter(Boolean))),
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapRecipeRow(data as RecipeRow);
}
