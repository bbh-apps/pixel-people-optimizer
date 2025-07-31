import { useSuspenseQueries } from "@tanstack/react-query";
import { useAuth } from "../api/useAuth";
import { fetchClient } from "../lib/fetchClient";
import type {
	BuildingListRes,
	MissionListWithDetailRes,
	ProfessionListWithDetailRes,
} from "../types/models";
import { PublicDataContext } from "./PublicDataContext";

const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
	const { token } = useAuth();
	const tokenQueryKey = token != null ? "hasToken" : "notHasToken";

	const results = useSuspenseQueries({
		queries: [
			{
				queryKey: ["buildings", "list", tokenQueryKey],
				queryFn: async (): Promise<BuildingListRes[]> =>
					await fetchClient("/api/buildings/", {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				// enabled: token !== undefined,
				staleTime: 1000 * 60 * 5,
			},
			{
				queryKey: ["professions", "list", tokenQueryKey],
				queryFn: async (): Promise<ProfessionListWithDetailRes[]> =>
					await fetchClient(`/api/professions/`, {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				// enabled: token !== undefined,
				staleTime: 1000 * 60 * 5,
			},
			{
				queryKey: ["missions", "list", tokenQueryKey],
				queryFn: async (): Promise<MissionListWithDetailRes[]> =>
					await fetchClient("/api/missions/", {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				// enabled: token !== undefined,
				staleTime: 1000 * 60 * 5,
			},
		],
	});

	// const isLoading = results.some(
	// 	(r) => r.isFetching || r.isLoading || r.data == null
	// );
	const buildings = results[0].data;
	const professions = results[1].data;
	const missions = results[2].data;

	// if (isLoading) {
	// 	return (
	// 		<Center h="100%">
	// 			<Loader size="lg" />
	// 		</Center>
	// 	);
	// }

	return (
		<PublicDataContext.Provider
			value={{
				buildings,
				professions,
				missions,
			}}
		>
			{children}
		</PublicDataContext.Provider>
	);
};

export default PublicDataProvider;
