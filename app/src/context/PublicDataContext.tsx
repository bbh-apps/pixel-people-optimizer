import { createContext } from "react";
import type {
	BuildingListRes,
	MissionListWithDetailRes,
	ProfessionListWithMissionRes,
} from "../types/models";

type PublicDataContextType = {
	buildings: BuildingListRes[] | undefined;
	professions: ProfessionListWithMissionRes[] | undefined;
	missions: MissionListWithDetailRes[] | undefined;
};

export const PublicDataContext = createContext<PublicDataContextType>({
	buildings: undefined,
	professions: undefined,
	missions: undefined,
});
