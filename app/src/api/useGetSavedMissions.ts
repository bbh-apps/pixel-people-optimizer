import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { MissionListRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetSavedMissions = (): UseQueryResult<MissionListRes[]> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["missions", "saved"],
		queryFn: async (): Promise<MissionListRes[]> =>
			await fetchClient("/api/me/missions", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetSavedMissions;
