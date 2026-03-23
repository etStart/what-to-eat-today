export type RecipeType = "homemade" | "takeout";
export type MealType = "breakfast" | "lunch" | "dinner";
export type AuthMode = "login" | "signup";

export type RecipeRow = {
  id: string;
  user_id: string;
  type: RecipeType;
  name: string;
  description: string;
  image_path: string | null;
  steps: string[];
  tags: string[];
  created_at: string;
};

export type Recipe = {
  id: string;
  userId: string;
  type: RecipeType;
  name: string;
  description: string;
  imagePath: string | null;
  imageUrl: string | null;
  steps: string[];
  tags: string[];
  createdAt: string;
};

export type RecipeSummary = Pick<
  Recipe,
  "id" | "name" | "description" | "imagePath" | "imageUrl" | "tags" | "type"
>;

export type MealPlanRow = {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  recipe_id: string;
  created_at: string;
  recipes: RecipeRow | RecipeRow[] | null;
};

export type MealPlanEntry = {
  id: string;
  date: string;
  mealType: MealType;
  recipeId: string;
  recipeSummary: RecipeSummary;
};

export type DemoMealCard = {
  id: string;
  mealType: MealType;
  title: string;
  description: string;
  type: RecipeType;
  tags: string[];
  imageUrl: string;
};
