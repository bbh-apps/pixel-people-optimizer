import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionListWithMissionRes } from "../types/models";

export const getProfessionsOptions = {
	queryKey: ["professions", "list"],
	queryFn: async (): Promise<ProfessionListWithMissionRes[]> =>
		await fetchClient(`/api/professions`),
	staleTime: Infinity,
};

export const useGetProfessions = (): UseQueryResult<
	ProfessionListWithMissionRes[]
> => {
	return useQuery(getProfessionsOptions);
};
