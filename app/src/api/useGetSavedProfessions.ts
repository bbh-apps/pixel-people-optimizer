import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ProfessionListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedProfessions = (): UseQueryResult<ProfessionListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["professions", "saved"],
		queryFn: async (): Promise<ProfessionListRes[]> =>
			await fetch("/api/me/professions", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			})
				.then((res): Promise<ProfessionListRes[]> => res.json())
				.then((res) => res),
		enabled: !!token,
	});
};

export default useGetSavedProfessions;
