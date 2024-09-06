import { KG_TO_LBS } from "../constants";

export const convertWeight = (weight: number, unit: string): number => {
  if (unit === "lbs") {
    return weight * KG_TO_LBS;
  }
  return weight;
};
