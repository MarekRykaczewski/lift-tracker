export interface Workout {
  id: number;
  date: string;
  notes: string | null;
  set_groups: SetGroup[];
}

export interface Set {
  id: number;
  exercise: string;
  weight: number;
  order: number;
  display_weight: number;
  reps: number;
}

export interface SetGroup {
  id: number;
  order: number;
  exercise_name: string;
  sets: Set[];
}
