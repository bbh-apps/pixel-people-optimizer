import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { MissionListRes } from "../types/models";

const useGetMissions = (): UseSuspenseQueryResult<MissionListRes[]> => {
	return useSuspenseQuery({
		queryKey: ["missions", "list"],
		queryFn: async (): Promise<MissionListRes[]> =>
			await fetchClient("/api/missions"),
	});
};

export default useGetMissions;
