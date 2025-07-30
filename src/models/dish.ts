export interface Dish {
  _id: string;
  dish: string;
  image?: string;
  ingredients?: Dish_Ingredient[];
  vietnamese_name: string;
}

export interface Ingredient {
  _id: string;
  category: string;
  image: string;
  name_en: string;
  net_unit_value: number;
  unit: string;
  name: string;
}

export interface Dish_Ingredient {
  category: String;
  image: string;
  vietnamese_name: string;
  ingredient_name?: string;
  net_unit_value: number;
  unit: string;
}


export interface NewDishPayload {
  dish?: string;
  vietnamese_name: string;
  image: string;
  ingredients?: Dish_Ingredient[];
}

export interface IngredientPayload {
  name: string;
  unit: string;
  category: string;
  image: string;
  net_unit_value: number;
}

