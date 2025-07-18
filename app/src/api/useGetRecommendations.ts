import { useQuery } from "@tanstack/react-query";
import type { RecommendationRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetRecommendations = (remainingLand: number | null) => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["recommendations", remainingLand],
		queryFn: async (): Promise<RecommendationRes[]> =>
			await fetch(
				`/api/recommendations?remaining_land=${remainingLand ?? 0}`,
				token
					? {
							headers: {
								Authorization: `Bearer ${token}`,
							},
					  }
					: {}
			)
				.then((res) => res.json())
				.then((res) => res),
		enabled: !!remainingLand,
	});
};

export default useGetRecommendations;
