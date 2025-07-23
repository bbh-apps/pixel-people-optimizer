import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { SavedProfessionListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedProfessions = (): UseQueryResult<SavedProfessionListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["professions", "saved"],
		queryFn: async (): Promise<SavedProfessionListRes[]> =>
			await fetchClient("/api/me/professions", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetSavedProfessions;
