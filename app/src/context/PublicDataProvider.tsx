import { useQueries } from "@tanstack/react-query";
import { getBuildingsOptions } from "../api/useGetAllBuildings";
import { getMissionsOptions } from "../api/useGetAllMissions";
import { getProfessionsOptions } from "../api/useGetAllProfessions";
import { PublicDataContext } from "./PublicDataContext";

const PublicDataProvider = ({ children }: { children: React.ReactNode }) => {
	const results = useQueries({
		queries: [getBuildingsOptions, getProfessionsOptions, getMissionsOptions],
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
