import { readdir, stat } from "fs/promises";
import path from "path";
import type { Solution } from "./types/solutions";

const handleErrorReturns = (message: string, day: string) => {
  return {
    day: Number(day),
    solutionOne: message,
    solutionTwo: message,
  };
};

const solutionsDir = path.resolve("./solutions");

const getSolutions = async (): Promise<Solution[]> => {
  // Read the base directory
  const solutions = await readdir(solutionsDir, { withFileTypes: true });

  const mappedSolutions = solutions
    .filter((solution) => solution.isDirectory())
    .map(async (solution) => {
      const day = solution.name;
      const folderPath = path.join(solutionsDir, day);
      const indexFilePath = path.join(folderPath, "index.ts");

      try {
        // Check if index.ts exists
        const stats = await stat(indexFilePath).catch(() => null);

        if (!stats || !stats.isFile()) {
          console.log({ stats, isFile: stats?.isFile() });
          return handleErrorReturns("no index.ts file found", day);
        }

        // Dynamically import the index.ts file
        const module = await import(indexFilePath);

        // Ensure the default export is a function that returns an array
        if (typeof module.default === "function") {
          const value = await module.default();
          if (Array.isArray(value)) {
            // Check types for both solutions
            const validType = (v: unknown): v is string | number | null =>
              typeof v === "string" || typeof v === "number" || v === null;

            if (!validType(value[0]) || !validType(value[1])) {
              return handleErrorReturns(
                "Value must be string, number, or null",
                day,
              );
            }

            return {
              day: Number(day),
              solutionOne: value[0],
              solutionTwo: value[1],
            };
          } else {
            return handleErrorReturns("Solution does not return an array", day);
          }
        } else {
          return handleErrorReturns(
            "File does not not have a default export",
            day,
          );
        }
      } catch (error) {
        console.error(`Error processing ${indexFilePath}:`, error);
        return handleErrorReturns("Error processing file", day);
      }
    });

  return Promise.all(mappedSolutions);
};

(async () => {
  const solutions = await getSolutions();
  console.table(solutions);
})();
