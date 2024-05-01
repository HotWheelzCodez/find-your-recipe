interface Meal {
  name: string;
  imagePath: string;
  instructions: string;
  listedIngredients: string[];
  cookTime: number;
  rank: number;
};

export type { Meal as Meal};
