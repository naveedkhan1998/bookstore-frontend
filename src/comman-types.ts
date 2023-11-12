export interface RefreshTokenResult {
  data?: {
    access?: string;
    refresh?: string;
  };
}
export type Credentials = {
  email: string;
  password: string;
};

export type Elixirs = {
  id: string;
  name: string;
  effect: string;
  sideEffects: string;
  characteristics: null | string;
  time: null | string;
  difficulty: string;
  ingredients: Ingredient[];
  inventors: any[];
  manufacturer: null | string;
};

export type Ingredient = {
  id: string;
  name: string;
};
