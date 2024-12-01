import { readFile } from "../../helpers/readFile.helper";
import type { AllowedSolutionTypes } from "../../types/solutions";

const input = readFile("1").split("\n");

const [leftList, rightList] = input.reduce<[number[], number[]]>(
  ([leftList, rightList], row) => {
    const [left, right] = row.split(/\s+/).map(Number);

    leftList.push(left);
    rightList.push(right);

    return [leftList, rightList];
  },
  [[], []],
);

const first = () => {
  const sortedLeft = [...leftList].sort();
  const sortedright = [...rightList].sort();

  return sortedLeft.reduce<number>((total, current, index) => {
    const rightValue = sortedright[index];

    return (total +=
      rightValue > current ? rightValue - current : current - rightValue);
  }, 0);
};

const second = () => {
  return leftList.reduce<number>((total, current) => {
    const frequency = rightList.filter((num) => num === current).length;
    return (total += current * frequency);
  }, 0);
};

const solution = (): AllowedSolutionTypes[] => {
  return [first(), second()];
};

export default solution;
