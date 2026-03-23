import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { MealPlanPage } from "./pages/MealPlanPage";
import { NewRecipePage } from "./pages/NewRecipePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipesPage } from "./pages/RecipesPage";

function NotFoundPage() {
  return <Navigate replace to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<AuthPage />} path="/auth" />

      <Route element={<ProtectedRoute />}>
        <Route element={<RecipesPage />} path="/recipes" />
        <Route element={<NewRecipePage />} path="/recipes/new" />
        <Route element={<RecipeDetailPage />} path="/recipes/:recipeId" />
        <Route element={<MealPlanPage />} path="/plan" />
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
