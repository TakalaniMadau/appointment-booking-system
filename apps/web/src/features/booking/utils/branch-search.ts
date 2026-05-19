import type { BranchLocation } from "../types";

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const buildBranchSearchText = (branch: BranchLocation) =>
  normalizeSearchValue(
    [
      branch.name,
      branch.address,
      branch.city,
      branch.postalCode,
      branch.province,
    ].join(" "),
  );

export const filterBranchesBySearch = (
  branches: BranchLocation[],
  query: string,
) => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return branches;
  }

  return branches.filter((branch) =>
    buildBranchSearchText(branch).includes(normalizedQuery),
  );
};

export const shouldGeocodeBranchSearch = (
  query: string,
  hasDirectMatches: boolean,
) => normalizeSearchValue(query).length >= 2 && !hasDirectMatches;

export const deriveVisibleBranches = ({
  branches,
  query,
}: {
  branches: BranchLocation[];
  query: string;
}) => {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return {
      hasDirectMatches: false,
      visibleBranches: branches,
    };
  }

  const directMatches = filterBranchesBySearch(branches, normalizedQuery);

  if (directMatches.length > 0) {
    return {
      hasDirectMatches: true,
      visibleBranches: directMatches,
    };
  }

  return {
    hasDirectMatches: false,
    visibleBranches: [],
  };
};
