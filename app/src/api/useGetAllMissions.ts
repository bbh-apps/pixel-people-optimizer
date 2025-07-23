import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { MissionListRes } from "../types/models";

export const getMissionsOptions = {
	queryKey: ["missions", "list"],
	queryFn: async (): Promise<MissionListRes[]> =>
		await fetchClient("/api/missions"),
	staleTime: Infinity,
};

export const useGetMissions = (): UseQueryResult<MissionListRes[]> => {
	return useQuery(getMissionsOptions);
};
