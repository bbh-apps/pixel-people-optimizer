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
				staleTime: 1000 * 60 * 5,
			},
			{
				queryKey: ["professions", "list", tokenQueryKey],
				queryFn: async (): Promise<ProfessionListWithDetailRes[]> =>
					await fetchClient(`/api/professions/`, {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				staleTime: 1000 * 60 * 5,
			},
			{
				queryKey: ["missions", "list", tokenQueryKey],
				queryFn: async (): Promise<MissionListWithDetailRes[]> =>
					await fetchClient("/api/missions/", {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				staleTime: 1000 * 60 * 5,
			},
		],
	});

	const buildings = results[0].data;
	const professions = results[1].data;
	const missions = results[2].data;

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
