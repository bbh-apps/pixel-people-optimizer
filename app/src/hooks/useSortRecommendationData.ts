import { useMemo, useState } from "react";
import { chunk } from "../lib/pagination";
import type { RecommendationRes } from "../types/models";

export type SortableKey = keyof RecommendationRes;
export type SortDirection = "asc" | "desc";

export const recommendationKeyToLabel: { label: string; value: SortableKey }[] =
	[
		{
			label: "Profession",
			value: "profession",
		},
		{
			label: "Gene 1",
			value: "parent1",
		},
		{
			label: "Gene 2",
			value: "parent2",
		},
		{
			label: "Land Cost",
			value: "extra_land_needed",
		},
		{
			label: "Unlocks Building",
			value: "unlock_bldg",
		},
		{
			label: "Unlocks Professions",
			value: "unlock_professions",
		},
		{
			label: "Max CPS",
			value: "max_cps",
		},
	];

const sortData = (
	data: RecommendationRes[],
	sortBy: SortableKey,
	sortDirection: SortDirection
): RecommendationRes[] => {
	return [...data].sort((a, b) => {
		const aVal = a[sortBy];
		const bVal = b[sortBy];

		if (typeof aVal === "number" && typeof bVal === "number") {
			return sortDirection === "desc" ? bVal - aVal : aVal - bVal;
		}

		if (Array.isArray(aVal) && Array.isArray(bVal)) {
			const aValStr = aVal.join();
			const bValStr = bVal.join();
			return sortDirection === "desc"
				? bValStr.localeCompare(aValStr)
				: aValStr.localeCompare(bValStr);
		}

		const aName =
			typeof aVal === "object" &&
			aVal !== null &&
			!Array.isArray(aVal) &&
			"name" in aVal
				? (aVal as { name: string }).name
				: "";
		const bName =
			typeof bVal === "object" &&
			bVal !== null &&
			!Array.isArray(bVal) &&
			"name" in bVal
				? (bVal as { name: string }).name
				: "";

		return sortDirection === "desc"
			? bName.localeCompare(aName)
			: aName.localeCompare(bName);
	});
};

export const useSortRecommendationData = (
	recommendations: RecommendationRes[]
) => {
	const [activePage, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<SortableKey>("extra_land_needed");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const onClickSorting = (header: SortableKey) => {
		if (sortBy !== header) {
			setSortBy(header);
			setSortDirection("asc");
		} else {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		}
		setPage(1);
	};

	const sortedData = useMemo(
		() => sortData(recommendations, sortBy, sortDirection),
		[recommendations, sortBy, sortDirection]
	);

	const pages = chunk(sortedData, 10);
	const currentPageData = pages[activePage - 1] ?? [];

	return {
		currentPageData,
		pages,
		activePage,
		setPage,
		onClickSorting,
		sortBy,
		sortDirection,
	};
};
