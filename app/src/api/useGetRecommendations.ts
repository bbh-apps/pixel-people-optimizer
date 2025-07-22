import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { RecommendationRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetRecommendations = (remainingLand: number | null) => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["recommendations"],
		queryFn: async (): Promise<RecommendationRes[]> =>
			await fetchClient(
				`/api/recommendations?remaining_land=${remainingLand ?? 0}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			),
		enabled: typeof remainingLand === "number" && !!token,
	});
};

export default useGetRecommendations;
