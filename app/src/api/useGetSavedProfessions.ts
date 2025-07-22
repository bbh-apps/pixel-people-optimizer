import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionListWithMissionRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedProfessions = (): UseQueryResult<
	ProfessionListWithMissionRes[]
> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["professions", "saved"],
		queryFn: async (): Promise<ProfessionListWithMissionRes[]> =>
			await fetchClient("/api/me/professions", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetSavedProfessions;
