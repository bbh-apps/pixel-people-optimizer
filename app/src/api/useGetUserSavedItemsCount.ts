import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { UserSavedItemCountRes } from "../types/models";
import { useAuth } from "./useAuth";

const useGetUserSavedItemsCount = (): UseQueryResult<UserSavedItemCountRes> => {
	const { token } = useAuth();

	return useQuery({
		queryKey: ["saved_items_count"],
		queryFn: async (): Promise<UserSavedItemCountRes> =>
			await fetchClient("/api/users/me/saved_count", {
				headers: {
					Authorization: token ? `Bearer ${token}` : "",
				},
			}),
		enabled: !!token,
	});
};

export default useGetUserSavedItemsCount;
