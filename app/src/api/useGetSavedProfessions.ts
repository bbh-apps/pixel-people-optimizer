import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedProfessions = (): UseQueryResult<ProfessionListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["professions", "saved"],
		queryFn: async (): Promise<ProfessionListRes[]> =>
			await fetchClient("/api/me/professions", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetSavedProfessions;
