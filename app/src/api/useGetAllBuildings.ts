import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { BuildingListRes } from "../types/models";

export const getBuildingsOptions = {
	queryKey: ["buildings", "list"],
	queryFn: async (): Promise<BuildingListRes[]> =>
		await fetchClient("/api/buildings"),
	staleTime: Infinity,
};

export const useGetBuildings = (): UseQueryResult<BuildingListRes[]> => {
	return useQuery(getBuildingsOptions);
};
