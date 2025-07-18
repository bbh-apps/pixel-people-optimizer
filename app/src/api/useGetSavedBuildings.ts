import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { BuildingListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedBuildings = (): UseQueryResult<BuildingListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["buildings", "saved"],
		queryFn: async (): Promise<BuildingListRes[]> =>
			await fetchClient("/api/me/buildings", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetSavedBuildings;
