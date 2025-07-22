import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionListWithMissionRes } from "../types/models";

export type SortType = "abc" | "gallery";

const SortTypeToColumn = {
	abc: "name",
	gallery: "id",
};

const useGetProfessions = (
	sortBy: SortType
): UseSuspenseQueryResult<ProfessionListWithMissionRes[]> => {
	return useSuspenseQuery({
		queryKey: ["professions", "list", sortBy],
		queryFn: async (): Promise<ProfessionListWithMissionRes[]> =>
			await fetchClient(
				`/api/professions?order_by=${SortTypeToColumn[sortBy]}`
			),
	});
};

export default useGetProfessions;
