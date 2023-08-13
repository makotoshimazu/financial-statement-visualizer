import { generatePath } from "react-router-dom";

export const PATHS = {
  root: "/",
  finantialStatement: "/fs/:companyId",
};

export const routes = {
  root: () => generatePath(PATHS.root),
  finantialStatement: (companyId: string) =>
    generatePath(PATHS.finantialStatement, { companyId }),
};
