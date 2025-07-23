import { createContext } from "react";
import type {
	BuildingListRes,
	MissionListRes,
	ProfessionListWithMissionRes,
} from "../types/models";

type PublicDataContextType = {
	buildings: BuildingListRes[] | undefined;
	professions: ProfessionListWithMissionRes[] | undefined;
	missions: MissionListRes[] | undefined;
};

export const PublicDataContext = createContext<PublicDataContextType>({
	buildings: undefined,
	professions: undefined,
	missions: undefined,
});
