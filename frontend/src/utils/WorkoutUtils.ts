import { Workout } from "../types";

export const calculateVolume = (workout: Workout) => {
  return workout.set_groups.reduce((workoutTotal, setGroup) => {
    const setGroupVolume = setGroup.sets.reduce((setTotal, set) => {
      return setTotal + set.reps * set.weight;
    }, 0);
    return workoutTotal + setGroupVolume;
  }, 0);
};

export const calculateSets = (workout: Workout) => {
  return workout.set_groups.reduce((workoutTotal, setGroup) => {
    return workoutTotal + setGroup.sets.length;
  }, 0);
};

export const calculateReps = (workout: Workout) => {
  return workout.set_groups.reduce((workoutTotal, setGroup) => {
    const setGroupReps = setGroup.sets.reduce((setTotal, set) => {
      return setTotal + set.reps;
    }, 0);
    return workoutTotal + setGroupReps;
  }, 0);
};

export const filterWorkouts = (workouts: Workout[], timeInterval: string) => {
  const now = new Date();
  switch (timeInterval) {
    case "1month":
      return workouts.filter(
        (workout) =>
          new Date(workout.date) >=
          new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      );
    case "3month":
      return workouts.filter(
        (workout) =>
          new Date(workout.date) >=
          new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      );
    case "6month":
      return workouts.filter(
        (workout) =>
          new Date(workout.date) >=
          new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
      );
    case "1year":
      return workouts.filter(
        (workout) =>
          new Date(workout.date) >=
          new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      );
    case "all":
    default:
      return workouts;
  }
};

export const aggregateData = (
  workouts: Workout[],
  interval: string,
  metric: string
) => {
  const aggregated: {
    [key: string]: {
      volume: number;
      sets: number;
      reps: number;
      count: number;
    };
  } = {};

  workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const week = Math.ceil(date.getDate() / 7);
    let key: string;

    switch (interval) {
      case "monthly":
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case "weekly":
        key = `${date.getFullYear()}-${date.getMonth() + 1}-W${week}`;
        break;
      case "yearly":
        key = `${date.getFullYear()}`;
        break;
      default:
        key = workout.date;
    }

    if (!aggregated[key]) {
      aggregated[key] = { volume: 0, sets: 0, reps: 0, count: 0 };
    }

    aggregated[key].volume += calculateVolume(workout);
    aggregated[key].sets += calculateSets(workout);
    aggregated[key].reps += calculateReps(workout);
    aggregated[key].count += 1;
  });

  return Object.entries(aggregated).map(([date, data]) => {
    const { volume, sets, reps, count } = data;
    const divisor = metric.includes("per_workout") ? count : 1;
    return {
      date,
      value: metric.includes("volume")
        ? volume / divisor
        : metric.includes("sets")
        ? sets / divisor
        : reps / divisor,
    };
  });
};
