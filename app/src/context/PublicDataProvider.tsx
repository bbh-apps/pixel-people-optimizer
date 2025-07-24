import { useQueries } from "@tanstack/react-query";
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

	const results = useQueries({
		queries: [
			{
				queryKey: ["buildings", "list", tokenQueryKey],
				queryFn: async (): Promise<BuildingListRes[]> =>
					await fetchClient("/api/buildings", {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				enabled: token !== undefined,
			},
			{
				queryKey: ["professions", "list", tokenQueryKey],
				queryFn: async (): Promise<ProfessionListWithDetailRes[]> =>
					await fetchClient(`/api/professions`, {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				enabled: token !== undefined,
			},
			{
				queryKey: ["missions", "list", tokenQueryKey],
				queryFn: async (): Promise<MissionListWithDetailRes[]> =>
					await fetchClient("/api/missions", {
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					}),
				enabled: token !== undefined,
			},
		],
	});

	return (
		<PublicDataContext.Provider
			value={{
				buildings: results[0].data,
				professions: results[1].data,
				missions: results[2].data,
			}}
		>
			{children}
		</PublicDataContext.Provider>
	);
};

export default PublicDataProvider;
