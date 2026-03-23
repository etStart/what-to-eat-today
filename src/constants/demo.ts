import type { DemoMealCard, MealType } from "../types/models";

const mealDescriptions: Record<MealType, string> = {
  breakfast: "酸甜开胃，做法简单，适合忙碌工作日前的轻松早餐。",
  lunch: "酱香浓郁，配一碗热米饭就很满足，午餐吃起来稳稳当当。",
  dinner: "蒜香清爽，口味不重，晚上吃也不会觉得太有负担。",
};

export const demoMeals: DemoMealCard[] = [
  {
    id: "demo-breakfast",
    mealType: "breakfast",
    title: "番茄炒蛋",
    description: mealDescriptions.breakfast,
    type: "homemade",
    tags: ["早餐", "家常菜"],
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-lunch",
    mealType: "lunch",
    title: "黄焖鸡米饭",
    description: mealDescriptions.lunch,
    type: "takeout",
    tags: ["外卖", "午餐"],
    imageUrl:
      "https://images.unsplash.com/photo-1512058454905-6b841e7ad132?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-dinner",
    mealType: "dinner",
    title: "蒜蓉西兰花",
    description: mealDescriptions.dinner,
    type: "homemade",
    tags: ["晚餐", "健康"],
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  },
];
