import fs from "fs";

export const readFile = (day: string) =>
  fs.readFileSync(`./solutions/${day}/input.txt`, "utf-8").trimEnd();
