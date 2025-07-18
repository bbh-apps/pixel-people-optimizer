import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { BuildingListRes } from "../types/models";

const useGetBuildings = (): UseSuspenseQueryResult<BuildingListRes[]> => {
	return useSuspenseQuery({
		queryKey: ["buildings", "list"],
		queryFn: async (): Promise<BuildingListRes[]> =>
			await fetch("/api/buildings")
				.then((res): Promise<BuildingListRes[]> => res.json())
				.then((res) => res),
	});
};

export default useGetBuildings;
