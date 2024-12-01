export type AllowedSolutionTypes = string | number | null;

export interface Solution {
  day: number;
  solutionOne: AllowedSolutionTypes;
  solutionTwo: AllowedSolutionTypes;
}
