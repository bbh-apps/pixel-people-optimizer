import { useQueries } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type {
	BuildingListRes,
	MissionListWithDetailRes,
	ProfessionListWithMissionRes,
} from "../types/models";
import { PublicDataContext } from "./PublicDataContext";

const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
	const results = useQueries({
		queries: [
			{
				queryKey: ["buildings", "list"],
				queryFn: async (): Promise<BuildingListRes[]> =>
					await fetchClient("/api/buildings"),
				staleTime: Infinity,
			},
			{
				queryKey: ["professions", "list"],
				queryFn: async (): Promise<ProfessionListWithMissionRes[]> =>
					await fetchClient(`/api/professions`),
				staleTime: Infinity,
			},
			{
				queryKey: ["missions", "list"],
				queryFn: async (): Promise<MissionListWithDetailRes[]> =>
					await fetchClient("/api/missions"),
				staleTime: Infinity,
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
