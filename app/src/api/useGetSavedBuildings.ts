import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { BuildingListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedBuildings = (): UseQueryResult<BuildingListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["buildings", "saved"],
		queryFn: async (): Promise<BuildingListRes[]> =>
			await fetch("/api/me/buildings", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			})
				.then((res) => res.json())
				.then((res) => res),
		enabled: !!token,
	});
};

export default useGetSavedBuildings;
