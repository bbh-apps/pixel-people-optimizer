import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { BuildingListRes } from "../types/models";

const useGetBuildings = (): UseSuspenseQueryResult<BuildingListRes[]> => {
	return useSuspenseQuery({
		queryKey: ["buildings", "list"],
		queryFn: async (): Promise<BuildingListRes[]> =>
			await fetchClient("/api/buildings"),
	});
};

export default useGetBuildings;
